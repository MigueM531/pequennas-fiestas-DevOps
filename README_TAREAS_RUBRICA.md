# Tareas pendientes según la rúbrica

## Reparto

| Persona | Responsabilidad principal |
| --- | --- |
| **Buri** | Backend, base de datos, Prisma, CRUD y almacenamiento de imágenes |
| **Pinilla** | JWT, roles, administración, seed, pruebas, documentación y despliegue |
| **Ruales** | Frontend, Next.js, TypeScript, vistas, UX y cliente HTTP |

Las tres personas deben revisar la integración y validar el resultado final.

---

## Buri — Backend, base de datos y API

### Arquitectura y tecnologías

- [x] Migrar el backend de JavaScript a TypeScript.
- [x] Crear `tsconfig.json` y migrar los archivos principales a `.ts`.
- [x] Organizar el backend en `domain`, `application`, `infrastructure` e
  `interface`.
- [x] Evitar que los controladores accedan directamente a Prisma.

### Base de datos

- [x] Migrar Drizzle/SQL a Prisma.
- [x] Crear `prisma/schema.prisma` y migraciones reproducibles.
- [x] Mantener como mínimo `User`, `ArtistProfile`, `Booking` y `ArtistRating`.
- [x] Mantener las relaciones mediante llaves foráneas.
- [x] Usar `Decimal` para precios, `DateTime` para fechas y `@unique` donde
  corresponda.
- [x] Agregar campos de borrado lógico como `isActive`, `deletedAt` o `status`.
- [x] Dejar preparado el esquema para los roles `admin` y `user`.

### API REST

- [x] Definir tres recursos de dominio con rutas plurales bajo `/api`.
- [x] Implementar CRUD completo para los tres recursos:
  - `GET` listado.
  - `GET /:id`.
  - `POST`.
  - `PUT` o `PATCH`.
  - `DELETE` lógico.
- [x] Usar códigos HTTP correctos: `200`, `201`, `204`, `400`, `404`, `409` y
  `500`.
- [x] Agregar paginación al listado principal:

```json
{
  "data": [],
  "pagination": {
    "total": 0,
    "currentPage": 1,
    "limit": 10,
    "totalPages": 0
  }
}
```

- [x] Agregar al menos un filtro por categoría, ciudad, texto o precio.
- [x] Mantener respuestas consistentes.

### Imágenes

- [x] Reemplazar el almacenamiento local de Multer por Supabase Storage o S3.
- [x] Validar tipo y tamaño del archivo.
- [x] Guardar en la base de datos la URL resultante.
- [x] Dejar documentado el endpoint para que Pinilla agregue su protección.

---

## Ruales — Frontend, UX y consumo de API

### Arquitectura y tecnologías

- [x] Migrar React/Vite a Next.js con App Router.
- [x] Migrar JavaScript/JSX a TypeScript/TSX.
- [x] Configurar TypeScript y migrar el cliente HTTP centralizado a `.ts`.
- [x] Organizar `app/` para rutas y `src/features/` para funcionalidades.
- [x] Separar cada feature en tipos, servicios, hooks y componentes.
- [x] Mantener Tailwind y eliminar lógica de negocio de las páginas.

### Cliente y sesión

- [x] Crear un cliente HTTP centralizado para la API propia.
- [x] Enviar el JWT en el encabezado `Authorization`.
- [x] Manejar `401` limpiando sesión y redirigiendo al login.
- [x] Persistir el token de sesión al recargar.
- [x] Implementar logout eliminando token y estado de usuario.
- [x] Mostrar estados de cargando, vacío y error.

### Vistas y CRUD

- [x] Completar landing, catálogo, listado, detalle y formularios.
- [x] Implementar crear, editar y eliminar lógicamente desde la interfaz.
- [x] Agregar paginación visual y filtros.
- [x] Agregar formulario de imagen con `multipart/form-data`.
- [x] Mostrar confirmación antes de eliminar.
- [x] Mostrar mensajes de éxito y error.
- [x] Crear componentes reutilizables para la vista administrativa de Pinilla.
- [x] Verificar diseño responsive y corregir textos/ortografía.

### Rutas frontend

- [x] Crear guard para rutas privadas.
- [x] Crear guard para rutas administrativas.
- [x] Proteger dashboard, creación, edición y eliminación.
- [x] Mantener páginas 403 y 404 funcionales.

---

## Pinilla — Autenticación, administración, calidad y entrega

### JWT y contraseñas

- [ ] Implementar `POST /api/auth/register`.
- [ ] Implementar `POST /api/auth/login`.
- [ ] Responder con datos públicos, JWT y expiración.
- [ ] Usar bcrypt para crear y comparar contraseñas.
- [ ] Leer `JWT_SECRET` exclusivamente desde variables de entorno.
- [ ] Responder `409` si el correo ya existe.
- [ ] Responder `401` con mensaje genérico ante credenciales inválidas.
- [ ] Nunca devolver contraseña ni hash.
- [ ] Crear `.env.example` con `DATABASE_URL`, `JWT_SECRET`, `PORT`,
  `FRONTEND_ORIGIN` y variables del almacenamiento.

### Seed y rol administrador

- [ ] Crear `prisma/seed.ts`.
- [ ] Crear mediante el seed un usuario `admin` con correo y contraseña de
  prueba almacenada con bcrypt.
- [ ] Crear mediante el seed un usuario `user` con correo y contraseña de
  prueba almacenada con bcrypt.
- [ ] Impedir que `admin` se registre desde el formulario.
- [ ] Agregar el comando de seed al `package.json`.
- [ ] Documentar las credenciales de prueba sin subir secretos reales.

### Middleware y panel administrativo

- [ ] Implementar middleware centralizado `requireAuth`.
- [ ] Implementar middleware `requireRole`.
- [ ] Token ausente o inválido debe responder `401`.
- [ ] Usuario autenticado sin permiso debe responder `403`.
- [ ] Proteger las rutas administrativas exclusivamente para `admin`.
- [ ] Proteger creación, edición, eliminación y subida de imágenes según rol.
- [ ] Crear una ruta protegida para que `admin` consulte usuarios y recursos.
- [ ] Permitir al administrador gestionar los tres recursos.
- [ ] Permitir activar/desactivar o eliminar lógicamente usuarios y recursos.

### Frontend administrativo

- [ ] Conectar registro y login con los endpoints JWT.
- [ ] Impedir que el formulario frontend permita seleccionar `admin`.
- [ ] Mostrar el panel administrativo únicamente a usuarios `admin`.
- [ ] Integrar los guards preparados por Ruales.
- [ ] Verificar navegación directa y respuesta visual 403.

### Pruebas

- [ ] Agregar pruebas backend para registro, login, bcrypt y JWT.
- [ ] Probar contraseña no expuesta.
- [ ] Probar `401` sin token y `403` sin permisos.
- [ ] Probar acceso permitido para `admin`.
- [ ] Probar seed de `admin` y `user`.
- [ ] Agregar pruebas E2E para registro, login, sesión, logout, creación con
  imagen, edición, eliminación, admin, usuario sin permisos, paginación y
  filtros.
- [ ] Ejecutar build y lint.

### Documentación y despliegue

- [ ] Actualizar el README de cada repositorio con descripción, tecnologías,
  instalación, variables de entorno, reparto, credenciales y URLs públicas.
- [ ] Confirmar que no existan `.env` reales ni credenciales sensibles subidas.
- [ ] Desplegar backend y frontend y comprobar su comunicación.
- [ ] Verificar PostgreSQL de producción y ejecutar el seed.
- [ ] Probar la aplicación usando las URLs de producción.
- [ ] Registrar el proyecto en el Excel y subir los enlaces a UVirtual.

---

## Validación compartida

- [x] Buri verifica esquema, migraciones, CRUD, paginación, filtros e
  imágenes.
- [ ] Ruales verifica vistas, responsive, cliente HTTP y flujo de usuario.
- [ ] Pinilla verifica autenticación, roles, seed, pruebas y despliegue.
- [ ] Las tres personas revisan la integración completa.
- [ ] Revisar el historial de commits de las tres personas.

```text
Backend: npm run build, npm test
Frontend: npm run build, npm run lint, npm run test:e2e
```

## Orden recomendado

1. **Buri:** Prisma, migraciones, CRUD, paginación, filtros e imágenes.
2. **Pinilla:** JWT, seed de `admin` y `user`, middleware y roles.
3. **Ruales:** migración frontend, cliente HTTP, sesión y vistas.
4. **Pinilla:** panel administrativo, pruebas, documentación y despliegue.
5. **Las tres personas:** pruebas integrales y validación en producción.

## Criterio de terminado

Una tarea está terminada cuando funciona localmente, tiene una prueba o validación
correspondiente, está integrada con el resto de la aplicación y funciona en producción cuando
aplica.
