// Emails each new waitlist entry through Resend's HTTPS API (no SMTP, no dependencies).
export function createNotifier({
  apiKey,
  to,
  from = "Hooksage <onboarding@resend.dev>",
  fetch = globalThis.fetch,
}) {
  if (!apiKey || !to) return null;
  return async (entry) => {
    const { attribution: a } = entry;
    const utm = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ]
      .filter((key) => a[key])
      .map((key) => `${key}: ${a[key]}`);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: entry.email,
        subject: `Nuevo registro: ${entry.businessName} (${entry.city})`,
        text: [
          `Negocio: ${entry.businessName}`,
          `Tipo: ${entry.businessType}`,
          `Contacto: ${entry.contactName}`,
          `Email: ${entry.email}`,
          `WhatsApp: ${entry.whatsapp || "No indicado"}`,
          `País: ${{ UY: "Uruguay", AR: "Argentina", MX: "México" }[entry.country || "MX"]}`,
          `Ciudad: ${entry.city}`,
          `Barrio: ${entry.neighborhood || "-"}`,
          `Landing: ${a.landing_path}`,
          ...utm,
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`resend_${response.status}`);
  };
}
