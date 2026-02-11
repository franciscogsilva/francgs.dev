---
title: "Nginx in Production: VHosts, SSL, and Security Headers"
author: "Francisco Gonzalez"
description: "A practical Nginx production setup for multiple domains with clean HTTPS redirects, TLS renewal, and baseline security headers."
pubDate: 2026-04-29
tags: ["devops", "nginx", "ssl", "security", "linux"]
category: devops
translationKey: post-43
lang: en
---

In production, Nginx doesn't fail for syntax: it fails for details. An ambiguous `server_name`, a poorly placed header or an unvalidated SSL renewal can bring down your site at the worst possible moment.

## Guided practical case

Scenario: a VPS with two apps:

- `api.midominio.com` (Node API),
- `midominio.com` (static frontend).

Aim:

1. separate vhosts by domain,
2. force HTTPS,
3. add base security headers,
4. validate automatic SSL renewal.

## Recommended configuration

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

## Secure operational flow

```bash
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d api.midominio.com -d midominio.com
sudo systemctl status certbot.timer
```

If `nginx -t` fails, do not reload. First correct and validate again.

## Errors that are repeated the most

- Use a default block that captures unexpected domains.
- Do not pass `X-Forwarded-Proto`, breaking HTTPS detection in backend.
- Mix aggressive caching rules in HTML and API.
- Activate strict headers without testing authentication flows and embeds.

## Actionable checklist

- [ ] One file per vhost, no ambiguous global rules
- [ ] Redirect 80 -> 443 on all public domains
- [ ] Valid certificates and verified automatic renewal
- [ ] `nginx -t` in pipeline or script prior to each reload
- [ ] Security headers audited in browser and scanner
