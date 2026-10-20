# Hooksage

Landing en español e inglés para startups, pymes, marcas personales y equipos de marketing. El piloto de Hooksage parte de ideas o grabaciones: perfil de marca, propuestas con hook, guion y tomas, y edición con voz, texto, movimiento y sonido. Astro genera diez páginas estáticas; un servidor Node guarda los formularios en SQLite. La landing conserva los ejemplos reales, las fotos identificadas como referencias y el diseño del kit de marca. Presenta los tres acabados Natural, Dinámico e Impacto.

Pricing de la versión local en revisión: **Founder US$14,99 / 5 videos por semana**, **Pyme US$34,99 / 15 videos por semana** y **Marca Personal US$59,99 / 40 videos por semana**, con cobro mensual. Packs de pago único: 5 videos por US$5,99, 15 por US$14,99 y 40 por US$34,99. Estos cambios esperan la evaluación del equipo antes de publicarse. El contacto público es **hooksage.app@gmail.com**.

La portada muestra tres comparaciones antes/después en un carrusel con flechas y un anuncio de la marca en un bloque desplegable separado. En móvil, Antes/Después cambia la versión mostrada; en escritorio se ven ambas juntas. Las copias optimizadas están en `public/videos/`; su procedencia y preparación se documentan en [docs/video-samples.md](docs/video-samples.md). Las fotos de las secciones inferiores siguen identificadas como referencias.

El producto está en desarrollo; esta web registra interés y no ejecuta el editor. La cobertura de funcionalidades y sus límites se documentan en [docs/landing-product-scope.md](docs/landing-product-scope.md). El MP4 actual del piloto es vertical, 720 × 1280 a 30 fps; la duración depende del montaje y la voz.

## Desarrollo local

Usa Node 24 LTS o superior.

```sh
npm ci
npm run build
npm run api:dev
```

En otra terminal:

```sh
npm run dev
```

La landing abre en `http://127.0.0.1:4321/`. Astro redirige `/api` al servidor local de `http://127.0.0.1:8787/`. SQLite se crea en `data/waitlist.sqlite`, fuera del directorio público y excluido de Git. Para servir la compilación con el backend en un solo proceso usa `npm start` y abre el puerto 8787.

## Formularios y datos

`POST /api/waitlist` recibe empresa o marca, tipo de equipo, nombre del contacto, correo, país (Uruguay, Argentina, Estados Unidos o Reino Unido), ciudad y WhatsApp opcional con código internacional. Guarda también el idioma elegido (`es` o `en`), la ruta de entrada, cinco UTMs permitidas, fecha UTC y versión del aviso de uso de datos. Conserva compatibilidad con los registros históricos de México. Admite además `footageUrl` (enlace HTTPS opcional, hasta 2048 caracteres) y `editingFeedback` (respuesta opcional, hasta 1000 caracteres). El receptor guarda el enlace sin descargar su contenido. El equipo coordina por email la primera edición gratis; el formulario no ejecuta el editor.

## Idiomas

La portada en español está en `/` y la inglesa en `/en/`. El selector ES/EN enlaza las versiones equivalentes de las cinco páginas; funciona sin JavaScript. Con JavaScript conserva la query de campaña y el ancla actual. No hay redirecciones automáticas por IP ni por idioma del navegador.

Los componentes comparten estructura y estilos. Las traducciones están en `src/data/english.json`, `src/data/content.en.ts` y `src/data/product.ts`; las rutas se resuelven en `src/lib/i18n.ts`. Cada página incluye canonical, hreflang recíproco, metadatos, FAQ y confirmaciones en su idioma. El formulario nativo y el envío con JavaScript guardan el mismo contrato; cambiar de idioma no duplica una inscripción. Los precios siguen en dólares por mes y las cuotas en videos exportados por semana: 5, 15 y 40 en la propuesta local.

El servidor vuelve a validar los campos, usa consultas parametrizadas y confirma `201 {ok:true,created:true}` después de escribir en SQLite. Una combinación ya registrada de correo, empresa, ciudad y país devuelve `200 {ok:true,created:false}` sin sobrescribir sus datos originales. Si el enlace al clip o la respuesta de edición estaban vacíos, puede completarlos una sola vez; un reintento no reemplaza valores ya guardados. El equipo recibe aviso al agregar esos datos, sin contarlo como otra conversión. La interfaz no cuenta ese reintento como una nueva conversión. Los errores mantienen los datos escritos para reintentar.

Los datos no se pueden listar, descargar ni modificar desde una API pública. El receptor acepta JSON y formularios HTML desde los orígenes configurados, limita intentos por dirección y rechaza un campo trampa. Esa protección básica no sustituye un servicio especializado contra bots si aparece abuso real.

## Configuración

| Variable del servidor | Uso                                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| `DATABASE_PATH`       | Archivo SQLite fuera de `dist/`; en Tenki debe estar dentro del volumen persistente.                       |
| `ALLOWED_ORIGINS`     | Orígenes exactos, separados por coma. Obligatorio en producción.                                           |
| `HOST`, `PORT`        | Por defecto `127.0.0.1:8787`; en producción se mantiene en loopback detrás de Cloudflare Tunnel.           |
| `TRUST_PROXY`         | `true` únicamente detrás de Cloudflare Tunnel con el preview deshabilitado, para limitar por IP reenviada. |
| `NODE_ENV`            | `production` en la instancia pública.                                                                      |

Hay una plantilla sin credenciales en `.server.env.example`. En Tenki, `hooksage.service` ejecuta el servidor con el archivo privado `.service.env`. La unidad reinicia el proceso si se detiene y se activa al arrancar la VM.

`PUBLIC_FORM_ENDPOINT` es opcional y público, y solo se utiliza en desarrollo. Las compilaciones de producción siempre envían a `/api/waitlist` en el mismo dominio, aunque un `.env` antiguo contenga otra URL. El formulario también permite el envío HTML nativo cuando JavaScript está desactivado o no puede iniciarse. `PUBLIC_ENABLE_ANALYTICS=false` desactiva Meta Pixel en la compilación local de revisión. Nunca pongas credenciales en variables `PUBLIC_*`.

## Consultar, exportar y respaldar

Estas operaciones se ejecutan desde una terminal autenticada, no desde el navegador:

```sh
npm run db:count
npm run db:export
npm run db:backup
```

Los comandos usan `DATABASE_PATH` o la base local por defecto. Exportación y copia consistente se guardan en `backups/`, también excluido de Git. El CSV conserva las UTMs y trata como texto las celdas que podrían interpretarse como fórmulas. No existe una programación automática de copias; el procedimiento de Tenki está en [DEPLOYMENT.md](DEPLOYMENT.md).

## Verificar

```sh
npm run check
npm run build
npm test
npm run test:api
```

La verificación de interfaz usa Happy DOM con solicitudes simuladas. La del backend realiza peticiones HTTP reales a un servidor temporal y comprueba SQLite, duplicados, persistencia, backup, entradas inválidas, límites y aislamiento de archivos. Sus bases temporales se eliminan al finalizar.

`npm run audit` genera informes Lighthouse y capturas en `artifacts/`, ignorado por Git. Las puntuaciones locales no prueban una mejora de conversión.

## Campañas

[SEO-FUNNEL.md](SEO-FUNNEL.md) contiene las hipótesis de anuncios y palabras clave para Instagram, Facebook y TikTok. La atribución se conserva treinta minutos durante la navegación. Los eventos no incluyen valores personales del formulario; `generate_lead` se emite solo al confirmar un registro nuevo. Meta Pixel mide PageView y Lead confirmado; los demás eventos quedan disponibles para integraciones. No se publican anuncios desde este repositorio.

## Estructura

- `src/components/`: landing, formulario y medición local.
- `src/data/`: plan, textos, rubros, fotografías y FAQ compartidas con JSON-LD.
- `src/styles/`: tokens originales y composición responsive.
- `server/`: endpoint HTTP, validación y SQLite.
- `scripts/database.mjs`: conteo, backup y exportación privada.
- `public/`: fuentes, logos, imágenes optimizadas y archivos SEO.
- `infra/`: runtime de Tenki y unidad systemd del servidor.

Las fotografías están identificadas como referencias, con créditos en [public/media/CREDITS.md](public/media/CREDITS.md). No representan clientes ni videos generados por Hooksage.

## Revisión local del feedback de Reddit

La versión completa se revisa en `http://127.0.0.1:8795/` y `/en/`. El backend usa `/private/tmp/hooksage-reddit-review/waitlist.sqlite` y tiene las notificaciones desactivadas. La versión fue aprobada y publicada el 20 de octubre de 2026 en https://hooksage.com y https://hooksage.com/en/. Ver [docs/local-reddit-review.md](docs/local-reddit-review.md).
