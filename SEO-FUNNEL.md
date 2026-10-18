# Hooksage: mensaje y funnel de registro

## Validación en inglés

La versión para compartir en comunidades de Estados Unidos y Reino Unido es `https://hooksage.com/en/`. Ejemplo de atribución: `https://hooksage.com/en/?utm_source=reddit&utm_medium=community&utm_campaign=uk_validation`. El selector conserva la campaña y su página de entrada al cambiar de idioma. La landing y sus cuatro páginas de público tienen canonical y hreflang propios; no se fuerza una redirección por ubicación.

La traducción mantiene la promesa de edición de material propio y el acceso anticipado, sin presentar el producto como disponible inmediatamente ni inventar validaciones estadounidenses o británicas. El formulario admite US y GB y guarda el idioma de inscripción. No se publicaron posts ni campañas como parte de este cambio.

17 de octubre de 2026. Público: startups y empresas chicas de Uruguay y Argentina, equipos de marketing sin editor full time y marcas personales. Objetivo: formularios guardados en la lista de espera. El tono usa voseo rioplatense.

## Promesa

“Más videos. Menos horas editando.” Pasá material sin editar y recibí piezas verticales de 15 segundos con cortes, zooms y subtítulos. El producto está en acceso anticipado: el CTA registra interés y avisa por email; no promete uso inmediato. Primer video gratis al registrarse. Planes con pago mensual: Founder US$14,97 (15 exportaciones por semana), Pyme US$29,99 (40) y Marca Personal US$49,99 (80).

Las conversaciones de validación informan el enfoque. No se publican nombres, logos ni citas de esas personas como testimonios. Las fotos están identificadas como referencias, sin presentarlas como resultados ni clientes.

## Mensajes para probar

| Público        | Mensaje                                           | Destino                              |
| -------------- | ------------------------------------------------- | ------------------------------------ |
| Startup        | Ya grabaste la demo. Que la edición no te frene.  | `/videos-para-startups/`             |
| Pyme           | Mostrá lo que hacés sin pasar horas editando.     | `/videos-para-pymes/`                |
| Marca personal | Tu experiencia merece salir del borrador.         | `/videos-para-marca-personal/`       |
| Marketing      | La estrategia ya está. Falta resolver la edición. | `/videos-para-equipos-de-marketing/` |

Los términos editor de videos cortos, edición para startups y pymes, subtítulos, cortes, zooms, Reels, TikTok y Shorts aparecen en contexto útil. No se añade `meta keywords`. Son hipótesis de mensajes: no hay datos de volumen, CPC ni evidencia de mejora de conversión.

## Campañas y medición

Ejemplo: `https://hooksage.com/videos-para-startups/?utm_source=instagram&utm_medium=paid_social&utm_campaign=rioplatense_waitlist&utm_content=founder_reel`.

La landing conserva cinco UTMs permitidas durante treinta minutos y la ruta de entrada al navegar al formulario. No se incluyen nombres, teléfonos, emails ni datos personales en etiquetas o eventos. Los destinos anteriores redirigen a la portada con su query intacta.

`waitlist_landing_view`, `waitlist_cta_click`, `waitlist_form_start` y `waitlist_form_error` permiten observar el recorrido. `generate_lead` y Meta Lead se emiten solo después de confirmar `{ok:true,created:true}`. Un duplicado no cuenta otra conversión. Meta Pixel conserva PageView; GA4, TikTok y CAPI no se agregan en este cambio.

El formulario guarda empresa, tipo de equipo, contacto, email, país, ciudad y WhatsApp opcional en SQLite. El servidor confirma después del commit. Las altas nuevas notifican al equipo por email; los fallos de notificación no pierden el registro. No se envían anuncios ni se cambia presupuesto.

Comparar registros guardados por visita, registros por formulario iniciado y costo por registro, junto con la calidad de cada alta. Probar mensajes con tráfico comparable; no declarar ganadora una variante solo por CTR. No se fijan tasas objetivo sin una línea base.
