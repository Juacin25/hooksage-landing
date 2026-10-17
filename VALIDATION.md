# Validación local — 17 de octubre de 2026

Versión con galería, SEO y funnel para Instagram/Facebook/TikTok, proceso rediseñado, cuota semanal corregida y los cuatro ajustes de revisión del navegador.

- `npm run check`: 0 errores, 0 advertencias, 0 hints.
- `npm run build`: correcto; cinco páginas estáticas.
- `npm test`: trece grupos correctos. Se verifican los metadatos de cada ruta, FAQ y JSON-LD, galería y cinco tonos, fotos distintas entre portada y galería inferior, assets AVIF/WebP, tres pasos del proceso, cuota de veinte videos exportados por semana, precio de facturación mensual, validación de campos, payload, duplicados, atribución, expiración, navegación, almacenamiento bloqueado y eventos de conversión solo tras confirmar un registro nuevo. Ningún evento incluye los datos personales del formulario. Estas pruebas de interfaz no enviaron registros a terceros; la comprobación de Tenki posterior usó datos ficticios.
- Navegador: el proceso se revisó a 826, 1456 y 412 px. El botón está centrado debajo de la foto y los pasos en todos estos tamaños; queda fuera de la cuadrícula de contenido. El footer muestra “Hecho en Latam para Latam” y enlaza a `mailto:hooksage.app@gmail.com`. No hay enlaces públicos de WhatsApp. La galería inferior carga las cuatro fotos nuevas. La portada conserva sus imágenes. Sin desborde horizontal; se verificó también la preselección de Sushi al navegar de su página al formulario.
- `git diff --check`: correcto.

| Lighthouse móvil                         | Performance | Accessibility | Best Practices | SEO |
| ---------------------------------------- | ----------: | ------------: | -------------: | --: |
| Sistema (oscuro en este equipo)          |          95 |           100 |            100 | 100 |
| Claro, fijado solo por el servidor de QA |          95 |           100 |            100 | 100 |

Informes y capturas en `artifacts/lighthouse-mobile*`, ignorados por Git. `artifacts/como-funciona-mobile.jpg` muestra la nueva sección completa. Las puntuaciones son locales y no prueban posicionamiento ni una mejora de conversión.

El Plan Base tiene **20 videos exportados por semana**, con el precio previsto de US$14.97 al mes. La definición compartida está en `src/data/plan.ts`. Se retiró el cálculo anterior de US$0.75 por video porque usaba una cuota mensual incorrecta.

“Cómo funcionará” usa una foto de preparación en cocina y tres acciones concretas en una lista editorial. La galería inferior y las páginas de rubro emplean otro juego de cuatro fotos, con créditos en `public/media/CREDITS.md`. Todas siguen identificadas como referencias y tienen formatos responsivos con carga diferida.

Precio presenta “Plan Base. Más tiers próximamente.”, con veinte exportaciones semanales y facturación mensual. El contacto público y los avisos de acceso usan correo; también se actualizó el enlace de la confirmación, probado con respuesta 2xx simulada. El campo WhatsApp del visitante se conserva.

Se mantienen los siete campos del formulario. Los textos de entrada, los llamados principales y la confirmación comunican la lista de espera. Los eventos y la atribución están preparados; no se instalaron píxeles ni se conectaron cuentas publicitarias.

## Base de datos y Tenki

Se agregó un servidor Node con SQLite, consultas parametrizadas, validación de los siete campos, límites de cuerpo e intentos y control de origen. La base no se sirve como archivo público y no tiene endpoints públicos de lectura. La confirmación requiere un JSON de guardado válido; duplicados y confirmaciones inválidas no emiten otra conversión.

`npm run test:api`: seis pruebas correctas con servidor HTTP y SQLite reales. Cubren guardado, duplicados concurrentes, recuperación tras cerrar/reabrir, backup consistente, campos inválidos, solicitudes fragmentadas grandes, intento de inyección SQL, límites y aislamiento de archivos.

Se creó un volumen persistente de 1 GiB en Tenki y una instancia mínima de 1 CPU/512 MiB. Un envío desde el navegador en la URL HTTPS real mostró éxito; la consulta directa a SQLite encontró el registro y sus UTMs de Instagram. Solo se usaron datos ficticios de prueba. El registro se conservó al reiniciar el servidor de la misma VM. El proceso queda bajo systemd con reinicio automático y arranque habilitado; no se creó una segunda instancia.

**Pendiente para campañas:** conectar el dominio elegido y las herramientas de medición publicitaria, y establecer una rutina de copias y seguimiento del saldo. Los anuncios y los píxeles no están publicados ni conectados. El procedimiento de operación y sus costos están en `DEPLOYMENT.md`.

La instancia continúa en http://127.0.0.1:4321/. No se publicaron campañas ni se modificó DNS. Ver `SEO-FUNNEL.md` para las hipótesis y el plan de comprobación.
