# Guía de Despliegue - Entersys Admin

## 🚀 Despliegue en Producción

### Opción 1: Usando Docker (Recomendado)

#### Pre-requisitos
- Docker y Docker Compose instalados en el servidor
- Traefik corriendo en el servidor (para HTTPS automático)

#### Pasos:

1. **Conectarse al servidor:**
```bash
ssh usuario@servidor.entersys.mx
```

2. **Clonar o copiar el proyecto:**
```bash
cd /opt
git clone <repositorio> entersys-admin
# O copiar archivos via SCP/SFTP
```

3. **Construir y desplegar:**
```bash
cd /opt/entersys-admin
docker-compose up -d --build
```

4. **Verificar:**
```bash
docker-compose logs -f
```

El sitio estará disponible en: https://admin.entersys.mx

#### Actualizar despliegue:
```bash
cd /opt/entersys-admin
git pull  # Si usas git
docker-compose down
docker-compose up -d --build
```

---

### Opción 2: Build Manual

#### Pasos:

1. **En tu máquina local, hacer build:**
```bash
npm run build
```

2. **Comprimir la carpeta dist:**
```bash
tar -czf entersys-admin-dist.tar.gz dist/
```

3. **Copiar al servidor:**
```bash
scp entersys-admin-dist.tar.gz usuario@servidor:/var/www/
```

4. **En el servidor:**
```bash
cd /var/www
tar -xzf entersys-admin-dist.tar.gz
mv dist entersys-admin
```

5. **Configurar Nginx:**

Crear archivo `/etc/nginx/sites-available/admin.entersys.mx`:

```nginx
server {
    listen 80;
    server_name admin.entersys.mx;

    root /var/www/entersys-admin;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;
}
```

6. **Activar sitio:**
```bash
sudo ln -s /etc/nginx/sites-available/admin.entersys.mx /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

7. **Configurar HTTPS con Certbot:**
```bash
sudo certbot --nginx -d admin.entersys.mx
```

---

## 📝 Variables de Entorno

El build usa: `VITE_API_URL=https://api.entersys.mx`

Para cambiar la URL del API, modifica `Dockerfile` línea 16:
```dockerfile
ENV VITE_API_URL=https://api.entersys.mx
```

---

## 🔍 Troubleshooting

### Error: CORS en producción
Verifica que el backend tenga configurado el origen correcto:
```python
# En el backend FastAPI
allow_origins=["https://admin.entersys.mx"]
```

### Error 404 en rutas
Asegúrate que nginx tiene `try_files $uri $uri/ /index.html;`

### Build falla
```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📊 Verificación Post-Despliegue

1. ✅ Abrir https://admin.entersys.mx
2. ✅ Verificar que carga el login
3. ✅ Login con credenciales válidas
4. ✅ Navegar entre páginas (Dashboard, Posts)
5. ✅ Verificar que no hay errores 404
6. ✅ Verificar conexión con API

---

## 🎯 Resumen Rápido

**Docker (método rápido):**
```bash
cd /opt/entersys-admin
docker-compose up -d --build
```

**Actualizar:**
```bash
docker-compose down && docker-compose up -d --build
```

**Ver logs:**
```bash
docker-compose logs -f
```

---

## 🌐 URLs

- **Producción:** https://admin.entersys.mx
- **API Backend:** https://api.entersys.mx
- **Frontend público:** https://entersys.mx
