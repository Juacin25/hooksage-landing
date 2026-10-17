# Hooksage

Hooksage ayuda a los restaurantes a hacer videos cortos que traen clientes. Este documento es la guía de marca: cómo nos vemos, cómo hablamos y cómo se construyen la landing, el deck y el producto. Todo lo que diseñemos sale de acá.

## Esencia

**Qué hacemos.** Vemos qué está funcionando en negocios como el tuyo, te decimos qué grabar y convertimos lo que grabaste con tu celular en un video vertical de 15 segundos listo para TikTok, Reels o Shorts.

**Para quién.** Dueños de taquerías, hamburgueserías, heladerías, sushi y fondas que atienden su negocio y además hacen "el marketing" desde el celular. Empezamos en la Ciudad de México.

**One-liner.** Graba con tu celular. Nosotros lo convertimos en clientes.

**Blurb.** Hooksage ayuda a los restaurantes a hacer videos cortos que traen clientes. Vemos qué está funcionando en negocios como el tuyo, te decimos qué grabar y convertimos lo que grabaste en un video de 15 segundos listo para publicar. Sin saber editar y sin adivinar: eliges un tono, subes tu video y listo.

## Valores

1. **Clientes, no likes.** Medimos el éxito en gente que entra al local, no en vistas. Un video viral que no trae a nadie no funcionó.
2. **Menos opciones, mejores videos.** El dueño de una taquería no necesita cien botones. Nosotros tomamos las decisiones para que él no tenga que hacerlo.
3. **Aprendemos de todo el mapa.** Lo que funciona en una colonia o en otra ciudad puede funcionar en la tuya. Llevamos esas tendencias a cada negocio.
4. **Tu negocio, tu material.** No inventamos contenido falso. Lugares reales, gente real, grabado con el celular y mejorado.
5. **Hablamos claro.** Sin tecnicismos ni promesas infladas. Hablamos como un vecino que sabe de marketing, no como una agencia.

## Voz y tono

Hablamos en español de México, de tú, con frases cortas. Sonamos como alguien que conoce el negocio: práctico, cálido y directo.

| Sí | No |
| --- | --- |
| "Sube tu video y en minutos lo tienes listo." | "Potencia tu presencia digital con IA de última generación." |
| "Esto está funcionando en taquerías de la Roma." | "Contenido viral garantizado." |
| "Tu primer video es gratis." | "¡¡Aprovecha esta oferta increíble!!" |
| "No necesitas saber editar." | "Solución end-to-end para creators." |

- Verbos al principio en botones: "Crear video", "Subir video", "Ver ejemplos".
- Cifras exactas y con fuente cuando las usamos ("10.295 taquerías en CDMX, INEGI 2024"). Nunca inventamos números.
- Sin emojis en la interfaz ni en la landing. En redes sociales, con moderación.
- Palabras que evitamos: "potenciar", "revolucionar", "disruptivo", "solución integral", "creators".

## Logo

El símbolo es una **hoja con un botón de play** y un **punto coral**:

- La hoja es la salvia (*sage*): lo natural, lo auténtico y el criterio de saber qué grabar.
- El play es el video.
- El punto coral es el *hook*: el momento que engancha y hace que alguien quiera ir.

Versiones (en Assets → Logos):

- `hooksage-lockup.svg`: símbolo + nombre sobre fondos claros. Es la versión principal.
- `hooksage-lockup-dark.svg`: para fondos oscuros (`ink` o `surface` en tema oscuro).
- `hooksage-mark.svg`: solo el símbolo, cuando el nombre ya aparece cerca o el espacio es chico.
- `hooksage-wordmark.svg`: solo el nombre, para pies de página y créditos.
- `hooksage-app-icon.svg`: ícono de app y foto de perfil en redes, sobre fondo `ink`.

Reglas:

- **Área de respeto:** alrededor del logo, dejar libre al menos la altura del punto coral × 3.
- **Tamaño mínimo:** símbolo de 24px; lockup de 120px de ancho.
- **El nombre va siempre en minúsculas:** "hooksage" en el logo. En texto corrido se escribe "Hooksage".
- **No hacer:** cambiar los colores del símbolo, rotar la hoja, quitar el punto coral, poner el logo sobre fotos sin una placa de `surface` o `ink` detrás, ni estirarlo.

## Color

La paleta se llama **Aguacate y coral**. Verde para la marca y la confianza; coral para lo que pide acción.

**Proporción 60 / 30 / 10:**

- **60% superficies:** `surface`, `surface-raised` y `surface-sunken`, en verdes casi blancos que se sienten frescos.
- **30% verde:** `brand` en bloques e íconos, `primary` en botones y links.
- **10% coral:** `accent` solo donde queremos que alguien actúe o note algo nuevo (el punto del logo, una oferta, el badge de "nuevo").

Reglas de uso:

- **Botón principal:** fondo `primary`, texto `on-primary`. Uno por vista.
- **Coral como fondo:** siempre con `on-accent` (tinta oscura) encima. **Nunca texto coral sobre blanco;** para texto chico coral usamos `accent-text`.
- **`brand`:** solo para formas y texto de 24px o más. Para texto chico verde usamos `primary`.
- **Fondos oscuros:** usar el tema oscuro (`surface` oscuro). No pintar secciones enteras de verde: el verde es acento, no fondo.
- **Contraste:** todo texto cumple 4.5:1 sobre su fondo en ambos temas (3:1 a partir de 24px). Cada token dice en qué fondo va.

## Tipografía

- **Bricolage Grotesque** (600–800) para titulares y cifras. Tiene personalidad y calidez sin perder claridad. Usamos tracking negativo en tamaños grandes.
- **DM Sans** (400–600) para texto, botones y la interfaz.

Escala en Typography. Reglas:

- Un solo `display-xl` por vista.
- Titulares en tipo oración, nunca en mayúsculas. La única excepción es `overline`, el antetítulo corto en mayúsculas.
- Largo de línea entre 45 y 75 caracteres para `body`.

## Espaciado y forma

- **Escala de 4px:** `space-1` a `space-20`. Las secciones de la landing llevan `space-20` arriba y abajo; las tarjetas, `space-6` de padding.
- **Esquinas redondeadas y amables:** `radius-md` en botones y tarjetas chicas, `radius-lg` en tarjetas grandes y marcos de video, `radius-pill` en botones de la landing y pills de tono.
- **Sistema plano:** separamos con bordes (`border`) y superficies, no con sombras. La única sombra, `shadow-lift`, es para el video destacado del hero.

## Iconografía

Usamos íconos de trazo (outline) de [Tabler Icons](https://tabler.io/icons), con trazo de 2px y esquinas redondeadas, igual que la hoja del logo.

- Tamaños: 20px junto a texto y 24px solos.
- Color: `ink` o `primary`; `accent` solo para un ícono que pide acción.
- Nunca íconos rellenos ni emojis.

## Imágenes y video

- **Material real:** comida de verdad, locales de verdad, dueños de verdad. Nada de stock genérico ni personas generadas.
- **Formato:** video siempre en vertical 9:16, dentro del componente VideoCard con `radius-lg`.
- **Fotos:** luz cálida y planos cerrados de la comida. El vapor, el queso derritiéndose y la salsa son nuestro mejor hook.

## Componentes

Los componentes son clases CSS en `components/bundle.css`, que funcionan en la landing, el deck y el producto. Cada uno tiene su guía en Components:

- **Button:** principal, secundario y acento.
- **Badge:** etiquetas cortas de estado o categoría.
- **FeatureCard:** un beneficio o paso, con ícono, título y texto.
- **VideoCard:** marco vertical 9:16 para mostrar un video con su tono.
- **StatCard:** una cifra grande con su fuente, para el deck y la landing.
- **PriceCard:** el plan con precio y lo que incluye.

## Cómo usar este sistema

Carga `tokens.css` y `components/bundle.css`, y las fuentes de `fonts/`. Usa siempre los tokens por nombre (`var(--primary)`), nunca el hex directo, para que el tema oscuro funcione solo.
