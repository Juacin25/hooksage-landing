# Kit de menciones externas

10 de noviembre de 2026. La auditoría SEO encontró que hooksage.com no figura en Common Crawl y que el único perfil público enlazado es Instagram. Este kit reúne los textos para crear perfiles y fichas sin redactar cada uno de cero, y el orden en que conviene hacerlo. Nada de esto se publica solo: cada alta la hace una persona del equipo con su cuenta.

Regla para todo lo que sigue: el mismo nombre, la misma descripción y el mismo enlace en todos lados. Si un sitio pide algo que no está acá (clientes, métricas, valoraciones), no se inventa.

## Datos fijos

| Campo | Valor |
| --- | --- |
| Nombre | Hooksage |
| Razón social | CANARY CODE SAS |
| Ciudad | Montevideo, Uruguay |
| Sitio | https://hooksage.com/ |
| Sitio en inglés | https://hooksage.com/en/ |
| Quiénes somos | https://hooksage.com/quienes-somos/ |
| Logo | https://hooksage.com/logos/hooksage-logo-512.png |
| Contacto | hooksage.app@gmail.com (reemplazar por un email del dominio cuando exista) |
| Categoría | Editor de video con IA / AI video editor |
| Precio | Primera edición gratis. Packs desde US$5,99 por 10 videos y planes desde US$14,99 al mes; los pagos todavía no están habilitados |

## Descripciones

**Una línea (hasta 60 caracteres)**

- ES: Editor de video con IA para Reels, TikTok y Shorts
- EN: AI video editor for Reels, TikTok and Shorts

**Corta (hasta 160 caracteres)**

- ES: Hooksage es un editor de video con IA que convierte grabaciones en videos verticales para Reels, TikTok y Shorts, con cortes, encuadre y subtítulos.
- EN: Hooksage is an AI video editor that turns raw recordings into vertical videos for Reels, TikTok and Shorts, with cuts, reframing and captions.

**Larga (hasta 500 caracteres)**

- ES: Hooksage es un editor de video con IA para equipos chicos que graban mucho y editan poco. Subes una grabación, o partes de un guion con voz en off, y recibes un video vertical con cortes, encuadre y subtítulos para Reels, TikTok y YouTube Shorts. Con el perfil de tu marca, propone hooks, guiones y listas de tomas. Nació en la hackatón Build 101 y lo hace CANARY CODE SAS, en Montevideo. La primera edición es gratis.
- EN: Hooksage is an AI video editor for small teams that record a lot and edit little. Upload a recording, or start from a voiceover script, and get a vertical video with cuts, reframing and captions for Reels, TikTok and YouTube Shorts. With your brand profile, it suggests hooks, scripts and shot lists. It started at the Build 101 hackathon and is made by CANARY CODE SAS in Montevideo, Uruguay. Your first edit is free.

**Límites que hay que decir si el sitio pregunta:** exporta MP4 de 720 × 1280 a 30 fps; no hace efectos, transiciones ni animación avanzada.

## Orden sugerido

### Semana 1: perfiles propios

Son los que más controlas y los que después se cargan en el schema del sitio (`sameAs` en `src/data/business.ts`).

1. **Instagram.** En la biografía, la descripción de una línea y el enlace a https://hooksage.com/blog/ o a la portada. Fijar un post con un antes y después.
2. **YouTube.** Crear el canal "Hooksage" y subir los tres pares de la portada como Shorts. Textos abajo.
3. **LinkedIn.** Página de empresa con la descripción larga, la ciudad y el sitio. Los fundadores pueden poner Hooksage como experiencia, con el enlace a la página de empresa.

Cuando estén creados, pasar las URLs para agregarlas a `sameAs` y a la tabla de datos de https://hooksage.com/quienes-somos/.

### Semanas 1 y 2: fichas en directorios

Cada sitio tiene su formulario de alta. Usar las descripciones de arriba sin cambios.

| Sitio | Por qué | Qué cuidar |
| --- | --- | --- |
| Product Hunt (producthunt.com) | Lanzamiento con fecha; queda una página permanente del producto | Elegir un martes, miércoles o jueves; preparar las imágenes de los tres pares antes |
| AlternativeTo (alternativeto.net) | Se puede listar como alternativa a CapCut, OpusClip y Submagic | Marcar solo las plataformas que existen hoy |
| SaaSHub (saashub.com) | Ficha de software con alternativas | Igual que AlternativeTo |
| There's An AI For That (theresanaiforthat.com) | Directorio de herramientas de IA | Algunos directorios cobran por el alta; no pagar sin decidirlo antes |
| Futurepedia (futurepedia.io) | Directorio de herramientas de IA | Igual que el anterior |

### Semanas 2 a 4: menciones de terceros

1. **Build 101.** Pedir a la organización que liste Hooksage entre los proyectos de la hackatón. Borrador abajo.
2. **Comunidades.** Responder preguntas reales sobre edición de video corto en español (Reddit, grupos de emprendedores, foros de marketing) con el artículo del blog que la responde. Un enlace por respuesta, solo cuando responde la pregunta, y diciendo que es nuestro.
3. **Artículos de terceros.** Varias comparativas en español de "alternativas a CapCut" se actualizan cada año. Escribir a quien las mantiene con la descripción corta y el enlace a la portada, sin pedir un lugar en la lista.

## Textos para YouTube

**Nombre del canal:** Hooksage

**Descripción del canal:** usar la descripción larga en español y agregar al final:

> Guías de video corto para negocios: https://hooksage.com/blog/

**Short 1: pitch de Drivo**

- Título: Antes y después: un pitch de 13 segundos editado con IA
- Descripción: El pitch de Drivo, una plataforma de subastas de autos, antes y después de editarlo con Hooksage: de 13,6 a 11,1 segundos, con subtítulos. Cómo editar un video vertical paso a paso: https://hooksage.com/blog/como-editar-videos-verticales-celular/

**Short 2: video a cámara**

- Título: El mismo video, sin subtítulos y con subtítulos
- Descripción: Un anuncio grabado a cámara, antes y después de editarlo con Hooksage: reencuadre y subtítulos. Cómo poner subtítulos automáticos: https://hooksage.com/blog/subtitulos-automaticos-videos/

**Short 3: anuncio con texto en pantalla**

- Título: Un hook en texto desde el primer segundo
- Descripción: Un anuncio de Hooksage antes y después de editarlo: el hook se lee en pantalla desde el inicio. 100 hooks para reels y TikTok: https://hooksage.com/blog/hooks-para-videos-de-negocio/

Publicar cada par como un solo Short con las dos versiones una después de otra, o como dos Shorts seguidos. Antes de subir el pitch de Drivo, confirmar que Drivo está de acuerdo con que se publique fuera de hooksage.com.

## Borrador para Build 101

Es un borrador: revisar, completar el nombre del destinatario y enviarlo desde la cuenta del equipo.

> **Asunto:** Hooksage, proyecto de Build 101, ya está en línea
>
> Hola [nombre]:
>
> Somos el equipo de Hooksage. Arrancamos el proyecto en Build 101 y hoy está en línea en https://hooksage.com/: es un editor de video con IA que convierte grabaciones en videos verticales para Reels, TikTok y Shorts, con cortes, encuadre y subtítulos.
>
> Si tienen una página o una publicación con los proyectos que salieron de la hackatón, nos gustaría aparecer. Les dejamos una descripción corta y el logo:
>
> Hooksage es un editor de video con IA que convierte grabaciones en videos verticales para Reels, TikTok y Shorts, con cortes, encuadre y subtítulos.
>
> Logo: https://hooksage.com/logos/hooksage-logo-512.png
>
> Gracias,
> Equipo de Hooksage

## Cómo saber si funcionó

- **Search Console → Enlaces → Sitios principales que enlazan:** el objetivo de las primeras cuatro semanas es pasar de cero a cinco dominios.
- **Búsqueda de marca:** buscar `"hooksage"` en Google cada semana y anotar cuántos resultados son de otros sitios.
- **Fecha de corte:** si al 8 de diciembre de 2026 Search Console no muestra ningún dominio enlazando, revisar qué altas quedaron pendientes de aprobación.
