# ==============================================================================
# Script para generar Secrets en Kubernetes (Minikube)
# ==============================================================================

set -euo pipefail

ENV_FILE=".env.k8s"
NAMESPACE="pequennas-fiestas"

if [ ! -f "$ENV_FILE" ] && [ -f "../$ENV_FILE" ]; then
  ENV_FILE="../$ENV_FILE"
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Error: No se encontró el archivo $ENV_FILE"
  echo "Copia la plantilla y configura tus credenciales:"
  echo "    cp .env.k8s.example .env.k8s"
  exit 1
fi

echo "🔍 Cargando configuración desde $ENV_FILE..."
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a


: "${K8S_DB_NAME:?K8S_DB_NAME no está definido}"
: "${K8S_DB_USER:?K8S_DB_USER no está definido}"
: "${K8S_DB_PASSWORD:?K8S_DB_PASSWORD no está definido}"
: "${K8S_AUTH_SECRET:?K8S_AUTH_SECRET no está definido}"


if [[ "$K8S_DB_PASSWORD" == *"CAMBIAR"* ]] || [[ "$K8S_AUTH_SECRET" == *"CAMBIAR"* ]]; then
  echo "⚠️  ADVERTENCIA: Estás usando contraseñas de ejemplo de la plantilla."
  echo "    Para producción, actualiza $ENV_FILE con contraseñas seguras."
fi


if ! kubectl get namespace "$NAMESPACE" >/dev/null 2>&1; then
  echo "Creando namespace $NAMESPACE..."
  kubectl create namespace "$NAMESPACE"
fi

echo "Aplicando postgres-secret..."
kubectl create secret generic postgres-secret \
  --namespace="$NAMESPACE" \
  --from-literal=POSTGRES_DB="$K8S_DB_NAME" \
  --from-literal=POSTGRES_USER="$K8S_DB_USER" \
  --from-literal=POSTGRES_PASSWORD="$K8S_DB_PASSWORD" \
  --dry-run=client -o yaml | kubectl apply -f -

DATABASE_URL="postgresql://${K8S_DB_USER}:${K8S_DB_PASSWORD}@postgres-service:5432/${K8S_DB_NAME}"

echo "Aplicando backend-secret..."
kubectl create secret generic backend-secret \
  --namespace="$NAMESPACE" \
  --from-literal=DATABASE_URL="$DATABASE_URL" \
  --from-literal=BETTER_AUTH_SECRET="$K8S_AUTH_SECRET" \
  --dry-run=client -o yaml | kubectl apply -f -

echo "✅ Secrets creados exitosamente en el namespace '$NAMESPACE':"
kubectl get secrets -n "$NAMESPACE"
