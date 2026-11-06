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
// Writes catalog/<tag>.arb, state/<tag>.json and out/translate-pr-body.md. It does not create
// branches or pull requests. --dry-run sends only the first batch and writes nothing.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";
import { checkRepository, checkTranslation, type CheckedCatalog } from "./lib/check.ts";
import { catalogPath, type SourceEntry } from "./lib/catalog.ts";
import { termsIn } from "./lib/glossary.ts";
import { categoriesFor } from "./lib/plural.ts";
import type { Locale } from "./lib/locales.ts";

export const MODEL = "claude-opus-5-5";
const BATCH_SIZE = 100;
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

export type Reason = "missing" | "invalid" | "source-changed" | "human-edit-source-changed";
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
export function select(entries: SourceEntry[], translations: Map<string, string>, state: State, valid: Set<string>): Work[] {
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

const namespace = (key: string) => key.split(".")[0]!;

export function buildPrompt(root: string, checked: CheckedCatalog, locale: Locale, batch: Work[], feedback?: Map<string, string[]>): string {
  const style = existsSync(join(root, "style", `${locale.tag}.md`)) ? readFileSync(join(root, "style", `${locale.tag}.md`), "utf8") : "";
  const english = batch.map((w) => w.entry.message).join("\n");
  const glossary = termsIn(checked.glossary, english).map((g) => ({ term: g.term, note: g.note, required: g.renderings.get(locale.tag) ?? null }));
  const spaces = new Set(batch.map((w) => namespace(w.entry.key)));
  const existing = [...(checked.catalog.translations.get(locale.tag) ?? [])]
    .filter(([k]) => spaces.has(namespace(k)) && !batch.some((w) => w.entry.key === k))
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
- A plural message must stay a plural on the same argument and use exactly these CLDR categories for ${locale.tag}: ${categoriesFor(locale.cldr).join(", ")}. Use # for the number.
- Do not add select, tags, number or date formatting. Use the typographic apostrophe ’, never ASCII '.
- Keep within maxLength characters when it is given.
- Follow the glossary's required renderings and the style guide.
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
export function callClaude(prompt: string): Map<string, string> {
  const bin = process.env.SILO_CLAUDE_BIN ?? "claude";
  const args = ["-p", "--model", MODEL, "--output-format", "json", "--json-schema", SCHEMA, "--tools", "", "--no-session-persistence", "--strict-mcp-config"];
  const r = spawnSync(bin, args, { input: prompt, encoding: "utf8", cwd: tmpdir(), maxBuffer: 64 << 20 });
  if (r.error) throw r.error;
  if (r.status !== 0) throw new Error(`${bin} exited ${r.status}: ${r.stderr || r.stdout}`);
  const out = JSON.parse(r.stdout) as { is_error?: boolean; result?: string; structured_output?: { translations: { key: string; message: string }[] } };
  if (out.is_error) throw new Error(`Claude Code: ${out.result}`);
  const data = out.structured_output ?? (JSON.parse(out.result ?? "{}") as { translations?: { key: string; message: string }[] });
  return new Map((data.translations ?? []).map((t) => [t.key, t.message]));
}

export interface BatchResult {
  accepted: Map<string, string>;
  failed: Map<string, string[]>;
}

/** Translates one batch, validates every message, and retries the failures once. */
export function translateBatch(root: string, checked: CheckedCatalog, locale: Locale, batch: Work[]): BatchResult {
  const accepted = new Map<string, string>();
  let pending = batch;
  let feedback: Map<string, string[]> | undefined;
  for (let attempt = 0; attempt < 2 && pending.length; attempt++) {
    const got = callClaude(buildPrompt(root, checked, locale, pending, feedback));
    feedback = new Map();
    for (const w of pending) {
      const message = got.get(w.entry.key);
      const checkedMessage = message === undefined ? undefined : checkTranslation(w.entry, checked.english.get(w.entry.key)!, locale, message);
      const problems = checkedMessage ? [...checkedMessage.problems, ...checkedMessage.mismatches] : ["no translation returned"];
      if (problems.length) feedback.set(w.entry.key, problems);
      else accepted.set(w.entry.key, message!);
    }
    pending = pending.filter((w) => feedback!.has(w.entry.key));
  }
  return { accepted, failed: feedback ?? new Map() };
}

interface Report {
  locale: string;
  written: number;
  humanEdits: { key: string; before: string; after: string }[];
  failed: Map<string, string[]>;
  changedDuringRun: string[];
}

function writeLanguage(root: string, checked: CheckedCatalog, locale: Locale, work: Work[], results: Map<string, string>, state: State, report: Report) {
  const file = catalogPath(root, locale.tag);
  const onDisk = readJson<Record<string, string>>(file, {});
  const merged: Record<string, string> = { "@@locale": locale.tag };
  const byKey = new Map(work.map((w) => [w.entry.key, w]));
  for (const entry of checked.catalog.entries) {
    // An empty string is how Weblate writes an untranslated unit; the loader treats it as missing.
    const now = onDisk[entry.key] === "" ? undefined : onDisk[entry.key];
    const w = byKey.get(entry.key);
    const next = results.get(entry.key);
    if (w && next !== undefined) {
      if (now !== w.previous) {
        // Someone changed the file while Claude ran: keep their value.
        report.changedDuringRun.push(entry.key);
        if (now !== undefined) merged[entry.key] = now;
        continue;
      }
      merged[entry.key] = next;
      state[entry.key] = { source: fingerprint(entry), value: valueHash(next), by: "opus", model: MODEL };
      report.written++;
      if (w.reason === "human-edit-source-changed" || w.reason === "invalid") report.humanEdits.push({ key: entry.key, before: w.previous!, after: next });
    } else if (now !== undefined) {
      merged[entry.key] = now;
    }
  }
  writeFileSync(file, JSON.stringify(merged, null, 2) + "\n");
  const ordered = Object.fromEntries(checked.catalog.entries.filter((e) => state[e.key]).map((e) => [e.key, state[e.key]]));
  mkdirSync(join(root, "state"), { recursive: true });
  writeFileSync(join(root, "state", `${locale.tag}.json`), JSON.stringify(ordered, null, 2) + "\n");
}

export function prBody(reports: Report[]): string {
  const lines = ["chore(translations): opus pass", "", `Model: ${MODEL}`, "", "| Language | Written | Failed |", "|---|---|---|"];
  for (const r of reports) lines.push(`| ${r.locale} | ${r.written} | ${r.failed.size} |`);
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

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({ options: { locale: { type: "string" }, "dry-run": { type: "boolean" }, root: { type: "string" } } });
  const root = resolve(values.root ?? resolve(import.meta.dirname, ".."));
  const checked = checkRepository(root);
  // Errors block the run; warnings (such as translations an English change left stale) don't,
  // since retranslating them is part of the run.
  if (checked.issues.some((i) => i.level === "error")) {
    console.error("the catalog has validation errors; run make check first");
    process.exit(1);
  }
  const locales = values.locale === "all" ? checked.locales.targets : checked.locales.targets.filter((l) => l.tag === values.locale);
  if (!locales.length) {
    console.error(`unknown locale ${values.locale}; use one of ${checked.locales.targets.map((l) => l.tag).join(", ")} or all`);
    process.exit(2);
  }
  const entries = checked.catalog.entries.filter((e) => checked.english.has(e.key));
  const reports: Report[] = [];
  for (const locale of locales) {
    const state = readJson<State>(join(root, "state", `${locale.tag}.json`), {});
    const translations = checked.catalog.translations.get(locale.tag) ?? new Map();
    const valid = new Set(checked.valid.get(locale.tag)?.keys() ?? []);
    const work = select(entries, translations, state, valid).sort((a, b) => (a.entry.key < b.entry.key ? -1 : 1));
    console.error(`${locale.tag}: ${work.length} keys to translate`);
    const batches: Work[][] = [];
    for (let i = 0; i < work.length; i += BATCH_SIZE) batches.push(work.slice(i, i + BATCH_SIZE));
    if (values["dry-run"]) {
      if (!batches.length) continue;
      const r = translateBatch(root, checked, locale, batches[0]!);
      console.log(JSON.stringify({ locale: locale.tag, batch: batches[0]!.length, accepted: Object.fromEntries(r.accepted), failed: Object.fromEntries(r.failed) }, null, 2));
      break;
    }
    const results = new Map<string, string>();
    const report: Report = { locale: locale.tag, written: 0, humanEdits: [], failed: new Map(), changedDuringRun: [] };
    for (const [i, batch] of batches.entries()) {
      console.error(`${locale.tag}: batch ${i + 1}/${batches.length}`);
      const r = translateBatch(root, checked, locale, batch);
      for (const [k, v] of r.accepted) results.set(k, v);
      for (const [k, v] of r.failed) report.failed.set(k, v);
    }
    writeLanguage(root, checked, locale, work, results, state, report);
    reports.push(report);
  }
  if (!values["dry-run"]) {
    mkdirSync(join(root, "out"), { recursive: true });
    writeFileSync(join(root, "out/translate-pr-body.md"), prBody(reports));
    console.error("wrote out/translate-pr-body.md; run make check, review, and open the PR");
  }
}
