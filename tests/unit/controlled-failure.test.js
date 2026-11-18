import test from "node:test";
import assert from "node:assert/strict";

test("Comprobación de Compuerta de Fallo Controlado", () => {
  const simulateFailure = process.env.SIMULATE_FAILURE === "true";

  if (simulateFailure) {
    assert.fail(
      "FALLO CONTROLADO DE DEMOSTRACIÓN: SIMULATE_FAILURE=true detectado. " +
      "Este fallo previene la promoción del artefacto y el despliegue automático, " +
      "demostrando la política de control de calidad del pipeline CI/CD."
    );
  }

  assert.ok(true, "Compuerta de calidad aprobada: pipeline listo para avanzar.");
});
