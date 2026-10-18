// Same normalizer is bundled into the form and used by both POST formats.
/** @param {unknown} value @param {string} country @returns {string|null} */
export function normalizePhone(value, country) {
  if (typeof value !== "string") return null;
  const raw = value.trim();
  if (!raw) return country === "MX" ? null : "";
  if (!/^[+\d\s().-]+$/.test(raw)) return null;
  const digits = raw.replace(/\D/g, "");
  if (country === "MX") {
    const number = digits.length === 10 ? `52${digits}` : digits;
    return /^52\d{10}$/.test(number) ? `+${number}` : null;
  }
  if (!raw.startsWith("+")) return null;
  if (country === "UY" && /^598[249]\d{7}$/.test(digits)) return `+${digits}`;
  if (country === "AR" && /^54(?:9)?[1-9]\d{9}$/.test(digits))
    return `+${digits}`;
  if (country === "US" && /^1[2-9]\d{2}[2-9]\d{6}$/.test(digits))
    return "+" + digits;
  if (country === "GB" && /^44[1-9]\d{8,9}$/.test(digits)) return "+" + digits;
  return null;
}
