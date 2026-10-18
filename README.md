# Hooksage

Landing en español e inglés para startups, pymes, marcas personales y equipos de marketing. Hooksage convierte material sin editar en videos cortos con cortes, zooms y subtítulos. Astro genera diez páginas estáticas; un servidor Node guarda los formularios en SQLite. Se conservan las galerías, fotos de referencia, selector de tonos y diseño del kit de marca.

Los planes tienen facturación mensual en dólares: **Founder US$14,97 / 15 videos por semana**, **Pyme US$29,99 / 40 videos por semana** y **Marca Personal US$49,99 / 80 videos por semana**. El contacto público es **hooksage.app@gmail.com**.

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

`POST /api/waitlist` recibe empresa o marca, tipo de equipo, nombre del contacto, correo, país (Uruguay, Argentina, Estados Unidos o Reino Unido), ciudad y WhatsApp opcional con código internacional. Guarda también el idioma elegido (`es` o `en`), la ruta de entrada, cinco UTMs permitidas, fecha UTC y versión del aviso de uso de datos. Conserva compatibilidad con los registros históricos de México.

## Idiomas

La portada en español está en `/` y la inglesa en `/en/`. El selector ES/EN enlaza las versiones equivalentes de las cinco páginas; funciona sin JavaScript. Con JavaScript conserva la query de campaña y el ancla actual. No hay redirecciones automáticas por IP ni por idioma del navegador.

Los componentes comparten estructura y estilos. Las traducciones están en `src/data/english.json` y `src/data/content.en.ts`; las rutas se resuelven en `src/lib/i18n.ts`. Cada página incluye canonical, hreflang recíproco, metadatos, FAQ y confirmaciones en su idioma. El formulario nativo y el envío con JavaScript guardan el mismo contrato; cambiar de idioma no duplica una inscripción. Los precios siguen en dólares por mes y las cuotas en videos exportados por semana: 15, 40 y 80.

El servidor vuelve a validar los campos, usa consultas parametrizadas y confirma `201 {ok:true,created:true}` después de escribir en SQLite. Una combinación ya registrada de correo, empresa, ciudad y país devuelve `200 {ok:true,created:false}` sin sobrescribir el registro. La interfaz no cuenta ese reintento como una nueva conversión. Los errores mantienen los datos escritos para reintentar.

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

`PUBLIC_FORM_ENDPOINT` es opcional y público, y solo se utiliza en desarrollo. Las compilaciones de producción siempre envían a `/api/waitlist` en el mismo dominio, aunque un `.env` antiguo contenga otra URL. El formulario también permite el envío HTML nativo cuando JavaScript está desactivado o no puede iniciarse. Nunca pongas credenciales en variables `PUBLIC_*`.

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
