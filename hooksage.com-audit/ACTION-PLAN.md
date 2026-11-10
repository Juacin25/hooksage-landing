# Plan de acción SEO para hooksage.com

Fecha: 10 de noviembre de 2026. Sale de [FULL-AUDIT-REPORT.md](FULL-AUDIT-REPORT.md).

No hay hallazgos críticos: nada bloquea el rastreo ni la indexación desde el lado del sitio. El orden de abajo sigue una dependencia: primero medir, después autoridad, después velocidad y confianza.

## Alta prioridad (esta semana)

| # | Acción | Quién | En qué se apoya | Cómo sabremos si falló | Indicador para seguir |
| --- | --- | --- | --- | --- | --- |
| 1 | Verificar el dominio en Search Console, enviar `sitemap.xml` e inspeccionar las URLs de Black Friday y CapCut | Tú | Sin esto no se puede medir la meta de 20.000 impresiones | A los 7 días, "Páginas indexadas" sigue en cero | Páginas indexadas sobre 49 |
| 2 | Conseguir las primeras menciones externas: canal de YouTube con los tres pares de antes y después, enlace desde la biografía de Instagram, pedido de enlace a Build 101 y ficha en directorios de herramientas | Tú | El dominio no figura en Common Crawl; sin enlaces, Google rastrea e indexa más despacio | A los 30 días, Search Console no muestra ningún dominio en "Enlaces externos" | Dominios que enlazan |
| 3 | Bajar el LCP de la portada: incrustar el CSS y quitar la opacidad cero de la animación del título | Código | El elemento LCP es el título y entra animado después de tres hojas de estilo | Lighthouse móvil sigue arriba de 2,5 s en tres corridas | LCP de laboratorio en la portada |
| 4 | Crear una página "Quiénes somos" con el equipo, la historia de Build 101, la razón social y el contacto, y apuntar ahí la firma del blog | Código, con datos tuyos | La firma de 34 artículos enlaza hoy a un ancla de la portada | La página nueva no recibe enlaces internos o queda con menos de 300 palabras | Enlaces internos a la página |

La acción 2 depende de la 1 para medirse. La 4 mantiene la firma "Equipo de Hooksage", como decidiste.

## Prioridad media (este mes)

| # | Acción | Quién | En qué se apoya | Cómo sabremos si falló | Indicador para seguir |
| --- | --- | --- | --- | --- | --- |
| 5 | Servir recursos con hash y fuentes con `max-age=31536000, immutable` | Código, requiere reiniciar el servidor | Hoy tienen una hora en el origen | La cabecera en producción sigue en 14.400 s | `cache-control` de un archivo de `/_astro/` |
| 6 | En Cloudflare, cambiar "Browser Cache TTL" a "Respect existing headers" | Tú | Cloudflare convierte `max-age=0` del HTML en cuatro horas | El HTML sigue llegando con `max-age=14400` | `cache-control` de la portada |
| 7 | Generar posters de 360 px para los videos | Código | Se sirven a 720 × 1280 y se muestran a unos 180 px | Lighthouse sigue marcando "Improve image delivery" | Peso total de la portada |
| 8 | Reemplazar el email de Gmail por uno del dominio | Tú | Un contacto en el dominio propio es una señal de confianza básica | El email viejo sigue en el schema | Campo `email` de la organización |
| 9 | Correr la prueba de cinco editores y publicar el borrador | Tu equipo | Es la única pieza con dato original | El artículo sale sin los videos exportados | Artículo publicado |
| 10 | Bajar el ritmo: no más de dos o tres artículos nuevos por semana | Tú | 34 artículos en dos días en un dominio de tres semanas | Search Console muestra muchas URLs en "Rastreada: actualmente sin indexar" | Proporción de artículos indexados |
| 11 | Crear páginas de categoría, empezando por "Ideas por industria" | Código | Las categorías son solo encabezados del índice | La página queda como una lista sin texto propio | Impresiones de "ideas de reels por rubro" |

## Prioridad baja (cuando haya tiempo)

- Redirigir `/index.html` a `/` con un 301.
- Quitar `about` del `WebPage` en los artículos, donde apunta al software.
- Sumar imágenes 4:3 y 1:1 al `BlogPosting`.
- Reescribir el texto alternativo de las 10 portadas que repiten el título.
- Enlazar tres o cuatro artículos desde la portada.
- Alargar las descripciones de las dos páginas de privacidad.
- Agregar una `Content-Security-Policy`.
- Evaluar una herramienta gratuita (generador de hooks o comprobador de zona segura): en esas búsquedas los resultados son herramientas.

## Lo que no conviene tocar

- `FAQPage`: ya no genera resultados en Google, pero no molesta. Dejarlo.
- `robots.txt` y `llms.txt`: están bien.
- Los slugs publicados: no cambiarlos.

## Seguimiento

Revisar Search Console el 17 y el 24 de noviembre: páginas indexadas, impresiones totales y las diez consultas con más impresiones. Con ese dato se decide qué artículos ampliar y cuáles retitular.
