# Despliegue en Tenki

La aplicación funciona con Node 24, sin instalar dependencias en el servidor: Astro se compila antes de subir y SQLite está incluido en Node. Se usa una sesión **sticky** de **1 vCPU, 512 MiB de RAM y disco raíz de 5 GiB**, con un **volumen persistente de 1 GiB** montado en `/data/hooksage`.

La base es `/data/hooksage/waitlist.sqlite`. El volumen sobrevive a la terminación de una sesión; debe volver a adjuntarse explícitamente a su reemplazo. No guardes la base en el disco raíz, en `/tmp`, dentro del paquete de despliegue ni en `dist/`.

La URL HTTPS estable se administra con `tenki sandbox preview-url`. Al reemplazar la VM se vuelve a asociar esa URL al nuevo ID de sesión y puerto. No depende de una exposición con vencimiento de una hora.

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
PUBLIC_FORM_ENDPOINT= npm run build
npm test
npm run test:api
COPYFILE_DISABLE=1 tar --no-xattrs -czf /tmp/hooksage-release.tar.gz dist server scripts/database.mjs
tenki sandbox write --session <sesion> --path /home/tenki/hooksage-release.tar.gz --data-file /tmp/hooksage-release.tar.gz
```

Descomprime en `/home/tenki/hooksage`, verifica sus archivos y ejecuta `sudo systemctl restart hooksage.service` dentro de la instancia. Reutiliza el mismo `DATABASE_PATH`; no reemplaces ni borres el volumen al actualizar código. Comprueba `/healthz` y un envío ficticio antes de dirigir campañas al servicio.

La configuración privada de producción es `/home/tenki/hooksage/.service.env`. Usa `.server.env.example` como referencia y añade la URL HTTPS real de Tenki a `ALLOWED_ORIGINS`. No se incluye en el paquete ni en Git.

`infra/hooksage.service` es la unidad instalada: ejecuta Node como el usuario `tenki`, protege el sistema y permite escrituras solo en el volumen de datos. Comprueba `command -v node` al usar otra imagen y ajusta `ExecStart` si cambia la ruta de Node. Tras copiar la unidad a `/etc/systemd/system/hooksage.service`, ejecuta `sudo systemctl daemon-reload` y `sudo systemctl enable --now hooksage.service`. En nuevas sesiones, `infra/tenki-runtime.json` espera ese servicio y verifica su endpoint de salud. La sesión inicial se configuró con un arranque provisional y se pasó al servicio systemd sin crear otra VM.

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
