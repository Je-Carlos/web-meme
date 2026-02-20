import { randomBytes } from "node:crypto";

export function generateSlug(length = 10): string {
  let slug = "";
  while (slug.length < length) {
    slug += randomBytes(length).toString("base64url");
  }
  return slug.slice(0, length);
}

export function randomHex(bytes = 16): string {
  return randomBytes(bytes).toString("hex");
}

export function generateImagePath(slug: string, ext: string): string {
  return `${slug}/${randomHex(16)}.${ext}`;
}
