const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export function validateAvatarFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Solo se permiten archivos JPG, PNG o WEBP.";
  }
  if (file.size > MAX_SIZE_BYTES) {
    return "La imagen no debe superar los 2 MB.";
  }
  return null;
}
