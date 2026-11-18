import test from "node:test";
import assert from "node:assert/strict";

const BACKEND_URL = process.env.TARGET_BACKEND_URL || "http://localhost:3000";
const FRONTEND_URL = process.env.TARGET_FRONTEND_URL || "http://localhost:8081";

test("Pruebas de Integración y Contratos de API", async (t) => {
  await t.test("GET /health responde HTTP 200 con { ok: true }", async () => {
    const res = await fetch(`${BACKEND_URL}/health`);
    assert.equal(res.status, 200, "Debe responder con código 200");

    const data = await res.json();
    assert.deepEqual(data, { ok: true }, "El cuerpo debe ser { ok: true }");
  });

  await t.test("GET /health/db responde HTTP 200 y valida conexión a PostgreSQL", async () => {
    const res = await fetch(`${BACKEND_URL}/health/db`);
    assert.equal(res.status, 200, "Debe responder con código 200");

    const data = await res.json();
    assert.equal(data.ok, true, "data.ok debe ser true");
    assert.ok(data.dbTime, "data.dbTime debe contener la marca temporal del servidor PostgreSQL");
  });

  await t.test("GET /openapi.json entrega la especificación OpenAPI de la aplicación", async () => {
    const res = await fetch(`${BACKEND_URL}/openapi.json`);
    assert.equal(res.status, 200, "Debe responder con código 200");

    const doc = await res.json();
    assert.ok(doc.openapi || doc.swagger, "Debe contener versión de OpenAPI o Swagger");
    assert.ok(doc.info, "Debe contener objeto info");
    assert.ok(doc.paths, "Debe definir endpoints en paths");
  });

  await t.test("GET /api-docs sirve la interfaz interactiva de Swagger UI", async () => {
    const res = await fetch(`${BACKEND_URL}/api-docs/`);
    assert.equal(res.status, 200, "Swagger UI debe estar disponible con código 200");
    const html = await res.text();
    assert.match(html, /swagger-ui/i, "La respuesta debe contener Swagger UI");
  });

  await t.test("GET /api/db/tables lista las tablas de la base de datos inicializada", async () => {
    const res = await fetch(`${BACKEND_URL}/api/db/tables`);
    assert.equal(res.status, 200, "Debe responder con código 200");

    const data = await res.json();
    assert.equal(data.ok, true);
    assert.ok(Array.isArray(data.data), "data.data debe ser un arreglo de tablas");
    assert.ok(data.data.includes("user"), "Debe existir la tabla 'user'");
    assert.ok(data.data.includes("bookings"), "Debe existir la tabla 'bookings'");
    assert.ok(data.data.includes("artist_profiles"), "Debe existir la tabla 'artist_profiles'");
  });

  await t.test("GET Frontend sirve el punto de entrada SPA (index.html)", async () => {
    try {
      const res = await fetch(`${FRONTEND_URL}/`);
      assert.equal(res.status, 200, "Frontend Nginx debe responder con código 200");
      const html = await res.text();
      assert.match(html, /<!doctype html>/i, "Debe devolver documento HTML válido");
    } catch (err) {
      if (process.env.SKIP_FRONTEND_TEST === "true") {
        t.skip("Frontend no evaluado por SKIP_FRONTEND_TEST");
      } else {
        throw err;
      }
    }
  });
});
