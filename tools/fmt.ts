// make fmt: rewrites catalog/*.arb and state/*.json in the canonical layout (tools/lib/format.ts).
// Refuses a file that isn't a JSON object or repeats a key, since rewriting it would lose data.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { canonicalText, formattedFiles, layoutProblems } from "./lib/format.ts";

const root = resolve(process.argv[2] ?? resolve(import.meta.dirname, ".."));
let failed = false;
let changed = 0;
for (const { file, kind } of formattedFiles(root)) {
  const text = readFileSync(file, "utf8");
  const { problems } = layoutProblems(text, kind);
  const fixable = problems.length === 1 && problems[0]!.endsWith("run make fmt");
  if (problems.length && !fixable) {
    console.error(`${file}: ${problems.join("; ")}; fix it by hand`);
    failed = true;
  } else if (fixable) {
    writeFileSync(file, canonicalText(text, kind)!);
    changed++;
  }
}
console.log(`formatted ${changed} file(s)`);
process.exit(failed ? 1 : 0);
