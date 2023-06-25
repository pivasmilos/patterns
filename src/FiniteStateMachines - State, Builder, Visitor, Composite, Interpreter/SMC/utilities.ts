import crypto from "crypto";

export function hash(s: string): string {
  return crypto.createHash("sha256").update(s).digest("hex");
}

export function addPrefix(prefix: string, list: string[]): string[] {
  return list.map((element) => prefix + element);
}

export function compressWhiteSpace(s: string): string {
  return s
    .replace(/\n+/g, "\n")
    .replace(/[\t ]+/g, " ")
    .replace(/ *\n */g, "\n");
}
