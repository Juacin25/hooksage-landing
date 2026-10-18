// A native form POST must remain useful when JavaScript cannot run.
// Only fixed messages appear here: submitted values never enter HTML or URLs.
export function sendFormResponse(response, status, body, headers = {}) {
  const success = body.ok === true;
  const title = success
    ? "¡Listo! Ya estás en la lista."
    : "No pudimos completar el registro.";
  const descriptions = {
    invalid_fields:
      "Revisá los campos del formulario. Revisá el email y, si dejaste WhatsApp, incluí el código de país.",
    origin_not_allowed:
      "Abrí el formulario desde hooksage.com para completar tu registro.",
    rate_limited:
      "Recibimos varios intentos seguidos. Esperá unos minutos antes de volver a intentarlo.",
  };
  const description = success
    ? "Te avisaremos por correo cuando puedas probar Hooksage."
    : descriptions[body.error] ||
      "Volvé al formulario e intentá de nuevo. También podés escribirnos por email.";
  response.writeHead(status, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex",
    ...headers,
  });
  response.end(`<!doctype html>
<html lang="es-UY"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} | Hooksage</title><link rel="icon" href="/logos/hooksage-app-icon.svg">
<style>*{box-sizing:border-box}body{margin:0;background:#0e1913;color:#edf5ef;font:18px/1.6 system-ui,-apple-system,sans-serif}main{max-width:620px;margin:10vh auto;padding:32px 24px}a{color:#34c67d;text-underline-offset:4px}a:focus{outline:3px solid #34c67d;outline-offset:5px}h1{font-size:clamp(28px,6vw,42px);line-height:1.15}p{color:#b6c6ba}nav{display:flex;flex-wrap:wrap;gap:24px;margin-top:32px}.brand{font-weight:700;font-size:24px;text-decoration:none}</style>
</head><body><main><a class="brand" href="/">hooksage</a><h1>${title}</h1><p>${description}</p><nav aria-label="Siguientes pasos"><a href="/${success ? "" : "#empezar"}">${success ? "Volver al inicio" : "Volver al formulario"}</a><a href="mailto:hooksage.app@gmail.com">Escribirnos por correo</a></nav></main></body></html>`);
}
