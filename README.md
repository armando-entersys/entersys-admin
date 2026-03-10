# Entersys Admin Panel

Panel de administración para el blog de Entersys.mx

## Características

- Autenticación con JWT
- Gestión completa de posts (CRUD)
- Editor Markdown con vista previa
- Estados de publicación (borrador/publicado)
- Campos SEO (meta description)
- Interfaz moderna con Tailwind CSS

## Requisitos

- Node.js 18+ y npm
- Backend API de Entersys corriendo en `https://api.entersys.mx`

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` si es necesario:
```
VITE_API_URL=https://api.entersys.mx
```

## Desarrollo

Iniciar servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Build para Producción

```bash
npm run build
```

Los archivos compilados estarán en el directorio `dist/`

## Estructura del Proyecto

```
entersys-admin/
├── src/
│   ├── api/           # Funciones API (auth, posts)
│   ├── components/    # Componentes reutilizables
│   │   └── auth/      # ProtectedRoute
│   ├── lib/           # Utilidades (axios config)
│   ├── pages/         # Páginas de la aplicación
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── PostsListPage.tsx
│   │   ├── CreatePostPage.tsx
│   │   └── EditPostPage.tsx
│   ├── types/         # Tipos TypeScript
│   ├── App.tsx        # Routing principal
│   └── main.tsx       # Entry point
├── .env               # Variables de entorno (no versionado)
└── .env.example       # Ejemplo de variables de entorno
```

## Rutas

- `/login` - Página de inicio de sesión
- `/dashboard` - Panel principal con estadísticas
- `/posts` - Lista de todos los posts
- `/posts/new` - Crear nuevo post
- `/posts/:id/edit` - Editar post existente

## Autenticación

El panel utiliza autenticación JWT. Las credenciales deben ser de un usuario administrador registrado en el backend.

El token se almacena en `localStorage` y se incluye automáticamente en todas las peticiones API.

## API Endpoints Utilizados

- `POST /api/v1/auth/token` - Login (OAuth2PasswordRequestForm)
- `GET /api/v1/posts` - Listar posts
- `GET /api/v1/posts/:id` - Obtener post por ID
- `POST /api/v1/posts` - Crear post
- `PUT /api/v1/posts/:id` - Actualizar post
- `DELETE /api/v1/posts/:id` - Eliminar post

## Tecnologías

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **SimpleMDE** - Markdown editor
- **React Markdown** - Markdown preview
- **Lucide React** - Icons

## Despliegue

Para desplegar en producción:

1. Build del proyecto:
```bash
npm run build
```

2. Los archivos en `dist/` pueden ser servidos desde cualquier servidor web estático (Nginx, Apache, Vercel, Netlify, etc.)

3. Asegurarse de configurar las variables de entorno correctamente en el servidor de producción.

## Notas de Desarrollo

- Las rutas están protegidas con `ProtectedRoute` que verifica autenticación
- El token expira según la configuración del backend
- Si el token expira, el usuario es redirigido automáticamente a `/login`
- Los errores 401 se manejan globalmente en el interceptor de Axios
