# Revisión local del feedback de Reddit

20 de octubre de 2026. Implementación revisada localmente, aprobada por el usuario y publicada en producción. La instancia de revisión conserva una base separada de producción.

## Qué revisar

- Portada: “De tu video en crudo a un short editado”. En inglés: “Turn raw footage into an edited short”. La promesa explica entrada, salida y edición; conserva las duraciones reales de las muestras y no fija todos los resultados en 15 segundos.
- Comparación: dos versiones grandes en escritorio, botones Antes/Después en móvil, tres pares con flechas, diferencia real de duración y cambios visibles. El anuncio queda separado y no se atribuye un crudo que no tenemos.
- Prueba concreta: botones “Probar con mi video”, enlace al clip opcional y coordinación por email. No se simula un editor ni una subida de archivos.
- Validación: pregunta opcional “¿Qué tuviste que rehacer en tu último video?”, con contexto para quien probó un editor con IA. No se agrega otro requisito al registro.
- Pricing: selector de packs y suscripciones con cupos semanales, según la última propuesta comercial. Incluido en la versión aprobada.

## Instancia

- Español: http://127.0.0.1:8795/
- Inglés: http://127.0.0.1:8795/en/
- SQLite de prueba: `/private/tmp/hooksage-reddit-review/waitlist.sqlite`, fuera de `dist/`.
- Notificaciones de email desactivadas. Meta Pixel desactivado con `PUBLIC_ENABLE_ANALYTICS=false` al compilar.

## Datos y compatibilidad

`footageUrl` acepta únicamente enlaces HTTPS sin credenciales, hasta 2048 caracteres; el servidor los guarda y no los consulta. `editingFeedback` acepta hasta 1000 caracteres, con saltos de línea. Ambos son opcionales y se validan en navegador y receptor. Se guardan en SQLite y se incluyen en el aviso por email de producción cuando corresponda. Un registro previo puede completar campos nuevos vacíos sin duplicarse ni sobrescribir sus datos originales. Los reintentos no cuentan otra conversión.

El esquema v4 preserva los registros y genera un snapshot privado antes de migrar. Los tests usan bases temporales de prueba, nunca la base pública. La API no expone lectura de registros y las confirmaciones no reflejan enlaces ni respuestas privadas.

El enlace y la respuesta no se incluyen en los eventos de analítica. La consulta de origen, el campo trampa, límites y fallback HTML nativo se conservan. `scripts/database.mjs export` incluye las columnas nuevas y mantiene el escape de celdas CSV.

La publicación aprobada debe seguir la sección nueva de DEPLOYMENT.md: esta entrega sí requiere actualizar el receptor y reiniciarlo para migrar antes de activar el formulario nuevo.

## Publicación aprobada

Código `cd884bea3c4337765723d1964345f8e5e54eac88`, publicado el 20 de octubre de 2026. Diez rutas ES/EN y ambos dominios verificados por HTTPS desde Tenki; formulario JSON español y HTML nativo inglés guardaron ambos campos opcionales. SQLite v4 conserva los cinco registros anteriores; los datos ficticios de prueba se eliminaron. Ver el registro de validación para el detalle operativo.
