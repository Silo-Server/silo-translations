// The real catalog through the same platform acceptance checks as the fixture: web ASTs format
// with intl-messageformat, the String Catalog has Xcode's structure, and aapt2 compiles, links
// and decodes the Android resources to the expected text.
import { acceptance } from "./acceptance.ts";
import { REPO } from "./helpers.ts";

acceptance(REPO, "catalog");
