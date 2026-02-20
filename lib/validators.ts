const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function sanitizeText(str: unknown, maxLen: number): string {
  if (typeof str !== "string") {
    return "";
  }

  const sanitized = str.replace(/\s+/g, " ").trim();
  if (sanitized.length > maxLen) {
    throw new ValidationError(`Texto acima do limite de ${maxLen} caracteres.`);
  }

  return sanitized;
}

export function normalizeExt(ext: unknown): string {
  if (typeof ext !== "string") {
    return "";
  }
  return ext.replace(/^\.+/, "").trim().toLowerCase();
}

export function assertAllowedExt(ext: string): void {
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new ValidationError("Extensao de arquivo invalida.");
  }
}
