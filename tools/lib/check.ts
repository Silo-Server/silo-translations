import { CATEGORY_ORDER, categoriesFor } from "./plural.ts";
import { analyze, literalLength, type Analysis } from "./icu.ts";
import { catalogPath, inScope, isShared, loadCatalog, type Catalog, type Issue, type SourceEntry } from "./catalog.ts";
import { loadGlossary, termsIn, type GlossaryTerm } from "./glossary.ts";
import { loadLocales, type Locale, type Locales } from "./locales.ts";

export function androidName(key: string): string {
  return key.replaceAll(".", "_");
}

/** The symbol Xcode generates for a key: segments joined in lowerCamel (`a.bC.d` -> `aBCD`). */
export function appleSymbol(key: string): string {
  return key
    .split(".")
    .map((s, i) => (i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)))
    .join("");
}

function sameSet(a: Set<string>, b: Set<string>): boolean {
  return a.size === b.size && [...a].every((x) => b.has(x));
}

function list(s: Iterable<string>): string {
  const items = [...s].sort();
  return items.length ? items.join(", ") : "none";
}

/** Problems with the English message and its metadata. */
export function checkSource(entry: SourceEntry, en: Analysis, source: Locale): string[] {
  const problems = [...en.problems];
  const declared = new Set(entry.placeholders.map((p) => p.name));
  if (!sameSet(declared, en.args)) {
    problems.push(`placeholders declared (${list(declared)}) differ from those used (${list(en.args)})`);
  }
  for (const p of en.plurals) {
    const type = entry.placeholders.find((x) => x.name === p.arg)?.type;
    if (type && type !== "int") problems.push(`plural argument ${p.arg} must be declared as int`);
  }
  problems.push(...pluralCategoryProblems(en, source));
  const last = entry.key.slice(entry.key.lastIndexOf(".") + 1);
  if (en.shape?.kind !== "plural" && (CATEGORY_ORDER as readonly string[]).includes(last)) {
    problems.push(`a key that is not a plural cannot end in the plural category "${last}" (Roku writes plurals as key.<category>)`);
  }
  if (entry.placeholders.length >= 2 && (inScope(entry, "apple") || inScope(entry, "android"))) {
    // Apple's generated symbols and Android's getString take unlabeled positional arguments;
    // the description is the call site's only guide to their order.
    const at = entry.placeholders.map((p) => entry.description.indexOf(`{${p.name}}`));
    if (at.some((i) => i < 0) || at.some((i, n) => n > 0 && i < at[n - 1]!)) {
      problems.push(`description must name the placeholders in argument order: ${entry.placeholders.map((p) => `{${p.name}}`).join(", ")}`);
    }
  }
  return problems;
}

function pluralCategoryProblems(a: Analysis, locale: Locale): string[] {
  const want = categoriesFor(locale.cldr);
  return a.plurals
    .filter((p) => !sameSet(new Set(p.categories), new Set(want)))
    .map((p) => `plural ${p.arg} needs exactly the ${locale.tag} categories ${want.join(" ")} (has ${p.categories.join(" ")})`);
}

/**
 * Checks one translation against its English. `problems` are faults in the translation itself
 * (ICU syntax, the subset, plural categories). `mismatches` are differences from the current
 * English (placeholders, tags, plural structure), which is also what an English change leaves
 * behind in every existing translation. Shared with `make translate`.
 */
export function checkTranslation(
  entry: SourceEntry,
  en: Analysis,
  locale: Locale,
  message: string,
): { problems: string[]; mismatches: string[]; analysis: Analysis } {
  const tr = analyze(message, isShared(entry));
  const problems = [...tr.problems];
  const mismatches: string[] = [];
  if (!tr.ast.length && problems.length) return { problems, mismatches, analysis: tr };
  if (!sameSet(tr.args, en.args)) mismatches.push(`placeholders (${list(tr.args)}) differ from English (${list(en.args)})`);
  if (!sameSet(tr.tags, en.tags)) mismatches.push(`tags (${list(tr.tags)}) differ from English (${list(en.tags)})`);
  if (en.shape && tr.shape && en.shape.kind !== tr.shape.kind) {
    mismatches.push(en.shape.kind === "plural" ? "English is a plural; the translation must be one too" : "English is not a plural");
  } else {
    const selectors = (a: Analysis) => new Set(a.plurals.map((p) => p.arg));
    if (!sameSet(selectors(tr), selectors(en))) {
      mismatches.push(`plurals select on ${list(selectors(tr))}; English selects on ${list(selectors(en))}`);
    }
  }
  problems.push(...pluralCategoryProblems(tr, locale));
  return { problems, mismatches, analysis: tr };
}

export interface CheckedCatalog {
  locales: Locales;
  catalog: Catalog;
  /** English analysis per key (only keys whose English is valid). */
  english: Map<string, Analysis>;
  /** Analyses of valid translations: tag -> key -> analysis. */
  valid: Map<string, Map<string, Analysis>>;
  glossary: GlossaryTerm[];
  issues: Issue[];
}

/** Runs every validator rule over the repository at `root`. */
export function checkRepository(root: string): CheckedCatalog {
  const locales = loadLocales(root);
  const catalog = loadCatalog(root, locales);
  const glossary = loadGlossary(root);
  const issues: Issue[] = [...catalog.issues];
  const english = new Map<string, Analysis>();
  const sourceFile = catalog.sourceFile;

  for (const entry of catalog.entries) {
    const a = analyze(entry.message, isShared(entry));
    const problems = checkSource(entry, a, locales.source);
    for (const message of problems) issues.push({ level: "error", file: sourceFile, key: entry.key, message });
    if (problems.length === 0) english.set(entry.key, a);
  }

  // Platform name collisions. Android joins segments with "_"; Xcode's symbols join them in
  // lowerCamel (a collision fails the build). Roku expands plurals to key.<category>, and its
  // associative arrays ignore case.
  const android = new Map<string, string>();
  const apple = new Map<string, string>();
  const roku = new Map<string, string>();
  for (const entry of catalog.entries) {
    if (inScope(entry, "apple")) {
      const symbol = appleSymbol(entry.key);
      const other = apple.get(symbol);
      if (other) issues.push({ level: "error", file: sourceFile, key: entry.key, message: `Apple symbol ${symbol} collides with ${other}` });
      else apple.set(symbol, entry.key);
    }
    if (inScope(entry, "android")) {
      const name = androidName(entry.key);
      const other = android.get(name);
      if (other) issues.push({ level: "error", file: sourceFile, key: entry.key, message: `Android name ${name} collides with ${other}` });
      else android.set(name, entry.key);
    }
    if (inScope(entry, "roku")) {
      const a = english.get(entry.key);
      const names = a?.shape?.kind === "plural" ? CATEGORY_ORDER.map((c) => `${entry.key}.${c}`) : [entry.key];
      for (const name of names.map((n) => n.toLowerCase())) {
        const other = roku.get(name);
        if (other && other !== entry.key) {
          issues.push({ level: "error", file: sourceFile, key: entry.key, message: `Roku name ${name} collides with ${other}` });
        } else roku.set(name, entry.key);
      }
    }
  }

  const glossaryTerms = new Map(catalog.entries.map((e) => [e.key, termsIn(glossary, e.message)]));
  const valid = new Map<string, Map<string, Analysis>>();
  for (const locale of locales.targets) {
    const messages = catalog.translations.get(locale.tag);
    if (!messages) continue;
    const file = catalogPath(root, locale.tag);
    const ok = new Map<string, Analysis>();
    valid.set(locale.tag, ok);
    for (const [key, message] of messages) {
      const entry = catalog.byKey.get(key)!;
      const en = english.get(key);
      if (!en) continue; // English is broken; reported above.
      const { problems, mismatches, analysis: tr } = checkTranslation(entry, en, locale, message);
      for (const m of problems) issues.push({ level: "error", file, key, message: m });
      // A mismatch must not block the English change that caused it: the translation is left
      // out of generated files (English shows instead) until make translate or a person fixes it.
      for (const m of mismatches) issues.push({ level: "warning", file, key, message: `${m}; left out until retranslated` });
      if (problems.length || mismatches.length) continue;
      ok.set(key, tr);
      if (entry.maxLength !== undefined && literalLength(tr.ast) > entry.maxLength) {
        issues.push({ level: "warning", file, key, message: `longer than x-maxLength ${entry.maxLength}` });
      }
      for (const term of glossaryTerms.get(key)!) {
        const want = term.renderings.get(locale.tag);
        if (want && !message.toLocaleLowerCase(locale.tag).includes(want.toLocaleLowerCase(locale.tag))) {
          issues.push({ level: "warning", file, key, message: `glossary: "${term.term}" should be "${want}"` });
        }
      }
    }
  }

  return { locales, catalog, english, valid, glossary, issues };
}

export function formatIssue(root: string, issue: Issue): string {
  const file = issue.file.startsWith(root + "/") ? issue.file.slice(root.length + 1) : issue.file;
  return `${issue.level}: ${file}${issue.key ? `: ${issue.key}` : ""}: ${issue.message}`;
}
