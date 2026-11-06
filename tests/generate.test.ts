// Golden tests: the fixture catalog's output for every platform must match tests/golden/
// byte for byte. Regenerate with `make golden` after an intended change, then review the diff.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { generateAll } from "../tools/generate.ts";
import { FIXTURE, REPO } from "./helpers.ts";

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
