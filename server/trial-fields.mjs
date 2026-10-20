// Shared by the browser and receiver. Links are stored, never fetched by the server.
export function normalizeFootageUrl(value = "") {
  if (typeof value !== "string") return null;
  const input = value.trim();
  if (!input) return "";
  if (input.length > 2048 || /[\u0000-\u001f\u007f]/.test(input)) return null;
  try {
    const url = new URL(input);
    return url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      url.href.length <= 2048
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export function normalizeEditingFeedback(value = "") {
  if (typeof value !== "string") return null;
  const input = value.replace(/\r\n?/g, "\n").trim().normalize("NFC");
  return input.length <= 1000 &&
    !/[\u0000-\u0008\u000b-\u001f\u007f]/.test(input)
    ? input
    : null;
}
