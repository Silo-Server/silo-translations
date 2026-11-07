import { test } from "node:test";
import assert from "node:assert/strict";
import { applyManifest, manifestEntries } from "../tools/import-settings-manifest.ts";

const manifest = {
  revision: 26,
  definitions: [
    {
      key: "ui.theme",
      label: "Theme",
      description: "Colors for this profile.",
      value_schema: { type: "enum", values: [{ value: "midnight-cinema", label: "Midnight Cinema" }, { value: "x" }] },
    },
    {
      key: "player.video_skip_back_seconds",
      label: "Skip back",
      description: "How far skip back goes.",
      value_schema: { type: "enum", values: [{ value: 5, label: "5 seconds" }] },
    },
    { key: "playback.audio_language", label: "Audio language", description: "Preferred audio.", unset_label: "No preference", value_schema: { type: "language_tag" } },
  ],
};

test("import-settings-manifest: keys, hyphens, numbers, unset labels", () => {
  const keys = manifestEntries(manifest).filter(([k]) => !k.startsWith("@")).map(([k, v]) => `${k}=${v}`);
  assert.deepEqual(keys, [
    "settingsManifest.ui.theme.label=Theme",
    "settingsManifest.ui.theme.description=Colors for this profile.",
    "settingsManifest.ui.theme.option.midnight_cinema=Midnight Cinema",
    "settingsManifest.player.video_skip_back_seconds.label=Skip back",
    "settingsManifest.player.video_skip_back_seconds.description=How far skip back goes.",
    "settingsManifest.player.video_skip_back_seconds.option.5=5 seconds",
    "settingsManifest.playback.audio_language.label=Audio language",
    "settingsManifest.playback.audio_language.description=Preferred audio.",
    "settingsManifest.playback.audio_language.unsetLabel=No preference",
  ]);
});

test("import-settings-manifest: replaces owned keys and writes the canonical layout", () => {
  const arb = {
    "@@locale": "en",
    "z.y": "Z",
    "@z.y": { description: "x" },
    "settingsManifest.old.label": "Old",
    "@settingsManifest.old.label": { description: "x" },
    "a.b": "A",
    "@a.b": { description: "x" },
  };
  const out = Object.keys(applyManifest(arb, manifest));
  assert.equal(out.indexOf("settingsManifest.old.label"), -1);
  assert.deepEqual(out.slice(0, 3), ["@@locale", "a.b", "@a.b"]);
  assert.equal(out[3], "settingsManifest.playback.audio_language.description");
  assert.deepEqual(out.slice(-2), ["z.y", "@z.y"]);
  assert.deepEqual(Object.entries(applyManifest(applyManifest(arb, manifest), manifest)), Object.entries(applyManifest(arb, manifest)));
});

test("import-settings-manifest: scopes each kind of text to the clients that render it", () => {
  const meta = Object.fromEntries(manifestEntries(manifest).filter(([k]) => k.startsWith("@")));
  const platforms = (k: string) => (meta[`@${k}`] as { "x-platforms": string[] })["x-platforms"];
  assert.deepEqual(platforms("settingsManifest.ui.theme.label"), ["web", "apple"]);
  assert.deepEqual(platforms("settingsManifest.ui.theme.description"), ["web", "apple"]);
  assert.deepEqual(platforms("settingsManifest.ui.theme.option.midnight_cinema"), ["web", "apple", "roku"]);
  assert.deepEqual(platforms("settingsManifest.playback.audio_language.unsetLabel"), ["web", "apple", "android", "roku"]);
});
