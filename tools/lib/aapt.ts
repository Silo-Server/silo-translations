// aapt2 helpers: compile and link a res/ tree, and read back the values AAPT decoded.
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";

export interface AndroidSdk {
  aapt2: string;
  androidJar: string;
}

/** The newest build-tools and platform under ANDROID_HOME (or ~/Android/Sdk), if any. */
export function findSdk(): AndroidSdk | undefined {
  const sdk = process.env.ANDROID_HOME ?? join(homedir(), "Android/Sdk");
  const latest = (dir: string) => (existsSync(dir) ? readdirSync(dir).sort().pop() : undefined);
  const tools = latest(join(sdk, "build-tools"));
  const platform = latest(join(sdk, "platforms"));
  if (!tools || !platform) return undefined;
  return { aapt2: join(sdk, "build-tools", tools, "aapt2"), androidJar: join(sdk, "platforms", platform, "android.jar") };
}

/** Compiles and links `res`, returning "name|config|quantity" -> decoded value. */
export function decodeResources(sdk: AndroidSdk, res: string): Map<string, string> {
  const dir = mkdtempSync(join(tmpdir(), "silo-aapt2-"));
  writeFileSync(join(dir, "AndroidManifest.xml"), '<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="org.silo.translations.check"/>');
  execFileSync(sdk.aapt2, ["compile", "--dir", res, "-o", join(dir, "compiled.zip")]);
  execFileSync(sdk.aapt2, ["link", "-I", sdk.androidJar, "--manifest", join(dir, "AndroidManifest.xml"), "-o", join(dir, "out.apk"), join(dir, "compiled.zip")]);
  const dump = execFileSync(sdk.aapt2, ["dump", "resources", join(dir, "out.apk")], { encoding: "utf8", maxBuffer: 64 << 20 });
  return parseDump(dump);
}

/** Parses `aapt2 dump resources` into "name|config|quantity" -> decoded value. */
export function parseDump(dump: string): Map<string, string> {
  const out = new Map<string, string>();
  const resource = /^\s+resource 0x[0-9a-f]+ (string|plurals)\/(\S+)/;
  const stringLine = /^      \(([^)]*)\) "(.*)$/;
  const pluralHead = /^      \(([^)]*)\) \(plurals\)/;
  const item = /^        (zero|one|two|few|many|other)="(.*)$/;
  let name = "";
  let config = "";
  let pending: { id: string; text: string } | undefined;
  const flush = () => {
    if (pending) out.set(pending.id, pending.text.replace(/\n+$/, "").replace(/"$/, ""));
    pending = undefined;
  };
  for (const line of dump.split("\n")) {
    let m: RegExpExecArray | null;
    if ((m = resource.exec(line))) {
      flush();
      name = m[2]!;
    } else if ((m = pluralHead.exec(line))) {
      flush();
      config = m[1]!;
    } else if ((m = stringLine.exec(line))) {
      flush();
      pending = { id: `${name}|${m[1]}|`, text: m[2]! };
    } else if ((m = item.exec(line))) {
      flush();
      pending = { id: `${name}|${config}|${m[1]}`, text: m[2]! };
    } else if (/^\s+(type|Package|resource) /.test(line)) {
      flush();
    } else if (pending) {
      pending.text += "\n" + line.replace(/^ {6}/, "");
    }
  }
  flush();
  return out;
}
