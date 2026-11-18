# ==============================================================================
# Verificación de Persistencia de PostgreSQL
# ==============================================================================

set -euo pipefail

MODE="${1:-compose}" # 'compose' o 'k8s'
TEST_ID="persist-$(date +%s)"
TEST_EMAIL="persist_${TEST_ID}@gigashow.test"
TEST_NAME="Prueba Persistencia ${TEST_ID}"

echo "=================================================================="
echo "INICIANDO PRUEBA DE PERSISTENCIA (Modo: $MODE)"
echo "=================================================================="

if [ "$MODE" = "compose" ]; then
  DB_CONTAINER="gigashow-database"
  DB_USER="${POSTGRES_USER:-gigashow}"
  DB_NAME="${POSTGRES_DB:-gigashow}"

  echo "1). Insertando registro de prueba en PostgreSQL ($DB_CONTAINER)..."
  docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" <<EOF
INSERT INTO "user" (id, name, email, role)
VALUES ('$TEST_ID', '$TEST_NAME', '$TEST_EMAIL', 'cliente');
EOF

  echo "2). Verificando que el registro existe antes del reinicio..."
  BEFORE=$(docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -t -A -c "SELECT count(*) FROM \"user\" WHERE id = '$TEST_ID';")
  if [ "$BEFORE" -ne 1 ]; then
    echo "❌ Error: El registro no se guardó correctamente antes del reinicio."
    exit 1
  fi
  echo "✅ Registro insertado exitosamente (id=$TEST_ID)."

  echo "3). Reiniciando contenedor de base de datos..."
  docker compose restart database
  sleep 4

  echo "4). Esperando a que la base de datos vuelva a estar saludable..."
  until docker exec -i "$DB_CONTAINER" pg_isready -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; do
    echo "    Esperando pg_isready..."
    sleep 2
  done

  echo "5). Comprobando persistencia del registro tras reinicio..."
  AFTER=$(docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -t -A -c "SELECT count(*) FROM \"user\" WHERE id = '$TEST_ID';")
  if [ "$AFTER" -eq 1 ]; then
    echo "[ÉXITO]: El registro '$TEST_ID' persistió intacto tras el reinicio del contenedor."
  else
    echo "[FALLO]: El registro no fue encontrado después de reiniciar el contenedor."
    exit 1
  fi

  # Limpieza del registro de prueba
  docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -c "DELETE FROM \"user\" WHERE id = '$TEST_ID';" >/dev/null

elif [ "$MODE" = "k8s" ]; then
  NAMESPACE="pequennas-fiestas"
  echo "1). Insertando registro de prueba en PostgreSQL en Kubernetes..."
  kubectl exec -i -n "$NAMESPACE" deployment/postgres -- psql -U gigashow -d gigashow <<EOF
INSERT INTO "user" (id, name, email, role)
VALUES ('$TEST_ID', '$TEST_NAME', '$TEST_EMAIL', 'cliente');
EOF

  echo "2). Verificando que el registro existe antes del reinicio..."
  BEFORE=$(kubectl exec -i -n "$NAMESPACE" deployment/postgres -- psql -U gigashow -d gigashow -t -A -c "SELECT count(*) FROM \"user\" WHERE id = '$TEST_ID';")
  if [ "$BEFORE" -ne 1 ]; then
    echo "❌ Error: El registro no se guardó en Kubernetes."
    exit 1
  fi
  echo "✅ Registro insertado en k8s (id=$TEST_ID)."

  echo "3). Eliminando pod de postgres para forzar recreación por ReplicaSet..."
  POD_NAME=$(kubectl get pods -n "$NAMESPACE" -l app=postgres -o jsonpath='{.items[0].metadata.name}')
  kubectl delete pod "$POD_NAME" -n "$NAMESPACE"

  echo "4). Esperando a que el nuevo pod alcance estado Running (Ready)..."
  kubectl rollout status deployment/postgres -n "$NAMESPACE"

  echo "5). Comprobando persistencia del registro tras recreación del Pod..."
  AFTER=$(kubectl exec -i -n "$NAMESPACE" deployment/postgres -- psql -U gigashow -d gigashow -t -A -c "SELECT count(*) FROM \"user\" WHERE id = '$TEST_ID';")
  if [ "$AFTER" -eq 1 ]; then
    echo "[ÉXITO]: El registro '$TEST_ID' persistió en el PersistentVolumeClaim (PVC)."
  else
    echo "[FALLO]: El registro no persistió en el nuevo pod."
    exit 1
  fi

  kubectl exec -i -n "$NAMESPACE" deployment/postgres -- psql -U gigashow -d gigashow -c "DELETE FROM \"user\" WHERE id = '$TEST_ID';" >/dev/null
else
  echo "Modo desconocido: $MODE. Usa 'compose' o 'k8s'."
  exit 1
fi

echo "=================================================================="
echo "PRUEBA DE PERSISTENCIA FINALIZADA"
echo "=================================================================="
