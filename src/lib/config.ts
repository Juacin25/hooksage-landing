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
