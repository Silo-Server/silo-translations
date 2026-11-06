// Apple: one Localizable.xcstrings (String Catalog) with every language, all entries manual.
// Pseudo-locales come from Xcode's own pseudolanguages, so none are generated here.
import { inScope, type SourceEntry } from "../lib/catalog.ts";
import type { Analysis, MessageFormatElement } from "../lib/icu.ts";
import { languagesFor, positional, positions, render, type Files, type GenInput } from "./common.ts";

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

function localization(entry: SourceEntry, a: Analysis): Localization {
  const shape = a.shape!;
  if (shape.kind === "simple") return unit(text(entry, shape.elements, entry.placeholders.length > 0, () => ""));
  const pos = positions(entry);
  const argNum = pos.get(shape.arg)!;
  if (entry.placeholders.every((p) => p.name === shape.arg || p.type === "String")) {
    // The count is the only number: the whole string varies by plural, with positional
    // arguments. Xcode compiles this to a stringsdict and selects on the count itself, also
    // when it is not the first argument (silo-apple spike S1).
    const plural: Record<string, Unit> = {};
    for (const [cat, elements] of shape.forms) plural[cat] = unit(text(entry, elements, true, () => `%${argNum}$lld`));
    return { variations: { plural } };
  }
  // Another number besides the count: Xcode's substitution form names the selecting argument.
  // %arg is the count inside the forms; the other arguments keep their positions.
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

export function generateApple(input: GenInput): Files {
  const strings: Record<string, unknown> = {};
  const entries = input.entries.filter((e) => inScope(e, "apple"));
  const languages = languagesFor(input, "apple", false);
  for (const entry of entries) {
    const localizations: Record<string, Localization> = {};
    for (const { locale, messages } of languages) {
      const a = messages?.get(entry.key);
      if (a) localizations[locale.tag] = localization(entry, a);
    }
    strings[entry.key] = { comment: entry.description, extractionState: "manual", localizations };
  }
  const doc = { sourceLanguage: input.locales.source.tag, strings, version: "1.0" };
  return new Map([[FILE, xcodeJson(doc) + "\n"]]);
}
