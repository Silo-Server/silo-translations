// make check-complete: every language has a valid, current translation of every English key on
// the platforms it ships on. Current means written for today's English: a translation whose state
// fingerprint differs was written before the English changed, and make translate redoes it.
// Each merge to main publishes a release, and a release must not leave a shipped language with
// missing keys; make check allows them, since the English commit of a pull request comes before
// its translations. CI runs this on every pull request.
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checkRepository, type CheckedCatalog } from "./lib/check.ts";
import { inScope, PLATFORMS, type SourceEntry } from "./lib/catalog.ts";
import { shipsOn } from "./lib/locales.ts";
import { fingerprint, type State } from "./translate.ts";

/**
 * Per language, the keys it ships without a current, valid translation, in catalog order: none,
 * one that no longer validates, or one written for English that has changed since.
 */
export function incompleteTranslations(root: string, checked: CheckedCatalog): Map<string, string[]> {
  const incomplete = new Map<string, string[]>();
  for (const locale of checked.locales.targets) {
    const valid = checked.valid.get(locale.tag);
    const stateFile = join(root, "state", `${locale.tag}.json`);
    const state = existsSync(stateFile) ? (JSON.parse(readFileSync(stateFile, "utf8")) as State) : {};
    const outOfDate = (e: SourceEntry) => Object.hasOwn(state, e.key) && state[e.key]!.source !== fingerprint(e);
    const keys = checked.catalog.entries
      .filter((e) => checked.english.has(e.key) && PLATFORMS.some((p) => inScope(e, p) && shipsOn(locale, p)))
      .filter((e) => !valid?.has(e.key) || outOfDate(e))
      .map((e) => e.key);
    if (keys.length) incomplete.set(locale.tag, keys);
  }
  return incomplete;
}

const SHOWN = 5;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = resolve(process.argv[2] ?? ".");
  const checked = checkRepository(root);
  const incomplete = incompleteTranslations(root, checked);
  for (const [tag, keys] of incomplete) {
    const more = keys.length > SHOWN ? `, and ${keys.length - SHOWN} more` : "";
    console.log(`${tag}: ${keys.length} keys missing, invalid or out of date: ${keys.slice(0, SHOWN).join(", ")}${more}`);
  }
  if (incomplete.size) {
    console.log(`\n${incomplete.size} of ${checked.locales.targets.length} languages are incomplete. A maintainer translates a pull request with`);
    console.log("make translate-pr PR=<number>, or a branch with make translate LOCALE=all (see CONTRIBUTING.md).");
    process.exit(1);
  }
  console.log(`${checked.locales.targets.length} languages, every key translated`);
}
