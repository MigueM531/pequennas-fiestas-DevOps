import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("Validación de plantillas de entorno y seguridad", async (t) => {
  await t.test(".env.example contiene variables necesarias para Docker Compose", () => {
    const envExamplePath = path.resolve(process.cwd(), ".env.example");
    assert.ok(fs.existsSync(envExamplePath), ".env.example debe existir");

    const content = fs.readFileSync(envExamplePath, "utf-8");
    assert.match(content, /POSTGRES_DB=/, "Debe definir POSTGRES_DB");
    assert.match(content, /POSTGRES_USER=/, "Debe definir POSTGRES_USER");
    assert.match(content, /POSTGRES_PASSWORD=/, "Debe definir POSTGRES_PASSWORD");
    assert.match(content, /BACKEND_PORT=3000/, "Puerto de backend debe alinearse a 3000");
    assert.match(content, /FRONTEND_ORIGIN=http:\/\/localhost:8081/, "FRONTEND_ORIGIN debe permitir 8081");
    assert.match(content, /BETTER_AUTH_SECRET=/, "Debe definir plantilla de BETTER_AUTH_SECRET");
  });

  await t.test(".env.k8s.example contiene variables para Kubernetes sin contraseñas fijas", () => {
    const k8sEnvPath = path.resolve(process.cwd(), ".env.k8s.example");
    assert.ok(fs.existsSync(k8sEnvPath), ".env.k8s.example debe existir");

    const content = fs.readFileSync(k8sEnvPath, "utf-8");
    assert.match(content, /K8S_DB_NAME=/, "Debe definir K8S_DB_NAME");
    assert.match(content, /K8S_DB_USER=/, "Debe definir K8S_DB_USER");
    assert.match(content, /K8S_DB_PASSWORD=/, "Debe definir K8S_DB_PASSWORD");
    assert.match(content, /K8S_AUTH_SECRET=/, "Debe definir K8S_AUTH_SECRET");
  });

  await t.test(".gitignore protege archivos con credenciales reales", () => {
    const gitignorePath = path.resolve(process.cwd(), ".gitignore");
    const content = fs.readFileSync(gitignorePath, "utf-8");

    assert.match(content, /\.env/, "Debe excluir archivos .env");
    assert.match(content, /\.env\.k8s/, "Debe excluir .env.k8s");
    assert.match(content, /k8s\/\*-secret\.yaml/, "Debe excluir secretos declarativos de k8s");
  });

  await t.test("Manifiestos de Kubernetes no contienen credenciales hardcodeadas", () => {
    const k8sDir = path.resolve(process.cwd(), "k8s");
    const files = fs.readdirSync(k8sDir).filter(f => f.endsWith(".yaml") || f.endsWith(".yml"));

    for (const file of files) {
      const content = fs.readFileSync(path.join(k8sDir, file), "utf-8");
      assert.doesNotMatch(content, /kind:\s*Secret/, `El archivo versionado ${file} no debe ser un Secret directo`);
      assert.doesNotMatch(content, /password:\s*["'][^"']+["']/i, `El archivo ${file} no debe tener contraseñas hardcodeadas`);
    }
  });

  await t.test("docker-compose.yml usa variables parametrizadas y dependencias saludables", () => {
    const composePath = path.resolve(process.cwd(), "docker-compose.yml");
    const content = fs.readFileSync(composePath, "utf-8");

    assert.match(content, /\$\{POSTGRES_USER/, "docker-compose debe parametrizar usuario de BD");
    assert.match(content, /\$\{POSTGRES_PASSWORD/, "docker-compose debe parametrizar contraseña de BD");
    assert.match(content, /condition:\s*service_healthy/, "Debe exigir que la BD esté saludable");
  });
});
