// make translate-pr: a pull request's English translated into every language and pushed back,
// with local repositories standing in for GitHub (tests/bin/fake-gh.mjs, fake-claude.mjs).
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { bodyWithSection, commitMessage, filesNeedingReview, subjectFromTitle } from "../tools/translate-pr.ts";
import { loadLocales } from "../tools/lib/locales.ts";
import { checkRepository } from "../tools/lib/check.ts";
import { fingerprint, valueHash } from "../tools/translate.ts";
import { entry, REPO, testSlotPort, writeArb } from "./helpers.ts";

test("translate-pr: subject, files to review, description section", () => {
  assert.equal(subjectFromTitle("feat(catalog): add the row of collections wording"), "the row of collections wording");
  assert.equal(subjectFromTitle("feat: show the sign-in button text on the web"), "show the sign-in button text on the web");
  assert.deepEqual(filesNeedingReview(["catalog/en.arb", "state/es.json", "tools/translate.ts", "catalog/sub/x.arb", "locales.json"]), ["tools/translate.ts", "catalog/sub/x.arb", "locales.json"]);
  assert.equal(commitMessage("the x keys", ["Co-Authored-By: A <a@b>"]), "chore(translations): the x keys in every language\n\nCo-Authored-By: A <a@b>\n");
  const report = { locale: "es", written: 2, humanEdits: [], failed: new Map(), changedDuringRun: [], batches: 1, calls: 1, seconds: 60 };
  const once = bodyWithSection("## Problem\n\nText.", [report], 21, 2);
  assert.match(once, /^## Problem\n\nText\.\n\n<!-- translate-pr -->\n## Translations\n/);
  assert.match(once, /translated 2 strings; all 21 languages have every key/);
  assert.match(once, /\| es \| 2 \| 0 \| 1 \| 1 \| 1 min \|/);
  const twice = bodyWithSection(once, [{ ...report, written: 5 }], 21, 5);
  assert.equal(twice.match(/<!-- translate-pr -->/g)!.length, 1, "a rerun replaces the section");
  assert.match(twice, /translated 5 strings/);
});

const git = (cwd: string, ...args: string[]) => execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const IDENTITY = { GIT_AUTHOR_NAME: "T", GIT_AUTHOR_EMAIL: "t@example.com", GIT_COMMITTER_NAME: "T", GIT_COMMITTER_EMAIL: "t@example.com" };

/**
 * origin.git with main (one key, every language translated) and pull request 7 adding a key.
 * `mainFiles` and `prFiles` change the seed checkout before main's and the pull request's commit.
 */
function setUp(prFiles: (seed: string) => void = () => {}, mainFiles: (seed: string, tags: string[]) => void = () => {}) {
  const dir = mkdtempSync(join(tmpdir(), "silo-translate-pr-test-"));
  const origin = join(dir, "origin.git");
  const seed = join(dir, "seed");
  execFileSync("git", ["init", "--quiet", "--bare", "--initial-branch=main", origin]);
  execFileSync("git", ["clone", "--quiet", origin, seed], { stdio: "ignore" });
  Object.assign(process.env, IDENTITY);
  cpSync(join(REPO, "locales.json"), join(seed, "locales.json"));
  writeFileSync(join(seed, ".gitignore"), "out/\n");
  mkdirSync(join(seed, "catalog"));
  const tags = loadLocales(seed).targets.map((l) => l.tag);
  writeArb(join(seed, "catalog/en.arb"), entry("a.b", "Hello"));
  for (const tag of tags) writeArb(join(seed, `catalog/${tag}.arb`), { "@@locale": tag, "a.b": `${tag} Hello` });
  mainFiles(seed, tags);
  git(seed, "add", ".");
  git(seed, "commit", "--quiet", "-m", "main");
  git(seed, "push", "--quiet", "origin", "main");
  git(seed, "switch", "--quiet", "-c", "feat/x");
  writeArb(join(seed, "catalog/en.arb"), { ...entry("a.b", "Hello"), ...entry("a.c", "New words") });
  prFiles(seed);
  git(seed, "add", ".");
  git(seed, "commit", "--quiet", "-m", "feat(catalog): add the new words");
  git(seed, "push", "--quiet", "origin", "feat/x", "HEAD:refs/pull/7/head");
  const head = git(seed, "rev-parse", "HEAD");
  const files = git(seed, "diff", "--name-only", "main", "HEAD").split("\n").map((path) => ({ path }));
  const repo = join(dir, "maintainer");
  execFileSync("git", ["clone", "--quiet", origin, repo], { stdio: "ignore" });
  const prJson = join(dir, "pr.json");
  writeFileSync(prJson, JSON.stringify({ number: 7, title: "feat(catalog): add the new words", url: "https://example.com/pr/7", state: "OPEN", body: "## Problem\n\nNo words.", headRefName: "feat/x", headRefOid: head, isCrossRepository: false, maintainerCanModify: true, headRepository: { name: "x" }, headRepositoryOwner: { login: "o" }, files }));
  return { dir, origin, repo, head, tags, prJson, body: join(dir, "body.md") };
}

function translatePr(s: ReturnType<typeof setUp>, ...args: string[]) {
  return translatePrEnv(s, {}, ...args);
}

function translatePrEnv(s: ReturnType<typeof setUp>, env: Record<string, string>, ...args: string[]) {
  return execFileSync(process.execPath, [join(REPO, "tools/translate-pr.ts"), "7", "--repo", s.repo, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    // FAKE_CLAUDE_LOG also counts the attempts of "shaky" keys across runs.
    env: { ...process.env, ...IDENTITY, SILO_GH_BIN: join(REPO, "tests/bin/fake-gh.mjs"), FAKE_GH_PR: s.prJson, FAKE_GH_BODY: s.body, SILO_CLAUDE_BIN: join(REPO, "tests/bin/fake-claude.mjs"), FAKE_CLAUDE_LOG: join(s.dir, "prompts.log"), SILO_TRANSLATE_SLOT_PORT: String(testSlotPort()), SILO_TRANSLATE_RETRY_MS: "0", ...env },
  });
}

test("translate-pr: translates every language, commits catalog and state, pushes, updates the description", () => {
  const s = setUp();
  translatePr(s, "--trailer", "Co-Authored-By: Someone <s@example.com>");
  const pushed = git(s.origin, "rev-parse", "refs/heads/feat/x");
  assert.equal(git(s.origin, "rev-parse", `${pushed}^`), s.head, "one commit on top of the pull request");
  assert.equal(git(s.origin, "log", "-1", "--format=%B", pushed), "chore(translations): the new words in every language\n\nCo-Authored-By: Someone <s@example.com>");
  const changed = git(s.origin, "diff", "--name-only", s.head, pushed).split("\n");
  assert.ok(changed.every((f) => /^(catalog|state)\//.test(f)), changed.join(", "));
  for (const tag of s.tags) {
    assert.equal(JSON.parse(git(s.origin, "show", `${pushed}:catalog/${tag}.arb`))["a.c"], "ES New words", tag);
  }
  const body = readFileSync(s.body, "utf8");
  assert.match(body, /^## Problem\n\nNo words\.\n\n<!-- translate-pr -->/);
  assert.match(body, new RegExp(`translated ${s.tags.length} strings; all ${s.tags.length} languages have every key`));
  assert.equal(existsSync(join(s.repo, "out/pr/7")), false, "the worktree is removed after the push");
});

test("translate-pr: a pull request that changes more than the catalog waits for --reviewed", () => {
  const s = setUp((seed) => writeFileSync(join(seed, "Makefile"), "all:\n\techo pwned\n"));
  assert.throws(() => translatePr(s), (e: { stderr: string }) => /changes files besides catalog\/ and state\/: Makefile/.test(e.stderr));
  assert.equal(existsSync(join(s.repo, "out/pr/7")), false, "nothing checked out");
  translatePr(s, "--reviewed", "--no-push");
  assert.equal(git(s.origin, "rev-parse", "refs/heads/feat/x"), s.head, "--no-push leaves the branch alone");
  const wt = join(s.repo, "out/pr/7");
  assert.match(git(wt, "log", "-1", "--format=%s"), /^chore\(translations\): the new words in every language$/);
  assert.equal(existsSync(join(wt, "pwned")), false, "the pull request's Makefile never ran");
});

test("translate-pr: a key left untranslated stops before the commit and keeps the rest for the rerun", () => {
  const s = setUp((seed) => writeArb(join(seed, "catalog/en.arb"), { ...entry("a.b", "Hello"), ...entry("a.c", "New words"), ...entry("a.broken", "Never") }));
  assert.throws(() => translatePr(s), (e: { stderr: string }) => /keys still untranslated or out of date \(nothing committed\)/.test(e.stderr) && /es: a.broken/.test(e.stderr));
  const wt = join(s.repo, "out/pr/7");
  assert.equal(git(wt, "rev-parse", "HEAD"), s.head, "nothing committed");
  assert.equal(JSON.parse(readFileSync(join(wt, "catalog/es.arb"), "utf8"))["a.c"], "ES New words", "the rest is kept for the rerun");
});

test("translate-pr: a pull request with a symbolic link is refused before anything is written", () => {
  let outside = "";
  const s = setUp((seed) => {
    // The link points at a file outside the checkout, as ../../../../catalog/es.arb would.
    outside = join(seed, "..", "outside-es.arb");
    writeFileSync(outside, readFileSync(join(seed, "catalog/es.arb")));
    git(seed, "rm", "--quiet", "catalog/es.arb");
    symlinkSync(outside, join(seed, "catalog/es.arb"));
  });
  const before = readFileSync(outside, "utf8");
  assert.throws(() => translatePr(s, "--no-push"), (e: { stderr: string }) => /symbolic link.*catalog\/es\.arb/.test(e.stderr));
  assert.equal(readFileSync(outside, "utf8"), before, "the file the link points at is untouched");
});

test("translate-pr: changed English whose retranslation keeps failing stops before the commit", () => {
  // Main has a.broken translated everywhere, with state recording the English it was written for.
  const s = setUp(
    (seed) => writeArb(join(seed, "catalog/en.arb"), { ...entry("a.b", "Hello"), ...entry("a.broken", "New wording") }),
    (seed, tags) => {
      writeArb(join(seed, "catalog/en.arb"), { ...entry("a.b", "Hello"), ...entry("a.broken", "Old wording") });
      const old = checkRepository(seed).catalog.byKey.get("a.broken")!;
      mkdirSync(join(seed, "state"));
      for (const tag of tags) {
        const value = `${tag} Old wording`;
        writeArb(join(seed, `catalog/${tag}.arb`), { "@@locale": tag, "a.b": `${tag} Hello`, "a.broken": value });
        writeFileSync(join(seed, `state/${tag}.json`), JSON.stringify({ "a.broken": { source: fingerprint(old), value: valueHash(value), by: "opus", model: "m" } }, null, 2) + "\n");
      }
    },
  );
  assert.throws(() => translatePr(s), (e: { stderr: string }) => /nothing committed/.test(e.stderr) && /es: a\.broken/.test(e.stderr));
  assert.equal(git(s.origin, "rev-parse", "refs/heads/feat/x"), s.head, "nothing pushed");
  assert.equal(git(join(s.repo, "out/pr/7"), "rev-parse", "HEAD"), s.head, "nothing committed");
});

/**
 * Main has a.edit written by a person for older English; the pull request changes that English
 * and adds a.shaky, whose first two attempts fail (the first language's attempt and retry).
 */
function humanEditSetUp() {
  return setUp(
    (seed) => writeArb(join(seed, "catalog/en.arb"), { ...entry("a.b", "Hello"), ...entry("a.edit", "New English"), ...entry("a.shaky", "Shaky") }),
    (seed, tags) => {
      writeArb(join(seed, "catalog/en.arb"), { ...entry("a.b", "Hello"), ...entry("a.edit", "Old English") });
      const old = checkRepository(seed).catalog.byKey.get("a.edit")!;
      mkdirSync(join(seed, "state"));
      for (const tag of tags) {
        const value = `${tag} by a person`;
        writeArb(join(seed, `catalog/${tag}.arb`), { "@@locale": tag, "a.b": `${tag} Hello`, "a.edit": value });
        writeFileSync(join(seed, `state/${tag}.json`), JSON.stringify({ "a.edit": { source: fingerprint(old), value: valueHash(value), by: "human" } }, null, 2) + "\n");
      }
    },
  );
}

test("translate-pr: a rerun after a stop still reports the human values the first run replaced", () => {
  const s = humanEditSetUp();
  // One round, one call at a time: the first language keeps failing a.shaky, so the run stops.
  assert.throws(() => translatePr(s, "--rounds", "1", "--jobs", "1"), (e: { stderr: string }) => /nothing committed/.test(e.stderr));
  translatePr(s);
  const body = readFileSync(s.body, "utf8");
  assert.match(body, /\| es \| `a\.edit` \| es by a person \| ES New English \|/, "the first run's replacement is listed for review");
  // Every language got a.edit and a.shaky, across both runs.
  assert.match(body, new RegExp(`translated ${s.tags.length * 2} strings`));
});

test("translate-pr: a rerun after a failed description update publishes it", () => {
  const s = humanEditSetUp();
  // The push lands, then the description update fails.
  assert.throws(() => translatePrEnv(s, { FAKE_GH_EDIT_FAIL: "1" }), (e: { stderr: string }) => /HTTP 502/.test(e.stderr));
  const pushed = git(s.origin, "rev-parse", "refs/heads/feat/x");
  assert.notEqual(pushed, s.head);
  assert.equal(existsSync(s.body), false);
  // GitHub now reports the pushed commit as the head.
  const pr = JSON.parse(readFileSync(s.prJson, "utf8"));
  writeFileSync(s.prJson, JSON.stringify({ ...pr, headRefOid: pushed }));
  translatePr(s);
  const body = readFileSync(s.body, "utf8");
  assert.match(body, /\| es \| `a\.edit` \| es by a person \| ES New English \|/);
  assert.match(body, new RegExp(`translated ${s.tags.length * 2} strings`));
  assert.equal(git(s.origin, "rev-parse", "refs/heads/feat/x"), pushed, "nothing pushed again");
  assert.equal(existsSync(join(s.repo, "out/pr/7")), false, "the worktree goes once the description is out");
});
