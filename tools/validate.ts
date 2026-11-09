// make check: validates the catalog. Exit 1 on any error; warnings are printed only.
import { resolve } from "node:path";
import { checkRepository, formatIssue } from "./lib/check.ts";

const root = resolve(process.argv[2] ?? ".");
const { issues, catalog } = checkRepository(root);
for (const issue of issues) console.log(formatIssue(root, issue));
const errors = issues.filter((i) => i.level === "error").length;
const warnings = issues.length - errors;
console.log(`${catalog.entries.length} keys, ${errors} errors, ${warnings} warnings`);
process.exit(errors ? 1 : 0);
