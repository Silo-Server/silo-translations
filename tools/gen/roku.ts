// Roku: flat locale/<folder>/strings.json in the format source/util/i18n.bs reads, plus
// source/util/pluralRules.bs compiled from CLDR, locale/languages.json (the shipped folders),
// and i18n-charsets/<folder>.txt: every
// character the language's strings use, sorted by code point, for the font subset step. The
// charsets sit outside locale/ and fonts/, so they are not packaged.
//
// A plural key becomes one entry per category of that language, `key.<category>`, with `#`
// written as `{<arg>}`. A translated plural always carries every category of its language
// (the validator requires it), so `key.other` in a language's own file means the plural is
// translated there; otherwise the client uses English with English's category.
import { inScope } from "../lib/catalog.ts";
import { brightScriptCondition, categoriesFor, CLDR_VERSION } from "../lib/plural.ts";
import { header, json, languagesFor, render, type Files, type GenInput } from "./common.ts";
import { shipsOn } from "../lib/locales.ts";
import { TYPE, type Analysis, type MessageFormatElement } from "../lib/icu.ts";

function flatten(key: string, a: Analysis, out: Record<string, string>): void {
  const shape = a.shape!;
  const opts = (pluralArg?: string) => ({
    literal: (t: string) => t,
    arg: (name: string) => `{${name}}`,
    pound: () => `{${pluralArg}}`,
  });
  if (shape.kind === "simple") out[key] = render(shape.elements, opts());
  else for (const [cat, elements] of shape.forms) out[`${key}.${cat}`] = render(elements, opts(shape.arg));
}

/**
 * Distinct non-control characters a language can show: the literal text of its messages, plus
 * the digits a count puts in place of #. Callers add English, which untranslated keys fall
 * back to.
 */
function charset(messages: Analysis[]): string {
  const chars = new Set<string>("0123456789");
  const collect = (els: MessageFormatElement[]) => {
    for (const el of els) {
      if (el.type === TYPE.literal) for (const c of el.value) chars.add(c);
      else if (el.type === TYPE.plural || el.type === TYPE.select) for (const o of Object.values(el.options)) collect(o.value);
    }
  };
  for (const a of messages) collect(a.ast);
  return [...chars].filter((c) => !/\p{Cc}/u.test(c)).sort((a, b) => a.codePointAt(0)! - b.codePointAt(0)!).join("");
}

/** Rules for every language Roku allows, shipped or not, so any folder a client has is covered. */
function pluralRules(input: GenInput): string {
  const languages = [input.locales.source, ...input.locales.targets, ...input.locales.pseudo].filter((l) => shipsOn(l, "roku"));
  // Group Roku folders by their CLDR rules, so languages that share rules share a branch.
  const groups = new Map<string, string[]>();
  for (const l of languages) groups.set(l.cldr, [...(groups.get(l.cldr) ?? []), l.roku]);
  const branches: string[] = [];
  for (const [cldr, folders] of groups) {
    const cats = categoriesFor(cldr).filter((c) => c !== "other");
    if (!cats.length) continue; // "other" for every count, the fallback below.
    const test = folders.map((f) => `language = "${f}"`).join(" or ");
    const lines = cats.map((c) => `            if ${brightScriptCondition(cldr, c)} then return "${c}"`);
    branches.push(`        ' CLDR "${cldr}"\n        if ${test}\n${lines.join("\n")}\n            return "other"\n        end if`);
  }
  return `' ${header(input.version)}
' Plural rules from CLDR ${CLDR_VERSION}, for whole numbers.
namespace pluralRules
    ' The CLDR plural category ("zero", "one", "two", "few", "many" or "other") of the
    ' whole number count in a locale folder such as "en_US" or "pt_BR". An unknown folder
    ' gets "other".
    function category(language as String, count as Integer) as String
        n = count
        if n < 0 then n = -n
${branches.join("\n")}
        return "other"
    end function
end namespace
`;
}

export function generateRoku(input: GenInput): Files {
  const files: Files = new Map();
  const entries = input.entries.filter((e) => inScope(e, "roku"));
  const english = entries.map((e) => input.english.get(e.key)!);
  const shipped = languagesFor(input, "roku", true);
  for (const { locale, messages } of shipped) {
    const out: Record<string, string> = {};
    const used: Analysis[] = [];
    for (const e of entries) {
      const a = messages?.get(e.key);
      if (!a) continue;
      flatten(e.key, a, out);
      used.push(a);
    }
    files.set(`locale/${locale.roku}/strings.json`, json(out));
    const fallback = locale === input.locales.source ? [] : english;
    files.set(`i18n-charsets/${locale.roku}.txt`, charset([...used, ...fallback]) + "\n");
  }
  // The folders this build ships, for the language picker and i18n.load (pseudo-locales apart,
  // for debug builds).
  files.set(
    "locale/languages.json",
    json({ languages: shipped.filter((l) => !l.pseudo).map((l) => l.locale.roku), pseudo: shipped.filter((l) => l.pseudo).map((l) => l.locale.roku) }),
  );
  files.set("source/util/pluralRules.bs", pluralRules(input));
  return files;
}
