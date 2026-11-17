#!/usr/bin/env node
// Stand-in for `claude -p --output-format json --json-schema ...` in translate tests.
// Translates by prefixing literal text with "ES " and expanding English plurals to the
// es categories. A key containing "empty" always gets "", and one containing "space" gets " ". A key containing "flaky" drops its placeholders on the first attempt so
// the retry path runs; a key containing "broken" always fails.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
const prompt = readFileSync(0, "utf8");
const log = process.env.FAKE_CLAUDE_LOG;
if (log) { const fs = await import("node:fs"); fs.appendFileSync(log, prompt + "\n=====\n"); }
function parentCommand() {
  try {
    return readFileSync(`/proc/${process.ppid}/cmdline`, "utf8");
  } catch {
    // no /proc (macOS)
  }
  try {
    return execFileSync("ps", ["-o", "command=", "-p", String(process.ppid)], { encoding: "utf8" });
  } catch {
    return "";
  }
}

/** Whether this call's parent is still the translate process that started it. */
const parentIsTranslate = () => /tools\/translate\.ts/.test(parentCommand());
const items = JSON.parse(prompt.slice(prompt.indexOf("Strings to translate:") + "Strings to translate:".length));
// Someone adds an English key and its translation while the call is running.
if (process.env.FAKE_CLAUDE_ADD_ROOT) {
  const fs = await import("node:fs");
  for (const [file, value] of [["en", "Added"], ["es", "Añadido"]]) {
    const path = `${process.env.FAKE_CLAUDE_ADD_ROOT}/catalog/${file}.arb`;
    const arb = JSON.parse(fs.readFileSync(path, "utf8"));
    arb["zzz.added"] = value;
    if (file === "en") arb["@zzz.added"] = { description: "Test string." };
    fs.writeFileSync(path, JSON.stringify(arb, null, 2) + "\n");
  }
}
const translations = items.map((it) => {
  let message;
  const m = /^\{(\w+), plural, one \{(.*)\} other \{(.*)\}\}$/.exec(it.english);
  if (m) message = `{${m[1]}, plural, one {ES ${m[2]}} many {ES ${m[3]}} other {ES ${m[3]}}}`;
  else message = `ES ${it.english}`;
  if (it.key.includes("flaky") && !it.problemsWithLastAttempt) message = "ES sin marcador";
  if (it.key.includes("broken")) message = "ES {roto";
  if (it.key.includes("empty")) message = "";
  if (it.key.includes("space")) message = " ";
  // A key containing "shaky" fails its first two attempts (one batch's attempt and its retry),
  // counted across calls in a file next to the prompt log, and succeeds after that.
  if (it.key.includes("shaky") && log) {
    const counter = `${log}.${it.key}`;
    const n = existsSync(counter) ? Number(readFileSync(counter, "utf8")) : 0;
    writeFileSync(counter, String(n + 1));
    if (n < 2) message = "ES {roto";
  }
  if (it.key.includes("crash") && process.env.FAKE_CLAUDE_CRASH) { process.stderr.write("simulated failure\n"); process.exit(1); }
  // The translate process is killed mid-run, as an interrupted pass would be. Only that process:
  // a call still running when it dies is re-parented (to init or a subreaper such as the
  // terminal or agent host running the tests), and must not kill its new parent.
  if (it.key.includes("kill") && process.env.FAKE_CLAUDE_KILL) {
    if (parentIsTranslate()) process.kill(process.ppid, "SIGKILL");
    process.exit(1);
  }
  return { key: it.key, message };
});
process.stdout.write(JSON.stringify({ type: "result", is_error: false, result: "", structured_output: { translations } }));
