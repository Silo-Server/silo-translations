// A machine-wide limit on Claude Code calls. Several translate runs can go at once on one
// maintainer machine (agents translating different pull requests), and each run's --jobs only
// limits itself, so every call also takes one of SILO_TRANSLATE_MAX_CALLS slots shared by all
// runs. A slot is a TCP port on 127.0.0.1 (SILO_TRANSLATE_SLOT_PORT and the ports after it) that
// the call listens on while it runs. Binding a port is atomic, and the kernel frees it when the
// process ends, however it ends, so a killed run never leaves a slot taken and there is nothing
// to clean up. A port another program listens on only counts as a taken slot.
import { createServer, type Server } from "node:net";

export const DEFAULT_MAX_CALLS = 6;
const DEFAULT_SLOT_PORT = 47360;

function slotPort(): number {
  const port = Number(process.env.SILO_TRANSLATE_SLOT_PORT ?? DEFAULT_SLOT_PORT);
  if (!Number.isInteger(port) || port < 1024 || port > 65000) throw new Error(`SILO_TRANSLATE_SLOT_PORT must be a port from 1024 to 65000, not ${process.env.SILO_TRANSLATE_SLOT_PORT}`);
  return port;
}

/** Listens on the port: the server when the slot is free, undefined when something holds it. */
function tryTake(port: number): Promise<Server | undefined> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", (e: NodeJS.ErrnoException) => (e.code === "EADDRINUSE" ? resolve(undefined) : reject(e)));
    server.listen({ port, host: "127.0.0.1", exclusive: true }, () => {
      // The slot never keeps the process alive on its own.
      server.unref();
      resolve(server);
    });
  });
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Waits for one of `max` slots and returns the function that frees it. `onWait` runs once, the
 * first time every slot is taken.
 */
export async function acquireSlot(max: number, onWait?: () => void): Promise<() => void> {
  const base = slotPort();
  for (let waited = false; ; waited = true) {
    for (let i = 0; i < max; i++) {
      const server = await tryTake(base + i);
      if (server) return () => server.close();
    }
    if (!waited) onWait?.();
    await sleep(500 + Math.random() * 1000);
  }
}
