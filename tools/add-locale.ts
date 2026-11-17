// make add-locale TAG=<bcp47> [NAME=…] [PLATFORMS=web,apple,android]: the files a new language
// needs before its first translation pass.
//
//   - locales.json: the language's line, with its identifiers derived from the tag (CLDR plural
//     key, Android resource directory, Roku folder, text direction) and, when Roku's packaged
//     fonts can't draw its script or it is right-to-left, the platforms without Roku
//   - glossary.csv: an empty column for the language (--glossary fills it from a term,rendering file)
//   - style/<tag>.md: the style guide template; its plural section is filled in from CLDR, the
//     sections marked TODO(add-locale) are written by whoever adds the language, and make
//     translate refuses the language until none is left
//
// Rerun with --glossary <file> to (re)write the column, for example after a rebase that conflicts
// in glossary.csv: take main's file and run it again.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { parseCsv } from "./lib/glossary.ts";
import { categoriesFor, categoryOf, type Category } from "./lib/plural.ts";
import { STYLE_TODO as TODO, type Locale, type LocalePlatform } from "./lib/locales.ts";

/**
 * Scripts the Roku app's packaged Inter subset draws (silo-roku scripts/subset-fonts.sh: Latin
 * and its extensions, Greek, Cyrillic, Vietnamese). SceneGraph has no font fallback and no
 * right-to-left layout, so any other script, and any right-to-left language, stays off Roku.
 */
const ROKU_SCRIPTS = ["Latn", "Grek", "Cyrl"];

/**
 * Android's java.util.Locale rewrites these ISO 639 codes to their old forms, and resources are
 * looked up under the old one (lint's LocaleFolder check): values-iw, not values-he.
 */
const ANDROID_LEGACY: Record<string, string> = { he: "iw", id: "in", yi: "ji" };

export class AddLocaleError extends Error {}

/** The CLDR plural key: the full tag when CLDR has rules for it (pt-PT), else its language. */
export function cldrKey(tag: string): string {
  for (const key of [tag, new Intl.Locale(tag).language]) {
    try {
      categoriesFor(key);
      return key;
    } catch {
      // no rules under this key
    }
  }
  throw new AddLocaleError(`CLDR has no plural rules for ${tag}`);
}

export function androidDir(tag: string): string {
  const l = new Intl.Locale(tag);
  const language = ANDROID_LEGACY[l.language] ?? l.language;
  if (l.script) return `values-b+${[language, l.script, l.region].filter(Boolean).join("+")}`;
  return l.region ? `values-${language}-r${l.region}` : `values-${language}`;
}

export function direction(tag: string): "ltr" | "rtl" {
  const l = new Intl.Locale(tag) as Intl.Locale & { getTextInfo?: () => { direction: string }; textInfo?: { direction: string } };
  return (l.getTextInfo?.() ?? l.textInfo)?.direction === "rtl" ? "rtl" : "ltr";
}

/** The language's own name for itself, capitalized as a picker lists it. */
export function endonym(tag: string): string {
  const name = new Intl.DisplayNames([tag], { type: "language" }).of(tag) ?? tag;
  return name.charAt(0).toLocaleUpperCase(tag) + name.slice(1);
}

/** Every platform, or every one but Roku when Roku can't show the language. */
export function defaultPlatforms(tag: string): LocalePlatform[] | undefined {
  const script = new Intl.Locale(tag).maximize().script ?? "";
  return ROKU_SCRIPTS.includes(script) && direction(tag) === "ltr" ? undefined : ["web", "apple", "android"];
}

export function newLocale(tag: string, o: { name?: string; platforms?: LocalePlatform[] } = {}): Locale {
  const canonical = Intl.getCanonicalLocales(tag)[0]!;
  if (canonical !== tag) throw new AddLocaleError(`write the tag as ${canonical}`);
  const platforms = o.platforms ?? defaultPlatforms(tag);
  return {
    tag,
    name: o.name ?? endonym(tag),
    dir: direction(tag),
    cldr: cldrKey(tag),
    android: androidDir(tag),
    roku: tag.replace(/-/g, "_"),
    ...(platforms ? { platforms } : {}),
  };
}

/** locales.json with the language's line added after the last language. */
export function addToLocalesJson(text: string, locale: Locale): string {
  const raw = JSON.parse(text) as { locales: Locale[] };
  if (raw.locales.some((l) => l.tag === locale.tag)) throw new AddLocaleError(`${locale.tag} is already in locales.json`);
  const lines = text.split("\n");
  const close = lines.findIndex((line, i) => i > 0 && /^\s*\],?\s*$/.test(line) && /"tag"/.test(lines[i - 1]!));
  if (close < 0) throw new AddLocaleError("locales.json: can't find the end of the locales list (one language per line)");
  const indent = /^\s*/.exec(lines[close - 1]!)![0];
  const fields = Object.entries(locale).map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v).replace(/","/g, '", "')}`);
  lines[close - 1] = lines[close - 1]!.replace(/\s*$/, "").replace(/,?$/, ",");
  lines.splice(close, 0, `${indent}{ ${fields.join(", ")} }`);
  const out = lines.join("\n");
  JSON.parse(out);
  return out;
}

function csvField(s: string): string {
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function csvText(rows: string[][]): string {
  return rows.map((r) => r.map(csvField).join(",")).join("\n") + "\n";
}

/**
 * glossary.csv with a column for `tag` (renderings by term; absent terms stay empty). An existing
 * column is replaced. Refuses a file it would not write back unchanged, so no other column moves.
 */
export function setGlossaryColumn(text: string, tag: string, renderings: Map<string, string> = new Map()): string {
  const rows = parseCsv(text.replace(/^﻿/, ""));
  if (csvText(rows) !== text) throw new AddLocaleError("glossary.csv isn't in the layout this tool writes back (one row per line, quotes only where needed)");
  const header = rows[0]!;
  let col = header.indexOf(tag);
  if (col < 0) {
    col = header.length;
    header.push(tag);
  }
  const terms = new Set(rows.slice(1).map((r) => r[0]!));
  const unknown = [...renderings.keys()].filter((t) => !terms.has(t));
  if (unknown.length) throw new AddLocaleError(`not glossary terms: ${unknown.join(", ")}`);
  for (const row of rows.slice(1)) {
    while (row.length < header.length) row.push("");
    row[col] = renderings.get(row[0]!) ?? "";
  }
  return csvText(rows);
}

/** Whole numbers (and a million) each category takes, as examples for the style guide. */
function examples(cldr: string, category: Category): string {
  const found = [...Array.from({ length: 1001 }, (_, n) => n), 1_000_000].filter((n) => categoryOf(cldr, n) === category);
  if (!found.length) return "only fractions (never a whole number)";
  return found.length > 8 ? `${found.slice(0, 8).join(", ")}, …` : found.join(", ");
}

export function styleTemplate(locale: Locale, englishName: string): string {
  const cats = categoriesFor(locale.cldr);
  const plural = cats.map((c) => `  - \`${c}\`: ${examples(locale.cldr, c)}`).join("\n");
  const todo = (what: string) => `<!-- ${TODO}: ${what} -->`;
  return `# ${englishName} (${locale.tag})

## Voice

${todo("how to address the user (formal or informal, and how), the form of buttons and menu items, of setting labels, of on/off values and of progress states (Loading…); capitalization; quotation marks; neutral wording for people. Model it on the guide of the closest language in style/.")}

- Keep every word that narrows what a sentence covers: *with {provider}*, *on this device*,
  *only*, *for this profile*. Dropping one changes what the sentence says.

## Placeholders and grammar

${todo("what a placeholder's unseen value does to the words around it (case endings, articles, gender and agreement, particles), and how to write around it: a carrier noun before the placeholder, or a sentence where it stands alone.")}

## Typography

${todo("punctuation and spacing rules of the language (quotation marks, spaces before punctuation, the ellipsis …, the apostrophe ’, number and unit spacing).")}

## Vocabulary

${todo("the standard UI terms the language's platforms use (settings, server, library, subtitles, download, device, account, password), and English loans it keeps.")}

## Terms that depend on context

${todo("a table of English words whose rendering depends on the meaning: request, Settings / a setting, add / delete / remove / clear, show (verb) / TV show, source, session, party (Watch Party), stream, worker, queue / schedule, sync, rating (stars) / rating (age), cast, buffering, pair, Couldn’t…, Try again / Retry, Auto, seek (moving within playback; never the word for search).")}

The glossary (\`glossary.csv\`) holds the fixed renderings and the names never translated.

## Keep as written

Code, file paths, URLs, environment variable and setting names, text in backticks, hostnames,
units (*Mbps*, *kbps*, *GB*), resolutions (*1080p*), codec, protocol and format names (in their
usual capitals, *HTTP*, *HLS*), and keyboard keys (*Space*, *Enter*).

When a sentence names another screen, button, row, task or setting, use the label that element
has in the catalog in this language, not the English one. Write that label word for word, also
inside a menu path (*Settings → General → …*): don’t swap in a synonym or another wording of the
same idea. When the prompt lists the labels a string names, use the one on the string’s
platform. The glossary lists the names that recur.

## Plurals and numbers

- Plurals list exactly these CLDR categories, with the whole numbers each one takes:
${plural}
  Write \`#\` where the number goes.
${todo("what each category's noun form is (with an example plural message), and anything the language does to a noun after a number.")}
- Where the English prints \`{count_text}\` instead of \`#\`, keep \`{count_text}\`: the app formats
  that number.
- Digits come from the app; don't write numbers out or change separators. An example of what to
  type into a field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly as written.

## Length

${todo("whether the language runs longer than English, and how to shorten a label that has to fit maxLength (TV and small controls) without abbreviating words.")}

## Season and episode codes

${todo("the letters for season and episode codes, used the same way everywhere (codes, tags, captions, play buttons, Watch Party lines, notifications, admin pages): S{season}E{episode} unless the language's streaming apps use their own letters; keep the English separators (none, · or :); and how spelled-out text names a season and an episode.")}
`;
}

/** Reads a term,rendering CSV (a header row first). */
export function readRenderings(text: string): Map<string, string> {
  const [header, ...rows] = parseCsv(text.replace(/^﻿/, ""));
  if (!header || header[0] !== "term" || header.length !== 2) throw new AddLocaleError("the glossary file needs two columns, term,rendering");
  return new Map(rows.map((r) => [r[0]!, r[1] ?? ""]));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      root: { type: "string" },
      name: { type: "string" },
      platforms: { type: "string" },
      glossary: { type: "string" },
    },
  });
  try {
    const tag = positionals[0];
    if (!tag) throw new AddLocaleError("usage: node tools/add-locale.ts <tag> [--name <endonym>] [--platforms web,apple,android] [--glossary <term,rendering csv>]");
    const root = resolve(values.root ?? resolve(import.meta.dirname, ".."));
    const localesFile = join(root, "locales.json");
    const glossaryFile = join(root, "glossary.csv");
    const styleFile = join(root, "style", `${tag}.md`);
    const renderings = values.glossary ? readRenderings(readFileSync(values.glossary, "utf8")) : undefined;
    const present = (JSON.parse(readFileSync(localesFile, "utf8")) as { locales: Locale[] }).locales.find((l) => l.tag === tag);
    if (!present) {
      const platforms = values.platforms?.split(",").map((p) => p.trim()) as LocalePlatform[] | undefined;
      const locale = newLocale(tag, { name: values.name, platforms });
      writeFileSync(localesFile, addToLocalesJson(readFileSync(localesFile, "utf8"), locale));
      console.log(`locales.json: ${JSON.stringify(locale)}`);
      if (!existsSync(styleFile)) {
        const english = new Intl.DisplayNames(["en"], { type: "language" }).of(tag) ?? tag;
        mkdirSync(join(root, "style"), { recursive: true });
        writeFileSync(styleFile, styleTemplate(locale, english));
        console.log(`style/${tag}.md: template written; replace every ${TODO} section`);
      }
    } else if (!renderings) {
      throw new AddLocaleError(`${tag} is already in locales.json; pass --glossary <file> to set its glossary column`);
    }
    if (existsSync(glossaryFile)) {
      writeFileSync(glossaryFile, setGlossaryColumn(readFileSync(glossaryFile, "utf8"), tag, renderings));
      const filled = renderings ? [...renderings.values()].filter(Boolean).length : 0;
      console.log(`glossary.csv: ${tag} column with ${filled} renderings`);
    }
  } catch (e) {
    if (!(e instanceof AddLocaleError)) throw e;
    console.error(e.message);
    process.exit(1);
  }
}
