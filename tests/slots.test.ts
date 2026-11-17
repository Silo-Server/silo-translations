// The machine-wide limit on Claude Code calls shared by every translate run.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { acquireSlot } from "../tools/lib/slots.ts";

function useDir(): string {
  const dir = mkdtempSync(join(tmpdir(), "silo-slots-test-"));
  process.env.SILO_TRANSLATE_SLOTS_DIR = dir;
  return dir;
}

test("slots: a call waits while every slot is taken and goes once one is freed", async () => {
  useDir();
  const first = await acquireSlot(1);
  let waited = 0;
  let got = false;
  const pending = acquireSlot(1, () => waited++).then((release) => {
    got = true;
    return release;
  });
  await new Promise((r) => setTimeout(r, 200));
  assert.equal(got, false, "the second call has no slot while the first holds it");
  assert.equal(waited, 1);
  first();
  (await pending)();
});

test("slots: a slot whose process is gone is taken over", async () => {
  const dir = useDir();
  const dead = spawnSync(process.execPath, ["-e", "process.pid"]).pid!;
  mkdirSync(join(dir, "0"));
  writeFileSync(join(dir, "0", "pid"), String(dead));
  const release = await acquireSlot(1);
  assert.ok(existsSync(join(dir, "0", "pid")));
  release();
  assert.equal(existsSync(join(dir, "0")), false);
});

test("slots: a slot still being set up (no pid yet) is left alone", async () => {
  const dir = useDir();
  mkdirSync(join(dir, "0"));
  const release = await acquireSlot(2);
  assert.ok(existsSync(join(dir, "0")), "the fresh slot without a pid stays");
  assert.ok(existsSync(join(dir, "1", "pid")), "the call took the next slot");
  release();
});
