// A native form POST must remain useful when JavaScript cannot run.
// Only fixed messages appear here: submitted values never enter HTML or URLs.
export function sendFormResponse(
  response,
  status,
  body,
  headers = {},
  language = "es",
) {
  const en = language === "en";
  const success = body.ok === true;
  const title = success
    ? en
      ? "You are on the list!"
      : "¡Listo! Ya estás en la lista."
    : en
      ? "We could not complete your registration."
      : "No pudimos completar el registro.";
  const descriptions = {
    invalid_fields: en
      ? "Check the form fields. Make sure your email is valid and include a country code if you enter a WhatsApp number."
      : "Revisá los campos del formulario. Revisá el email y, si dejaste WhatsApp, incluí el código de país.",
    origin_not_allowed: en
      ? "Open the form on hooksage.com to complete your registration."
      : "Abrí el formulario desde hooksage.com para completar tu registro.",
    rate_limited: en
      ? "We received several requests in a short time. Please wait a few minutes and try again."
      : "Recibimos varios intentos seguidos. Esperá unos minutos antes de volver a intentarlo.",
  };
  const description = success
    ? en
      ? "We will email you when you can try Hooksage."
      : "Te avisaremos por correo cuando puedas probar Hooksage."
    : descriptions[body.error] ||
      (en
        ? "Go back to the form and try again. You can also email us."
        : "Volvé al formulario e intentá de nuevo. También podés escribirnos por email.");
  response.writeHead(status, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex",
    ...headers,
  });
  response.end(`<!doctype html>
<html lang="${en ? "en" : "es-UY"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} | Hooksage</title><link rel="icon" href="/logos/hooksage-app-icon.svg">
<style>*{box-sizing:border-box}body{margin:0;background:#0e1913;color:#edf5ef;font:18px/1.6 system-ui,-apple-system,sans-serif}main{max-width:620px;margin:10vh auto;padding:32px 24px}a{color:#34c67d;text-underline-offset:4px}a:focus{outline:3px solid #34c67d;outline-offset:5px}h1{font-size:clamp(28px,6vw,42px);line-height:1.15}p{color:#b6c6ba}nav{display:flex;flex-wrap:wrap;gap:24px;margin-top:32px}.brand{font-weight:700;font-size:24px;text-decoration:none}</style>
</head><body><main><a class="brand" href="${en ? "/en/" : "/"}">hooksage</a><h1>${title}</h1><p>${description}</p><nav aria-label="${en ? "Next steps" : "Siguientes pasos"}"><a href="${en ? "/en/" : "/"}${success ? "" : "#empezar"}">${en ? (success ? "Back to home" : "Back to the form") : success ? "Volver al inicio" : "Volver al formulario"}</a><a href="mailto:hooksage.app@gmail.com">${en ? "Email us" : "Escribirnos por correo"}</a></nav></main></body></html>`);
}
