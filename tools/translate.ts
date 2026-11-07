// make translate LOCALE=<tag>|all [DRY_RUN=1]: the Opus pass, run through Claude Code on a
// maintainer machine. CI never runs this and holds no Anthropic credential.
//
// Per language and key:
//   - no translation                          -> translate
//   - translation, no state entry             -> a person wrote it: record it as human, keep it
//   - state matches the English fingerprint   -> keep (a changed value is recorded as human)
//   - English fingerprint changed             -> retranslate; when a person had edited the
//                                                value, list it in the PR body for review
// The fingerprint covers the English message, description and placeholders. Glossary and
// style changes alone do not trigger retranslation.
//
// Batches hold whole namespaces (up to about 100 keys), so related strings are translated
// together; the prompt also carries the namespace's existing translations. The catalog and
// state are written after every batch, so an interrupted run resumes where it stopped.
//
// Writes catalog/<tag>.arb, state/<tag>.json, out/translate-pr-body.md and a per-batch log,
// out/translate-<tag>.log.jsonl. It does not create branches or pull requests.
//
//   --dry-run                 send only the first batch and write nothing
//   --jobs N                  run N Claude Code calls at once (default 1)
//   --only <p1,p2>            consider only keys starting with these prefixes
//   --retranslate <p1,p2>     also retranslate keys the Opus pass wrote under these prefixes
//                             (after a glossary or style fix); a person's values are kept
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";
import { checkRepository, checkTranslation, type CheckedCatalog } from "./lib/check.ts";
import { catalogPath, type SourceEntry } from "./lib/catalog.ts";
import { termsIn } from "./lib/glossary.ts";
import { categoriesFor } from "./lib/plural.ts";
import { canonicalArb, canonicalState, jsonText } from "./lib/format.ts";
import type { Locale } from "./lib/locales.ts";

export const MODEL = "claude-opus-5-5";
/** A positive integer from text, or the fallback. */
function positiveInt(text: string | undefined, fallback: number): number {
  const n = Number(text);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

const BATCH_SIZE = positiveInt(process.env.SILO_TRANSLATE_BATCH_SIZE, 100);
const CONTEXT_LIMIT = 150;

export interface StateEntry {
  /** Fingerprint of the English the value was written for. */
  source: string;
  /** Hash of the value as last written or recorded. */
  value: string;
  by: "opus" | "human";
  model?: string;
}
export type State = Record<string, StateEntry>;

/** First 16 hex digits of SHA-256; used for value hashes and (over JSON) fingerprints. */
export const valueHash = (s: string) => createHash("sha256").update(s).digest("hex").slice(0, 16);

export function fingerprint(e: SourceEntry): string {
  return valueHash(JSON.stringify([e.message, e.description, e.placeholders]));
}

export type Reason = "missing" | "invalid" | "source-changed" | "human-edit-source-changed" | "retranslate";
export interface Work {
  entry: SourceEntry;
  reason: Reason;
  /** The value when the run started (undefined when missing). */
  previous?: string;
}

/**
 * Decides what to translate for one language and updates `state` for kept human values.
 * `valid` holds the keys whose current translation passes validation; any other existing
 * value (for example one an English placeholder change left behind) is retranslated.
 */
export function select(
  entries: SourceEntry[],
  translations: Map<string, string>,
  state: State,
  valid: Set<string>,
  retranslate: (key: string) => boolean = () => false,
): Work[] {
  const work: Work[] = [];
  for (const entry of entries) {
    const current = translations.get(entry.key);
    const st = state[entry.key];
    const fp = fingerprint(entry);
    if (current === undefined) {
      work.push({ entry, reason: "missing" });
    } else if (!valid.has(entry.key)) {
      work.push({ entry, reason: "invalid", previous: current });
    } else if (!st) {
      state[entry.key] = { source: fp, value: valueHash(current), by: "human" };
    } else {
      const human = st.by === "human" || st.value !== valueHash(current);
      if (st.source === fp) {
        if (human) state[entry.key] = { source: fp, value: valueHash(current), by: "human" };
        else if (retranslate(entry.key)) work.push({ entry, reason: "retranslate", previous: current });
      } else {
        work.push({ entry, reason: human ? "human-edit-source-changed" : "source-changed", previous: current });
      }
    }
  }
  return work;
}


function readJson<T>(file: string, fallback: T): T {
  return existsSync(file) ? (JSON.parse(readFileSync(file, "utf8")) as T) : fallback;
}

/** The area a key belongs to: web.<a>.<b> for web keys, the first segment otherwise. */
export function namespaceOf(key: string): string {
  const parts = key.split(".");
  return parts[0] === "web" ? parts.slice(0, 3).join(".") : parts[0]!;
}

/**
 * Batches of whole namespaces, in key order: small namespaces share a batch with their
 * neighbours, and a namespace larger than `size` is split into consecutive chunks.
 */
export function makeBatches(work: Work[], size = BATCH_SIZE): Work[][] {
  const sorted = [...work].sort((a, b) => (a.entry.key < b.entry.key ? -1 : a.entry.key > b.entry.key ? 1 : 0));
  const groups: Work[][] = [];
  for (const w of sorted) {
    const last = groups[groups.length - 1];
    if (last && namespaceOf(last[0]!.entry.key) === namespaceOf(w.entry.key)) last.push(w);
    else groups.push([w]);
  }
  const batches: Work[][] = [];
  let current: Work[] = [];
  for (const group of groups) {
    if (group.length > size) {
      if (current.length) batches.push(current);
      current = [];
      for (let i = 0; i < group.length; i += size) batches.push(group.slice(i, i + size));
      continue;
    }
    if (current.length + group.length > size) {
      batches.push(current);
      current = [];
    }
    current.push(...group);
  }
  if (current.length) batches.push(current);
  return batches;
}

export function buildPrompt(root: string, checked: CheckedCatalog, locale: Locale, batch: Work[], known: Map<string, string>, feedback?: Map<string, string[]>): string {
  const style = existsSync(join(root, "style", `${locale.tag}.md`)) ? readFileSync(join(root, "style", `${locale.tag}.md`), "utf8") : "";
  const english = batch.map((w) => w.entry.message).join("\n");
  const glossary = termsIn(checked.glossary, english).map((g) => ({ term: g.term, note: g.note, required: g.renderings.get(locale.tag) ?? null }));
  const spaces = new Set(batch.map((w) => namespaceOf(w.entry.key)));
  const inBatch = new Set(batch.map((w) => w.entry.key));
  const existing = [...known]
    .filter(([k]) => spaces.has(namespaceOf(k)) && !inBatch.has(k))
    .slice(0, CONTEXT_LIMIT)
    .map(([key, message]) => ({ key, english: checked.catalog.byKey.get(key)?.message, message }));
  const items = batch.map((w) => ({
    key: w.entry.key,
    english: w.entry.message,
    description: w.entry.description,
    placeholders: Object.fromEntries(w.entry.placeholders.map((p) => [p.name, p.type])),
    ...(w.entry.maxLength ? { maxLength: w.entry.maxLength } : {}),
    ...(w.previous !== undefined ? { previousTranslation: w.previous } : {}),
    ...(feedback?.get(w.entry.key) ? { problemsWithLastAttempt: feedback.get(w.entry.key) } : {}),
  }));
  return `Translate these user-interface strings of Silo, a self-hosted media server and its apps, from English into ${locale.name} (${locale.tag}).

Rules:
- Each English message is ICU MessageFormat. Keep every {placeholder} exactly as written; do not translate placeholder names.
- A plural message must stay a plural on the same argument and use exactly these CLDR categories for ${locale.tag}: ${categoriesFor(locale.cldr).join(", ")}. Use # where the English uses #; where the English forms print a placeholder such as {count_text} instead, print that placeholder, never #.
- Keep every select and every rich-text tag (<b>…</b>, <name></name>, …) from the English, with the same names and options. Do not add select, tags, number or date formatting.
- Use the typographic apostrophe ’, never ASCII '.
- Keep within maxLength characters when it is given.
- Follow the glossary's required renderings and the style guide. A required rendering equal to the English term means: keep it untranslated.
- Return one entry per key below, with the key unchanged and the translated ICU message.

Style guide for ${locale.tag}:
${style || "(none)"}

Glossary terms in this batch:
${JSON.stringify(glossary, null, 2)}

Existing ${locale.tag} translations in the same areas (for consistent wording):
${JSON.stringify(existing, null, 2)}

Strings to translate:
${JSON.stringify(items, null, 2)}
`;
}

const SCHEMA = JSON.stringify({
  type: "object",
  properties: {
    translations: {
      type: "array",
      items: { type: "object", properties: { key: { type: "string" }, message: { type: "string" } }, required: ["key", "message"] },
    },
  },
  required: ["translations"],
});

/** Sends one prompt to Claude Code headless and returns key -> message. */
export function callClaude(prompt: string): Promise<Map<string, string>> {
  const bin = process.env.SILO_CLAUDE_BIN ?? "claude";
  const args = ["-p", "--model", MODEL, "--output-format", "json", "--json-schema", SCHEMA, "--tools", "", "--no-session-persistence", "--strict-mcp-config"];
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { cwd: tmpdir(), stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d));
    child.stderr.on("data", (d) => (stderr += d));
    child.on("error", reject);
    // A child that exits before reading the whole prompt (bad flag, auth failure) breaks the
    // pipe; that's a failed call to retry, not a crash of the whole run.
    child.stdin.on("error", reject);
    child.on("close", (status) => {
      try {
        if (status !== 0) throw new Error(`${bin} exited ${status}: ${(stderr || stdout).slice(0, 500)}`);
        const out = JSON.parse(stdout) as { is_error?: boolean; result?: string; structured_output?: { translations: { key: string; message: string }[] } };
        if (out.is_error) throw new Error(`Claude Code: ${out.result}`);
        const data = out.structured_output ?? (JSON.parse(out.result ?? "{}") as { translations?: { key: string; message: string }[] });
        resolvePromise(new Map((data.translations ?? []).map((t) => [t.key, t.message])));
      } catch (e) {
        reject(e);
      }
    });
    child.stdin.end(prompt);
  });
}

export interface BatchResult {
  accepted: Map<string, string>;
  failed: Map<string, string[]>;
  /** Problems with the first attempt, by key (placeholder, markup or plural changes among them). */
  firstAttempt: Map<string, string[]>;
  calls: number;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const RETRY_DELAYS_MS = (process.env.SILO_TRANSLATE_RETRY_MS ?? "30000,120000").split(",").map(Number);

/** One Claude Code call, retried after a delay when the call itself fails. */
async function callWithRetry(prompt: string, onCall: () => void): Promise<Map<string, string>> {
  for (let i = 0; ; i++) {
    onCall();
    try {
      return await callClaude(prompt);
    } catch (e) {
      if (i >= RETRY_DELAYS_MS.length) throw e;
      await sleep(RETRY_DELAYS_MS[i]!);
    }
  }
}

/** Translates one batch, validates every message, and retries the failures once. */
export async function translateBatch(root: string, checked: CheckedCatalog, locale: Locale, batch: Work[], known: Map<string, string>): Promise<BatchResult> {
  const accepted = new Map<string, string>();
  const result: BatchResult = { accepted, failed: new Map(), firstAttempt: new Map(), calls: 0 };
  let pending = batch;
  let feedback: Map<string, string[]> | undefined;
  for (let attempt = 0; attempt < 2 && pending.length; attempt++) {
    let got: Map<string, string>;
    try {
      got = await callWithRetry(buildPrompt(root, checked, locale, pending, known, feedback), () => result.calls++);
    } catch (e) {
      for (const w of pending) result.failed.set(w.entry.key, [`call failed: ${(e as Error).message}`]);
      return result;
    }
    feedback = new Map();
    for (const w of pending) {
      const message = got.get(w.entry.key);
      // An empty answer is no answer: it would erase the value and read as missing next time.
      const checkedMessage = message === undefined || message.trim() === "" ? undefined : checkTranslation(w.entry, checked.english.get(w.entry.key)!, locale, message);
      const problems = checkedMessage ? [...checkedMessage.problems, ...checkedMessage.mismatches] : ["no translation returned"];
      if (problems.length) feedback.set(w.entry.key, problems);
      else accepted.set(w.entry.key, message!);
    }
    if (attempt === 0) result.firstAttempt = new Map(feedback);
    pending = pending.filter((w) => feedback!.has(w.entry.key));
  }
  result.failed = feedback ?? new Map();
  return result;
}

interface Report {
  locale: string;
  written: number;
  humanEdits: { key: string; before: string; after: string }[];
  failed: Map<string, string[]>;
  changedDuringRun: string[];
  batches: number;
  calls: number;
  seconds: number;
}

/**
 * Writes the catalog and state for every result so far. Idempotent: called after each batch.
 * A key whose value changed on disk since the run started keeps the person's value.
 */
function writeLanguage(root: string, checked: CheckedCatalog, locale: Locale, byKey: Map<string, Work>, results: Map<string, string>, state: State, changedDuringRun: Set<string>) {
  const file = catalogPath(root, locale.tag);
  const onDisk = readJson<Record<string, string>>(file, {});
  const merged: Record<string, string> = { "@@locale": locale.tag };
  for (const entry of checked.catalog.entries) {
    // An empty string is how Weblate writes an untranslated unit; the loader treats it as missing.
    const now = onDisk[entry.key] === "" ? undefined : onDisk[entry.key];
    const w = byKey.get(entry.key);
    const next = results.get(entry.key);
    if (w && next !== undefined && !changedDuringRun.has(entry.key)) {
      // The file may already hold this run's value from an earlier batch's write.
      if (now !== w.previous && now !== next) {
        changedDuringRun.add(entry.key);
        if (now !== undefined) merged[entry.key] = now;
        continue;
      }
      merged[entry.key] = next;
      state[entry.key] = { source: fingerprint(entry), value: valueHash(next), by: "opus", model: MODEL };
    } else if (now !== undefined) {
      merged[entry.key] = now;
    }
  }
  writeFileSync(file, jsonText(canonicalArb(merged)));
  const kept = Object.fromEntries(checked.catalog.entries.filter((e) => state[e.key]).map((e) => [e.key, state[e.key]!]));
  mkdirSync(join(root, "state"), { recursive: true });
  writeFileSync(join(root, "state", `${locale.tag}.json`), jsonText(canonicalState(kept)));
}

export function prBody(reports: Report[]): string {
  const lines = ["chore(translations): opus pass", "", `Model: ${MODEL}`, "", "| Language | Written | Failed | Batches | Claude calls | Wall time |", "|---|---|---|---|---|---|"];
  for (const r of reports) lines.push(`| ${r.locale} | ${r.written} | ${r.failed.size} | ${r.batches} | ${r.calls} | ${(r.seconds / 60).toFixed(0)} min |`);
  const edits = reports.flatMap((r) => r.humanEdits.map((e) => ({ ...e, locale: r.locale })));
  if (edits.length) {
    lines.push("", "## Retranslated values a person wrote or that no longer matched English (please review)", "", "| Language | Key | Before | After |", "|---|---|---|---|");
    for (const e of edits) lines.push(`| ${e.locale} | \`${e.key}\` | ${e.before.replace(/\|/g, "\\|")} | ${e.after.replace(/\|/g, "\\|")} |`);
  }
  const failed = reports.flatMap((r) => [...r.failed].map(([key, p]) => `- ${r.locale} \`${key}\`: ${p.join("; ")}`));
  if (failed.length) lines.push("", "## Left untranslated (failed validation twice)", "", ...failed);
  const raced = reports.flatMap((r) => r.changedDuringRun.map((k) => `- ${r.locale} \`${k}\``));
  if (raced.length) lines.push("", "## Kept because the file changed during the run", "", ...raced);
  return lines.join("\n") + "\n";
}

/** Runs async tasks with at most `jobs` in flight. */
async function pool<T>(items: T[], jobs: number, run: (item: T, index: number) => Promise<void>): Promise<void> {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.max(1, Math.min(jobs, items.length)) }, async () => {
      while (next < items.length) {
        const i = next++;
        await run(items[i]!, i);
      }
    }),
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({
    options: {
      locale: { type: "string" },
      "dry-run": { type: "boolean" },
      root: { type: "string" },
      jobs: { type: "string" },
      only: { type: "string" },
      retranslate: { type: "string" },
    },
  });
  const root = resolve(values.root ?? resolve(import.meta.dirname, ".."));
  const checked = checkRepository(root);
  // Errors block the run; warnings (such as translations an English change left stale) don't,
  // since retranslating them is part of the run.
  if (checked.issues.some((i) => i.level === "error" && i.rule !== "layout")) {
    console.error("the catalog has validation errors; run make check first");
    process.exit(1);
  }
  const locales = values.locale === "all" ? checked.locales.targets : checked.locales.targets.filter((l) => l.tag === values.locale);
  if (!locales.length) {
    console.error(`unknown locale ${values.locale}; use one of ${checked.locales.targets.map((l) => l.tag).join(", ")} or all`);
    process.exit(2);
  }
  const prefixes = (v?: string) => (v ? v.split(",").filter(Boolean) : undefined);
  const only = prefixes(values.only);
  const again = prefixes(values.retranslate) ?? [];
  if (values.jobs !== undefined && !(Number.isInteger(Number(values.jobs)) && Number(values.jobs) > 0)) {
    console.error(`--jobs must be a positive integer, not ${values.jobs}`);
    process.exit(2);
  }
  const jobs = positiveInt(values.jobs, 1);
  const entries = checked.catalog.entries.filter((e) => checked.english.has(e.key) && (!only || only.some((p) => e.key.startsWith(p))));
  const reports: Report[] = [];
  for (const locale of locales) {
    const state = readJson<State>(join(root, "state", `${locale.tag}.json`), {});
    const translations = checked.catalog.translations.get(locale.tag) ?? new Map();
    const valid = new Set(checked.valid.get(locale.tag)?.keys() ?? []);
    const work = select(entries, translations, state, valid, (k) => again.some((p) => k.startsWith(p)));
    const batches = makeBatches(work);
    console.error(`${locale.tag}: ${work.length} keys to translate in ${batches.length} batches, ${jobs} at a time`);
    // What the prompt shows as existing wording: the catalog's values plus this run's results.
    const known = new Map(translations);
    if (values["dry-run"]) {
      if (!batches.length) continue;
      const r = await translateBatch(root, checked, locale, batches[0]!, known);
      console.log(JSON.stringify({ locale: locale.tag, batch: batches[0]!.length, accepted: Object.fromEntries(r.accepted), failed: Object.fromEntries(r.failed) }, null, 2));
      break;
    }
    mkdirSync(join(root, "out"), { recursive: true });
    const log = join(root, "out", `translate-${locale.tag}.log.jsonl`);
    const byKey = new Map(work.map((w) => [w.entry.key, w]));
    const results = new Map<string, string>();
    const changedDuringRun = new Set<string>();
    const report: Report = { locale: locale.tag, written: 0, humanEdits: [], failed: new Map(), changedDuringRun: [], batches: batches.length, calls: 0, seconds: 0 };
    const started = Date.now();
    let done = 0;
    await pool(batches, jobs, async (batch, i) => {
      const t0 = Date.now();
      const r = await translateBatch(root, checked, locale, batch, known);
      for (const [k, v] of r.accepted) {
        results.set(k, v);
        known.set(k, v);
      }
      for (const [k, v] of r.failed) report.failed.set(k, v);
      report.calls += r.calls;
      writeLanguage(root, checked, locale, byKey, results, state, changedDuringRun);
      done++;
      const keys = batch.map((w) => w.entry.key);
      appendFileSync(log, JSON.stringify({ batch: i + 1, of: batches.length, first: keys[0], last: keys[keys.length - 1], keys: keys.length, accepted: r.accepted.size, calls: r.calls, seconds: Math.round((Date.now() - t0) / 1000), firstAttempt: Object.fromEntries(r.firstAttempt), failed: Object.fromEntries(r.failed) }) + "\n");
      console.error(`${locale.tag}: batch ${i + 1}/${batches.length} done (${done} finished) ${keys[0]} … ${keys[keys.length - 1]}: ${r.accepted.size}/${keys.length} accepted, ${r.firstAttempt.size} retried, ${r.failed.size} failed, ${Math.round((Date.now() - t0) / 1000)} s`);
    });
    report.seconds = (Date.now() - started) / 1000;
    for (const [k, w] of byKey) {
      if (!results.has(k) || changedDuringRun.has(k)) continue;
      report.written++;
      if (w.reason === "human-edit-source-changed" || w.reason === "invalid") report.humanEdits.push({ key: k, before: w.previous!, after: results.get(k)! });
    }
    report.changedDuringRun = [...changedDuringRun];
    reports.push(report);
  }
  if (!values["dry-run"]) {
    mkdirSync(join(root, "out"), { recursive: true });
    writeFileSync(join(root, "out/translate-pr-body.md"), prBody(reports));
    console.error("wrote out/translate-pr-body.md; run make check, review, and open the PR");
  }
}
