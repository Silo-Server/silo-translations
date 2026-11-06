// Apple: Localizable.xcstrings (String Catalog) with every language, all entries manual, and the
// per-app InfoPlist.xcstrings catalogs for permission prompts.
// Pseudo-locales come from Xcode's own pseudolanguages, so none are generated here.
import { INFO_PLIST_APPS, infoPlistApp, inScope, isInfoPlist, type SourceEntry } from "../lib/catalog.ts";
import { TYPE, type Analysis, type MessageFormatElement } from "../lib/icu.ts";
import { languagesFor, positional, positions, render, type Files, type GenInput, type Language } from "./common.ts";

const FILE = "iosApp/iosApp/Localizable.xcstrings";
// %lld is Int and %lf Double in Xcode's generated symbols (%d would be Int32, %f Float).
const SPECIFIER = { String: "@", int: "lld", double: "lf" } as const;

type Unit = { stringUnit: { state: "translated"; value: string } };
type Localization = Unit | { variations: { plural: Record<string, Unit> } } | (Unit & { substitutions: Record<string, unknown> });

function unit(value: string): Unit {
  return { stringUnit: { state: "translated", value } };
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

function catalog(input: GenInput, languages: Language[], entries: SourceEntry[], keyOf: (e: SourceEntry) => string): string {
  const strings: Record<string, unknown> = {};
  for (const entry of entries) {
    const localizations: Record<string, Localization> = {};
    const substitution = needsSubstitution(entry, input.english.get(entry.key));
    for (const { locale, messages } of languages) {
      const a = messages?.get(entry.key);
      if (a) localizations[locale.tag] = localization(entry, a, substitution);
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
  const files: Files = new Map([[FILE, catalog(input, languages, app, (e) => e.key)]]);
  for (const [name, dir] of Object.entries(INFO_PLIST_APPS)) {
    const own = entries.filter((e) => infoPlistApp(e) === name);
    files.set(`iosApp/InfoPlist/${dir}/InfoPlist.xcstrings`, catalog(input, languages, own, (e) => e.plistKey!));
  }
  return files;
}
