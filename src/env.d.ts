/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly PUBLIC_FORM_ENDPOINT?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface HooksageAttribution {
  landing_path: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}
interface Window {
  HooksageFunnel?: {
    getAttribution(): HooksageAttribution;
    track(
      name:
        | "waitlist_landing_view"
        | "waitlist_cta_click"
        | "waitlist_form_start"
        | "waitlist_form_error"
        | "generate_lead",
      details?: { cta_location?: string; error_type?: string },
    ): void;
  };
  dataLayer?: Record<string, unknown>[];
}
