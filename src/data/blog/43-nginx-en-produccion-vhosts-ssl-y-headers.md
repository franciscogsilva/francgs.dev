---
title: "Nginx en produccion: vhosts, SSL y headers de seguridad"
author: "Francisco Gonzalez"
description: "Configuracion real de Nginx para varios sitios con SSL automatizado, redirects limpios y headers de seguridad sin romper la app."
pubDate: 2026-04-29
tags: ["devops", "nginx", "ssl", "security", "linux"]
category: devops
translationKey: post-43
lang: es
---

En produccion, Nginx no falla por sintaxis: falla por detalles. Un `server_name` ambiguo, un header mal puesto o una renovacion SSL no validada te puede tumbar el sitio en el peor momento.

## Caso practico guiado

Escenario: un VPS con dos apps:

- `api.midominio.com` (Node API),
- `midominio.com` (frontend estatico).

Objetivo:

1. separar vhosts por dominio,
2. forzar HTTPS,
3. agregar headers de seguridad base,
4. validar renovacion SSL automatica.

## Configuracion recomendada

`/etc/nginx/sites-available/api.midominio.com`:

```nginx
server {
    listen 80;
    server_name api.midominio.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.midominio.com;

    ssl_certificate /etc/letsencrypt/live/api.midominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.midominio.com/privkey.pem;

    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options DENY always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }
}
```

## Flujo operativo seguro

```bash
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d api.midominio.com -d midominio.com
sudo systemctl status certbot.timer
```

Si `nginx -t` falla, no recargues. Primero corrige y vuelve a validar.

## Errores que mas se repiten

- Usar un bloque default que captura dominios no esperados.
- No pasar `X-Forwarded-Proto`, rompiendo deteccion HTTPS en backend.
- Mezclar reglas de cache agresivas en HTML y API.
- Activar headers estrictos sin probar flujos de autenticacion y embeds.

## Checklist accionable

- [ ] Un archivo por vhost, sin reglas globales ambiguas
- [ ] Redirect 80 -> 443 en todos los dominios publicos
- [ ] Certificados validos y renovacion automatica verificada
- [ ] `nginx -t` en pipeline o script previo a cada reload
- [ ] Headers de seguridad auditados en navegador y scanner
