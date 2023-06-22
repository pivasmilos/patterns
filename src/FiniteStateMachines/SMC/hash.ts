import crypto from "crypto";

export function hash(s: string): string {
  return crypto.createHash("sha256").update(s).digest("hex");
}
