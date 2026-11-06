# AGENTS.md

Rules for anyone changing this repository, people and coding agents alike. The README
describes the formats; CONTRIBUTING describes the workflows.

## Build and test

- Node 22.18 or newer. The tools are TypeScript run directly by Node (type stripping), so use
  only erasable syntax: no `enum`, `namespace` or parameter properties, and import local files
  with their `.ts` extension.
- `npm ci`, then `make ci` (typecheck, catalog check, all tests) before every commit.
- Generator changes: run `make golden` and review the golden diff as carefully as the code.
  A golden change reaches every client.
- Platform acceptance tests need the Android SDK for aapt2; CI has it. Don't weaken a test to
  get past a missing tool.

## Catalog rules

- `catalog/en.arb` is the only file developers edit for English. Every key needs a
  `description` that says where the text appears and what each placeholder holds.
- Key, placeholder and message rules are in the README and enforced by `make check`. Don't
  add validator exceptions for a single key.
- Never reorder or rename existing placeholders: their order is the positional order on
  Android and Apple.
- Extraction from a client keeps English byte-identical (only wrong plurals such as
  "1 items" may be fixed).
- Don't hand-edit `state/*.json`. Don't edit `settingsManifest.*` keys; they come from
  `make import-settings-manifest`.
- Don't write translations by hand in a change that adds English. `make translate` writes them
  in its own pull request, run on a maintainer machine. Never add an Anthropic credential to
  CI.

## Output contract

- The per-platform output paths, placeholder mapping and Roku plural layout in the README are
  a contract with four client repositories. Changing them needs a coordinated change in every
  client that uses them; say so in the pull request.
- Generated files are never edited in clients; they are replaced by
  `scripts/sync-translations`. `tools/sync-translations.sh` is the source of that script.

## Pull requests

- Conventional Commit titles (`feat:`, `fix:`, `chore(translations):`).
- Additions-only English changes should merge quickly: each merge to `main` publishes a release
  the client change waits for.
