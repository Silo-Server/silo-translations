// The plural rules agree with CLDR's own samples for every shipped language, in TypeScript and
// in the generated BrightScript (compiled with bsc and run under brs-node).
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { categoriesFor, categoryOf, integerSamples } from "../tools/lib/plural.ts";
import { loadLocales, shipsOn } from "../tools/lib/locales.ts";
import { generateAll } from "../tools/generate.ts";
import { entry, makeRepo, REPO } from "./helpers.ts";

const locales = loadLocales(REPO);
const languages = [...locales.all, ...locales.pseudo];
// Boundaries beyond CLDR's samples: zero, one, a million (es/fr/pt many), Arabic mod-100 edges.
const EXTRA = [0, 1, 2, 3, 10, 11, 99, 100, 101, 102, 103, 111, 1000, 1000000, 2000000, 1000001];

function cases(): { roku: string; n: number; want: string }[] {
  const out: { roku: string; n: number; want: string }[] = [];
  for (const l of languages.filter((l) => shipsOn(l, "roku"))) {
    for (const cat of categoriesFor(l.cldr)) for (const n of integerSamples(l.cldr, cat)) out.push({ roku: l.roku, n, want: cat });
    for (const n of EXTRA) out.push({ roku: l.roku, n, want: categoryOf(l.cldr, n) });
  }
  return out;
}

test("plural: CLDR integer samples", () => {
  for (const l of languages) {
    for (const cat of categoriesFor(l.cldr)) {
      const samples = integerSamples(l.cldr, cat);
      assert.ok(samples.length > 0, `${l.tag} ${cat} has samples`);
      for (const n of samples) assert.equal(categoryOf(l.cldr, n), cat, `${l.tag} ${n}`);
    }
  }
  assert.equal(categoryOf("es", 1000000), "many");
  assert.equal(categoryOf("fr", 0), "one");
  assert.equal(categoryOf("pt", 0), "one");
  assert.equal(categoryOf("de", 0), "other");
  assert.equal(categoryOf("ar", 102), "other");
  assert.equal(categoryOf("ar", 111), "many");
  assert.equal(categoryOf("ar", -3), "few");
});

test("plural: generated pluralRules.bs compiles with bsc and matches under brs-node", () => {
  const dir = mkdtempSync(join(tmpdir(), "silo-plural-"));
  mkdirSync(join(dir, "src/source/util"), { recursive: true });
  // A catalog where every language has a translation, so every Roku language ships and gets rules.
  const root = makeRepo({
    en: entry("a.b", "Hi"),
    ...Object.fromEntries(locales.targets.map((l) => [l.tag, { "@@locale": l.tag, "a.b": "x" }])),
  });
  const rules = generateAll(root, "test").get("roku")!.get("source/util/pluralRules.bs")!;
  writeFileSync(join(dir, "src/source/util/pluralRules.bs"), rules);
  const all = cases();
  const calls = all.map((c) => `    print "${c.roku} ${c.n} " + pluralRules.category("${c.roku}", ${c.n})`).join("\n");
  writeFileSync(join(dir, "src/source/main.bs"), `sub Main()\n${calls}\nend sub\n`);
  writeFileSync(join(dir, "src/manifest"), "title=plural\nmajor_version=1\nminor_version=0\nbuild_version=0\n");
  const bin = join(REPO, "node_modules/.bin");
  const bsc = execFileSync(join(bin, "bsc"), ["--rootDir", "src", "--stagingDir", "staging", "--createPackage", "false"], {
    cwd: dir,
    encoding: "utf8",
  });
  assert.doesNotMatch(bsc, /error|warning/i, bsc);
  const out = execFileSync(join(bin, "brs-cli"), ["-n", "staging/source/main.brs", "staging/source/util/pluralRules.brs"], {
    cwd: dir,
    encoding: "utf8",
  });
  const got = new Map(out.split(/\r?\n/).filter((l) => /^\S+ \d+ \w+$/.test(l)).map((l) => {
    const [roku, n, cat] = l.split(" ");
    return [`${roku} ${n}`, cat];
  }));
  for (const c of all) assert.equal(got.get(`${c.roku} ${c.n}`), c.want, `${c.roku} ${c.n}`);
});
