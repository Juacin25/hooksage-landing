import { countries } from "./countries.mjs";
// Same normalizer is bundled into the form and used by both POST formats.
/** @param {unknown} value @param {string} country @returns {string|null} */
export function normalizePhone(value, country) {
  if (typeof value !== "string") return null;
  const raw = value.trim();
  // WhatsApp is optional for every country.
  if (!raw) return "";
  if (!/^[+\d\s().-]+$/.test(raw)) return null;
  const digits = raw.replace(/\D/g, "");
  if (country === "MX") {
    const number = digits.length === 10 ? `52${digits}` : digits;
    return /^52\d{10}$/.test(number) ? `+${number}` : null;
  }
  if (!raw.startsWith("+")) return null;
  if (country === "UY")
    return /^598[249]\d{7}$/.test(digits) ? `+${digits}` : null;
  if (country === "AR")
    return /^54(?:9)?[1-9]\d{9}$/.test(digits) ? `+${digits}` : null;
  if (country === "GB")
    return /^44[1-9]\d{8,9}$/.test(digits) ? `+${digits}` : null;
  const dial = countries.find((entry) => entry.code === country)?.dial;
  if (!dial) return null;
  // North American numbering plan (US, Puerto Rico, Dominican Republic).
  if (dial === "1")
    return /^1[2-9]\d{2}[2-9]\d{6}$/.test(digits) ? `+${digits}` : null;
  // ponytail: generic length check per calling code; add per-country rules if bad numbers slip through.
  return new RegExp(`^${dial}\\d{7,11}$`).test(digits) ? `+${digits}` : null;
}
