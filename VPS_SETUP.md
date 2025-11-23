# Configuración del VPS para Deploy

## Requisitos previos en el VPS

1. **Instalar Node.js 22+**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Instalar pnpm**
   ```bash
   npm install -g pnpm
   ```

3. **Instalar PM2 (Process Manager)**
   ```bash
   npm install -g pm2
   ```

4. **Configurar PM2 para auto-start en reboot**
   ```bash
   pm2 startup
   # Ejecuta el comando que PM2 te muestra
   ```

## Configuración inicial

1. **Crear el directorio de deploy** (debe coincidir con `DEPLOY_PATH` en GitHub Secrets)
   ```bash
   mkdir -p /path/to/your/deploy/directory
   cd /path/to/your/deploy/directory
   ```

2. **El archivo .env se crea automáticamente** ✨
   
   No necesitas crear manualmente el archivo `.env`. El workflow de GitHub Actions lo genera automáticamente desde los GitHub Secrets durante cada deploy.
   
   Las variables de entorno se configuran en los GitHub Secrets (ver sección más abajo).

3. **Configurar Nginx como reverse proxy** (opcional pero recomendado)
   ```nginx
   server {
       listen 80;
       server_name francgs.dev www.francgs.dev;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

4. **Configurar SSL con Let's Encrypt** (recomendado)
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d francgs.dev -d www.francgs.dev
   ```

## GitHub Secrets necesarios

Asegúrate de tener configurados estos secrets en tu repositorio de GitHub:

- `SSH_PRIVATE_KEY`: Tu clave SSH privada para acceder al VPS
- `SERVER_HOST`: IP o dominio de tu VPS
- `SERVER_USER`: Usuario SSH del VPS
- `DEPLOY_PATH`: Ruta completa donde se deployará la app (ej: `/var/www/francgs.dev`)
- `WEB3FORMS_ACCESS_KEY`: Tu access key de Web3Forms
- `SUPABASE_URL`: URL de tu proyecto Supabase
- `SUPABASE_SERVICE_KEY`: Service key de Supabase

## Comandos útiles de PM2

```bash
# Ver status de la aplicación
pm2 status

# Ver logs en tiempo real
pm2 logs francgs-dev

# Reiniciar la aplicación
pm2 restart francgs-dev

# Detener la aplicación
pm2 stop francgs-dev

# Eliminar la aplicación de PM2
pm2 delete francgs-dev

# Ver información detallada
pm2 show francgs-dev

# Monitorear recursos
pm2 monit
```

## Troubleshooting

### El servidor no inicia
```bash
# Ver logs de error
pm2 logs francgs-dev --err

# Verificar que el archivo .env existe
cat .env

# Verificar que las dependencias están instaladas
ls node_modules/
```

### Puerto 3000 ya en uso
```bash
# Encontrar qué proceso usa el puerto
sudo lsof -i :3000

# Cambiar el puerto en .env
nano .env
# Cambiar PORT=3000 a otro puerto (ej: PORT=3001)

# Reiniciar PM2
pm2 restart francgs-dev
```

### Problemas de permisos
```bash
# Asegúrate de que el usuario tiene permisos en el directorio
sudo chown -R $USER:$USER /path/to/deploy/directory
```

## Estructura del directorio después del deploy

```
/path/to/deploy/directory/
├── dist/
│   ├── client/          # Archivos estáticos
│   └── server/          # Código del servidor Node.js
│       └── entry.mjs    # Punto de entrada del servidor
├── node_modules/        # Dependencias de producción
├── package.json
├── pnpm-lock.yaml
└── .env                 # Variables de entorno (NO commitear)
```

## Notas importantes

- El servidor se ejecuta en el puerto 3000 por defecto
- PM2 mantendrá el proceso corriendo y lo reiniciará automáticamente si falla
- Los logs se guardan automáticamente por PM2
- El deploy automático se ejecuta en cada push a la rama `main`
