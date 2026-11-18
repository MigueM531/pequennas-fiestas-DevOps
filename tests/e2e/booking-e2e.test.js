import test from "node:test";
import assert from "node:assert/strict";

const BACKEND_URL = process.env.TARGET_BACKEND_URL || "http://localhost:3000";
const TRUSTED_ORIGIN = "http://localhost:3000";

test("Flujo Funcional E2E - HU-03 Reserva de Artista y Casos de Error", async (t) => {
  const timestamp = Date.now();
  const artistEmail = `artista_${timestamp}@testgigashow.com`;
  const clientEmail = `cliente_${timestamp}@testgigashow.com`;
  const password = "PasswordSeguro123!";

  let artistUserId = null;
  let clientUserId = null;
  let clientCookie = null;
  let createdBookingId = null;

  await t.test("CASO DE ERROR 1: Intento de reserva sin autenticación devuelve HTTP 401", async () => {
    const res = await fetch(`${BACKEND_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": TRUSTED_ORIGIN,
      },
      body: JSON.stringify({
        clientId: "fake-client-id",
        artistId: "fake-artist-id",
        eventDate: new Date(Date.now() + 86400000).toISOString(),
        eventLocation: "Teatro Principal",
        jobHours: 2,
        agreedPrice: 200000,
      }),
    });

    assert.equal(res.status, 401, "Debe rechazar la petición sin sesión con código 401");
    const data = await res.json();
    assert.equal(data.error, "No autorizado");
  });

  await t.test("PASO 1: Registro de usuario Artista en Better Auth", async () => {
    const res = await fetch(`${BACKEND_URL}/api/auth/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": TRUSTED_ORIGIN,
      },
      body: JSON.stringify({
        email: artistEmail,
        password: password,
        name: `Artista Test ${timestamp}`,
        role: "artista",
      }),
    });

    assert.ok(res.status === 200 || res.status === 201, `Sign up de artista debe ser exitoso (status ${res.status})`);
    const data = await res.json();
    artistUserId = data.user?.id || data.id;
    assert.ok(artistUserId, "El artista debe recibir un ID único");

    // Extraer cookie de sesión del artista para configurar su perfil
    const rawCookies = res.headers.get("set-cookie") || "";
    const sessionCookie = rawCookies.split(";")[0];

    // Asignar rol de artista en onboarding para inicializar artist_profiles
    const roleRes = await fetch(`${BACKEND_URL}/api/onboarding/role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": TRUSTED_ORIGIN,
        Cookie: sessionCookie,
      },
      body: JSON.stringify({ role: "artista" }),
    });

    assert.equal(roleRes.status, 200, "Onboarding de rol artista debe ser 200");
  });

  await t.test("PASO 2: Registro e inicio de sesión de usuario Cliente", async () => {
    const res = await fetch(`${BACKEND_URL}/api/auth/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": TRUSTED_ORIGIN,
      },
      body: JSON.stringify({
        email: clientEmail,
        password: password,
        name: `Cliente Test ${timestamp}`,
        role: "cliente",
      }),
    });

    assert.ok(res.status === 200 || res.status === 201, `Sign up de cliente debe ser exitoso (status ${res.status})`);
    const data = await res.json();
    clientUserId = data.user?.id || data.id;
    assert.ok(clientUserId, "El cliente debe recibir un ID único");

    // Guardar cookie de sesión del cliente limpia
    const rawCookies = res.headers.get("set-cookie") || "";
    clientCookie = rawCookies.split(";")[0];
    assert.ok(clientCookie, "Debe entregarse cookie de sesión al autenticarse");
  });

  await t.test("CASO DE ERROR 2: Cliente no puede crear reserva a nombre de otro usuario (HTTP 403)", async () => {
    const res = await fetch(`${BACKEND_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": TRUSTED_ORIGIN,
        Cookie: clientCookie,
      },
      body: JSON.stringify({
        clientId: "otro-id-suplantado",
        artistId: artistUserId,
        eventDate: new Date(Date.now() + 86400000).toISOString(),
        eventLocation: "Calle 10 # 40-20",
        description: "Intento de suplantación",
        jobHours: 2,
        agreedPrice: 150000,
      }),
    });

    assert.equal(res.status, 403, "Debe responder con 403 Forbidden");
    const data = await res.json();
    assert.match(data.error, /no puedes crear una reserva para otro usuario/i);
  });

  await t.test("CASO DE ERROR 3: Artista inexistente produce HTTP 404", async () => {
    const res = await fetch(`${BACKEND_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": TRUSTED_ORIGIN,
        Cookie: clientCookie,
      },
      body: JSON.stringify({
        clientId: clientUserId,
        artistId: "00000000-0000-0000-0000-000000000000",
        eventDate: new Date(Date.now() + 86400000).toISOString(),
        eventLocation: "Calle Falsa 123",
        description: "Artista no existe",
        jobHours: 2,
        agreedPrice: 150000,
      }),
    });

    assert.equal(res.status, 404, "Debe responder con 404 Not Found");
    const data = await res.json();
    assert.match(data.error, /artista no encontrado/i);
  });

  await t.test("PASO 3 (HU-03): Creación exitosa de reserva de servicio (HTTP 201)", async () => {
    const bookingPayload = {
      clientId: clientUserId,
      artistId: artistUserId,
      eventDate: new Date(Date.now() + 172800000).toISOString(), // En 2 días
      eventLocation: "Salón Social Los Laureles, Medellín",
      description: "Serenata de aniversario acústica de 2 horas",
      jobHours: 2,
      agreedPrice: 350000,
    };

    const res = await fetch(`${BACKEND_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": TRUSTED_ORIGIN,
        Cookie: clientCookie,
      },
      body: JSON.stringify(bookingPayload),
    });

    assert.equal(res.status, 201, `Creación de reserva debe responder 201 Created (recibido ${res.status})`);
    const result = await res.json();

    assert.equal(result.message, "Reserva creada exitosamente");
    assert.ok(result.data, "Debe devolver el objeto de la reserva creada");
    assert.equal(result.data.clientId, clientUserId);
    assert.equal(result.data.artistId, artistUserId);
    assert.equal(result.data.status, "pendiente");
    assert.equal(result.data.eventLocation, bookingPayload.eventLocation);

    createdBookingId = result.data.id;
    assert.ok(createdBookingId, "La reserva debe tener un UUID asignado");
  });
});
