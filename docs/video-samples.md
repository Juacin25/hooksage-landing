# Muestras en video

Los siete archivos fueron aportados por el usuario para publicarlos en la landing. Cada par conserva el material original y su versión editada:

| Original recibido | Uso | Archivo publicado |
| --- | --- | --- |
| WhatsApp Video 2026-10-17 at 15.05.34.mp4 | Antes, sin subtítulos | talking-head-original.mp4 |
| WhatsApp Video 2026-10-17 at 19.56.26.mp4 | Después, con edición y subtítulos | talking-head-edited.mp4 |
| WhatsApp Video 2026-10-17 at 17.28.19.mp4 | Ejemplo promocional | promo.mp4 |
| IMG_4278.MOV | Segundo antes, pitch de Drivo | drivo-original.mp4 |
| WhatsApp Video 2026-10-18 at 00.35.07.mp4 | Segundo después, pitch editado | drivo-edited.mp4 |
| WhatsApp Video 2026-10-18 at 01.52.57.mp4 | Tercer antes, anuncio a cámara sin textos | founder-ad-original.mp4 |
| WhatsApp Video 2026-10-18 at 01.52.52.mp4 | Tercer después, anuncio con textos y animaciones | founder-ad-edited.mp4 |

Las copias web están en `public/videos/`. Conservan el audio y la duración de cada muestra: aproximadamente 8,4 s, 5,8 s y 15 s. No se alargaron los clips de la comparación para que coincidan con la duración anunciada del producto.

El segundo par dura aproximadamente 13,6 s y 11,1 s. El crudo de iPhone estaba en HEVC de 10 bits y HLG/HDR, con orientación vertical indicada por una matriz de rotación. Se normalizó a video vertical H.264 SDR BT.709 con tone mapping Hable para reproducirlo en navegadores sin soporte de HDR, sin incorporar ubicación, sensores u otros streams de metadatos del MOV.

El tercer par muestra el anuncio a cámara: 10,6 s de material sin textos y 9,7 s de versión editada con textos y animaciones. El crudo conserva 576×1024 píxeles; la copia editada se reduce de 1080×1920 a 720×1280. Ambos usan AAC de 96 kbps, posters propios y el editado incluye una pista inglesa que traduce sus textos.

Codificación: H.264, píxeles yuv420p, 30 fps, audio AAC y metadatos MP4 al principio del archivo (`faststart`). Se retiraron los metadatos de los originales. Los crudos conservan hasta su resolución original y las copias web no superan 720×1280. Los originales completos no se incorporan al repositorio. Los posters son fotogramas de cada video convertidos a WebP.

Las etiquetas y descripciones están en español e inglés; los propios videos conservan su español original. Cada editado tiene una pista WebVTT en inglés, seleccionable desde los controles del reproductor. No hay reproducción automática y los MP4 usan `preload=none`. El carrusel cambia de par mediante flechas, anuncia el ejemplo seleccionado y admite teclado. Al cambiar se pausan todos los videos. Sin JavaScript se muestran los tres pares y se ocultan las flechas; los controles HTML siguen funcionando.

La comparación está dentro del hero, antes de las fotografías ilustrativas de las secciones inferiores. El botón secundario lleva a `#ver-edicion`; cada versión mantiene su propio selector ES/EN y su enlace al formulario.


## Revisión local del 20 de octubre de 2026

La comparación ocupa dos columnas en escritorio y un reproductor por vez en móvil, con botones Antes/Después. Las flechas siguen recorriendo los tres pares. La diferencia de duración, los subtítulos, el reencuadre y los textos se señalan según lo que se observa en cada muestra; no se atribuye la reducción completa a silencios ni a una selección de mejores momentos que los archivos por sí solos no prueban.

El anuncio de 15 segundos está en un bloque desplegable identificado como pieza de la marca, separado de los pares. No se presenta como otra comparación ni se inventa un material de partida. Los MP4 y posters se conservan.
