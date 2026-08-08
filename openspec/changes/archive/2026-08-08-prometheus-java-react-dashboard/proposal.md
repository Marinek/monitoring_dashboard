## Why

Organizations monitoring virtualized infrastructure and Kubernetes clusters using Prometheus need a dedicated, futuristic, high-performance monitoring dashboard ("Kubimetrics VM & Cluster Command Center") that visualizes real-time metrics (VM health, CPU/RAM utilization, storage, network traffic, active alarms) powered by a robust Spring Boot Java backend and modern React frontend with Tailwind CSS and Chart.js.

Additionally, to allow effortless local developer experience and quick evaluation:
- A `docker-compose.yml` file with standard Prometheus configuration will be provided.
- A comprehensive `README.md` will document local setup, APIs, and stack details.
- A quickstart script `start.sh` will automate building, launching Prometheus, Backend, and Frontend.

## What Changes

- **Java Backend (Spring Boot)**:
  - Prometheus integration via Spring Web / REST API client (`/api/v1/query`, `/api/v1/query_range`, `/api/v1/alerts`).
  - Spring WebSockets / STOMP or Server-Sent Events (SSE) for real-time metric updates to the frontend.
  - Proxy endpoints for proxying or aggregating Prometheus query metrics safely with mock data fallback when Prometheus is unreachable.
- **React Frontend**:
  - Implementation of the exact layout, cyberpunk aesthetic, fonts (Orbitron, Rajdhani, Share Tech Mono), color system, scanline HUD effects, animated canvas background, and interactive controls from `kubimetrics_vm_operations_command_center.html`.
  - Chart.js graphs for CPU/Memory, Storage I/O, Network traffic, and Cluster Node metrics.
  - Interactive VM Instance tables, Alert Feed, and Time-range controls.
- **Infrastructure & DX Scripts**:
  - `docker-compose.yml` for launching Prometheus locally.
  - `README.md` with complete architecture overview and instructions.
  - `start.sh` executable script for one-click startup.

## Capabilities

### New Capabilities
- `prometheus-backend-api`: Spring Boot REST and WebSocket API that connects to Prometheus TSDB to query VM and cluster metrics and streaming real-time alerts.
- `command-center-ui`: React-based single page dashboard rendering the futuristic Kubimetrics Command Center layout with Chart.js visualization, real-time data polling/streaming, and full interactive filters.
- `local-dev-environment`: Prometheus Docker Compose setup, project README.md, and `start.sh` launch script for instant single-command setup.

### Modified Capabilities
None.

## Impact

- **New Components**:
  - `backend/`: Java 17+ Spring Boot application.
  - `frontend/`: React + Vite client application with Tailwind CSS and Chart.js.
  - `docker-compose.yml` & `prometheus.yml`: Local Prometheus service.
  - `README.md`: Project documentation.
  - `start.sh`: Local orchestration script.
