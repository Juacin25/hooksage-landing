import { normalizePhone } from "./phone.mjs";
import {
  normalizeFootageUrl,
  normalizeEditingFeedback,
} from "./trial-fields.mjs";
const types = new Set([
  "Startup",
  "Pyme",
  "Marca personal",
  "Agencia",
  "Equipo de marketing",
  "Taquería",
  "Hamburguesería",
  "Heladería",
  "Sushi",
  "Otro",
]);
const campaignKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];
function text(value, min, max) {
  if (typeof value !== "string") return null;
  const normalized = value.trim().normalize("NFC");
  return normalized.length >= min &&
    normalized.length <= max &&
    !/[\u0000-\u001f\u007f]/.test(normalized)
    ? normalized
    : null;
}

export function validateEntry(input) {
  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input) ||
    input.intent !== "waitlist"
  )
    return null;
  if (input.website !== undefined && input.website !== "") return null;
  const country = input.country === undefined ? "MX" : input.country;
  if (!["UY", "AR", "MX", "US", "GB"].includes(country)) return null;
  const language = input.language === undefined ? "es" : input.language;
  if (!["es", "en"].includes(language)) return null;
  const noticeVersion =
    input.noticeVersion === undefined ? "waitlist-v2" : input.noticeVersion;
  if (!["trial-notice-2026-10-23", "waitlist-v2"].includes(noticeVersion))
    return null;
  const entry = {
    language,
    country,
    // Version of the trial-request notice, not consent to advertising or terms.
    noticeVersion,
    businessName: text(input.businessName, 2, 100),
    businessType: types.has(input.businessType) ? input.businessType : null,
    contactName: text(input.contactName, 2, 100),
    email: text(input.email, 3, 254)?.toLowerCase() || null,
    whatsapp: normalizePhone(input.whatsapp ?? "", country),
    city: text(input.city, 2, 100),
    neighborhood: text(input.neighborhood ?? "", 0, 100),
    footageUrl: normalizeFootageUrl(input.footageUrl ?? ""),
    editingFeedback: normalizeEditingFeedback(input.editingFeedback ?? ""),
  };
  if (Object.values(entry).some((value) => value === null)) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.email)) return null;
  const source =
    input.attribution && typeof input.attribution === "object"
      ? input.attribution
      : {};
  entry.attribution = {
    landing_path:
      typeof source.landing_path === "string" &&
      /^\/[a-zA-Z0-9/_-]{0,199}$/.test(source.landing_path)
        ? source.landing_path
        : "/",
  };
  for (const key of campaignKeys) {
    if (
      typeof source[key] === "string" &&
      /^[a-zA-Z0-9._-]{1,80}$/.test(source[key])
    )
      entry.attribution[key] = source[key];
  }
  return entry;
}
