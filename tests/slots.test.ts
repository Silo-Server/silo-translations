// The machine-wide limit on Claude Code calls shared by every translate run.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { join } from "node:path";
import { acquireSlot } from "../tools/lib/slots.ts";
import { REPO, testSlotPort } from "./helpers.ts";

process.env.SILO_TRANSLATE_SLOT_PORT = String(testSlotPort());
const port = Number(process.env.SILO_TRANSLATE_SLOT_PORT);

const tick = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Another process that takes one slot, prints "got", and holds it until killed. */
function holder() {
  const child = spawn(process.execPath, ["--input-type=module", "-e", `import { acquireSlot } from ${JSON.stringify(join(REPO, "tools/lib/slots.ts"))}; await acquireSlot(1); console.log("got"); setInterval(() => {}, 1000);`], {
    env: process.env,
    stdio: ["ignore", "pipe", "inherit"],
  });
  const got = new Promise<void>((resolve) => child.stdout.on("data", (d) => String(d).includes("got") && resolve()));
  return { child, got };
}

test("slots: a call waits while every slot is taken and goes once one is freed", async () => {
  const first = await acquireSlot(1);
  let waited = 0;
  let got = false;
  const pending = acquireSlot(1, () => waited++).then((release) => {
    got = true;
    return release;
  });
  await tick(200);
  assert.equal(got, false, "the second call has no slot while the first holds it");
  assert.equal(waited, 1);
  first();
  (await pending)();
});

test("slots: another process can't take a slot this one holds, and gets it once freed", async () => {
  const release = await acquireSlot(1);
  const other = holder();
  let otherGot = false;
  void other.got.then(() => (otherGot = true));
  await tick(1500);
  assert.equal(otherGot, false);
  release();
  await other.got;
  other.child.kill("SIGKILL");
});

test("slots: a slot held by a process that is killed is free at once", async () => {
  const other = holder();
  await other.got;
  other.child.kill("SIGKILL");
  await new Promise((r) => other.child.once("exit", r));
  const started = Date.now();
  (await acquireSlot(1))();
  assert.ok(Date.now() - started < 500, "no waiting for a dead owner's slot");
});

test("slots: a port another program listens on counts as a taken slot", async () => {
  const busy = createServer().listen(port, "127.0.0.1");
  await new Promise((r) => busy.once("listening", r));
  const release = await acquireSlot(2);
  // The call took the second slot.
  const probe = createServer().listen(port + 1, "127.0.0.1");
  await new Promise((resolve) => probe.once("error", resolve));
  release();
  busy.close();
});
