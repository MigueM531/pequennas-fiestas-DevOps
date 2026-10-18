# Pequeñas Fiestas

Monorepo de la plataforma GigaShow para conectar clientes con artistas y
facilitar la gestión de reservas.

## Estructura

Este repositorio contiene dos proyectos como submódulos Git:

- `frontend`: aplicación web en React 19 y Vite 7.
- `backend`: API en Node.js y Express.

Los submódulos tienen sus propios repositorios:

- [Frontend](https://github.com/ruales1138/pequennas_fiestas-frontend)
- [Backend](https://github.com/ruales1138/pequennas_fiestas-backend)

## Tecnologías

| Componente | Tecnología |
| --- | --- |
| Frontend | React 19, Vite 7, Node.js 22 |
| Frontend en producción | Nginx 1.27 |
| Backend | Node.js, Express |
| Base de datos | PostgreSQL 16 |
| Contenedores | Docker y Docker Compose |

## Clonar el proyecto

Para clonar el monorepo junto con sus submódulos:

```bash
git clone --recurse-submodules https://github.com/ruales1138/pequennas_fiestas.git
cd pequennas_fiestas
```

Si ya se clonó el repositorio sin submódulos:

```bash
git submodule update --init --recursive
```

Para actualizar los submódulos a las referencias configuradas por el
monorepo:

```bash
git submodule update --remote --merge
```

## Frontend

El frontend se puede ejecutar localmente desde `frontend`:

```bash
cd frontend
npm ci
npm run dev
```

También se puede descargar la imagen publicada en DockerHub:

```bash
docker pull ruales1138/gigashow-frontend:latest
docker run --rm -p 8080:80 ruales1138/gigashow-frontend:latest
```

La aplicación estará disponible en `http://localhost:8080`.

## Ejecutar frontend, backend y base de datos

Docker Compose levanta los tres servicios y crea el esquema inicial de
PostgreSQL:

```bash
docker compose up --build
```

Servicios disponibles:

- Frontend: `http://localhost:8081`
- Backend: `http://localhost:3001`
- Swagger: `http://localhost:3001/api-docs/`
- PostgreSQL: `localhost:5432`

Para detener los servicios:

```bash
docker compose down
```

Para eliminar también los datos locales de PostgreSQL:

```bash
docker compose down -v
```

El frontend ya tiene una imagen publicada en DockerHub:

```bash
docker pull ruales1138/gigashow-frontend:latest
```

El backend también está publicado:

```bash
docker pull ruales1138/gigashow-backend:latest
```

## Historias y pruebas

Las historias de usuario y sus responsables están documentadas en
[HISTORIAS_USUARIO.md](./HISTORIAS_USUARIO.md).

### Pruebas unitarias del backend

Desde `backend`:

```bash
npm ci
npm test
```

### Pruebas iniciales con Playwright

Con Docker Compose levantado, desde `frontend`:

```bash
npm ci
npx playwright install chromium
npm run test:e2e
```

Las pruebas verifican la carga de la página principal y la navegación directa
al catálogo.
