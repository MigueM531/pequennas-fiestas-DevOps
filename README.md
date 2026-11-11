# Pequeñas Fiestas (GigaShow)

Monorepo de la plataforma **GigaShow** para conectar clientes con artistas profesionales y gestionar reservas, calificaciones y auditoría administrativa.

---

## 1. Estructura del Proyecto y Repositorios

Este repositorio articula dos submódulos Git independientes:

- **`backend/`** ([Ruales1138/pequennas_fiestas-backend](https://github.com/Ruales1138/pequennas_fiestas-backend)): API RESTful en **Node.js 22**, **Express 5**, **TypeScript**, **Prisma ORM**, **PostgreSQL**, **JWT + Bcrypt** y **Supabase Storage** bajo Arquitectura Limpia.
- **`frontend/`** ([Ruales1138/pequennas_fiestas-frontend](https://github.com/Ruales1138/pequennas_fiestas-frontend)): Aplicación web en **Next.js 16 (App Router)**, **React 19**, **TypeScript** y **Tailwind CSS 4**.

---

## 2. Reparto de Tareas del Equipo

| Integrante | Área / Rol | Entregables Principales |
| --- | --- | --- |
| **Tomás Buriticá (Buri)** | Backend Base, Prisma & Storage | Migración a TypeScript, arquitectura limpia de 4 capas (`domain`, `application`, `infrastructure`, `interface`), Prisma ORM y migraciones, CRUD de entidades (`artists`, `bookings`, `ratings`) con paginación/filtros/borrado lógico, y subida de imágenes a Supabase Storage. |
| **David Ruales** | Frontend Next.js & Experiencia de Usuario | Migración del frontend a Next.js App Router con TypeScript, catálogo con filtros dinámicos, detalle de artista, reservas, cliente HTTP centralizado y diseño responsivo. |
| **Juan Sebastián Pinilla Giraldo** | Autenticación JWT, Roles, Panel Admin & Pruebas | Endpoints `/api/auth/register` y `/api/auth/login` con JWT y `bcrypt`, seed de base de datos (`admin` y `user`), middlewares `requireAuth` y `requireRole`, rutas y panel administrativo (`/api/admin/*` y `/admin`), pruebas unitarias y E2E con Playwright, y despliegue en Render/Vercel. |

---

## 3. Clonar e Inicializar el Proyecto

```bash
git clone --recurse-submodules https://github.com/Ruales1138/pequennas_fiestas.git
cd pequennas_fiestas
```

Si ya clonaste el repositorio sin submódulos:

```bash
git submodule update --init --recursive
```

---

## 4. Configuración y Ejecución Local

### 4.1 Backend (`backend/`)
1. Copiar `.env.example` a `.env` y configurar `DATABASE_URL` y `JWT_SECRET`.
2. Instalar dependencias, ejecutar migraciones y correr el seed:
   ```bash
   cd backend
   npm install
   npx prisma migrate deploy
   npm run seed
   npm run dev
   ```

### 4.2 Frontend (`frontend/`)
1. Copiar `.env.example` a `.env` (`NEXT_PUBLIC_API_URL=http://localhost:3000`).
2. Instalar dependencias y levantar el servidor de desarrollo:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 5. Credenciales de Prueba (Seed)

| Rol | Correo electrónico | Contraseña de prueba | Acceso |
| --- | --- | --- | --- |
| **Administrador (`admin`)** | `admin@gigashow.com` | `Admin123!` | Panel `/admin` y gestión completa de recursos |
| **Usuario estándar (`user`)** | `user@gigashow.com` | `User123!` | Catálogo, reservas y calificaciones (`403` en `/admin`) |
| **Cliente (`cliente`)** | `cliente@gigashow.com` | `Cliente123!` | Catálogo, reservas y calificaciones (`403` en `/admin`) |
| **Artista (`artista`)** | `artista@gigashow.com` | `Artista123!` | Panel `/dashboard` de artista |

---

## 6. Pruebas y Aseguramiento de Calidad

- **Pruebas Unitarias (Backend):**
  ```bash
  cd backend
  npm run build
  npm test
  ```
- **Linter, Compilación y Pruebas E2E con Playwright (Frontend):**
  ```bash
  cd frontend
  npm run lint
  npm run build
  npm run test:e2e
  ```

---

## 7. Despliegue en Producción

- **Frontend Next.js (Vercel):** [https://pequennasfiestas-frontend.vercel.app/](https://pequennasfiestas-frontend.vercel.app/) (`Ruales1138/pequennas_fiestas-frontend`)
- **Backend + PostgreSQL (Render):** [https://pequennas-fiestas-backend.onrender.com](https://pequennas-fiestas-backend.onrender.com) (`Ruales1138/pequennas_fiestas-backend`)
  - **Salud de API:** [https://pequennas-fiestas-backend.onrender.com/health](https://pequennas-fiestas-backend.onrender.com/health)
  - **Salud de Base de Datos:** [https://pequennas-fiestas-backend.onrender.com/health/db](https://pequennas-fiestas-backend.onrender.com/health/db)
  - **Documentación OpenAPI (Swagger):** [https://pequennas-fiestas-backend.onrender.com/api-docs](https://pequennas-fiestas-backend.onrender.com/api-docs)
