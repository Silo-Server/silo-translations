// make translate LOCALE=<tag>[,<tag>…]|all [DRY_RUN=1]: the Opus pass, run through Claude Code
// on a maintainer machine. CI never runs this and holds no Anthropic credential.
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
// The batches of every language share one pool of Claude Code calls, so a pull request that
// adds a few keys sends one batch per language side by side instead of one language at a time.
// Keys that still fail after a batch's own retry go round again (--rounds). Every call also takes
// one of SILO_TRANSLATE_MAX_CALLS (default 6) slots shared by all runs on the machine: local
// ports from SILO_TRANSLATE_SLOT_PORT (default 47360), see tools/lib/slots.ts.
//
// Writes catalog/<tag>.arb, state/<tag>.json, out/translate-pr-body.md and a per-batch log,
// out/translate-<tag>.log.jsonl. It does not create branches or pull requests; translate-pr.ts
// does that for a pull request.
//
//   --dry-run                 send only the first batch and write nothing
//   --jobs N                  run N Claude Code calls at once, across languages (default 4)
//   --rounds N                send keys that failed again, up to N rounds in all (default 3)
//   --only <p1,p2>            consider only keys starting with these prefixes
//   --retranslate <p1,p2>     also retranslate keys the Opus pass wrote under these prefixes
//                             (after a glossary or style fix); a person's values are kept
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";
import { checkRepository, checkTranslation, type CheckedCatalog } from "./lib/check.ts";
import { literalLength } from "./lib/icu.ts";
import { catalogPath, type SourceEntry } from "./lib/catalog.ts";
import { termsIn } from "./lib/glossary.ts";
import { categoriesFor } from "./lib/plural.ts";
import { canonicalArb, canonicalState, jsonText } from "./lib/format.ts";
import { STYLE_TODO, type Locale } from "./lib/locales.ts";
import { acquireSlot, DEFAULT_MAX_CALLS } from "./lib/slots.ts";

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
    const st = Object.hasOwn(state, entry.key) ? state[entry.key] : undefined;
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

const LABEL_MAX = 40;
const LABELS_PER_NAME = 8;
const NAMED_LIMIT = 40;
interface Span {
  /** Index into the batch's strings that can name a label. */
  message: number;
  start: number;
  end: number;
}

/**
 * Labels that English messages in the batch name as a step in a menu path (Settings → General)
 * or in quotation marks, with their current translations: the style guides ask for a named
 * label's own wording, and the label usually lives in another namespace than the message.
 * A label English shared by several keys lists them (up to LABELS_PER_NAME: those on the
 * naming string's platform first, then titles and labels), with descriptions, so the model can
 * pick the right one. A label found only inside a longer named label ("Home" in "Home
 * Sections") is left out.
 */
export function namedLabels(checked: CheckedCatalog, batch: Work[], known: Map<string, string>) {
  const sep = String.raw`(?:→|›|\s>\s)`;
  const prose = batch
    .map((w) => ({ text: w.entry.message.replace(/<\/?[A-Za-z][\w-]*>/g, ""), platforms: w.entry.platforms }))
    .filter((m) => /→|›|\s>\s|[“"«]/.test(m.text));
  if (!prose.length) return [];
  const inBatch = new Set(batch.map((w) => w.entry.key));
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const byLabel = new Map<string, SourceEntry[]>();
  for (const e of checked.catalog.entries) {
    const label = e.message.trim();
    if (label.length < 2 || label.length > LABEL_MAX || /[{}<>#.?!:→›]/.test(label) || !/^\p{Lu}/u.test(label)) continue;
    const list = byLabel.get(label) ?? [];
    list.push(e);
    byLabel.set(label, list);
  }
  // Where each label is named in `prose`.
  const spans = new Map<string, Span[]>();
  for (const label of byLabel.keys()) {
    const l = escape(label);
    const named = new RegExp(`(?<=${sep}\\s*)${l}(?![\\p{L}\\p{N}])|(?<![\\p{L}\\p{N}])${l}(?=\\s*${sep})|(?<=[“"«])${l}(?=[”"»])`, "gu");
    const found: Span[] = [];
    prose.forEach((m, message) => {
      for (const match of m.text.matchAll(named)) found.push({ message, start: match.index, end: match.index + label.length });
    });
    if (found.length) spans.set(label, found);
  }
  const all = [...spans.values()].flat();
  // A span strictly inside a longer one in the same message.
  const insideLonger = (a: Span) =>
    all.some((b) => b.message === a.message && b.start <= a.start && a.end <= b.end && b.end - b.start > a.end - a.start);
  const out: { key: string; english: string; description: string; message: string }[] = [];
  for (const [label, found] of spans) {
    const naming = found.filter((f) => !insideLonger(f)).map((f) => prose[f.message]!);
    if (!naming.length) continue;
    const onNamingPlatform = (e: SourceEntry) => naming.some((m) => m.platforms.some((p) => e.platforms.includes(p)));
    const isTitle = (e: SourceEntry) => /\.(title|label|settingsLabel)$/.test(e.key);
    const rank = (e: SourceEntry) => (onNamingPlatform(e) ? 0 : 2) + (isTitle(e) ? 0 : 1);
    const candidates = byLabel.get(label)!.filter((x) => !inBatch.has(x.key) && known.has(x.key));
    for (const e of candidates.sort((a, b) => rank(a) - rank(b)).slice(0, LABELS_PER_NAME)) {
      out.push({ key: e.key, english: e.message, description: e.description, message: known.get(e.key)! });
    }
  }
  return out.slice(0, NAMED_LIMIT);
}

export function buildPrompt(root: string, checked: CheckedCatalog, locale: Locale, batch: Work[], known: Map<string, string>, feedback?: Map<string, string[]>): string {
  const style = existsSync(join(root, "style", `${locale.tag}.md`)) ? readFileSync(join(root, "style", `${locale.tag}.md`), "utf8") : "";
  const english = batch.map((w) => w.entry.message).join("\n");
  const glossary = termsIn(checked.glossary, english).map((g) => {
    const forms = (g.renderings.get(locale.tag) ?? "").split("|").map((f) => f.trim()).filter(Boolean);
    return { term: g.term, note: g.note, required: forms[0] ?? null, ...(forms.length > 1 ? { acceptedForms: forms } : {}) };
  });
  const spaces = new Set(batch.map((w) => namespaceOf(w.entry.key)));
  const inBatch = new Set(batch.map((w) => w.entry.key));
  const existing = [...known]
    .filter(([k]) => spaces.has(namespaceOf(k)) && !inBatch.has(k))
    .slice(0, CONTEXT_LIMIT)
    .map(([key, message]) => ({ key, english: checked.catalog.byKey.get(key)?.message, message }));
  const labels = namedLabels(checked, batch, known);
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
- Keep within maxLength characters when it is given; a CJK (wide) character counts as two.
- Follow the glossary's required renderings and the style guide. A required rendering equal to the English term means: keep it untranslated.
- Return one entry per key below, with the key unchanged and the translated ICU message.

Style guide for ${locale.tag}:
${style || "(none)"}

Glossary terms in this batch:
${JSON.stringify(glossary, null, 2)}

Existing ${locale.tag} translations in the same areas (for consistent wording):
${JSON.stringify(existing, null, 2)}
${labels.length ? `
Labels these strings name in a menu path or in quotation marks, with their current ${locale.tag} wording. When a string names one of these screens, menus, rows or buttons, write that label exactly as below (inflect only where the grammar requires it); use the description to pick the label on the string's platform:
${JSON.stringify(labels, null, 2)}
` : ""}
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

const MAX_CALLS = positiveInt(process.env.SILO_TRANSLATE_MAX_CALLS, DEFAULT_MAX_CALLS);
let toldWaiting = false;

/** One Claude Code call in a machine-wide slot, retried after a delay when the call itself fails. */
async function callWithRetry(prompt: string, onCall: () => void): Promise<Map<string, string>> {
  for (let i = 0; ; i++) {
    onCall();
    const release = await acquireSlot(MAX_CALLS, () => {
      if (toldWaiting) return;
      toldWaiting = true;
      console.error(`waiting: all ${MAX_CALLS} Claude Code slots on this machine are in use (SILO_TRANSLATE_MAX_CALLS)`);
    });
    try {
      return await callClaude(prompt);
    } catch (e) {
      if (i >= RETRY_DELAYS_MS.length) throw e;
    } finally {
      release();
    }
    // The slot is free while this call waits to try again.
    await sleep(RETRY_DELAYS_MS[i]!);
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
      // x-maxLength is advisory: an answer over it goes back once with the limit, and the
      // second answer is accepted (make check warns if it is still too long).
      const max = w.entry.maxLength;
      if (!problems.length && attempt === 0 && max !== undefined && literalLength(checkedMessage!.analysis.ast) > max) {
        problems.push(`longer than maxLength ${max} (a CJK character counts as two); write a shorter rendering`);
      }
      if (problems.length) feedback.set(w.entry.key, problems);
      else accepted.set(w.entry.key, message!);
    }
    if (attempt === 0) result.firstAttempt = new Map(feedback);
    pending = pending.filter((w) => feedback!.has(w.entry.key));
  }
  result.failed = feedback ?? new Map();
  return result;
}

export interface Report {
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
  // File-level metadata other ARB tools write (@@last_modified, @@x-...) stays as it was.
  for (const [key, value] of Object.entries(onDisk)) {
    if (key.startsWith("@@") && key !== "@@locale") merged[key] = value;
  }
  for (const entry of checked.catalog.entries) {
    // An empty string is how Weblate writes an untranslated unit; the loader treats it as missing.
    const raw = Object.hasOwn(onDisk, entry.key) ? onDisk[entry.key] : undefined;
    const now = raw === "" ? undefined : raw;
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
  // English keys added while this run was going aren't in the catalog it loaded. Keep their
  // translations instead of pruning them as orphans.
  const english = readJson<Record<string, unknown>>(catalogPath(root, checked.locales.source.tag), {});
  for (const [key, value] of Object.entries(onDisk)) {
    if (!key.startsWith("@") && !Object.hasOwn(merged, key) && Object.hasOwn(english, key) && value !== "") merged[key] = value;
  }
  writeFileSync(file, jsonText(canonicalArb(merged)));
  writeState(root, checked, locale, state);
}

/** Writes state/<lang>.json with the entries of keys still in the catalog. */
function writeState(root: string, checked: CheckedCatalog, locale: Locale, state: State) {
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

/** A problem with the options or the catalog; the CLI prints the message and exits with `code`. */
export class TranslateError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}

export interface TranslateOptions {
  root: string;
  /** Language tags, or "all" for every language in locales.json. */
  locales: string[] | "all";
  /** Claude Code calls at once, across languages. */
  jobs?: number;
  /** Rounds in all: keys that fail a round are sent again in the next. */
  rounds?: number;
  only?: string[];
  retranslate?: string[];
  dryRun?: boolean;
  /**
   * Leave the record of replaced human values (out/translate-<tag>.human-edits.jsonl) in place
   * after writing the PR body, for a caller that publishes the report only once a later run
   * completes: each run then reports every value replaced since the first.
   */
  keepAudit?: boolean;
  log?: (line: string) => void;
}

export const DEFAULT_JOBS = 4;
export const DEFAULT_ROUNDS = 3;

/** One language's share of a run. */
interface LanguageRun {
  locale: Locale;
  state: State;
  work: Work[];
  /** What the prompt shows as existing wording: the catalog's values plus this run's results. */
  known: Map<string, string>;
  byKey: Map<string, Work>;
  results: Map<string, string>;
  changedDuringRun: Set<string>;
  report: Report;
  logFile: string;
  audit: string;
  sent: number;
  started?: number;
  ended?: number;
}

/** The languages `wanted` names, or every language for "all". */
export function pickLocales(targets: Locale[], wanted: string[] | "all"): Locale[] {
  if (wanted === "all") return targets;
  const unknown = wanted.filter((tag) => !targets.some((l) => l.tag === tag));
  if (unknown.length || !wanted.length) {
    throw new TranslateError(`unknown locale ${unknown.join(", ") || "(none)"}; use one or more of ${targets.map((l) => l.tag).join(", ")}, or all`, 2);
  }
  return targets.filter((l) => wanted.includes(l.tag));
}

/**
 * Translates what each language is missing or has stale, writes the catalog, state and
 * out/translate-pr-body.md, and returns one report per language. Throws TranslateError when the
 * options or the catalog don't allow a run.
 */
export async function runTranslate(o: TranslateOptions): Promise<Report[]> {
  const say = o.log ?? ((line: string) => console.error(line));
  const root = o.root;
  const jobs = o.jobs ?? DEFAULT_JOBS;
  const rounds = o.rounds ?? DEFAULT_ROUNDS;
  const checked = checkRepository(root);
  // Errors block the run; warnings (such as translations an English change left stale) don't,
  // since retranslating them is part of the run.
  if (checked.issues.some((i) => i.level === "error" && i.rule !== "layout")) {
    throw new TranslateError("the catalog has validation errors; run make check first", 1);
  }
  const locales = pickLocales(checked.locales.targets, o.locales);
  // A language make add-locale added isn't ready until a person has written its style guide and
  // glossary column: the prompt would otherwise carry the template's instructions.
  const unready = locales.flatMap((l) => {
    const style = join(root, "style", `${l.tag}.md`);
    const problems: string[] = [];
    if (existsSync(style) && readFileSync(style, "utf8").includes(STYLE_TODO)) problems.push(`style/${l.tag}.md still has ${STYLE_TODO} sections`);
    if (checked.glossary.length && !checked.glossary.some((g) => g.renderings.has(l.tag))) problems.push(`glossary.csv has no ${l.tag} renderings`);
    return problems;
  });
  if (unready.length) throw new TranslateError(`not ready to translate: ${unready.join("; ")}`, 1);
  const again = o.retranslate ?? [];
  const entries = checked.catalog.entries.filter((e) => checked.english.has(e.key) && (!o.only || o.only.some((p) => e.key.startsWith(p))));

  const runs: LanguageRun[] = locales.map((locale) => {
    const state = readJson<State>(join(root, "state", `${locale.tag}.json`), {});
    const translations = checked.catalog.translations.get(locale.tag) ?? new Map<string, string>();
    const valid = new Set(checked.valid.get(locale.tag)?.keys() ?? []);
    const work = select(entries, translations, state, valid, (k) => again.some((p) => k.startsWith(p)));
    return {
      locale,
      state,
      work,
      known: new Map(translations),
      byKey: new Map(work.map((w) => [w.entry.key, w])),
      results: new Map(),
      changedDuringRun: new Set(),
      report: { locale: locale.tag, written: 0, humanEdits: [], failed: new Map(), changedDuringRun: [], batches: 0, calls: 0, seconds: 0 },
      logFile: join(root, "out", `translate-${locale.tag}.log.jsonl`),
      audit: join(root, "out", `translate-${locale.tag}.human-edits.jsonl`),
      sent: 0,
    };
  });

  if (o.dryRun) {
    const first = runs.find((r) => r.work.length);
    if (first) {
      const batch = makeBatches(first.work)[0]!;
      const r = await translateBatch(root, checked, first.locale, batch, first.known);
      console.log(JSON.stringify({ locale: first.locale.tag, batch: batch.length, accepted: Object.fromEntries(r.accepted), failed: Object.fromEntries(r.failed) }, null, 2));
    }
    return [];
  }

  mkdirSync(join(root, "out"), { recursive: true });
  for (const run of runs) {
    // select() records untracked human translations in state. With no batch to write them,
    // save them now, so a later English change retranslates those keys instead of keeping them.
    if (!run.work.length && (Object.keys(run.state).length || existsSync(join(root, "state", `${run.locale.tag}.json`)))) {
      writeState(root, checked, run.locale, run.state);
    }
  }

  const batchesFor = (run: LanguageRun, work: Work[]) => {
    const batches = makeBatches(work);
    run.report.batches += batches.length;
    return batches.map((batch) => ({ run, batch }));
  };
  let tasks = runs.flatMap((run) => batchesFor(run, run.work));
  for (const run of runs) if (run.work.length) say(`${run.locale.tag}: ${run.work.length} keys to translate in ${run.report.batches} batches`);
  say(`${tasks.length} batches in ${runs.filter((r) => r.work.length).length} languages, ${jobs} at a time`);
  let finished = 0;
  for (let round = 1; tasks.length; round++) {
    await pool(tasks, jobs, async ({ run, batch }) => {
      const t0 = Date.now();
      run.started ??= t0;
      const r = await translateBatch(root, checked, run.locale, batch, run.known);
      for (const [k, v] of r.accepted) {
        run.results.set(k, v);
        run.known.set(k, v);
      }
      for (const [k, v] of r.failed) run.report.failed.set(k, v);
      run.report.calls += r.calls;
      writeLanguage(root, checked, run.locale, run.byKey, run.results, run.state, run.changedDuringRun);
      // The record of human values replaced goes to disk with the batch, so a run that stops
      // before the end still reports them on the next run.
      for (const w of batch) {
        const k = w.entry.key;
        if ((w.reason === "human-edit-source-changed" || w.reason === "invalid") && r.accepted.has(k) && !run.changedDuringRun.has(k)) {
          appendFileSync(run.audit, JSON.stringify({ key: k, before: w.previous!, after: run.results.get(k)! }) + "\n");
        }
      }
      const n = ++run.sent;
      finished++;
      run.ended = Date.now();
      const seconds = Math.round((run.ended - t0) / 1000);
      const keys = batch.map((w) => w.entry.key);
      appendFileSync(run.logFile, JSON.stringify({ batch: n, of: run.report.batches, round, first: keys[0], last: keys[keys.length - 1], keys: keys.length, accepted: r.accepted.size, calls: r.calls, seconds, firstAttempt: Object.fromEntries(r.firstAttempt), failed: Object.fromEntries(r.failed) }) + "\n");
      say(`${run.locale.tag}: batch ${n}/${run.report.batches} done (${finished} finished in all) ${keys[0]} … ${keys[keys.length - 1]}: ${r.accepted.size}/${keys.length} accepted, ${r.firstAttempt.size} retried, ${r.failed.size} failed, ${seconds} s`);
    });
    if (round >= rounds) break;
    // Keys that still failed go round again; a later round that fails them reports them again.
    tasks = runs.flatMap((run) => {
      const retry = [...run.report.failed.keys()].map((k) => run.byKey.get(k)!);
      run.report.failed.clear();
      return retry.length ? batchesFor(run, retry) : [];
    });
    if (tasks.length) say(`round ${round + 1} of ${rounds}: sending ${tasks.reduce((n, t) => n + t.batch.length, 0)} keys that failed again`);
  }

  const audits: string[] = [];
  for (const run of runs) {
    run.report.seconds = run.started !== undefined ? (run.ended! - run.started) / 1000 : 0;
    for (const k of run.byKey.keys()) {
      if (run.results.has(k) && !run.changedDuringRun.has(k)) run.report.written++;
    }
    // Human values replaced by this run and by any earlier run that stopped before reporting.
    if (existsSync(run.audit)) {
      const edits = new Map<string, { key: string; before: string; after: string }>();
      for (const line of readFileSync(run.audit, "utf8").split("\n").filter(Boolean)) {
        const r = JSON.parse(line) as { key: string; before: string; after: string };
        edits.set(r.key, { ...r, before: edits.get(r.key)?.before ?? r.before });
      }
      run.report.humanEdits.push(...edits.values());
      audits.push(run.audit);
    }
    run.report.changedDuringRun = [...run.changedDuringRun];
  }
  const reports = runs.map((r) => r.report);
  // Audit files are removed only once the PR body that lists them is on disk, so a run that
  // stops before this point still reports the values it replaced next time.
  writeFileSync(join(root, "out/translate-pr-body.md"), prBody(reports));
  if (!o.keepAudit) for (const audit of audits) rmSync(audit);
  return reports;
}

/** Splits a comma-separated list of prefixes or tags; undefined when absent. */
function list(v?: string): string[] | undefined {
  return v ? v.split(",").map((s) => s.trim()).filter(Boolean) : undefined;
}

/** A positive integer option; a TranslateError (exit 2) names the option otherwise. */
export function intOption(name: string, v: string | undefined, fallback: number): number {
  if (v === undefined) return fallback;
  const n = Number(v);
  if (!(Number.isInteger(n) && n > 0)) throw new TranslateError(`--${name} must be a positive integer, not ${v}`, 2);
  return n;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({
    options: {
      locale: { type: "string" },
      "dry-run": { type: "boolean" },
      root: { type: "string" },
      jobs: { type: "string" },
      rounds: { type: "string" },
      only: { type: "string" },
      retranslate: { type: "string" },
    },
  });
  try {
    const root = resolve(values.root ?? resolve(import.meta.dirname, ".."));
    await runTranslate({
      root,
      locales: values.locale === "all" ? "all" : (list(values.locale) ?? []),
      jobs: intOption("jobs", values.jobs, DEFAULT_JOBS),
      rounds: intOption("rounds", values.rounds, DEFAULT_ROUNDS),
      only: list(values.only),
      retranslate: list(values.retranslate),
      dryRun: values["dry-run"],
    });
    if (!values["dry-run"]) console.error("wrote out/translate-pr-body.md; run make check, review, and open the PR");
  } catch (e) {
    if (!(e instanceof TranslateError)) throw e;
    console.error(e.message);
    process.exit(e.code);
  }
}
