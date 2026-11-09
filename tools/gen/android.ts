// Android: res/values{,-<qualifier>}/strings_catalog.xml in android-shared, next to (never
// replacing) hand-written strings.xml. Pseudo-locales come from AAPT's own en-XA/ar-XB
// (pseudoLocalesEnabled), so none are generated here.
//
// Both apps read android-shared's resources, so every language Android ships is generated;
// android-shared/silo-locales.properties lists each app's languages as resource qualifiers
// for its localeFilters, which is how a language is held back on one app.
import { inScope, type SourceEntry } from "../lib/catalog.ts";
import { androidName } from "../lib/check.ts";
import { TYPE, type Analysis, type MessageFormatElement } from "../lib/icu.ts";
import { BIDI_CONTROL, hasPercent, header, languagesFor, positional, render, type Files, type GenInput } from "./common.ts";
import { ANDROID_APPS, androidApps, type Locale } from "../lib/locales.ts";

const RES = "android-shared/src/androidMain/res";
const SPECIFIER = { String: "s", int: "d", double: "f" } as const;
/** Characters written as \uXXXX: XML-forbidden controls, carriage return, and bidi controls. */
const ESCAPED = new RegExp(`[\\u0000-\\u0008\\u000B-\\u001F\\u007F]|${BIDI_CONTROL.source}`, "g");
const TOOLS_NS = 'xmlns:tools="http://schemas.android.com/tools"';

/**
 * Whether lint's ImpliedQuantity check must be silenced for a plural: its English `one` form
 * prints no number ("Delete download", "VOTE"). In languages whose `one` also covers 0 (fr,
 * pt-BR), lint reads such a form as implying exactly one; the text is intended there (D76).
 */
function oneOmitsNumber(english: Analysis | undefined): boolean {
  const one = english?.shape?.kind === "plural" ? english.shape.forms.get("one") : undefined;
  return one !== undefined && !one.some((el) => el.type === TYPE.pound || el.type === TYPE.argument);
}

/** Escapes text for an AAPT string resource (backslash escapes, then XML). */
export function escapeAndroid(text: string, formatted: boolean): string {
  let s = text
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\t/g, "\\t");
  if (formatted) s = s.replace(/%/g, "%%");
  // XML forbids most control characters, AAPT folds a raw carriage return into a space, and
  // repositories that vendor the output refuse literal bidi controls: write them all as Android
  // \uXXXX escapes, which AAPT decodes to the same character.
  s = s.replace(ESCAPED, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** AAPT trims and collapses unquoted whitespace; protect leading, trailing and repeated spaces. */
function protectSpaces(value: string): string {
  return value.replace(/^ | $|(?<= ) /g, "\\u0020");
}

function value(entry: SourceEntry, elements: MessageFormatElement[], formatted: boolean, pluralArg?: string): string {
  const spec = positional(entry, SPECIFIER);
  const out = protectSpaces(
    render(elements, { literal: (t) => escapeAndroid(t, formatted), arg: spec, pound: () => spec(pluralArg!) }),
  );
  // A leading @ or ? would make AAPT read a resource reference.
  return /^[@?]/.test(out) ? `\\${out}` : out;
}

function comment(text: string): string {
  // XML comments may not contain "--" or end in "-": space out every run of hyphens.
  return text.replace(/-{2,}/g, (run) => run.split("").join(" ")).replace(/-$/, "- ");
}

function resource(entry: SourceEntry, a: Analysis, withComment: boolean, ignoreImplied: boolean): string {
  const name = androidName(entry.key);
  const lines: string[] = [];
  if (withComment) lines.push(`    <!-- ${comment(entry.description)} -->`);
  const shape = a.shape!;
  if (shape.kind === "simple") {
    // getString(id) without arguments does not format, so % stays literal there.
    const formatted = entry.placeholders.length > 0;
    const attr = !formatted && hasPercent(shape.elements) ? ' formatted="false"' : "";
    lines.push(`    <string name="${name}"${attr}>${value(entry, shape.elements, formatted)}</string>`);
  } else {
    // getQuantityString with the count always formats, so % is escaped in plural items.
    const ignore = ignoreImplied ? ' tools:ignore="ImpliedQuantity"' : "";
    lines.push(`    <plurals name="${name}"${ignore}>`);
    for (const [cat, elements] of shape.forms) {
      lines.push(`        <item quantity="${cat}">${value(entry, elements, true, shape.arg)}</item>`);
    }
    lines.push("    </plurals>");
  }
  return lines.join("\n");
}

export function generateAndroid(input: GenInput): Files {
  const files: Files = new Map();
  const entries = input.entries.filter((e) => inScope(e, "android"));
  const languages = languagesFor(input, "android", false);
  for (const { locale, messages } of languages) {
    const isSource = locale === input.locales.source;
    const shown = entries.filter((e) => messages?.has(e.key));
    const implied = new Set(shown.filter((e) => oneOmitsNumber(input.english.get(e.key))).map((e) => e.key));
    const body = shown.map((e) => resource(e, messages!.get(e.key)!, isSource, implied.has(e.key))).join("\n");
    files.set(
      `${RES}/${(locale as Locale).android}/strings_catalog.xml`,
      `<?xml version="1.0" encoding="utf-8"?>
<!-- ${header(input.version)} -->
<resources${implied.size ? ` ${TOOLS_NS}` : ""}>
${body ? body + "\n" : ""}</resources>
`,
    );
  }
  const apps = ANDROID_APPS.map((app) => {
    const qualifiers = languages.filter((l) => androidApps(l.locale).includes(app)).map((l) => (l.locale as Locale).android);
    return `${app}=${qualifiers.map((q) => (q === "values" ? input.locales.source.tag : q.replace(/^values-/, ""))).join(",")}`;
  });
  files.set("android-shared/silo-locales.properties", `# ${header(input.version)}\n# Resource qualifiers per app, for androidResources.localeFilters.\n${apps.join("\n")}\n`);
  return files;
}
