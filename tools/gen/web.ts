// Web: one FormatJS AST file per language (what `formatjs compile --ast` emits, so react-intl
// skips parsing at runtime) and keys.ts with the key type and the language list.
import { inScope } from "../lib/catalog.ts";
import { header, json, languagesFor, type Files, type GenInput } from "./common.ts";

const DIR = "web/src/locales";

export function generateWeb(input: GenInput): Files {
  const files: Files = new Map();
  const entries = input.entries.filter((e) => inScope(e, "web"));
  const languages = languagesFor(input, "web", true);
  for (const { locale, messages } of languages) {
    const out: Record<string, unknown> = {};
    for (const e of entries) {
      const a = messages?.get(e.key);
      if (a) out[e.key] = a.ast;
    }
    files.set(`${DIR}/${locale.tag}.json`, json(out));
  }

  const keyLines = entries.length ? entries.map((e) => `  | ${JSON.stringify(e.key)}`).join("\n") : "  never";
  const localeLines = languages
    .map(({ locale, pseudo }) => `  { tag: ${JSON.stringify(locale.tag)}, name: ${JSON.stringify(locale.name)}, dir: "${locale.dir}", pseudo: ${pseudo} },`)
    .join("\n");
  files.set(
    `${DIR}/keys.ts`,
    `// ${header(input.version)}

export type MessageKey =
${keyLines};

export interface AppLocale {
  tag: string;
  name: string;
  dir: "ltr" | "rtl";
  /** Pseudo-locales are for debug builds only. */
  pseudo: boolean;
}

export const SOURCE_LOCALE = ${JSON.stringify(input.locales.source.tag)};

/** The languages this build ships (each has a <tag>.json), then the pseudo-locales. */
export const LOCALES: readonly AppLocale[] = [
${localeLines}
];
`,
  );
  return files;
}
