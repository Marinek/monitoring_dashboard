# Kubimetrics Prometheus Command Center

Futuristic Cyberpunk Monitoring Dashboard for Virtual Machines & Kubernetes Clusters with a Java Spring Boot backend and React frontend.

![Kubimetrics Dashboard Layout](kubimetrics_vm_operations_command_center.html)

## Architecture

- **Backend (`/backend`)**: Java 17 Spring Boot (Gradle build) REST application interfacing with Prometheus TSDB via Spring WebFlux WebClient with automatic mock metrics fallback.
- **Frontend (`/frontend`)**: React 18, Vite, Tailwind CSS (Cyberpunk theme), Chart.js visualizers, fiber canvas background animation.
- **Infrastructure**: `docker-compose.yml` for Prometheus instance, `start.sh` quickstart script.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Java 17+ & Gradle (optional for backend execution)
- Docker & Docker Compose (optional for local Prometheus container)

### One-Click Startup

Run the launch script:
```bash
./start.sh
```

### Manual Component Startup

1. **Prometheus Container (Optional)**:
   ```bash
   docker compose up -d
   ```

2. **Java Spring Boot Backend**:
   ```bash
   cd backend
   gradle bootRun
   # Runs on http://localhost:8080
   ```

3. **React Frontend**:
   ```bash
   cd frontend
   npm install
   npx vite
   # Runs on http://localhost:3000
   ```

## REST API Endpoints

- `GET /api/metrics/summary`: Returns cluster overview metrics (VMs online, CPU load, Memory, Network traffic).
- `GET /api/vms`: Returns status list of 100 Virtual Machine instances.
- `GET /api/alerts`: Returns real-time active system alarms.
