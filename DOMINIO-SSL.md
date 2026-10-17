# hooksage.com con HTTPS gratis

Tenki no permite dominios propios: solo publica puertos en `*.sb.tenki.sh` (con su propio certificado) y no da IP fija ni puertos 80/443. Por eso no se puede apuntar un registro A de `hooksage.com` a Tenki ni emitir Let's Encrypt dentro del sandbox.

La solución gratuita es **Cloudflare (plan Free) + Cloudflare Tunnel**:

```
visitante ──HTTPS──▶ Cloudflare (certificado gratis de hooksage.com)
                          │  túnel saliente, iniciado desde el sandbox
                          ▼
              sandbox Tenki: cloudflared ──▶ node server/index.mjs (127.0.0.1:8787)
```

- Cloudflare emite y renueva solo el certificado de `hooksage.com` y `*.hooksage.com` (Universal SSL, gratis).
- `cloudflared` sale del sandbox hacia Cloudflare, así que no hace falta inbound, IP fija ni el plan Team de Tenki para tener un slug estable.
- No hay que comprar el SSL de Namecheap.

## 1. Pasar el DNS a Cloudflare (hacerlo primero: la propagación tarda)

1. Crear cuenta en <https://dash.cloudflare.com> → **Add a domain** → `hooksage.com` → plan **Free**.
2. Cloudflare muestra 2 nameservers (`xxx.ns.cloudflare.com`).
3. Namecheap → Domain List → `hooksage.com` → **Manage** → Nameservers → **Custom DNS** → pegar los 2 de Cloudflare → guardar.
4. Borrar en Cloudflare los registros importados del parking de Namecheap (`A 162.255.119.187`, `CNAME www → parkingpage.namecheap.com`).
5. Esperar a que el dominio aparezca como **Active** (de minutos a unas horas). Comprobar:

```bash
dig +short NS hooksage.com
```

## 2. Crear el túnel

Cloudflare → **Zero Trust** → Networks → **Tunnels** → Create a tunnel → **Cloudflared** → nombre `hooksage`.

- Copiar el **token** (`eyJ...`). Es secreto: va en los secretos de Tenki, nunca en el repo.
- **Public hostnames**:
  - `hooksage.com` → Service `HTTP` → `localhost:8787`
  - `www.hooksage.com` → Service `HTTP` → `localhost:8787`

Cloudflare crea solo los CNAME al túnel.

## 3. Arrancar `cloudflared` en el sandbox de Tenki

Junto al servidor Node, en el comando de arranque del runtime (sesión `--sticky`):

```bash
curl -fsSL -o /home/tenki/cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-$( [ "$(uname -m)" = aarch64 ] && echo arm64 || echo amd64 )
chmod +x /home/tenki/cloudflared
/home/tenki/cloudflared tunnel --no-autoupdate --protocol http2 run --token "$TUNNEL_TOKEN" >/home/tenki/cloudflared.log 2>&1 </dev/null &
```

- `--protocol http2` usa TCP 7844 saliente (no UDP/QUIC). Si Tenki bloquea el 7844, el túnel no conecta.
- Con el túnel, el servidor puede escuchar en `HOST=127.0.0.1` y la sesión crearse con `--allow-inbound=false`: así nadie llega al puerto sin pasar por Cloudflare y `TRUST_PROXY=true` es seguro (el servidor toma la última IP de `X-Forwarded-For`, que es la que añade Cloudflare).
- `ALLOWED_ORIGINS=https://hooksage.com,https://www.hooksage.com` ya está bien en `.server.env.example`.

## 4. Ajustes de Cloudflare

SSL/TLS → Edge Certificates:

- **Always Use HTTPS**: On
- **Automatic HTTPS Rewrites**: On

El modo SSL (Flexible/Full) no aplica al túnel: el tramo Cloudflare → sandbox ya va cifrado dentro del túnel.

## 5. Verificar

```bash
curl -sI https://hooksage.com | head -1
curl -sI http://hooksage.com | grep -i location
curl -s -o /dev/null -w "%{http_code}\n" https://www.hooksage.com
```

Esperado: `200`, una redirección a `https://`, y `200`.
