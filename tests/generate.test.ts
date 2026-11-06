// Golden tests: the fixture catalog's output for every platform must match tests/golden/
// byte for byte. Regenerate with `make golden` after an intended change, then review the diff.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { generateAll } from "../tools/generate.ts";
import { entry, FIXTURE, makeRepo, REPO } from "./helpers.ts";

const GOLDEN = join(REPO, "tests/golden");

function listFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? listFiles(p) : [p];
  });
}

const platforms = generateAll(FIXTURE, "test");

for (const [platform, files] of platforms) {
  test(`golden: ${platform}`, () => {
    const want = listFiles(join(GOLDEN, platform)).map((f) => relative(join(GOLDEN, platform), f)).sort();
    assert.deepEqual([...files.keys()].sort(), want, "generated file list");
    for (const [path, content] of files) {
      assert.equal(content, readFileSync(join(GOLDEN, platform, path), "utf8"), `${platform}/${path}`);
    }
  });
}

test("an apostrophe after a placeholder reaches every platform as a literal", () => {
  const root = makeRepo({ en: entry("a.b", "group {n}'s rules", { placeholders: { n: { type: "String" } } }) });
  const out = generateAll(root, "test");
  assert.equal(JSON.parse(out.get("roku")!.get("locale/en_US/strings.json")!)["a.b"], "group {n}'s rules");
  assert.match(out.get("android")!.get("android-shared/src/androidMain/res/values/strings_catalog.xml")!, /group %1\$s\\'s rules/);
  assert.equal(JSON.parse(out.get("apple")!.get("iosApp/iosApp/Localizable.xcstrings")!).strings["a.b"].localizations.en.stringUnit.value, "group %1$@'s rules");
  assert.deepEqual(JSON.parse(out.get("web")!.get("web/src/locales/en.json")!)["a.b"].at(-1), { type: 0, value: "'s rules" });
  assert.match(JSON.parse(out.get("roku")!.get("locale/en_XA/strings.json")!)["a.b"], /^⟦ĝŕöûþ \{n\}'š ŕûļéš~+⟧$/);
});
