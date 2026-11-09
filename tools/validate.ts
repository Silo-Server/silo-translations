// make check: validates the catalog. Exit 1 on any error; warnings are printed only.
import { resolve } from "node:path";
import { checkRepository, formatIssue } from "./lib/check.ts";
import { generateAll } from "./generate.ts";
import { literalBidi } from "./gen/common.ts";

const root = resolve(process.argv[2] ?? ".");
const { issues, catalog } = checkRepository(root);
// Generated output must carry bidi controls only as escapes (vendoring repositories refuse
// literal ones). Only checked on a catalog the generators accept.
if (!issues.some((i) => i.level === "error" && i.rule !== "layout")) {
  for (const [platform, files] of generateAll(root, "check")) {
    for (const { path, codePoint } of literalBidi(files)) {
      issues.push({ level: "error", file: `${platform}: ${path}`, message: `generated output contains a literal bidi control (${codePoint}); write it as an escape` });
    }
  }
}
for (const issue of issues) console.log(formatIssue(root, issue));
const errors = issues.filter((i) => i.level === "error").length;
const warnings = issues.length - errors;
console.log(`${catalog.entries.length} keys, ${errors} errors, ${warnings} warnings`);
process.exit(errors ? 1 : 0);
