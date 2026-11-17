// make translate-pr PR=<number>: translate a pull request's English into every language and push
// the result to the pull request, in one command, on a maintainer machine signed in to Claude Code.
//
//   1. Reads the pull request with gh. One that changes files other than catalog/*.arb and
//      state/*.json stops here until a maintainer has reviewed those changes (--reviewed).
//   2. Checks out its head in a worktree, out/pr/<number>, of this repository. Only this
//      checkout's tools run: nothing from the pull request (Makefile, tools, dependencies) runs
//      on the machine that holds the Claude Code sign-in.
//   3. Runs the translation pass for every language (tools/translate.ts: one shared pool of
//      calls, failed keys sent again), then make check and make check-complete on the result.
//      A key still untranslated stops the command before anything is committed; run it again
//      and only the missing keys are sent. An interrupted run resumes in the same worktree.
//   4. Commits catalog/ and state/ as "chore(translations): <subject> in every language",
//      pushes to the pull request's branch (a fork's too, when it allows maintainer edits) and
//      puts the per-language table in the pull request description. --no-push stops after
//      the commit.
//
//   --subject <text>     what the keys are (default: from the pull request title)
//   --reviewed           allow changes outside catalog/ and state/ (review them first)
//   --no-push            commit in out/pr/<number> and stop
//   --jobs N, --rounds N as for make translate
//   --trailer <line>     add a trailer line to the commit message (repeatable)
//   --repo <dir>         the checkout to make the worktree in (default: this one)
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { incompleteTranslations } from "./check-complete.ts";
import { checkRepository, formatIssue } from "./lib/check.ts";
import { DEFAULT_JOBS, DEFAULT_ROUNDS, intOption, prBody, runTranslate, TranslateError, type Report } from "./translate.ts";

export interface PullRequest {
  number: number;
  title: string;
  url: string;
  state: string;
  body: string;
  headRefName: string;
  headRefOid: string;
  isCrossRepository: boolean;
  maintainerCanModify: boolean;
  headRepository: { name: string } | null;
  headRepositoryOwner: { login: string } | null;
  files: { path: string }[];
}

export class TranslatePrError extends Error {}

/** "feat(catalog): add the row of collections wording" -> "the row of collections wording". */
export function subjectFromTitle(title: string): string {
  return title
    .replace(/^\w+(\([^)]*\))?!?:\s*/, "")
    .replace(/^(add|adds|added)\s+/i, "")
    .trim();
}

/** Files a maintainer must review before the translation pass runs against the pull request. */
export function filesNeedingReview(files: string[]): string[] {
  return files.filter((f) => !/^catalog\/[^/]+\.arb$/.test(f) && !/^state\/[^/]+\.json$/.test(f));
}

const START = "<!-- translate-pr -->";
const END = "<!-- /translate-pr -->";

/** The pull request description with the translation section replaced or appended. */
export function bodyWithSection(body: string, reports: Report[], languages: number, written: number): string {
  const table = prBody(reports).split("\n").slice(2).join("\n").trim();
  const section = [
    START,
    "## Translations",
    "",
    `\`make translate-pr\`${written ? ` translated ${written} strings;` : ""} all ${languages} languages have every key (\`make check-complete\`).`,
    "",
    "<details><summary>Last pass, per language</summary>",
    "",
    table,
    "",
    "</details>",
    END,
  ].join("\n");
  const at = body.indexOf(START);
  const end = body.indexOf(END);
  if (at >= 0 && end > at) return body.slice(0, at) + section + body.slice(end + END.length);
  return `${body.trimEnd()}\n\n${section}\n`;
}

export function commitMessage(subject: string, trailers: string[]): string {
  return `chore(translations): ${subject} in every language\n${trailers.length ? `\n${trailers.join("\n")}\n` : ""}`;
}

function run(cmd: string, args: string[], cwd?: string, input?: string): string {
  // maxBuffer: git show prints whole catalog files (several MB).
  return execFileSync(cmd, args, { cwd, encoding: "utf8", input, maxBuffer: 1 << 30, stdio: [input === undefined ? "ignore" : "pipe", "pipe", "pipe"] }).trim();
}

const gh = (args: string[], cwd: string, input?: string) => run(process.env.SILO_GH_BIN ?? "gh", args, cwd, input);
const git = (args: string[], cwd: string) => run("git", args, cwd);

/** Whether a git command that answers with its exit status succeeds. */
function gitSucceeds(args: string[], repo: string): boolean {
  try {
    git(args, repo);
    return true;
  } catch {
    return false;
  }
}

const hasRef = (repo: string, ref: string) => gitSucceeds(["rev-parse", "--verify", "--quiet", ref], repo);
const isAncestor = (repo: string, a: string, b: string) => gitSucceeds(["merge-base", "--is-ancestor", a, b], repo);

/** Tracked paths in the worktree that are symbolic links (git mode 120000). */
export function symbolicLinks(dir: string): string[] {
  return git(["ls-files", "--stage", "-z"], dir)
    .split("\0")
    .filter((line) => line.startsWith("120000 "))
    .map((line) => line.slice(line.indexOf("\t") + 1));
}

/**
 * Translations the worktree's catalog adds or changes since `base`, over every language: the count
 * for the description, which a pass resumed after a stop can't give.
 */
export function changedStrings(dir: string, base: string, tags: string[]): number {
  let n = 0;
  for (const tag of tags) {
    const path = `catalog/${tag}.arb`;
    const before = gitSucceeds(["cat-file", "-e", `${base}:${path}`], dir) ? (JSON.parse(git(["show", `${base}:${path}`], dir)) as Record<string, string>) : {};
    const after = existsSync(join(dir, path)) ? (JSON.parse(readFileSync(join(dir, path), "utf8")) as Record<string, string>) : {};
    for (const [key, value] of Object.entries(after)) if (!key.startsWith("@") && before[key] !== value) n++;
  }
  return n;
}

export interface Options {
  pr: number;
  repo: string;
  subject?: string;
  reviewed?: boolean;
  push?: boolean;
  jobs?: number;
  rounds?: number;
  trailers?: string[];
  log?: (line: string) => void;
}

/** Returns the worktree it committed in, or undefined when there was nothing to translate. */
export async function translatePr(o: Options): Promise<string | undefined> {
  const say = o.log ?? ((line: string) => console.error(line));
  const fields = "number,title,url,state,body,headRefName,headRefOid,isCrossRepository,maintainerCanModify,headRepository,headRepositoryOwner,files";
  const pr = JSON.parse(gh(["pr", "view", String(o.pr), "--json", fields], o.repo)) as PullRequest;
  if (pr.state !== "OPEN") throw new TranslatePrError(`#${pr.number} is ${pr.state.toLowerCase()}`);
  const push = o.push ?? true;
  if (push && pr.isCrossRepository && !pr.maintainerCanModify) {
    throw new TranslatePrError(`#${pr.number} comes from a fork that doesn't allow maintainer edits; ask its author to allow them, or use --no-push`);
  }
  const review = filesNeedingReview(pr.files.map((f) => f.path));
  if (review.length && !o.reviewed) {
    throw new TranslatePrError(`#${pr.number} changes files besides catalog/ and state/: ${review.join(", ")}. Review them, then run again with REVIEWED=1 (--reviewed).`);
  }

  // The tools that run are this checkout's; say so when they aren't main's.
  const toolsRoot = resolve(import.meta.dirname, "..");
  if (hasRef(toolsRoot, "origin/main") && !isAncestor(toolsRoot, "HEAD", "origin/main")) {
    say("note: these tools are not on origin/main (as of the last fetch); the pass runs this checkout's tools as they are");
  }

  const dir = join(o.repo, "out", "pr", String(pr.number));
  if (existsSync(dir)) {
    if (!isAncestor(dir, pr.headRefOid, "HEAD")) {
      throw new TranslatePrError(`${dir} is from an earlier head of #${pr.number}; remove it (git worktree remove --force ${dir}) and run again`);
    }
    say(`resuming in ${dir}`);
  } else {
    git(["fetch", "--quiet", "origin", `refs/pull/${pr.number}/head`], o.repo);
    const fetched = git(["rev-parse", "FETCH_HEAD"], o.repo);
    if (fetched !== pr.headRefOid) throw new TranslatePrError(`#${pr.number} moved while fetching (${fetched} vs ${pr.headRefOid}); run again`);
    git(["worktree", "add", "--quiet", "--detach", dir, pr.headRefOid], o.repo);
    say(`checked out #${pr.number} (${pr.headRefOid.slice(0, 7)}) in ${dir}`);
  }

  // The pass writes catalog/, state/ and out/ through whatever the pull request put at those
  // paths; a symbolic link would send the writes outside the worktree.
  const links = symbolicLinks(dir);
  if (links.length) throw new TranslatePrError(`#${pr.number} has symbolic links (${links.join(", ")}); the pass writes into the checkout, so it refuses them`);
  // The record of replaced human values stays in the worktree until the description that lists
  // them is published (the worktree is removed then), so a run resumed after a stop reports them.
  const reports = await runTranslate({ root: dir, locales: "all", jobs: o.jobs, rounds: o.rounds, log: say, keepAudit: true });
  const checked = checkRepository(dir);
  const errors = checked.issues.filter((i) => i.level === "error");
  if (errors.length) throw new TranslatePrError(`make check fails in ${dir}:\n${errors.map((i) => formatIssue(dir, i)).join("\n")}`);
  const incomplete = incompleteTranslations(dir, checked);
  if (incomplete.size) {
    const lines = [...incomplete].map(([tag, keys]) => `${tag}: ${keys.slice(0, 5).join(", ")}${keys.length > 5 ? ` and ${keys.length - 5} more` : ""}`);
    throw new TranslatePrError(`keys still untranslated or out of date (nothing committed); run again to send only these:\n${lines.join("\n")}\nFailures are in ${join(dir, "out/translate-pr-body.md")}.`);
  }

  if (git(["status", "--porcelain", "--", "catalog", "state"], dir)) {
    git(["add", "--", "catalog", "state"], dir);
    const subject = o.subject ?? subjectFromTitle(pr.title);
    run("git", ["commit", "--quiet", "-F", "-"], dir, commitMessage(subject, o.trailers ?? []));
    say(`committed: chore(translations): ${subject} in every language`);
  }
  // Written before the push and removed once the description is updated: a rerun after a push
  // whose description update failed finds its commit as the pull request's head, and publishes
  // the description (with the record of replaced human values the worktree keeps) then.
  const pending = join(dir, "out", "translate-pr-pending.json");
  const tags = checked.locales.targets.map((l) => l.tag);
  const publishAndRemove = (base: string) => {
    const written = changedStrings(dir, base, tags);
    gh(["pr", "edit", String(pr.number), "--body-file", "-"], o.repo, bodyWithSection(pr.body, reports, tags.length, written));
    rmSync(pending);
    say(`updated the description of ${pr.url}`);
    git(["worktree", "remove", "--force", dir], o.repo);
  };

  if (git(["rev-parse", "HEAD"], dir) === pr.headRefOid) {
    if (existsSync(pending)) {
      publishAndRemove((JSON.parse(readFileSync(pending, "utf8")) as { base: string }).base);
      return dir;
    }
    say(`#${pr.number}: every language already has every key; nothing to commit`);
    git(["worktree", "remove", "--force", dir], o.repo);
    return undefined;
  }
  if (!push) {
    say(`not pushed (--no-push); the commit is in ${dir}`);
    return dir;
  }

  // A commit from an earlier run whose push failed is pushed now.
  const remote = pr.isCrossRepository ? `https://github.com/${pr.headRepositoryOwner!.login}/${pr.headRepository!.name}.git` : "origin";
  mkdirSync(join(dir, "out"), { recursive: true });
  writeFileSync(pending, JSON.stringify({ base: pr.headRefOid }) + "\n");
  git(["push", "--quiet", remote, `HEAD:refs/heads/${pr.headRefName}`], dir);
  say(`pushed to ${pr.headRefName}`);
  publishAndRemove(pr.headRefOid);
  return dir;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      subject: { type: "string" },
      reviewed: { type: "boolean" },
      "no-push": { type: "boolean" },
      jobs: { type: "string" },
      rounds: { type: "string" },
      trailer: { type: "string", multiple: true },
      repo: { type: "string" },
    },
  });
  const pr = Number(positionals[0]);
  if (!Number.isInteger(pr) || pr <= 0) {
    console.error("usage: node tools/translate-pr.ts <number> [--subject <text>] [--reviewed] [--no-push] [--jobs N] [--rounds N] [--trailer <line>]");
    process.exit(2);
  }
  try {
    await translatePr({
      pr,
      repo: resolve(values.repo ?? resolve(import.meta.dirname, "..")),
      subject: values.subject,
      reviewed: values.reviewed,
      push: !values["no-push"],
      jobs: intOption("jobs", values.jobs, DEFAULT_JOBS),
      rounds: intOption("rounds", values.rounds, DEFAULT_ROUNDS),
      trailers: values.trailer,
    });
  } catch (e) {
    if (!(e instanceof TranslatePrError || e instanceof TranslateError)) throw e;
    console.error(e.message);
    process.exit(e instanceof TranslateError ? e.code : 1);
  }
}
