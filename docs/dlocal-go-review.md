# Revisión comercial y legal de Hooksage

23 de octubre de 2026. Entrega local; publicación separada. No se envió una solicitud de revisión ni un mensaje a dLocal Go.

## Decisiones aprobadas

Operador: CANARY CODE SAS, RUT 219631960019. Domicilio constituido autorizado para publicación: Brandzen 1956, apartamento 501, Montevideo, Uruguay. Contacto: hooksage.app@gmail.com. Sin teléfono ni redes no confirmados.

La app tiene registro y login comprobados con HTTP 200: https://app.hooksage.com/auth/register y https://app.hooksage.com/auth/login. Los precios y cuotas originales se conservan en `src/data/plan.ts`, importados también por los términos ES/EN.

Prueba gratuita coordinada por correo, una por persona o negocio. Condiciones comerciales aprobadas: original de hasta 5 minutos/250 MB; dos regeneraciones por pieza con el mismo material y objetivo; ajustes manuales y descargas sin descontar otra unidad; fallos sin consumo. Packs de 90 días. Suscripciones mensuales con cupos cada 7 días desde la activación, sin acumulación. Renovación automática solo informada y aceptada antes de pagar. Cancelación por correo antes del siguiente cobro sin penalidad y con acceso hasta terminar el período pagado. Devolución de la parte no prestada dentro de 10 días corridos, preservando derechos legales obligatorios.

Retención operativa: solicitudes 12 meses desde última interacción; originales, proyectos y resultados 30 días desde última actividad; copias propias de respaldo hasta 90 días adicionales. Gestión manual, sin prometer un borrado automático existente. Documentos fiscales por el plazo legal aplicable. Portfolio/publicidad solo con permiso separado.

## Privacidad implementada en la landing

Proveedores confirmados por el usuario: OpenRouter y AI33. Infraestructura/correo documentados: Tenki, Cloudflare, Resend y Gmail. Se informa que OpenRouter deriva solicitudes a proveedores de modelos y que sus prácticas dependen del proveedor/configuración. No se promete retención cero o exclusión general de entrenamiento sin verificarla.

Meta Pixel solo se carga tras aceptar. Rechazar tiene igual prominencia; las preferencias se reabren desde el pie. GPC mantiene desactivada la publicidad y DNT no equivale a consentimiento. Elección hasta 180 días. La atribución de campaña local solo se conserva con aceptación, con validez de 30 minutos; se elimina al rechazar o retirar la aceptación. Sin consentimiento no se envían eventos al `dataLayer`, UTMs del formulario ni solicitudes a Meta.

El aviso del formulario y los enlaces legales explican el uso precontractual solicitado. `noticeVersion` se guarda en la columna histórica `consent_version`: no es consentimiento de marketing. Pestañas viejas mantienen una marca legacy. No se reetiquetan registros anteriores ni se migra destructivamente la base.

## Pendiente en la aplicación

La inspección del gateway y la app encontró registro/login operativos, pero no integración dLocal Go ni checkout, cobros recurrentes, cómputo comercial de cupos o vencimiento de packs implementados. La app todavía usa presentación de demo. Los términos aprobados no implementan esas funciones.

Por eso `PUBLIC_PAID_PLANS_AVAILABLE=false`: los botones crean una cuenta gratuita y el copy informa que los pagos aún no están habilitados. Antes de cobrar se deben implementar y comprobar cargos, cupos, cancelaciones, devoluciones y retenciones comprometidos; enlazar también las políticas y recoger la aceptación pertinente en el proceso de contratación de la app. No cambiar el indicador para aparentar una compra operativa.

## Validación

- Astro check: 0 errores, 0 advertencias y un hint del stub estándar de Meta.
- Build: 14 rutas estáticas.
- `npm test`: 18 grupos, incluidas cuatro páginas legales, idiomas, operador, precios y enlaces.
- `npm run test:api`: 19 pruebas HTTP/SQLite aisladas, incluido aviso actual/legacy.
- `npm run test:consent`: 8 grupos sin contactar Meta, incluidas revocación, atribución opt-in, GPC/DNT y almacenamiento bloqueado.
- Navegador móvil: términos, privacidad, idioma inglés, rechazo y reapertura inspeccionados. Sin crear cuentas ni pagar.

## Fuentes

- [Ley 18.331, información previa](https://www.impo.com.uy/bases/leyes/18331-2008/13), [acceso](https://www.impo.com.uy/bases/leyes/18331-2008/14), [rectificación/supresión](https://www.impo.com.uy/bases/leyes/18331-2008/15) y [transferencias](https://www.impo.com.uy/bases/leyes/18331-2008/23).
- [Ley 17.250, artículo 16](https://www.impo.com.uy/bases/leyes/17250-2000/16) y [16-BIS](https://www.impo.com.uy/bases/leyes/17250-2000/16_BIS).
- [Ley 20.531, artículo 108](https://www.impo.com.uy/bases/leyes/20531-2026/108) y [vigencia desde enero de 2027](https://www.impo.com.uy/bases/leyes/20531-2026/2). No se presenta esa reforma como vigente en octubre de 2026.
- [Privacidad OpenRouter](https://openrouter.ai/privacy) y [políticas de proveedores](https://openrouter.ai/docs/guides/privacy/provider-logging).

La aceptación final del sitio depende de la revisión de dLocal Go y del funcionamiento real del servicio.
