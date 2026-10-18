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
| Base de datos | PostgreSQL |
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

## Estado de la contenerización

El frontend ya cuenta con un `Dockerfile` multietapa y una imagen publicada
en DockerHub. La configuración de Docker Compose y los servicios de backend y
base de datos se incorporarán en la siguiente etapa del proyecto.
