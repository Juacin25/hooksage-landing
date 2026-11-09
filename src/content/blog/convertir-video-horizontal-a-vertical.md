---
title: "Cómo convertir un video horizontal a vertical sin perder calidad"
seoTitle: "Convertir un video horizontal a vertical"
description: "Tres formas de pasar un video 16:9 a 9:16 para Reels, TikTok y Shorts: recorte siguiendo al sujeto, fondo desenfocado y pantalla dividida."
shortAnswer: "Para pasar un video horizontal (16:9) a vertical (9:16) hay tres opciones: recortar siguiendo al sujeto, poner el video horizontal sobre un fondo desenfocado o dividir la pantalla. El recorte da el mejor resultado en redes, pero solo conserva un tercio del ancho original, así que funciona mejor si grabaste en 4K o con el sujeto centrado."
category: "Guías de edición"
publishDate: 2026-11-08
updatedDate: 2026-11-08
order: 8
coverAlt: "Un cuadro horizontal con un recorte vertical marcado sobre la persona que habla"
faqs:
  - question: "¿Se pierde calidad al pasar un video de horizontal a vertical?"
    answer: "Sí, si recortas. De un video de 1920 × 1080 queda una franja de unos 608 × 1080 píxeles, que luego se amplía a 1080 × 1920. Si grabaste en 4K, el recorte conserva resolución suficiente para 1080 × 1920."
  - question: "¿Puedo convertir un video a vertical gratis?"
    answer: "Sí. CapCut permite cambiar la proporción del proyecto a 9:16 y reencuadrar cada toma. Con la herramienta gratuita FFmpeg puedes hacerlo desde la terminal."
  - question: "¿Qué hago si en el video hay dos personas hablando?"
    answer: "Usa pantalla dividida (una persona arriba y otra abajo) o cambia el encuadre según quién habla en cada momento."
sources:
  - title: "FFmpeg: documentación de filtros (crop, scale, boxblur, overlay)"
    url: "https://ffmpeg.org/ffmpeg-filters.html"
  - title: "YouTube Ayuda: Información sobre los Shorts de YouTube de tres minutos"
    url: "https://support.google.com/youtube/answer/15424877?hl=es-419"
  - title: "Hopper HQ: Instagram Reel Size in 2026"
    url: "https://www.hopperhq.com/blog/instagram-reel-size/"
---

Mucho material de empresa está grabado en horizontal: entrevistas, webinars, eventos, videos institucionales. Para usarlo en Reels, TikTok o Shorts hay que pasarlo a 9:16. Subirlo tal cual, con barras negras arriba y abajo, desperdicia dos tercios de la pantalla del celular.

## Opción 1: recortar siguiendo al sujeto

Es la opción que mejor funciona en redes, porque el video ocupa toda la pantalla. Consiste en quedarte con una franja vertical del cuadro original y moverla para que la persona o el producto queden siempre adentro.

**El costo en calidad:** de un video de 1920 × 1080 queda una franja de unos 608 × 1080 píxeles. Al ampliarla a 1080 × 1920 se nota algo de pérdida de nitidez, sobre todo en textos. Si grabaste en 4K (3840 × 2160), la franja recortada mide unos 1215 × 2160 y alcanza de sobra.

**Cómo hacerlo en CapCut:** cambia la proporción del proyecto a 9:16, agranda el clip hasta que llene la pantalla y ajusta la posición en cada toma. Si la persona se mueve, divide el clip y vuelve a centrar.

## Opción 2: fondo desenfocado

Pones el video horizontal completo en el centro y, detrás, una copia ampliada y desenfocada que llena la pantalla. Conserva toda la imagen original, pero el contenido queda chico.

Conviene para material donde importa ver todo el cuadro, como una demostración en pantalla o una toma grupal.

## Opción 3: pantalla dividida

Divides la pantalla vertical en dos: arriba una toma y abajo otra. Funciona para entrevistas (una persona en cada mitad) o para mostrar a alguien hablando arriba y el producto abajo.

## Comparación

|                         | Recorte              | Fondo desenfocado    | Pantalla dividida |
| ----------------------- | -------------------- | -------------------- | ----------------- |
| Ocupa toda la pantalla  | Sí                   | Sí, con imagen chica | Sí                |
| Conserva todo el cuadro | No                   | Sí                   | Parcial           |
| Calidad desde 1080p     | Media                | Alta                 | Media             |
| Ideal para              | Una persona a cámara | Pantallas y grupos   | Entrevistas       |

## Hacerlo con FFmpeg

Si tienes muchos videos, FFmpeg (gratis) permite automatizarlo desde la terminal.

Recorte centrado a 9:16 y escalado a 1080 × 1920:

```
ffmpeg -i entrada.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920" -c:a copy salida.mp4
```

Fondo desenfocado con el video completo en el centro:

```
ffmpeg -i entrada.mp4 -filter_complex "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20[bg];[0:v]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2" -c:a copy salida.mp4
```

El recorte centrado no sigue al sujeto: si la persona se mueve a un costado, queda fuera. Para eso hace falta ajustar a mano o usar una herramienta que detecte caras.

## Para la próxima grabación

Si sabes que el video va a terminar en vertical, grábalo en vertical. Si necesitas las dos versiones, graba en horizontal con el sujeto centrado y deja aire arriba de la cabeza: así el recorte vertical funciona sin mover nada. Más consejos en la guía para [grabar videos con el celular para tu negocio](/blog/como-grabar-videos-con-celular-para-negocio/).
