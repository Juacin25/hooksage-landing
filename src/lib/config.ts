function httpsUrl(value: string | undefined) {
  if (!value?.trim()) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}
export const formEndpoint = import.meta.env.PROD
  ? "/api/waitlist"
  : httpsUrl(import.meta.env.PUBLIC_FORM_ENDPOINT) || "/api/waitlist";
export const contactEmail = "hooksage.app@gmail.com";
export const contactUrl = `mailto:${contactEmail}`;
// Set to the real registration/payment app; no guessed URL is published.
export const applicationUrl =
  httpsUrl(import.meta.env.PUBLIC_APP_URL) ||
  "https://app.hooksage.com/auth/register";
// Enable only after checkout, billing and the approved entitlements exist in the app.
export const paidPlansAvailable =
  import.meta.env.PUBLIC_PAID_PLANS_AVAILABLE === "true";
