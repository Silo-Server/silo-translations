// A machine-wide limit on Claude Code calls. Several translate runs can go at once on one
// maintainer machine (agents translating different pull requests), and each run's --jobs only
// limits itself, so every call also takes one of SILO_TRANSLATE_MAX_CALLS slots shared by all
// runs. A slot is a directory holding its owner's pid; a slot whose process is gone (a run that
// was killed) is taken over.
import { mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const DEFAULT_MAX_CALLS = 6;
/** How long a slot without a pid file yet counts as being set up rather than abandoned. */
const SETUP_MS = 10_000;

export function slotsDir(): string {
  return process.env.SILO_TRANSLATE_SLOTS_DIR ?? join(tmpdir(), `silo-translate-slots-${process.getuid?.() ?? "user"}`);
}

function alive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return (e as NodeJS.ErrnoException).code === "EPERM";
  }
}

/** Whether a taken slot's owner is gone, so the slot can be freed. */
function abandoned(slot: string): boolean {
  let pid: number;
  try {
    pid = Number(readFileSync(join(slot, "pid"), "utf8"));
  } catch {
    // No pid file yet: its owner may be between creating the slot and writing it.
    try {
      return Date.now() - statSync(slot).mtimeMs >= SETUP_MS;
    } catch {
      return false; // released meanwhile
    }
  }
  return !alive(pid);
}

/** Takes the slot when it is free. A slot whose owner is gone is freed for the next try. */
function tryTake(slot: string): boolean {
  try {
    mkdirSync(slot);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "EEXIST") throw e;
    if (abandoned(slot)) rmSync(slot, { recursive: true, force: true });
    return false;
  }
  writeFileSync(join(slot, "pid"), String(process.pid));
  return true;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Waits for one of `max` slots and returns the function that frees it. `onWait` runs once, the
 * first time every slot is taken.
 */
export async function acquireSlot(max: number, onWait?: () => void): Promise<() => void> {
  const dir = slotsDir();
  mkdirSync(dir, { recursive: true });
  for (let waited = false; ; waited = true) {
    for (let i = 0; i < max; i++) {
      const slot = join(dir, String(i));
      if (tryTake(slot)) return () => rmSync(slot, { recursive: true, force: true });
    }
    if (!waited) onWait?.();
    await sleep(500 + Math.random() * 1000);
  }
}
