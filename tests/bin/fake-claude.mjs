#!/usr/bin/env node
// Stand-in for `claude -p --output-format json --json-schema ...` in translate tests.
// Translates by prefixing literal text with "ES " and expanding English plurals to the
// es categories. A key containing "flaky" drops its placeholders on the first attempt so
// the retry path runs; a key containing "broken" always fails.
import { readFileSync } from "node:fs";
const prompt = readFileSync(0, "utf8");
const log = process.env.FAKE_CLAUDE_LOG;
if (log) { const fs = await import("node:fs"); fs.appendFileSync(log, prompt + "\n=====\n"); }
const items = JSON.parse(prompt.slice(prompt.indexOf("Strings to translate:") + "Strings to translate:".length));
const translations = items.map((it) => {
  let message;
  const m = /^\{(\w+), plural, one \{(.*)\} other \{(.*)\}\}$/.exec(it.english);
  if (m) message = `{${m[1]}, plural, one {ES ${m[2]}} many {ES ${m[3]}} other {ES ${m[3]}}}`;
  else message = `ES ${it.english}`;
  if (it.key.includes("flaky") && !it.problemsWithLastAttempt) message = "ES sin marcador";
  if (it.key.includes("broken")) message = "ES {roto";
  return { key: it.key, message };
});
process.stdout.write(JSON.stringify({ type: "result", is_error: false, result: "", structured_output: { translations } }));
