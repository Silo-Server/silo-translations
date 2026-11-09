import { CATEGORY_ORDER, categoriesFor } from "./plural.ts";
import { analyze, literalLength, TYPE, type Analysis, type MessageFormatElement } from "./icu.ts";
import { catalogPath, INFO_PLIST_APPS, INFO_PLIST_PREFIX, infoPlistApp, inScope, isInfoPlist, isShared, loadCatalog, PLIST_KEY_PATTERN, type Catalog, type Issue, type SourceEntry } from "./catalog.ts";
import { loadGlossary, termsIn, usesRendering, type GlossaryTerm } from "./glossary.ts";
import { loadLocales, type Locale, type Locales } from "./locales.ts";
import { readFileSync } from "node:fs";
import { formattedFiles, LAYOUT_MESSAGE, layoutProblems } from "./format.ts";

export function androidName(key: string): string {
  return key.replaceAll(".", "_");
}

/**
 * The symbol Xcode generates for a key: segments joined in lowerCamel, with a capital after each
 * `_` and after a digit (`a.bC.d` -> `aBCD`, `requests.reason.not_found` ->
 * `requestsReasonNotFound`, `watchParty.seat.a11yHost` -> `watchPartySeatA11YHost`).
 */
export function appleSymbol(key: string): string {
  return key
    .split(".")
    .map((seg, i) => {
      const s = seg.replace(/_+([A-Za-z0-9])/g, (_, c: string) => c.toUpperCase()).replace(/(\d)([a-z])/g, (_, d: string, c: string) => d + c.toUpperCase());
      return i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1);
    })
    .join("");
}

function sameSet(a: Set<string>, b: Set<string>): boolean {
  return a.size === b.size && [...a].every((x) => b.has(x));
}

function list(s: Iterable<string>): string {
  const items = [...s].sort();
  return items.length ? items.join(", ") : "none";
}

/** Every select argument in a message with the union of its option names. */
function selectOptions(elements: MessageFormatElement[], out = new Map<string, Set<string>>()): Map<string, Set<string>> {
  for (const el of elements) {
    if (el.type === TYPE.select) {
      const names = out.get(el.value) ?? new Set<string>();
      for (const [name, option] of Object.entries(el.options)) {
        names.add(name);
        selectOptions(option.value, out);
      }
      out.set(el.value, names);
    } else if (el.type === TYPE.plural) {
      for (const option of Object.values(el.options)) selectOptions(option.value, out);
    } else if (el.type === TYPE.tag) selectOptions(el.children, out);
  }
  return out;
}

/** Problems with the English message and its metadata. */
export function checkSource(entry: SourceEntry, en: Analysis, source: Locale): string[] {
  const problems = [...en.problems];
  const declared = new Set(entry.placeholders.map((p) => p.name));
  // FormatJS reads arguments and tag handlers from one values object, so a name can't be both.
  const both = [...en.args].filter((a) => en.tags.has(a));
  if (both.length) problems.push(`${list(both)} used both as a placeholder and as a tag; rename one`);
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
  problems.push(...infoPlistProblems(entry));
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

/**
 * Rules for Info.plist strings (permission prompts): apple.infoPlist.<app>.<name>, Apple only,
 * with the plist key in x-plistKey, and no placeholders (Info.plist values are not formatted).
 */
function infoPlistProblems(entry: SourceEntry): string[] {
  const problems: string[] = [];
  if (!isInfoPlist(entry)) {
    if (entry.plistKey !== undefined) problems.push(`x-plistKey is only for ${INFO_PLIST_PREFIX}* keys`);
    return problems;
  }
  if (!infoPlistApp(entry)) problems.push(`Info.plist keys are ${INFO_PLIST_PREFIX}<${Object.keys(INFO_PLIST_APPS).join("|")}>.<name>`);
  if (entry.platforms.length !== 1 || entry.platforms[0] !== "apple") problems.push('Info.plist keys need "x-platforms": ["apple"]');
  if (!entry.plistKey || !PLIST_KEY_PATTERN.test(entry.plistKey)) problems.push("Info.plist keys need x-plistKey, the plist key verbatim (such as NSCameraUsageDescription)");
  if (entry.placeholders.length) problems.push("Info.plist strings take no placeholders");
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
  // Callers pass the English option values, so an option English doesn't have is never chosen.
  // A translation may drop options (Japanese keeps only `other` for a gender select) or print
  // the argument instead (a day number that English selects on only for its ordinal suffix).
  const trSelects = selectOptions(tr.ast);
  for (const [arg, want] of selectOptions(en.ast)) {
    const got = trSelects.get(arg);
    if (!got) continue;
    const extra = [...got].filter((o) => !want.has(o));
    if (extra.length) mismatches.push(`select ${arg} has options English doesn't (${list(extra)}); use English's (${list(want)})`);
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

  // Two keys for the same Info.plist key of one app.
  const plist = new Map<string, string>();
  for (const entry of catalog.entries) {
    const app = infoPlistApp(entry);
    if (!app || !entry.plistKey) continue;
    const other = plist.get(`${app} ${entry.plistKey}`);
    if (other) issues.push({ level: "error", file: sourceFile, key: entry.key, message: `${entry.plistKey} for ${app} is already ${other}` });
    else plist.set(`${app} ${entry.plistKey}`, entry.key);
  }

  // Platform name collisions. Android joins segments with "_"; Xcode's symbols join them in
  // lowerCamel (a collision fails the build). Roku expands plurals to key.<category>, and its
  // associative arrays ignore case.
  const android = new Map<string, string>();
  const apple = new Map<string, string>();
  const roku = new Map<string, string>();
  for (const entry of catalog.entries) {
    // Info.plist strings get no Localizable symbol.
    if (inScope(entry, "apple") && !isInfoPlist(entry)) {
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

  // Canonical layout (make fmt), so branches that add keys in parallel merge cleanly. Only make
  // check fails on these; generate and translate read the content and ignore the layout.
  for (const { file, kind } of formattedFiles(root)) {
    const { problems, layout, parsed } = layoutProblems(readFileSync(file, "utf8"), kind);
    // An unparsable file the loader read is already reported; one it skipped (a language not in
    // locales.json) is not. Repeated keys lose data, so they block generate and translate too.
    const reported = !parsed && issues.some((i) => i.file === file && !i.key);
    for (const message of problems) if (!reported) issues.push({ level: "error", file, message });
    if (layout) issues.push({ level: "error", file, message: LAYOUT_MESSAGE, rule: "layout" });
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
        if (want && !usesRendering(message, want, locale.tag)) {
          issues.push({ level: "warning", file, key, message: `glossary: "${term.term}" should be "${want.split("|").join('" or "')}"` });
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
