---
    title: Configurar un nuevo sitio web en NGINX
    author: Francisco González
    description: "How to configure a new virtual host in your linux NGINX server"
    image:
        url: "https://docs.astro.build/assets/arc.webp"
        alt: "Thumbnail of Astro arcs."
    pubDate: 2022-07-08
    tags: ["linux", "nginx", "servers"]
---
# Configurar un nuevo sitio web en NGINX

Seguir los siguientes comando:

1. crear folder del sitio
`sudo mkdir -p /var/www/{your-domain}/`

2. Asignamos el usuario dueño del folder
`sudo chown -R $USER:$USER /var/www/{your-domain}/`

3. Asignamos permisos
`sudo chmod -R 755 /var/www/{your-domain}/`

4. Creamos un index.html file a modo de prueba
`sudo nano /var/www/{your-domain}/index.html`

5. Contenido del archivo index.html
```
<html>
    <head>
        <title>Welcome to your-domain!</title>
    </head>
    <body>
        <h1>Success!  The your-domain server block is working!</h1>
    </body>
</html>
```

6. Para que Nginx pueda servir este contenido, es necesario crear un server block con las directivas correctas. En lugar de modificar el archivo de configuración predeterminado directamente, hagamos uno nuevo en /etc/nginx/sites-available/{your-domain}:
`sudo nano /etc/nginx/sites-available/{your-domain}`

7. El contenido del archivo de configuración:
```
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

8. A continuación, vamos a habilitar el archivo creando un enlace desde este al directorio sites-enabled, del cual Nginx lee durante el inicio:

`sudo ln -s /etc/nginx/sites-available/your_domain /etc/nginx/sites-enabled/`


> **_NOTA:_** Nginx utiliza una práctica común llamada enlaces simbólicos, o symlinks, para rastrear cuáles de tus bloques de servidor están habilitados. Crear un symlink es como crear un acceso directo en el disco, de modo que más tarde podrías eliminar el acceso directo del directorio sites-enabled mientras mantienes el bloque de servidor en sites-available si quisieras habilitarlo.

9. Para evitar un posible problema de memoria del hash bucket que puede surgir al agregar nombres de servidor adicionales, es necesario ajustar un solo valor en el archivo /etc/nginx/nginx.conf. Abre el archivo:
`sudo nano /etc/nginx/nginx.conf`

Encuentra la directiva `server_names_hash_bucket_size` y elimina el símbolo `#` para descomentar la línea. Si estás usando nano, puedes buscar rápidamente palabras en el archivo presionando `CTRL` y `w`.

Verifica que el archivo de configuración no contenga errores: `sudo nginx -t`

10. Reiniciamos el servicio de nginx `sudo systemctl restart nginx`


