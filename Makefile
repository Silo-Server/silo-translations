# Every target runs the TypeScript tools directly with Node (>= 22.18, native type stripping).
NODE ?= node

.PHONY: check fmt test typecheck generate golden translate import-settings-manifest ci

## check: validate the catalog (errors fail; warnings print)
check:
	$(NODE) tools/validate.ts .
	$(NODE) tools/import-settings-manifest.ts --check

## fmt: rewrite catalog/*.arb and state/*.json in the canonical layout (make check requires it)
fmt:
	$(NODE) tools/fmt.ts

## test: validator table tests, generator goldens, plural rules, platform acceptance
test:
	$(NODE) --test tests/*.test.ts

typecheck:
	npx tsc -p .

## generate OUT=<dir> [VERSION=<v>]: write <dir>/{web,apple,android,roku}/...
generate:
	@test -n "$(OUT)" || { echo "usage: make generate OUT=<dir> [VERSION=<version>]"; exit 2; }
	$(NODE) tools/generate.ts --out "$(OUT)" $(if $(VERSION),--version "$(VERSION)")

## golden: rewrite tests/golden from the fixture catalog (review the diff)
golden:
	rm -rf tests/golden
	$(NODE) tools/generate.ts --root tests/fixtures/basic --out tests/golden --version test
	rm -f tests/golden/.silo-translations-out

## translate LOCALE=<tag> [DRY_RUN=1]: Opus pass through Claude Code (maintainer machine only)
translate:
	@test -n "$(LOCALE)" || { echo "usage: make translate LOCALE=<tag>|all [DRY_RUN=1]"; exit 2; }
	$(NODE) tools/translate.ts --locale "$(LOCALE)" $(if $(DRY_RUN),--dry-run)

## import-settings-manifest REPO=<silo-server checkout> REF=<rev>
import-settings-manifest:
	@test -n "$(REPO)" -a -n "$(REF)" || { echo "usage: make import-settings-manifest REPO=<silo-server checkout> REF=<rev>"; exit 2; }
	$(NODE) tools/import-settings-manifest.ts --repo "$(REPO)" --ref "$(REF)"

ci: typecheck check test
