# 🚀 Comandos para Desplegar en el Servidor

## Método 1: Script Automático Python (Recomendado)

### Conectarse al servidor
```bash
# Usando gcloud CLI
gcloud compute ssh [NOMBRE-INSTANCIA] --zone=[ZONA]

# O SSH tradicional
ssh usuario@servidor-entersys
```

### Navegar al directorio del proyecto
```bash
cd /opt/entersys-admin
```

### Ejecutar el script de despliegue
```bash
python3 deploy-to-server.py
```

El script hará automáticamente:
1. ✅ Bajar cambios de GitHub
2. ✅ Detener contenedor actual
3. ✅ Construir nueva imagen
4. ✅ Levantar contenedor nuevo
5. ✅ Verificar despliegue

---

## Método 2: Comandos Manuales

Si prefieres ejecutar los comandos uno por uno:

### 1. Conectarse y navegar
```bash
cd /opt/entersys-admin
```

### 2. Bajar cambios
```bash
git pull origin master
```

### 3. Reconstruir Docker
```bash
docker-compose down
docker-compose up -d --build
```

### 4. Verificar
```bash
docker-compose ps
docker-compose logs -f
```

---

## Verificación Post-Despliegue

### Ver logs en tiempo real
```bash
docker-compose logs -f entersys-admin
```

### Ver estado del contenedor
```bash
docker-compose ps
```

### Probar el sitio
```bash
curl -I https://admin.entersys.mx
```

### Entrar al contenedor (troubleshooting)
```bash
docker-compose exec entersys-admin sh
```

---

## Rollback (Si algo sale mal)

### Ver commits anteriores
```bash
git log --oneline -5
```

### Volver a commit anterior
```bash
git reset --hard <commit-hash>
docker-compose down
docker-compose up -d --build
```

### O simplemente rebuildeando
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## Troubleshooting Común

### Error: Puerto 80 ocupado
```bash
# Ver qué usa el puerto
sudo lsof -i :80
# O
sudo netstat -tlnp | grep :80
```

### Error: Docker no responde
```bash
sudo systemctl restart docker
docker-compose up -d
```

### Error: Cambios no reflejados
```bash
# Limpiar cache de Docker
docker-compose down
docker system prune -a
docker-compose up -d --build
```

### Ver todos los logs
```bash
docker-compose logs --tail=100
```

---

## Comandos Útiles

### Reiniciar contenedor
```bash
docker-compose restart
```

### Detener sin eliminar
```bash
docker-compose stop
```

### Iniciar contenedor detenido
```bash
docker-compose start
```

### Ver recursos usados
```bash
docker stats entersys-admin
```

### Backup antes de actualizar
```bash
docker commit entersys-admin entersys-admin-backup
```

---

## 🎯 Comando Rápido (Todo en Uno)

```bash
cd /opt/entersys-admin && \
git pull origin master && \
docker-compose down && \
docker-compose up -d --build && \
docker-compose logs -f
```

---

## URLs Importantes

- **Admin Panel:** https://admin.entersys.mx
- **API Backend:** https://api.entersys.mx
- **Frontend:** https://entersys.mx

---

## Contacto

Si hay problemas, verifica:
1. ✅ Traefik está corriendo: `docker ps | grep traefik`
2. ✅ Network existe: `docker network ls | grep traefik`
3. ✅ DNS apunta correctamente: `nslookup admin.entersys.mx`
4. ✅ Certificado SSL válido: `curl -vI https://admin.entersys.mx 2>&1 | grep certificate`
