import { existsSync } from "node:fs";
import { resolve as $resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const acceptLanguageRegex =
  /((([a-zA-Z]+(-[a-zA-Z0-9]+){0,2})|\*)(;q=[0-1](\.[0-9]+)?)?)*/g;

interface AcceptLanguage {
  language: string;
  script: string | null;
  region: string | null;
  quality: number;
}

export function parseAcceptLanguage(al?: string) {
  if (!al) return [];

  const strings = al.match(acceptLanguageRegex);

  if (!strings) return [];

  return strings
    .map(function (m) {
      if (!m) return;

      const bits = m.split(";");
      const ietf = bits[0].split("-");

      let script = null;
      let region = null;

      if (ietf.length === 2) {
        if (ietf[1].length === 2) {
          region = ietf[1];
        } else {
          script = ietf[1];
        }
      }

      if (ietf.length === 3) {
        script = ietf[1];
        region = ietf[2];
      }

      return {
        language: ietf[0]?.toLowerCase(),
        script,
        region: region ? region.toUpperCase() : null,
        quality: bits[1] ? parseFloat(bits[1].split("=")[1]) : 1.0,
      };
    })
    .filter(function (r): r is AcceptLanguage {
      return !!r;
    })
    .sort(function (a, b) {
      return b.quality - a.quality;
    });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function findRootDir(dir = __dirname) {
  const packagePath = $resolve(dir, "package.json");
  if (existsSync(packagePath)) {
    return dir;
  }

  const parentDir = $resolve(dir, "..");
  if (parentDir === dir) {
    throw new Error("Could not find package.json");
  }

  return findRootDir(parentDir);
}

export const __rootdir = findRootDir();

export function resolve(...args: string[]) {
  return $resolve(__rootdir, ...args);
}
