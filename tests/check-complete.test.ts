// make check-complete: a language must carry a valid translation of every English key on the
// platforms it ships on.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { incompleteTranslations } from "../tools/check-complete.ts";
import { checkRepository } from "../tools/lib/check.ts";
import { entry, makeRepo, REPO } from "./helpers.ts";

const en = {
  ...entry("a.web", "Hello", { "x-platforms": ["web"] }),
  ...entry("a.roku", "Roku only", { "x-platforms": ["roku"] }),
  ...entry("a.named", "Hi {name}", { placeholders: { name: { type: "String" } }, "x-platforms": ["web"] }),
};
// Every language in the real locales.json but es and ar, complete.
const others = (root: string) =>
  checkRepository(root)
    .locales.targets.map((l) => l.tag)
    .filter((t) => t !== "es" && t !== "ar");

function repo(es: Record<string, string>, ar: Record<string, string>) {
  const root = makeRepo({ en, es, ar });
  const full = { "a.web": "X", "a.roku": "X", "a.named": "X {name}" };
  return makeRepo({ en, es, ar, ...Object.fromEntries(others(root).map((t) => [t, full])) });
}

test("check-complete: lists missing and invalid keys, only on platforms the language ships on", () => {
  // ar doesn't ship on Roku, so its Roku-only key isn't required; es drops a placeholder.
  const root = repo({ "a.web": "Hola", "a.named": "Hola" }, { "a.web": "مرحبا", "a.named": "مرحبا {name}" });
  const missing = incompleteTranslations(root, checkRepository(root));
  assert.deepEqual([...missing], [["es", ["a.named", "a.roku"]]]);
});

test("check-complete: exits 1 with the gaps, 0 when complete", () => {
  const incomplete = repo({ "a.web": "Hola" }, {});
  assert.throws(
    () => execFileSync(process.execPath, [join(REPO, "tools/check-complete.ts"), incomplete], { encoding: "utf8" }),
    (e: { status: number; stdout: string }) => e.status === 1 && /es: 2 keys missing, invalid or out of date: a.named, a.roku/.test(e.stdout) && /ar: 2 keys/.test(e.stdout) && /make translate-pr PR=<number>/.test(e.stdout),
  );
  const complete = repo({ "a.web": "Hola", "a.roku": "Roku", "a.named": "Hola {name}" }, { "a.web": "مرحبا", "a.named": "مرحبا {name}" });
  assert.match(execFileSync(process.execPath, [join(REPO, "tools/check-complete.ts"), complete], { encoding: "utf8" }), /every key translated/);
});

test("check-complete: a translation whose English changed since it was written is out of date", () => {
  const root = repo({ "a.web": "Hola", "a.roku": "Roku", "a.named": "Hola {name}" }, { "a.web": "مرحبا", "a.named": "مرحبا {name}" });
  // es was written for other English: its state fingerprint no longer matches.
  mkdirSync(join(root, "state"), { recursive: true });
  writeFileSync(join(root, "state/es.json"), JSON.stringify({ "a.web": { source: "0000000000000000", value: "x", by: "opus" } }) + "\n");
  assert.throws(
    () => execFileSync(process.execPath, [join(REPO, "tools/check-complete.ts"), root], { encoding: "utf8" }),
    (e: { status: number; stdout: string }) => e.status === 1 && /es: 1 keys missing, invalid or out of date: a\.web/.test(e.stdout),
  );
});
