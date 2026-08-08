#!/usr/bin/env bash
set -e

echo "=========================================================="
echo " 🚀 Starting Kubimetrics Prometheus Command Center "
echo "=========================================================="

# Check Prerequisites
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+."
    exit 1
fi

if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17+."
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 1. Prometheus Docker Setup
if command -v docker &> /dev/null; then
    echo "🐳 [1/4] Starting Prometheus via Docker Compose..."
    docker compose down -v 2>/dev/null || true
    docker compose up -d
else
    echo "⚠️ Docker not found. Skipping Prometheus container start."
fi

# 2. Build React Frontend
echo "📦 [2/4] Building React Frontend..."
cd "$SCRIPT_DIR/frontend"
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi
npx vite build
echo "✅ Frontend build complete."

# 3. Copy frontend build to Spring Boot static resources
echo "📋 [3/4] Deploying frontend to Spring Boot static resources..."
STATIC_DIR="$SCRIPT_DIR/backend/src/main/resources/static"
rm -rf "$STATIC_DIR"
mkdir -p "$STATIC_DIR"
cp -r "$SCRIPT_DIR/frontend/dist/"* "$STATIC_DIR/"
echo "✅ Frontend deployed to backend."

# 4. Java Spring Boot Backend Setup
echo "⚙️ [4/4] Building and starting Java Spring Boot Backend..."
cd "$SCRIPT_DIR/backend"

if [ ! -f "./gradlew" ] || [ ! -f "./gradle/wrapper/gradle-wrapper.jar" ]; then
    echo "❌ Gradle wrapper jar missing in backend/gradle/wrapper/."
    exit 1
fi

# Kill any existing backend process on port 8080
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
sleep 1

echo ""
echo "=========================================================="
echo " 🎉 Kubimetrics Command Center Starting!"
echo " 🔗 Dashboard URL:    http://localhost:8080"
echo " 🔗 Backend API URL:  http://localhost:8080/api"
echo " 🔗 Prometheus URL:   http://localhost:9091"
echo " 📄 Logs:             stdout below"
echo "=========================================================="
echo ""

# Run Spring Boot (foreground so logs are visible)
./gradlew bootRun
