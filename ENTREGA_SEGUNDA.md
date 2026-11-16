# Proyecto semestral - Segunda entrega

## Proyecto

**Pequeñas Fiestas / GigaShow**

Aplicación web para conectar clientes con artistas, consultar perfiles y
gestionar solicitudes de reserva.

## Integrantes

- Heiver David Ruales Luna
- Alejandro Ruiz Diaz
- Miguel Angel Martinez Tamayo

Repositorio principal:

- [Monorepo en GitHub](https://github.com/ruales1138/pequennas_fiestas)

## 1. Componentes implementados

| Componente | Tecnología | Evidencia |
| --- | --- | --- |
| Frontend | React 19, Vite 7, Node.js 22 | [Repositorio frontend](https://github.com/ruales1138/pequennas_fiestas-frontend) |
| Backend | Node.js 22, Express 5 | [Repositorio backend](https://github.com/ruales1138/pequennas_fiestas-backend) |
| Base de datos | PostgreSQL 16 | [Esquema inicial](./backend/db/init.sql) |
| Orquestación | Docker Compose | [docker-compose.yml](./docker-compose.yml) |
| Documentación de API | Swagger/OpenAPI 3.0 | [Configuración OpenAPI](./backend/src/config/openapi.js) |

## 2. Frontend

La aplicación frontend está contenerizada mediante una imagen multietapa:

- [Dockerfile del frontend](./frontend/Dockerfile)
- [Configuración Nginx](./frontend/nginx.conf)
- [README del frontend](./frontend/README.md)
- [Imagen en DockerHub](https://hub.docker.com/r/ruales1138/gigashow-frontend)

Descargar y ejecutar la imagen:

```powershell
docker pull ruales1138/gigashow-frontend:latest
docker run --rm -p 8080:80 ruales1138/gigashow-frontend:latest
```

Prueba esperada:

- [Abrir frontend local](http://localhost:8081)

El puerto `8081` se usa cuando la aplicación se inicia con Docker Compose. El
puerto `8080` corresponde a la ejecución independiente de la imagen.

## 3. Backend

El backend expone la API y verifica la conexión a PostgreSQL antes de iniciar:

- [Dockerfile del backend](./backend/Dockerfile)
- [README del backend](./backend/README.md)
- [Imagen en DockerHub](https://hub.docker.com/r/ruales1138/gigashow-backend)
- [Endpoint de salud](http://localhost:3001/health)
- [Endpoint de salud de la base de datos](http://localhost:3001/health/db)
- [Swagger UI](http://localhost:3001/api-docs/)
- [Documento OpenAPI JSON](http://localhost:3001/openapi.json)

Descargar la imagen:

```powershell
docker pull ruales1138/gigashow-backend:latest
```

## 4. Base de datos y esquema

La base de datos se ejecuta con PostgreSQL 16 y utiliza un volumen persistente.
El esquema inicial se crea desde:

- [backend/db/init.sql](./backend/db/init.sql)
- [Modelo Drizzle de autenticación](./backend/src/schemas/auth.schema.js)
- [Modelo Drizzle de aplicación](./backend/src/schemas/app.schema.js)

Tablas principales:

- `user`
- `session`
- `account`
- `verification`
- `artist_profiles`
- `bookings`
- `artist_ratings`

## 5. Docker Compose

El archivo [docker-compose.yml](./docker-compose.yml) define los servicios:

```text
frontend  -> http://localhost:8081
backend   -> http://localhost:3001
database  -> localhost:5432
```

Levantar todos los servicios:

```powershell
docker compose up --build -d
```

Verificar el estado:

```powershell
docker compose ps
```

Resultado esperado:

```text
pequennas_fiestas-frontend-1   Up
pequennas_fiestas-backend-1    Up
pequennas_fiestas-database-1   Up (healthy)
```

La comunicación interna usa la red creada automáticamente por Compose. El
backend se conecta a PostgreSQL mediante el nombre de servicio `database`:

```text
postgresql://gigashow:gigashow_dev_password@database:5432/gigashow
```

Detener los servicios:

```powershell
docker compose down
```

Eliminar también el volumen de datos:

```powershell
docker compose down -v
```

## 6. Flujo completo de prueba

### 6.1 Frontend

Abrir [http://localhost:8081](http://localhost:8081).

Prueba HTTP desde PowerShell:

```powershell
Invoke-WebRequest http://localhost:8081/
```

Resultado verificado:

```text
HTTP 200
```

### 6.2 Backend

Abrir [http://localhost:3001/health](http://localhost:3001/health).

```powershell
Invoke-WebRequest http://localhost:3001/health
```

Respuesta verificada:

```json
{"ok":true}
```

### 6.3 Backend y base de datos

Abrir [http://localhost:3001/health/db](http://localhost:3001/health/db).

```powershell
Invoke-WebRequest http://localhost:3001/health/db
```

Respuesta verificada:

```json
{"ok":true,"dbTime":"..."}
```

Esta respuesta demuestra que el backend consultó PostgreSQL correctamente.

### 6.4 Swagger/OpenAPI

Abrir [Swagger UI](http://localhost:3001/api-docs/).

También se puede consultar el documento directamente en
[openapi.json](http://localhost:3001/openapi.json).

Resultado verificado:

```text
Swagger UI: HTTP 200
OpenAPI JSON: HTTP 200
```

## 7. Historias de usuario y trazabilidad

Las historias de esta entrega mantienen la trazabilidad con las historias
definidas en la Entrega 1. Se actualizan sus criterios de aceptación,
responsables y estados según la implementación actual.

| ID | Historia de usuario | Criterios de aceptación | Responsable | Estado |
| --- | --- | --- | --- | --- |
| HU-01 | Como cliente, quiero registrarme e iniciar sesión para acceder a las opciones de reserva. | El usuario puede registrarse, iniciar sesión y mantener una sesión activa mediante la API de autenticación. | Alejandro Ruiz Diaz | Implementada |
| HU-02 | Como cliente, quiero ver el catálogo de shows y servicios de fiesta para elegir la mejor opción. | El catálogo carga los servicios disponibles y permite consultar los detalles de un artista. | Miguel Angel Martinez Tamayo | Implementada |
| HU-03 | Como cliente, quiero reservar un servicio seleccionando la fecha de mi evento. | El cliente autenticado puede enviar una solicitud de reserva con la información del evento y visualizar el resultado. | Alejandro Ruiz Diaz | Implementada |
| HU-04 | Como proveedor, quiero subir fotos de mi espectáculo para promocionar mi oferta. | El proveedor autenticado puede cargar imágenes válidas y el sistema las almacena para su consulta. | Miguel Angel Martinez Tamayo | Implementada |
| HU-05 | Como administrador, quiero ver la lista general de usuarios para auditar el sistema. | El administrador puede consultar un listado protegido de usuarios y servicios registrados. | Heiver David Ruales Luna | No iniciada |
| HU-06 | Como proveedor, quiero configurar mi perfil para publicar mi información y servicios. | El proveedor puede completar y guardar la información de su perfil mediante el flujo de onboarding. | Miguel Angel Martinez Tamayo | Implementada |

HU-06 es una ampliación del alcance definida después de la Entrega 1. La
verificación de `/health`, `/health/db` y Swagger se considera una actividad
técnica de validación del sistema, no una historia de usuario independiente.

## 8. Pruebas unitarias

Prueba implementada:

- [Prueba unitaria de OpenAPI](./backend/test/openapi.test.js)

Ejecutar:

```powershell
cd backend
npm ci
npm test
```

Resultado verificado:

```text
2 tests passed
0 failed
```

## 9. Pruebas iniciales con Playwright

Configuración y pruebas:

- [Configuración de Playwright](./frontend/playwright.config.js)
- [Pruebas de flujos críticos](./frontend/tests/critical-flows.spec.js)

Las pruebas verifican:

- Carga de la página principal.
- Título `GigaShow`.
- Renderizado del contenedor principal de React.
- Navegación directa a `/catalog`.
- Funcionamiento del fallback de rutas SPA servido por Nginx.

Ejecutar:

```powershell
cd frontend
npm ci
npx playwright install chromium
npm run test:e2e
```

Resultado verificado:

```text
2 passed
0 failed
```

## 10. Git, ramas y submódulos

El monorepo utiliza los siguientes submódulos:

- [Submódulo frontend](https://github.com/ruales1138/pequennas_fiestas-frontend)
- [Submódulo backend](https://github.com/ruales1138/pequennas_fiestas-backend)
- [Configuración .gitmodules](./.gitmodules)

Los tres repositorios tienen rama principal `main`.

Clonar todo el proyecto:

```powershell
git clone --recurse-submodules https://github.com/ruales1138/pequennas_fiestas.git
cd pequennas_fiestas
```

Si el repositorio se clonó sin submódulos:

```powershell
git submodule update --init --recursive
```

## 11. Resumen de cumplimiento

| Requisito | Estado |
| --- | --- |
| Frontend con Dockerfile | Cumplido |
| Backend con Dockerfile | Cumplido |
| Base de datos con esquema | Cumplido |
| Docker Compose con frontend, backend y database | Cumplido |
| Comunicación frontend-backend | Verificada |
| Comunicación backend-base de datos | Verificada |
| Swagger/OpenAPI | Cumplido |
| Rama principal en los repositorios | Cumplido |
| Monorepo con submódulos | Cumplido |
| Imágenes publicadas en DockerHub | Cumplido |
| README de instalación y ejecución | Cumplido |
| Historias con responsables | Cumplido |
| Pruebas unitarias | 2 pruebas exitosas |
| Pruebas Playwright | 2 pruebas exitosas |
