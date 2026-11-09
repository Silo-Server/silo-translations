// Apple: Localizable.xcstrings (String Catalog) with every language, all entries manual, and the
// per-app InfoPlist.xcstrings catalogs for permission prompts.
// Pseudo-locales come from Xcode's own pseudolanguages, so none are generated here.
import { INFO_PLIST_APPS, infoPlistApp, inScope, isInfoPlist, type SourceEntry } from "../lib/catalog.ts";
import { TYPE, type Analysis, type MessageFormatElement } from "../lib/icu.ts";
import { categoriesFor, categoryOf, integerSamples } from "../lib/plural.ts";
import { languagesFor, positional, positions, render, type Files, type GenInput, type Language } from "./common.ts";

const FILE = "iosApp/iosApp/Localizable.xcstrings";
// %lld is Int and %lf Double in Xcode's generated symbols (%d would be Int32, %f Float).
const SPECIFIER = { String: "@", int: "lld", double: "lf" } as const;

// "translated" for a real translation; "needs_review" for the English value written into a
// language that has no valid translation of the key (D71).
type State = "translated" | "needs_review";
type Unit = { stringUnit: { state: State; value: string } };
type Localization = Unit | { variations: { plural: Record<string, Unit> } } | (Unit & { substitutions: Record<string, unknown> });

function unit(value: string): Unit {
  return { stringUnit: { state: "translated", value } };
}

/** Marks every string unit in a localization as an English fallback, not a translation. */
function asFallback(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(asFallback);
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => [k, k === "stringUnit" ? { ...(v as Unit["stringUnit"]), state: "needs_review" } : asFallback(v)]),
  );
}

function text(entry: SourceEntry, elements: MessageFormatElement[], formatted: boolean, pound: () => string): string {
  return render(elements, {
    literal: (t) => (formatted ? t.replace(/%/g, "%%") : t),
    arg: positional(entry, SPECIFIER),
    pound,
  });
}

/** Whether a plural form prints its count, as `#` or as the count argument itself. */
function printsCount(elements: MessageFormatElement[], arg: string): boolean {
  return elements.some((el) => el.type === TYPE.pound || (el.type === TYPE.argument && el.value === arg));
}

/**
 * Whether a plural key needs Xcode's substitution layout in every language. Xcode rejects a
 * whole-string plural variation whose forms don't reference the number ("Plural variation
 * requires referencing the number in the string"): a `{count_text}` string printed instead of
 * `#`, a label plural (`one {VOTE} other {VOTES}`), or a form such as "Delete download". It
 * accepts the same forms as a substitution. English decides, so a translation never changes the
 * generated symbol; those symbols label the count (`.key(count: n, text)`).
 */
function needsSubstitution(entry: SourceEntry, english: Analysis | undefined): boolean {
  const shape = english?.shape;
  if (shape?.kind !== "plural") return false;
  const otherNumber = entry.placeholders.some((p) => p.name !== shape.arg && p.type !== "String");
  return otherNumber || [...shape.forms.values()].some((elements) => !printsCount(elements, shape.arg));
}

function localization(entry: SourceEntry, a: Analysis, substitution: boolean): Localization {
  const shape = a.shape!;
  if (shape.kind === "simple") return unit(text(entry, shape.elements, entry.placeholders.length > 0, () => ""));
  const pos = positions(entry);
  const argNum = pos.get(shape.arg)!;
  // A translation whose forms all leave the number out (every count spelled out) can't be a
  // whole-string variation either; its layout changes, but the symbol comes from English.
  const anyPrints = [...shape.forms.values()].some((elements) => printsCount(elements, shape.arg));
  if (!substitution && anyPrints) {
    // The count is the only number: the whole string varies by plural, with positional
    // arguments. Xcode compiles this to a stringsdict and selects on the count itself, also
    // when it is not the first argument (silo-apple spike S1).
    const plural: Record<string, Unit> = {};
    for (const [cat, elements] of shape.forms) plural[cat] = unit(text(entry, elements, true, () => `%${argNum}$lld`));
    return { variations: { plural } };
  }
  // The substitution form: %#@count@ names the selecting argument; %arg is the count inside the
  // forms, and the other arguments keep their positions. The generated symbol labels the count
  // with the substitution's name (`.playerProgress(count: 3, 10)`).
  const plural: Record<string, Unit> = {};
  for (const [cat, elements] of shape.forms) plural[cat] = unit(text(entry, elements, true, () => "%arg"));
  return {
    ...unit(`%#@${shape.arg}@`),
    substitutions: { [shape.arg]: { argNum, formatSpecifier: "lld", variations: { plural } } },
  };
}

/** JSON in Xcode's own layout (sorted keys, `"key" : value`, two-space indent), so an IDE save changes nothing. */
export function xcodeJson(value: unknown, indent = ""): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  const inner = indent + "  ";
  if (Array.isArray(value)) {
    if (!value.length) return "[]";
    return `[\n${value.map((v) => inner + xcodeJson(v, inner)).join(",\n")}\n${indent}]`;
  }
  const entries = Object.entries(value).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  if (!entries.length) return "{\n\n" + indent + "}";
  return `{\n${entries.map(([k, v]) => `${inner}${JSON.stringify(k)} : ${xcodeJson(v, inner)}`).join(",\n")}\n${indent}}`;
}

/**
 * English, re-keyed to a target language's plural categories. Foundation selects a fallback's
 * form by the app language's rules, so English's `one`/`other` would give Chinese "1 parts" and
 * French "Delete download" for 0. Each target category takes the English form English itself uses
 * for that category's numbers (0–1000 and CLDR's samples). Where those numbers span several
 * English forms, it takes one that prints the count (`other` first), so the count is never lost;
 * only the agreement can then be off ("1 parts" in Japanese, which has one category).
 */
export function englishFor(english: Analysis, targetCldr: string, sourceCldr: string): Analysis {
  const shape = english.shape;
  if (shape?.kind !== "plural") return english;
  const form = (cat: string) => shape.forms.get(cat) ?? shape.forms.get("other")!;
  const forms = new Map<string, MessageFormatElement[]>();
  for (const cat of categoriesFor(targetCldr)) {
    const numbers = [...Array.from({ length: 1001 }, (_, n) => n), ...integerSamples(targetCldr, cat)];
    const used = new Set(numbers.filter((n) => categoryOf(targetCldr, n) === cat).map((n) => categoryOf(sourceCldr, n) as string));
    let chosen = [...used][0]!;
    if (used.size > 1) chosen = ["other", ...used].find((c) => used.has(c) && printsCount(form(c), shape.arg)) ?? "other";
    forms.set(cat, form(chosen));
  }
  return { ...english, shape: { ...shape, forms } };
}

/**
 * With `fallback`, every shipped language gets every key: where a language has no valid
 * translation, it gets the English value marked `needs_review`. Apple shows the raw key name for an
 * app string missing from the app language's table instead of falling back to English, which every
 * other platform does (D71). Info.plist strings don't need it: the system uses the plist's own
 * (English) value for a language without one.
 */
function catalog(input: GenInput, languages: Language[], entries: SourceEntry[], keyOf: (e: SourceEntry) => string, fallback: boolean): string {
  const strings: Record<string, unknown> = {};
  for (const entry of entries) {
    const localizations: Record<string, Localization> = {};
    const english = input.english.get(entry.key);
    const substitution = needsSubstitution(entry, english);
    for (const { locale, messages } of languages) {
      const a = messages?.get(entry.key);
      if (a) localizations[locale.tag] = localization(entry, a, substitution);
      else if (fallback && english) {
        const re = englishFor(english, locale.cldr, input.locales.source.cldr);
        localizations[locale.tag] = asFallback(localization(entry, re, substitution)) as Localization;
      }
    }
    strings[keyOf(entry)] = { comment: entry.description, extractionState: "manual", localizations };
  }
  return xcodeJson({ sourceLanguage: input.locales.source.tag, strings, version: "1.0" }) + "\n";
}

/**
 * Localizable.xcstrings for app strings, and one InfoPlist.xcstrings per app
 * (iosApp/InfoPlist/<iOS|tvOS|macOS>/) for its Info.plist strings, keyed by the plist key. The
 * three InfoPlist catalogs are always written, so the project's references stay valid. Which
 * languages ship is decided by the app strings alone; a translated prompt doesn't ship a language.
 */
export function generateApple(input: GenInput): Files {
  const entries = input.entries.filter((e) => inScope(e, "apple"));
  const app = entries.filter((e) => !isInfoPlist(e));
  const languages = languagesFor({ ...input, entries: app }, "apple", false);
  const files: Files = new Map([[FILE, catalog(input, languages, app, (e) => e.key, true)]]);
  for (const [name, dir] of Object.entries(INFO_PLIST_APPS)) {
    const own = entries.filter((e) => infoPlistApp(e) === name);
    files.set(`iosApp/InfoPlist/${dir}/InfoPlist.xcstrings`, catalog(input, languages, own, (e) => e.plistKey!, false));
  }
  return files;
}
