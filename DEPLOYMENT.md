# Despliegue en Tenki

La aplicación funciona con Node 24, sin instalar dependencias en el servidor: Astro se compila antes de subir y SQLite está incluido en Node. Se usa una sesión **sticky** de **1 vCPU, 512 MiB de RAM y disco raíz de 5 GiB**, con un **volumen persistente de 1 GiB** montado en `/data/hooksage`.

La base es `/data/hooksage/waitlist.sqlite`. El volumen sobrevive a la terminación de una sesión; debe volver a adjuntarse explícitamente a su reemplazo. No guardes la base en el disco raíz, en `/tmp`, dentro del paquete de despliegue ni en `dist/`.

Los dominios de producción son `https://hooksage.com` y `https://www.hooksage.com`. Cloudflare termina HTTPS y el túnel existente `hooksage` conecta ambos dominios con `http://localhost:8787` dentro de la misma sesión Tenki. La URL de preview de Tenki se conserva únicamente durante la verificación inicial y se deshabilita al completar el cambio de dominio.

## Costos

Tenki factura por el tiempo encendido, incluso con pocos formularios. Con las tarifas publicadas el 17 de octubre de 2026:

- CPU: `1 × US$0.000014/segundo`.
- Memoria: `0.5 × US$0.0000045/GiB/segundo`.
- Volumen persistente: aproximadamente `US$0.197/GiB` por 30 días.

La estimación para 30 días encendido es **US$42.32**, antes de impuestos, otros recursos o cambios de tarifa. Las copias y otros recursos pueden agregar consumo. Los créditos disponibles se descuentan de este uso. El saldo y las condiciones de la promoción se verifican en el panel; no se necesita activar recarga automática para operar con el saldo existente.

Fuentes: [precios](https://tenki.cloud/pricing), [oferta Build101](https://tenki.cloud/events/build101), [volúmenes](https://tenki.cloud/docs/sandbox/volumes), [sesiones](https://tenki.cloud/docs/sandbox/sessions). La oferta anunciada no sustituye el saldo realmente acreditado en el workspace.

## Actualizar la aplicación

Usa un CLI autenticado en el workspace correcto. Los IDs del despliegue no son credenciales; el token del CLI se conserva fuera del repositorio.

```sh
npm ci
npm run check
npm run build
npm test
npm run test:api
COPYFILE_DISABLE=1 tar --no-xattrs -czf /tmp/hooksage-release.tar.gz dist server scripts/database.mjs
tenki sandbox write --session <sesion> --path /home/tenki/hooksage-release.tar.gz --data-file /tmp/hooksage-release.tar.gz
```

Descomprime en `/home/tenki/hooksage`, verifica sus archivos y ejecuta `sudo systemctl restart hooksage.service` dentro de la instancia. Reutiliza el mismo `DATABASE_PATH`; no reemplaces ni borres el volumen al actualizar código. Comprueba `/healthz` y un envío ficticio antes de dirigir campañas al servicio.

La configuración privada de producción es `/home/tenki/hooksage/.service.env`. Usa `.server.env.example` como referencia y configura los orígenes indicados en la sección del túnel. No se incluye en el paquete ni en Git.

`infra/hooksage.service` es la unidad instalada: ejecuta Node como el usuario `tenki`, protege el sistema y permite escrituras solo en el volumen de datos. Comprueba `command -v node` al usar otra imagen y ajusta `ExecStart` si cambia la ruta de Node. Tras copiar la unidad a `/etc/systemd/system/hooksage.service`, ejecuta `sudo systemctl daemon-reload` y `sudo systemctl enable --now hooksage.service`. En nuevas sesiones, `infra/tenki-runtime.json` espera tanto `hooksage.service` como `cloudflared.service` y verifica el endpoint de salud de la aplicación. Ambas unidades y su configuración privada deben estar instaladas antes de que la sesión pueda quedar lista; el archivo de runtime no las provisiona. La sesión inicial se configuró con un arranque provisional y se pasó al servicio systemd sin crear otra VM.

## Cloudflare Tunnel y dominio propio

Se reutiliza el túnel `hooksage`, ID `d92fe260-8f37-46ff-bfce-7d34582f11d8`, sin modificar DNS, rutas ni certificados de Cloudflare. Las rutas de ambos dominios deben apuntar a `http://localhost:8787`. El ID identifica el túnel; no sirve como token de conexión.

### Binario y servicio

Dentro de la sesión existente, instala el binario oficial que corresponda a `uname -m`: `cloudflared-linux-amd64` para `x86_64` o `cloudflared-linux-arm64` para `aarch64`/`arm64`.

```sh
case "$(uname -m)" in
  x86_64) cloudflared_arch=amd64 ;;
  aarch64|arm64) cloudflared_arch=arm64 ;;
  *) exit 1 ;;
esac
cloudflared_download=$(mktemp)
trap 'rm -f "$cloudflared_download"' EXIT
curl --fail --location --show-error --output "$cloudflared_download" "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-$cloudflared_arch"
sudo install -o root -g root -m 0755 "$cloudflared_download" /usr/local/bin/cloudflared
cloudflared --version
```

La instalación inicial usa `cloudflared 2026.10.1` en `x86_64`. Si la descarga o la conexión fallan por la red de Tenki, detén el despliegue y conserva el error exacto; no cambies de VM, proveedor ni transporte como alternativa.

El token completo se carga directamente en `/etc/hooksage/cloudflared.env` con `sudoedit`. El archivo debe pertenecer a `root:root`, tener permisos `0600` y contener una sola línea `TUNNEL_TOKEN=<token de conexión>`. El directorio `/etc/hooksage` tiene permisos `0700`. No pases el valor como argumento, no lo imprimas y no lo guardes en Git, documentación ni logs. Un placeholder puede mantenerse mientras falta la credencial.

La unidad `infra/cloudflared.service` lee ese archivo mediante `EnvironmentFile`; no expande el token en la línea de comandos. Su condición de arranque omite placeholders y UUID cortos. Usa un usuario dinámico, reinicio automático y protecciones de systemd.

```sh
sudo install -o root -g root -m 0644 infra/cloudflared.service /etc/systemd/system/cloudflared.service
sudo systemd-analyze verify /etc/systemd/system/cloudflared.service
sudo systemctl daemon-reload
sudo systemctl enable --now cloudflared.service
```

Tras reemplazar un placeholder, ejecuta `sudo systemctl restart cloudflared.service`. Comprueba que se registren conexiones en `journalctl -u cloudflared.service`, sin volcar variables de entorno. La unidad fuerza `--protocol http2`: este transporte utiliza **TCP 7844**, no TCP 443. Consulta los [parámetros oficiales](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/configure-tunnels/run-parameters/) y los [requisitos de red](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/configure-tunnels/tunnel-with-firewall/).

### Verificación antes de cerrar el preview

Durante la migración, conserva `HOST=0.0.0.0` y la asociación del preview al puerto 8787. La configuración de la aplicación debe incluir:

```dotenv
ALLOWED_ORIGINS=https://hooksage.com,https://www.hooksage.com,https://hooksage-landing--pb87yo.us.sb.tenki.sh
TRUST_PROXY=true
```

Reinicia `hooksage.service`. Una vez que el túnel registre conexiones, comprueba desde fuera de Tenki que el dominio principal responda 200 por HTTPS, que HTTP redirija con 301 a HTTPS y que `https://www.hooksage.com` responda 200. Envía además un formulario ficticio a `https://hooksage.com/api/waitlist` con `Origin: https://hooksage.com`, verifica únicamente su fila en SQLite y elimina esa fila de prueba sin alterar otros registros.

Solo después de superar esas comprobaciones, configura el estado final:

```dotenv
HOST=127.0.0.1
PORT=8787
ALLOWED_ORIGINS=https://hooksage.com,https://www.hooksage.com
TRUST_PROXY=true
```

Reinicia la aplicación y desasocia la URL de preview del puerto 8787 con `tenki sandbox preview-url unbind <preview-id>`. Revisa también las exposiciones del puerto con `tenki sandbox ports` y elimina cualquier exposición adicional de 8787. Repite las comprobaciones de ambos dominios y confirma que la aplicación escucha solo en `127.0.0.1:8787`. No cierres la sesión ni modifiques el volumen `/data/hooksage`.

La aplicación toma la última IP válida de `X-Forwarded-For` cuando `TRUST_PROXY=true`. Por eso, la configuración final exige escuchar en loopback y retirar el acceso público de Tenki: `cloudflared` debe ser la única entrada remota al servidor.

## Notificaciones de registros por email

Cada registro nuevo se guarda en SQLite y después se notifica por la API HTTPS de Resend. Los reintentos de un registro ya existente no generan otro correo. Si el correo falla, el formulario sigue confirmado y el registro permanece en la base; la aplicación escribe `waitlist_notify_failed` sin datos del formulario ni credenciales. No hay reintentos persistentes de correo configurados.

Añade estas variables únicamente a `/home/tenki/hooksage/.service.env`, con permisos `0600`, sin incluir su contenido privado en paquetes, Git, comandos ni logs:

```dotenv
RESEND_API_KEY=
NOTIFY_EMAIL_TO=hooksage.app@gmail.com
# Opcional: remitente de un dominio verificado en Resend.
NOTIFY_EMAIL_FROM=
```

Carga la clave real de forma privada en `RESEND_API_KEY`. El remitente por defecto es `Hooksage <onboarding@resend.dev>`; con ese remitente, el destinatario debe ser el correo de la cuenta de Resend. Para enviar a otro destinatario, configura un remitente de un dominio verificado. No uses el prefijo `PUBLIC_` para ninguna credencial.

El servidor necesita salida HTTPS a `api.resend.com` (TCP 443). Si la sesión utiliza una allowlist, añade solo ese hostname a la política existente. No amplíes la salida al resto de Internet ni reemplaces la sesión o el volumen para habilitar las notificaciones.

Después de subir `server/notify.mjs`, `server/app.mjs` y `server/index.mjs`, ejecuta `sudo systemctl restart hooksage.service`. Revisa el journal de la invocación recién iniciada y confirma que no aparezca `Email notifications disabled`. Comprueba `/healthz`, envía un registro identificado como prueba y verifica su entrega en Resend (`last_event=delivered`) o en el buzón destinatario. La aceptación del formulario y la ausencia de errores, por sí solas, no confirman la entrega del correo. Borra únicamente la fila de prueba una vez verificada, sin alterar otros registros.

## Acceso y compatibilidad del formulario

Producción siempre usa `/api/waitlist` en el mismo dominio. Una variable `PUBLIC_FORM_ENDPOINT` de desarrollo no puede incorporar una URL antigua al build. El formulario conserva `action`, `method=post` y validación nativa: si JavaScript no puede ejecutarse, el servidor recibe el POST HTML y devuelve una confirmación legible. Ambos modos aplican la misma validación, límites, deduplicación y guardado en SQLite. Los datos de contacto nunca se colocan en la URL.

El JavaScript se compila para Chrome/Edge 80+, Firefox 78+ y Safari 14+; el envío HTML básico no necesita JavaScript. Antes de considerar operativo un despliegue, verifica el dominio con resolución DNS normal. `curl --resolve` sirve para aislar problemas de DNS, pero no prueba que el resolvedor de un visitante ya haya actualizado la delegación. Comprueba también los nameservers públicos, el DNS de la conexión afectada y el formulario desde un navegador.

## Copia consistente y exportación

Desde una terminal autenticada:

```sh
tenki sandbox exec --session <sesion> --cwd /home/tenki/hooksage -- node --env-file=.service.env scripts/database.mjs count
tenki sandbox exec --session <sesion> --cwd /home/tenki/hooksage -- node --env-file=.service.env scripts/database.mjs backup /data/hooksage/backups/waitlist.sqlite
tenki sandbox read --session <sesion> --path /data/hooksage/backups/waitlist.sqlite --out ./backups/waitlist.sqlite
tenki sandbox exec --session <sesion> --cwd /home/tenki/hooksage -- node --env-file=.service.env scripts/database.mjs export /data/hooksage/backups/waitlist.csv
```

Guarda las copias fuera de Tenki para poder recuperar los datos aunque se pierda el volumen. `backup` usa la API de backup de SQLite; copiar únicamente el archivo principal mientras WAL está activo puede omitir registros recientes. No hay backups programados ni retención automática configurados.

## Disponibilidad

La sesión permanece activa para recibir formularios. Pausarla ahorra cómputo y detiene temporalmente la recepción. No basta con preservar el volumen para mantener disponible el endpoint. El saldo debe vigilarse desde Billing antes de lanzar o ampliar campañas. Los créditos promocionales son temporales; no convierten el servicio en gratuito para siempre.

Tenki Sandbox proporciona VMs y URLs de preview, no una base de datos gestionada con alta disponibilidad. Esta instalación sirve para la lista de espera inicial; la recuperación y las copias son responsabilidad del proyecto.

## Formulario Uruguay / Argentina y esquema v2

El formulario pide empresa o marca, tipo de equipo, contacto, email, país y ciudad. WhatsApp es opcional; si se informa, usa +598 (Uruguay) o +54 (Argentina). JSON y POST HTML comparten la misma validación. La exportación CSV incluye `country`.

Al abrir una base v1, el servidor crea primero una copia consistente y privada `waitlist.sqlite.before-v2-<timestamp>.sqlite` en el mismo volumen, con permisos 0600. Después migra en una transacción a v2: conserva íntegros IDs, contactos, fechas, atribución, consentimiento y huellas de duplicados; los registros históricos se identifican como MX. Admite nuevas categorías y WhatsApp vacío. Las pestañas antiguas sin país siguen usando el contrato anterior y no duplican registros. Reiniciar v2 no repite la migración.

Antes de desplegar, ejecuta las pruebas de migración y crea además un backup consistente con el comando privado. Compara el conteo y una huella de las filas preexistentes antes y después, sin imprimir datos de contacto. No reemplaces el archivo de base con el paquete. Después de migrar, conserva `server/database.mjs` v2 si necesitas revertir solo la interfaz: el servidor v1 no es compatible con el esquema nuevo. No restaures un snapshot sobre una base que ya recibió altas nuevas; preserva ambas y prepara una recuperación que no pierda registros.

Los enlaces de los cuatro rubros gastronómicos anteriores devuelven 301 a la portada y conservan la query de campaña. Las páginas activas son `/videos-para-startups/`, `/videos-para-pymes/`, `/videos-para-marca-personal/` y `/videos-para-equipos-de-marketing/`.
