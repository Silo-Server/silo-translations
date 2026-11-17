#!/usr/bin/env node
// Stand-in for gh in translate-pr tests: `pr view` prints FAKE_GH_PR (a JSON file), `pr edit
// --body-file -` writes the new description to FAKE_GH_BODY, or fails when FAKE_GH_EDIT_FAIL is set.
import { readFileSync, writeFileSync } from "node:fs";
const [cmd, sub] = process.argv.slice(2);
if (cmd === "pr" && sub === "view") process.stdout.write(readFileSync(process.env.FAKE_GH_PR, "utf8"));
else if (cmd === "pr" && sub === "edit" && process.env.FAKE_GH_EDIT_FAIL) {
  process.stderr.write("fake gh: HTTP 502\n");
  process.exit(1);
} else if (cmd === "pr" && sub === "edit") writeFileSync(process.env.FAKE_GH_BODY, readFileSync(0, "utf8"));
else {
  process.stderr.write(`fake gh: unexpected ${process.argv.slice(2).join(" ")}\n`);
  process.exit(1);
}
