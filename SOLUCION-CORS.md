# 🔧 Solución al Problema de CORS

## 📋 Problema Detectado

```
Access to XMLHttpRequest at 'https://api.entersys.mx/api/v1/posts/'
from origin 'http://localhost:5173' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## ❌ Por qué ocurre

CORS (Cross-Origin Resource Sharing) es una medida de seguridad de los navegadores que bloquea requests desde un origen diferente al del servidor.

- **Frontend**: `http://localhost:5173` (desarrollo local)
- **Backend**: `https://api.entersys.mx` (servidor remoto)

Como son diferentes orígenes, el navegador bloquea las peticiones por seguridad.

## ✅ Solución (Backend - REQUERIDO)

**El backend DEBE configurar CORS para permitir requests desde localhost durante desarrollo.**

### Para FastAPI (Python):

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://admin.entersys.mx",  # Producción
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Para Express.js (Node.js):

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://admin.entersys.mx'
  ],
  credentials: true
}));
```

## 🎯 Configuración Recomendada por Entorno

### Desarrollo:
```python
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
]
```

### Producción:
```python
CORS_ORIGINS = [
    "https://admin.entersys.mx",
    "https://www.entersys.mx",
]
```

### Ambos (usando variables de entorno):
```python
import os

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
```

## 🔍 Verificar que CORS esté Configurado

```bash
curl -I -X OPTIONS https://api.entersys.mx/api/v1/posts \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET"
```

Deberías ver en la respuesta:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: *
```

## ⚠️ Soluciones Temporales (NO RECOMENDADAS PARA PRODUCCIÓN)

### Opción 1: Proxy en Vite (solo para desarrollo)

Ya está configurado automáticamente en el frontend para producción. No es necesario en desarrollo si el backend configura CORS correctamente.

### Opción 2: Extensión de navegador (solo para pruebas)

Instalar extensión "CORS Unblock" o similar - **NUNCA usar en producción**.

## 📝 Checklist

- [ ] Configurar CORS en el backend
- [ ] Agregar `http://localhost:5173` a allowed origins
- [ ] Agregar `http://localhost:5174` a allowed origins
- [ ] Verificar que `allow_credentials` esté en `True`
- [ ] Verificar que `allow_methods` incluya `["*"]` o `["GET", "POST", "PUT", "DELETE", "OPTIONS"]`
- [ ] Verificar que `allow_headers` incluya `["*"]` o los headers necesarios
- [ ] Reiniciar el servidor backend
- [ ] Probar que el frontend pueda hacer requests exitosos
- [ ] Para producción, agregar dominio de producción a allowed origins

## 🚀 Después de Configurar CORS

1. Reinicia el servidor backend
2. Refresca la aplicación frontend (F5)
3. Los posts deberían cargarse sin errores
4. Verifica en DevTools → Network que las peticiones sean exitosas (status 200)

---

**Nota:** CORS es una configuración del BACKEND, no del frontend. El frontend no puede hacer nada para solucionarlo por sí mismo.
