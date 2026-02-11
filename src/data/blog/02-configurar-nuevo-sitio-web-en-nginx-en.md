---
title: "Set Up a New Website in NGINX"
author: "Francisco González"
description: "Step-by-step guide to configure a new virtual host on an NGINX Linux server from scratch."
pubDate: 2022-07-08
image:
  url: "https://docs.astro.build/assets/arc.webp"
  alt: "Thumbnail of Astro arcs."
tags: ["linux", "nginx", "devops"]
category: devops
translationKey: post-02
lang: en
---

<!-- # Set Up a New Website in NGINX -->

Run the following commands:

1. Create the site folder
`sudo mkdir -p /var/www/{your-domain}/`

2. Set your user as the folder owner
`sudo chown -R $USER:$USER /var/www/{your-domain}/`

3. Set permissions
`sudo chmod -R 755 /var/www/{your-domain}/`

4. Create a test `index.html` file
`sudo nano /var/www/{your-domain}/index.html`

5. `index.html` file content

```html
<html>
    <head>
        <title>Welcome to your-domain!</title>
    </head>
    <body>
        <h1>Success!  The your-domain server block is working!</h1>
    </body>
</html>
```

6. For NGINX to serve this content, create a new server block with the right directives. Instead of editing the default config directly, create a new file at `/etc/nginx/sites-available/{your-domain}`:

`sudo nano /etc/nginx/sites-available/{your-domain}`

7. Configuration file content:

```nginx
server {
        listen 80;
        listen [::]:80;

        root /var/www/your_domain;
        index index.html index.htm index.nginx-debian.html;

        server_name your_domain www.your_domain;

        location / {
                try_files $uri $uri/ =404;
        }
}
```

8. Enable the file by creating a symlink to `sites-enabled`, which NGINX reads on startup:

`sudo ln -s /etc/nginx/sites-available/your_domain /etc/nginx/sites-enabled/`

> **_NOTE:_** NGINX uses symbolic links (symlinks) to track which server blocks are enabled. Creating a symlink is like creating a shortcut: later, you can remove that shortcut from `sites-enabled` while keeping the original config in `sites-available`.

9. To avoid potential hash bucket memory issues when adding additional server names, update one value in `/etc/nginx/nginx.conf`. Open the file:

`sudo nano /etc/nginx/nginx.conf`

Find the `server_names_hash_bucket_size` directive and remove `#` to uncomment the line. If you use `nano`, press `CTRL + w` to search quickly.

Check for config errors: `sudo nginx -t`

10. Restart NGINX: `sudo systemctl restart nginx`
