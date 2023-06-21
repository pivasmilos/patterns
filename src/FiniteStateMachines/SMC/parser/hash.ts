import crypto from "crypto";

export function hash(s: crypto.BinaryLike): string {
  return crypto.createHash("sha256").update(s).digest("hex");
}
