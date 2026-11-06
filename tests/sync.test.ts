// tools/sync-translations.sh against a fake release served over file://, and --local.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { REPO } from "./helpers.ts";

const SCRIPT = join(REPO, "tools/sync-translations.sh");

function release(version: string, files: Record<string, string>, extra?: (tree: string) => void) {
  const base = mkdtempSync(join(tmpdir(), "silo-release-"));
  const tree = join(base, "tree");
  for (const [p, c] of Object.entries(files)) {
    mkdirSync(join(tree, p, ".."), { recursive: true });
    writeFileSync(join(tree, p), c);
  }
  extra?.(tree);
  const dir = join(base, `v${version}`);
  mkdirSync(dir);
  const asset = `silo-translations-roku-${version}.tar.gz`;
  execFileSync("tar", ["-C", tree, "-czf", join(dir, asset), "."]);
  const sum = createHash("sha256").update(readFileSync(join(dir, asset))).digest("hex");
  writeFileSync(join(dir, "SHA256SUMS"), `${sum}  ${asset}\n`);
  return { base, sum };
}

function client() {
  const root = mkdtempSync(join(tmpdir(), "silo-client-"));
  execFileSync("git", ["init", "-q", root]);
  return root;
}

function sync(root: string, base: string, ...args: string[]) {
  return spawnSync("sh", [SCRIPT, ...args], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, SILO_TRANSLATIONS_PUBLIC: "1", SILO_TRANSLATIONS_BASE_URL: `file://${base}` },
  });
}

test("sync: installs a release, pins its checksum, reinstalls from the pin", () => {
  const { base, sum } = release("2026.11.06-abc1234", { "locale/en_US/strings.json": "{}\n", "source/util/pluralRules.bs": "' x\n" });
  const root = client();
  const r = sync(root, base, "--platform", "roku", "--version", "2026.11.06-abc1234");
  assert.equal(r.status, 0, r.stderr);
  assert.equal(readFileSync(join(root, "locale/en_US/strings.json"), "utf8"), "{}\n");
  assert.equal(readFileSync(join(root, ".silo-translations"), "utf8"), `platform=roku\nversion=2026.11.06-abc1234\nsha256=${sum}\n`);
  writeFileSync(join(root, "locale/en_US/strings.json"), "edited");
  assert.equal(sync(root, base).status, 0);
  assert.equal(readFileSync(join(root, "locale/en_US/strings.json"), "utf8"), "{}\n");
});

test("sync: a checksum mismatch changes nothing", () => {
  const { base } = release("1", { "locale/en_US/strings.json": "{}\n" });
  const root = client();
  writeFileSync(join(root, ".silo-translations"), `platform=roku\nversion=1\nsha256=${"0".repeat(64)}\n`);
  const r = sync(root, base);
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /checksum mismatch/);
  assert.ok(!existsSync(join(root, "locale")));
  assert.match(readFileSync(join(root, ".silo-translations"), "utf8"), /sha256=0{64}/);
});

test("sync: rejects links in the tarball", () => {
  const { base } = release("1", { "a.txt": "x" }, (tree) => symlinkSync("/etc/passwd", join(tree, "evil")));
  const root = client();
  const r = sync(root, base, "--platform", "roku", "--version", "1");
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /links or special files/);
  assert.ok(!existsSync(join(root, "a.txt")));
  assert.ok(!existsSync(join(root, ".silo-translations")));
});

test("sync: --local generates from a checkout and records its version", () => {
  const root = client();
  const r = sync(root, "/nonexistent", "--platform", "web", "--local", REPO);
  assert.equal(r.status, 0, r.stderr);
  assert.ok(existsSync(join(root, "web/src/locales/en.json")));
  assert.match(readFileSync(join(root, ".silo-translations"), "utf8"), /^platform=web\nversion=local-[0-9a-f]{12}(-dirty)?\nsha256=-\n$/);
});

test("sync: rejects paths that climb out of the client", () => {
  const base = mkdtempSync(join(tmpdir(), "silo-release-"));
  mkdirSync(join(base, "v1"));
  const asset = join(base, "v1/silo-translations-roku-1.tar.gz");
  execFileSync("python3", ["-I", "-c", `
import io, sys, tarfile
with tarfile.open(sys.argv[1], "w:gz") as t:
    data = b"x"
    info = tarfile.TarInfo("../escaped.txt"); info.size = len(data)
    t.addfile(info, io.BytesIO(data))
`, asset]);
  const sum = createHash("sha256").update(readFileSync(asset)).digest("hex");
  writeFileSync(join(base, "v1/SHA256SUMS"), `${sum}  silo-translations-roku-1.tar.gz\n`);
  const root = client();
  const r = sync(root, base, "--platform", "roku", "--version", "1");
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /unsafe paths/);
  assert.ok(!existsSync(join(root, "..", "escaped.txt")));
});

test("sync: a local pin cannot be reinstalled as a release", () => {
  const root = client();
  writeFileSync(join(root, ".silo-translations"), "platform=web\nversion=local-0123456789ab\nsha256=-\n");
  const r = sync(root, "/nonexistent");
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /pinned to a local build/);
});
