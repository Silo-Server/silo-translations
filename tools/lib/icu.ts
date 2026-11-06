import { parse, TYPE, type MessageFormatElement } from "@formatjs/icu-messageformat-parser";

export { TYPE };
export type { MessageFormatElement };

/** The shape every non-web generator works from. */
export type Shape =
  | { kind: "simple"; elements: MessageFormatElement[] }
  | { kind: "plural"; arg: string; forms: Map<string, MessageFormatElement[]> };

export interface Analysis {
  ast: MessageFormatElement[];
  /** Argument names the message uses (plural and select variables included). */
  args: Set<string>;
  /** Rich-text tag names (web only). */
  tags: Set<string>;
  /** Every plural in the message: its variable and its category names (exact `=N` keys excluded). */
  plurals: { arg: string; categories: string[] }[];
  /** Set for messages inside the shared subset. */
  shape?: Shape;
  problems: string[];
}

export function parseMessage(message: string): { ast?: MessageFormatElement[]; error?: string } {
  try {
    return { ast: parse(message, { requiresOtherClause: true }) };
  } catch (e) {
    const err = e as { message?: string; originalMessage?: string };
    return { error: `ICU parse error: ${err.message ?? String(e)}` };
  }
}

// ICU's rule: an ASCII apostrophe is literal unless the next character is one it quotes
// ({ } # | or another '). FormatJS also quotes < for rich-text tags. So "{n}'s" is fine, and
// "'{" or "''" is an escape the author almost never means.
const APOSTROPHE_HAZARD = /'(?=[{}#|'<])/;

/**
 * Parses a message and checks it against the shared ICU subset (`shared`), or the web-only
 * rules. Problems are human-readable and empty when the message is fine.
 */
export function analyze(message: string, shared: boolean): Analysis {
  const parsed = parseMessage(message);
  const result = parsed.ast ? analyzeAst(parsed.ast, shared) : emptyAnalysis([parsed.error!]);
  // A check on the text people write; ASTs built by the tools never carry it.
  if (APOSTROPHE_HAZARD.test(message)) {
    result.problems.unshift("ASCII apostrophe before { } # | < or ' starts an ICU escape; use ’ (U+2019)");
    result.shape = undefined;
  }
  return result;
}

function emptyAnalysis(problems: string[]): Analysis {
  return { ast: [], args: new Set(), tags: new Set(), plurals: [], problems };
}

/** The same checks on an AST (used for generated messages such as pseudo-locales). */
export function analyzeAst(ast: MessageFormatElement[], shared: boolean): Analysis {
  const result = emptyAnalysis([]);
  result.ast = ast;

  const walk = (elements: MessageFormatElement[], inPlural: boolean) => {
    for (const el of elements) {
      switch (el.type) {
        case TYPE.literal:
        case TYPE.pound:
          break;
        case TYPE.argument:
          result.args.add(el.value);
          break;
        case TYPE.number:
        case TYPE.date:
        case TYPE.time:
          result.args.add(el.value);
          result.problems.push(`{${el.value}, ${TYPE[el.type]}} is not allowed; format it in the caller and pass a String`);
          break;
        case TYPE.select:
          result.args.add(el.value);
          if (shared) result.problems.push("select is allowed only in web-only keys");
          for (const opt of Object.values(el.options)) walk(opt.value, inPlural);
          break;
        case TYPE.plural: {
          result.args.add(el.value);
          if (el.pluralType === "ordinal") result.problems.push("selectordinal is not allowed");
          const categories = Object.keys(el.options).filter((k) => !k.startsWith("="));
          result.plurals.push({ arg: el.value, categories });
          if (shared) {
            if (inPlural) result.problems.push("nested plurals are not allowed");
            if (el.offset) result.problems.push("plural offset is not allowed");
            if (Object.keys(el.options).some((k) => k.startsWith("="))) {
              result.problems.push("exact plural matches (=N) are not allowed; use the CLDR categories");
            }
          }
          for (const opt of Object.values(el.options)) walk(opt.value, true);
          break;
        }
        case TYPE.tag:
          result.tags.add(el.value);
          if (shared) result.problems.push(`<${el.value}> tags are allowed only in web-only keys`);
          walk(el.children, inPlural);
          break;
      }
    }
  };
  walk(ast, false);

  if (shared && result.problems.length === 0) {
    const plural = ast.find((el) => el.type === TYPE.plural);
    if (!plural) {
      result.shape = { kind: "simple", elements: ast };
    } else if (ast.length !== 1) {
      result.problems.push("a plural must span the whole message");
    } else if (plural.type === TYPE.plural) {
      const forms = new Map<string, MessageFormatElement[]>();
      for (const [cat, opt] of Object.entries(plural.options)) forms.set(cat, opt.value);
      result.shape = { kind: "plural", arg: plural.value, forms };
    }
  }
  return result;
}

/** Literal text length of the longest variant, ignoring placeholders. */
export function literalLength(elements: MessageFormatElement[]): number {
  let length = 0;
  for (const el of elements) {
    if (el.type === TYPE.literal) length += [...el.value].length;
    else if (el.type === TYPE.plural || el.type === TYPE.select) {
      length += Math.max(0, ...Object.values(el.options).map((opt) => literalLength(opt.value)));
    } else if (el.type === TYPE.tag) length += literalLength(el.children);
  }
  return length;
}
