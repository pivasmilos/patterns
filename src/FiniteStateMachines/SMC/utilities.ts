import crypto from "crypto";

export function hash(s: string): string {
  return crypto.createHash("sha256").update(s).digest("hex");
}

export function commaList(names: string[]): string {
  let commaList = "";
  let first = true;
  for (const name of names) {
    commaList += (first ? "" : ",") + name;
    first = false;
  }
  return commaList;
}

export function addPrefix(prefix: string, list: string[]): string[] {
  const result: string[] = [];
  for (const element of list) {
    result.push(prefix + element);
  }
  return result;
}

export function compressWhiteSpace(s: string): string {
  return s
    .replace(/\n+/g, "\n")
    .replace(/[\t ]+/g, " ")
    .replace(/ *\n */g, "\n");
}
