// make check-complete: every language has a valid translation of every English key on the
// platforms it ships on. Each merge to main publishes a release, and a release must not leave a
// shipped language with missing keys; make check allows them, since the English commit of a pull
// request comes before its translations. CI runs this on every pull request.
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checkRepository, type CheckedCatalog } from "./lib/check.ts";
import { inScope, PLATFORMS } from "./lib/catalog.ts";
import { shipsOn } from "./lib/locales.ts";

/** Per language, the keys it ships without a valid translation, in catalog order. */
export function missingTranslations(checked: CheckedCatalog): Map<string, string[]> {
  const missing = new Map<string, string[]>();
  for (const locale of checked.locales.targets) {
    const valid = checked.valid.get(locale.tag);
    const keys = checked.catalog.entries
      .filter((e) => checked.english.has(e.key) && !valid?.has(e.key))
      .filter((e) => PLATFORMS.some((p) => inScope(e, p) && shipsOn(locale, p)))
      .map((e) => e.key);
    if (keys.length) missing.set(locale.tag, keys);
  }
  return missing;
}

const SHOWN = 5;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = resolve(process.argv[2] ?? ".");
  const checked = checkRepository(root);
  const missing = missingTranslations(checked);
  for (const [tag, keys] of missing) {
    const more = keys.length > SHOWN ? `, and ${keys.length - SHOWN} more` : "";
    console.log(`${tag}: ${keys.length} keys missing or invalid: ${keys.slice(0, SHOWN).join(", ")}${more}`);
  }
  if (missing.size) {
    console.log(`\n${missing.size} of ${checked.locales.targets.length} languages are incomplete. A maintainer translates a pull request with`);
    console.log("make translate-pr PR=<number>, or a branch with make translate LOCALE=all (see CONTRIBUTING.md).");
    process.exit(1);
  }
  console.log(`${checked.locales.targets.length} languages, every key translated`);
}
