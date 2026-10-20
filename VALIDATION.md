# Validación local — 17 de octubre de 2026

Versión con galería, SEO y funnel para Instagram/Facebook/TikTok, proceso rediseñado, cuota semanal corregida y los cuatro ajustes de revisión del navegador.

- `npm run check`: 0 errores, 0 advertencias, 0 hints.
- `npm run build`: correcto; cinco páginas estáticas.
- `npm test`: trece grupos correctos. Se verifican los metadatos de cada ruta, FAQ y JSON-LD, galería y cinco tonos, fotos distintas entre portada y galería inferior, assets AVIF/WebP, tres pasos del proceso, cuota de quince videos exportados por semana, precio de facturación mensual, validación de campos, payload, duplicados, atribución, expiración, navegación, almacenamiento bloqueado y eventos de conversión solo tras confirmar un registro nuevo. Ningún evento incluye los datos personales del formulario. Estas pruebas de interfaz no enviaron registros a terceros; la comprobación de Tenki posterior usó datos ficticios.
- Navegador: el proceso se revisó a 826, 1456 y 412 px. El botón está centrado debajo de la foto y los pasos en todos estos tamaños; queda fuera de la cuadrícula de contenido. El footer muestra “Hecho en Latam para Latam” y enlaza a `mailto:hooksage.app@gmail.com`. No hay enlaces públicos de WhatsApp. La galería inferior carga las cuatro fotos nuevas. La portada conserva sus imágenes. Sin desborde horizontal; se verificó también la preselección de Sushi al navegar de su página al formulario.
- `git diff --check`: correcto.

| Lighthouse móvil                         | Performance | Accessibility | Best Practices | SEO |
| ---------------------------------------- | ----------: | ------------: | -------------: | --: |
| Sistema (oscuro en este equipo)          |          95 |           100 |            100 | 100 |
| Claro, fijado solo por el servidor de QA |          95 |           100 |            100 | 100 |

Informes y capturas en `artifacts/lighthouse-mobile*`, ignorados por Git. `artifacts/como-funciona-mobile.jpg` muestra la nueva sección completa. Las puntuaciones son locales y no prueban posicionamiento ni una mejora de conversión.

El Plan Base tiene **15 videos exportados por semana**, con el precio previsto de $299 MXN al mes, IVA incluido. La definición compartida está en `src/data/plan.ts`. Se retiró el cálculo anterior de US$0.75 por video porque usaba una cuota mensual incorrecta.

“Cómo funcionará” usa una foto de preparación en cocina y tres acciones concretas en una lista editorial. La galería inferior y las páginas de rubro emplean otro juego de cuatro fotos, con créditos en `public/media/CREDITS.md`. Todas siguen identificadas como referencias y tienen formatos responsivos con carga diferida.

Precio presenta “Plan Base. Más tiers próximamente.”, con quince exportaciones semanales y facturación mensual. El contacto público y los avisos de acceso usan correo; también se actualizó el enlace de la confirmación, probado con respuesta 2xx simulada. El campo WhatsApp del visitante se conserva.

Se mantienen los siete campos del formulario. Los textos de entrada, los llamados principales y la confirmación comunican la lista de espera. Los eventos y la atribución están preparados. El Meta Pixel `1119851420489248` envía `PageView` en cada página y `Lead` solo tras un registro nuevo, sin datos del formulario.

## Base de datos y Tenki

Se agregó un servidor Node con SQLite, consultas parametrizadas, validación de los siete campos, límites de cuerpo e intentos y control de origen. La base no se sirve como archivo público y no tiene endpoints públicos de lectura. La confirmación requiere un JSON de guardado válido; duplicados y confirmaciones inválidas no emiten otra conversión.

`npm run test:api`: seis pruebas correctas con servidor HTTP y SQLite reales. Cubren guardado, duplicados concurrentes, recuperación tras cerrar/reabrir, backup consistente, campos inválidos, solicitudes fragmentadas grandes, intento de inyección SQL, límites y aislamiento de archivos.

Se creó un volumen persistente de 1 GiB en Tenki y una instancia mínima de 1 CPU/512 MiB. Un envío desde el navegador en la URL HTTPS real mostró éxito; la consulta directa a SQLite encontró el registro y sus UTMs de Instagram. Solo se usaron datos ficticios de prueba. El registro se conservó al reiniciar el servidor de la misma VM. El proceso queda bajo systemd con reinicio automático y arranque habilitado; no se creó una segunda instancia.

**Pendiente para campañas:** conectar el dominio elegido y las herramientas de medición publicitaria, y establecer una rutina de copias y seguimiento del saldo. Los anuncios y los píxeles no están publicados ni conectados. El procedimiento de operación y sus costos están en `DEPLOYMENT.md`.

La instancia continúa en http://127.0.0.1:4321/. No se publicaron campañas ni se modificó DNS. Ver `SEO-FUNNEL.md` para las hipótesis y el plan de comprobación.


## Revisión local del feedback de Reddit · 20 de octubre de 2026

Esta sección corresponde a la entrega local en revisión y reemplaza las expectativas antiguas de texto, pricing y formulario de este registro histórico. No se hizo push ni despliegue.

- Astro check: 0 errores, 0 advertencias. Compilación estática de las diez rutas ES/EN correcta.
- Interfaz: 17 grupos correctos, con titular concreto, pricing de packs y cupos semanales, comparación Antes/Después, selector móvil, pregunta opcional de edición y enlace opcional al clip. Se verifica que los nuevos valores no entren en eventos de analítica.
- API: 18 pruebas correctas. Cubren guardado de enlaces y texto en JSON y formulario HTML nativo, validación, avisos simulados, deduplicación, incorporación de datos nuevos a una persona ya registrada y migraciones sin pérdida de v1/v2/v3 a v4 con snapshot privado. Se conservaron los controles de origen, límites, preparación de consultas y aislamiento de archivos.
- Navegador local: el MP4 editado comenzó a reproducirse con `readyState=4`, sin error de decodificación. El selector Antes/Después cambia el reproductor móvil visible. A 390 px no hay desbordamiento horizontal. Los formularios ES/EN devolvieron éxito y SQLite confirmó el enlace y la respuesta en ambos registros ficticios.
- Entorno de revisión: puerto 8795, SQLite separado en `/private/tmp/hooksage-reddit-review/`, notificaciones por email desactivadas y Meta Pixel ausente en la compilación local. Las pruebas del servidor usan fixtures temporales, no la base pública.

No se afirma una mejora de conversión medida: los cambios están preparados para evaluación del equipo y posterior validación con usuarios.

Revisión final en navegador: ES y EN sin desbordamiento a 320 y 390 px; selector de suscripción probado en el ancho de 320 px. Se confirmó el guardado de los dos campos opcionales en los dos envíos ficticios y su inclusión en el CSV exportado desde la base local de prueba. Captura de portada en `/private/tmp/hooksage-reddit-review/landing-desktop.png`.

## Publicación del feedback de Reddit · 20 de octubre de 2026

Código publicado: `cd884bea3c4337765723d1964345f8e5e54eac88`. Se reutilizaron la sesión de Tenki, la configuración privada, el volumen y el túnel existentes.

- Se ejecutaron las 18 pruebas de API con Node 24.14.0 de Tenki: todas correctas. Se verificaron por SHA-256 los 183 archivos del manifiesto de la entrega.
- Se creó un backup consistente privado antes de migrar a SQLite v4. Los cinco registros preexistentes conservaron todas sus columnas anteriores, comprobadas por huella; `integrity_check=ok`. El túnel conservó el mismo proceso.
- Las diez rutas ES/EN respondieron 200 por HTTPS desde Tenki. Se comparó el HTML completo con la compilación aprobada, revirtiendo únicamente la ofuscación de email agregada por Cloudflare. Ambos dominios respondieron 200; HTTP redirigió con 301 a HTTPS.
- Los siete MP4 respondieron 206 y devolvieron correctamente los bytes solicitados. El navegador mostró el titular nuevo, los campos opcionales y el cambio de packs a suscripción en inglés.
- Un envío JSON en español y un formulario HTML nativo en inglés guardaron enlace, respuesta, país e idioma. El reintento JSON no duplicó el alta. Se eliminaron solo los registros ficticios identificados de esta comprobación y el conteo final fue cinco, con los originales intactos.
- Las notificaciones permanecen configuradas y el journal de la invocación no registró desactivación ni errores de Resend. Esto no se presenta como confirmación de entrega en el buzón.
- La analítica está habilitada en el build público y deshabilitada en la instancia local separada del puerto 8795. Las solicitudes técnicas de prueba no ejecutaron el Pixel del navegador.

La conexión Wi-Fi de este Mac presentó un certificado emitido por Fortinet al cliente de terminal; no se desactivó TLS ni se cambió la confianza del sistema. La validación HTTPS pública se completó desde Tenki y la landing cargó en el navegador. Este filtro de red es independiente del despliegue.
