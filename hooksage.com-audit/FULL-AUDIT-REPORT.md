# Auditoría SEO de hooksage.com

Fecha: 10 de noviembre de 2026. Alcance: las 49 URLs del sitemap, rastreadas en producción después del deploy del 9 de noviembre (`eb41b08`).

Los puntajes son heurísticos del plugin claude-seo, no señales internas de Google. No hay datos de Search Console, de PageSpeed (la API devolvió límite de cuota) ni de campo (CrUX): el sitio es demasiado nuevo. El rendimiento se midió con Lighthouse local, una corrida por página.

## Resumen

**Puntaje de salud SEO: 80/100.** Tipo de negocio detectado: SaaS con blog de contenido.

| Categoría | Peso | Puntaje |
| --- | --- | --- |
| SEO técnico | 22 % | 90 |
| Calidad de contenido | 23 % | 64 |
| SEO on-page | 20 % | 90 |
| Schema | 10 % | 82 |
| Rendimiento | 10 % | 72 |
| Preparación para búsqueda con IA | 10 % | 74 |
| Imágenes | 5 % | 88 |

El sitio está limpio por dentro. Lo que limita las impresiones está afuera: no hay forma de confirmar la indexación y el dominio no tiene ningún enlace ni mención externa conocida.

### Los cinco hallazgos principales

1. **Indexación sin medir.** Sin Search Console no se sabe cuántas de las 49 URLs están en el índice de Google.
2. **Autoridad en cero.** El dominio no aparece en Common Crawl (versión de enero a marzo de 2026) y el único perfil enlazado en el schema es Instagram.
3. **La portada pinta lento en móvil.** LCP de 4,4 s en laboratorio. El título principal entra con una animación desde opacidad cero y espera tres hojas de estilo.
4. **Señales de confianza débiles.** No hay página "Quiénes somos" ni de contacto, la firma es colectiva y el email de contacto es de Gmail.
5. **Recursos estáticos con caché corta.** CSS con hash, fuentes e imágenes se sirven con una hora en el origen y cuatro horas vía Cloudflare.

### Los cinco arreglos rápidos

1. Enviar el sitemap en Search Console e inspeccionar las URLs de Black Friday y CapCut.
2. Incrustar el CSS en el HTML (`build.inlineStylesheets: "always"` en Astro) y quitar la opacidad cero de la animación del título.
3. Servir los recursos con hash y las fuentes con `max-age=31536000, immutable`.
4. Generar posters de 360 px de ancho para los videos de la portada (unos 170 KB menos).
5. Redirigir `/index.html` a `/`.

## SEO técnico: 90

**Lo que funciona**

- Las 49 URLs responden 200, con canónica propia, `lang` correcto y viewport.
- HTTP redirige a HTTPS y `www` al dominio sin `www`, las dos con 301. Las rutas sin barra final redirigen con 301.
- Una URL inexistente devuelve 404 real.
- 73 destinos de enlaces internos comprobados, ninguno roto. Ninguna URL del sitemap tiene menos de dos páginas que la enlacen.
- `robots.txt` permite todo y declara el sitemap. El sitemap tiene 49 URLs y 34 `lastmod`, uno por artículo.
- Hreflang recíproco entre español e inglés en las 14 páginas que tienen versión en inglés, con `x-default`.
- HTML servido completo sin JavaScript, con gzip.
- Cabeceras: HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy` y `Permissions-Policy`.

**Hallazgos**

| Severidad | Hallazgo | Evidencia |
| --- | --- | --- |
| Media | Caché corta en recursos estáticos | `server/app.mjs` envía `max-age=3600` para todo lo que no es HTML; Cloudflare lo sube a 14.400 s. Lighthouse estima 277 KiB reutilizables en la portada. |
| Media | Cloudflare pisa la caché del HTML en el navegador | El origen envía `max-age=0`; en producción llega `max-age=14400`. Quien vuelve dentro de cuatro horas ve la versión anterior. |
| Baja | `/index.html` responde 200 | Duplica `/`. La canónica lo resuelve, pero un 301 es más limpio. |
| Baja | Sin `Content-Security-Policy` | No afecta el posicionamiento. |
| Baja | Enlaces con `?rubro=` | Las ocho páginas por público enlazan a `/?rubro=…`. La canónica apunta a `/`. |
| Info | Caché de HTML en el borde de 10 minutos | Con caché, el documento llega en 60 ms; sin caché, en unos 630 ms. |

## Calidad de contenido: 64

**Lo que mejoró desde el 9 de noviembre**

- Ninguna página tiene menos de 300 palabras. Los artículos van de 774 a 2.002 palabras contando la plantilla, con mediana de 1.178.
- Títulos y descripciones únicos en las 49 URLs.
- Cuatro artículos muestran videos propios de antes y después, con duraciones medidas.
- Las fuentes están citadas dentro del texto y las comparativas declaran que Hooksage es parte interesada.

**Hallazgos**

| Severidad | Hallazgo | Evidencia |
| --- | --- | --- |
| Alta | Sin página de equipo ni de contacto | "Quiénes somos" es una sección de la portada. La firma de los 34 artículos enlaza a un ancla. |
| Media | Email de contacto en Gmail | `hooksage.app@gmail.com` figura en la portada y en el schema de la organización. |
| Media | 34 artículos publicados en dos días | 23 el 8 de noviembre y 11 el 9. En un dominio nuevo, ese ritmo se parece a contenido en serie. |
| Media | Sin investigación propia | La prueba de cinco editores sigue como borrador. Es la única pieza que daría un dato que nadie más tiene. |
| Baja | Precios leídos con herramienta automática | Artículos de CapCut y de alternativas. Falta la revisión manual. |

## SEO on-page: 90

**Lo que funciona**

- Ningún título supera los 60 caracteres y ninguna descripción los 160.
- Un solo H1 por página.
- Migas de pan en todas las páginas interiores.
- El blog enlaza a las cuatro páginas por público y estas, al blog.

**Hallazgos**

| Severidad | Hallazgo | Evidencia |
| --- | --- | --- |
| Media | Las categorías no tienen página propia | Son encabezados del índice. Con 10 artículos, "Ideas por industria" podría ser una página que apunte a "ideas de reels por rubro". |
| Baja | La portada no enlaza a ningún artículo | Solo al índice del blog, desde el menú y el pie. |
| Baja | Descripciones cortas en las páginas de privacidad | 108 y 109 caracteres. |

## Schema: 82

**Lo que funciona**

- Un grafo JSON-LD válido en las 49 páginas: `Organization`, `WebSite`, `WebPage`, `BreadcrumbList`, `SoftwareApplication`, y `BlogPosting` en los 34 artículos.
- `BlogPosting` lleva título, descripción, fechas, imagen, sección, cantidad de palabras, autor y editor.
- No hay valoraciones ni reseñas inventadas.

**Hallazgos**

| Severidad | Hallazgo | Evidencia |
| --- | --- | --- |
| Baja | `WebPage.about` apunta al software en todos los artículos | Un artículo sobre abogados no trata sobre Hooksage. |
| Baja | Una sola proporción de imagen en `BlogPosting` | Solo 16:9. Google sugiere sumar 4:3 y 1:1. |
| Baja | `sameAs` con un solo perfil | Solo Instagram. |
| Info | `FAQPage` en la portada y en las páginas por público | Google retiró los resultados enriquecidos de preguntas frecuentes en mayo de 2026. No hace falta quitarlo. |
| Info | `SoftwareApplication` sin valoraciones | No genera resultado enriquecido. Correcto mientras no haya reseñas reales. |

## Rendimiento: 72

Lighthouse móvil, una corrida por página, sin datos de campo.

| Página | Rendimiento | LCP | CLS | TBT | Peso |
| --- | --- | --- | --- | --- | --- |
| Portada | 72 | 4,4 s | 0 | 0 ms | 438 KiB |
| Artículo de Black Friday | 77 | 4,0 s | 0 | 0 ms | 163 KiB |
| Artículo de hooks | 98 | 2,1 s | 0 | 0 ms | 192 KiB |

Los dos artículos usan la misma plantilla y difieren 21 puntos: la medición de laboratorio varía mucho entre corridas. Accesibilidad, buenas prácticas y SEO dieron 100 en las tres.

**Hallazgos**

| Severidad | Hallazgo | Evidencia |
| --- | --- | --- |
| Alta | LCP de la portada en 4,4 s | El elemento LCP es un `<span>` del título. Entra con la animación `story-rise`, que arranca en opacidad cero, y espera tres hojas de estilo. |
| Media | CSS que bloquea el render en los artículos | Dos hojas (17 KiB). Lighthouse estimó entre 150 ms y 1,6 s según la corrida. |
| Media | Posters de video más grandes de lo necesario | 720 × 1280 para mostrarse a unos 180 px de ancho. 172 KiB de más en la portada. |
| Baja | JavaScript heredado | 10 KiB. |

## Preparación para búsqueda con IA: 74

**Lo que funciona**

- GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, CCBot, Googlebot y Bingbot reciben 200.
- `robots.txt` declara `Content-Signal: search=yes, ai-input=yes, ai-train=yes`.
- `llms.txt` existe y lista los 34 artículos.
- Cada artículo abre con una respuesta corta, y usa tablas y preguntas frecuentes.

**Hallazgos**

| Severidad | Hallazgo | Evidencia |
| --- | --- | --- |
| Alta | Sin menciones fuera del sitio | El dominio no está en Common Crawl. No hay canal de YouTube, ficha en directorios ni presencia en comunidades. |
| Info | Sin versión Markdown ni `llms-full.txt` | Opcionales. Ningún agente de consumo está confirmado como consumidor. |
| Info | El formulario no declara herramientas WebMCP | Opcional. |

## Imágenes: 88

- 297 imágenes en las 49 páginas: todas con `alt` y con ancho y alto declarados, 153 con carga diferida.
- Portadas en WebP de 1200 × 675.
- Hallazgo, bajo: 10 de las 11 portadas nuevas tienen como texto alternativo el título del artículo.
- Hallazgo, medio: los posters de video, ya contados en rendimiento.

## Experiencia de búsqueda

El tipo de página coincide con lo que muestra el buscador en las consultas revisadas el 9 de noviembre: listas para "ideas de reels", tabla para precios, plantilla para zona segura. Hay una brecha: en "generador de hooks" y "comprobador de zona segura" los resultados son herramientas, y Hooksage ofrece listas y una plantilla.

## Lo que esta auditoría no pudo medir

- Indexación, impresiones y clics: requieren Search Console.
- Core Web Vitals reales: el sitio no tiene datos de campo todavía.
- PageSpeed Insights: la API devolvió límite de cuota sin clave.
- Enlaces entrantes más allá de Common Crawl: no hay claves de Moz ni de Bing configuradas.
- Capturas automáticas: la revisión visual se hizo a mano el 9 de noviembre, en escritorio y a 375 px.
