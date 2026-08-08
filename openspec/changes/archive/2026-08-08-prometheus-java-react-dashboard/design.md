## Context

The requirement is to create a full-stack Prometheus Monitoring Dashboard ("Kubimetrics VM & Cluster Command Center") consisting of a Java Spring Boot backend server and a React frontend application based on the design, metrics layout, cyberpunk aesthetic, styling, canvas animations, and Chart.js visualizations in `kubimetrics_vm_operations_command_center.html`. Furthermore, local execution will be streamlined with Docker Compose, documentation, and a `start.sh` script.

## Goals / Non-Goals

**Goals:**
- **Java Spring Boot Backend**:
  - Expose REST APIs to fetch current and historical Prometheus metrics (`/api/v1/query`, `/api/v1/query_range`, `/api/v1/alerts`).
  - Graceful fallback: when live Prometheus server is unavailable, provide synthetic dynamic Prometheus-compatible metric data generator so the dashboard runs out of the box.
  - WebSocket / SSE endpoint for streaming real-time status and alerts.
- **React Frontend**:
  - Replicate the exact visual layout, dark cyberpunk theme (`#050914`, Orbitron/Rajdhani/Share Tech Mono fonts, cyan glowing panels, scanlines, fiber canvas background).
  - Embed dynamic visual charts (Chart.js) for CPU/Memory cluster performance, Storage I/O throughput, Network bandwidth, and Node status metrics.
  - Interactive controls: time range filters (5m, 15m, 1h, 24h), dynamic refresh triggers, VM instance search & table filters, interactive alert logs.
- **Local Dev Automation & DX**:
  - Docker Compose setup containing Prometheus container and scrape targets configuration.
  - Comprehensive `README.md` file.
  - Executable `start.sh` script to boot services conveniently.

**Non-Goals:**
- Multi-tenant OAuth2/SSO user authentication (can be added later).
- Direct cluster write/command execution (dashboard is read-only command center).

## Decisions

1. **Tech Stack**:
   - **Backend**: Java 17, Spring Boot 3, Spring Web, Spring WebSocket / WebFlux WebClient for Prometheus HTTP API integration.
   - **Frontend**: React 18, Vite, Tailwind CSS with customized Cyberpunk theme, Chart.js (`react-chartjs-2`), FontAwesome icons.
   - **Infrastructure**: Docker Compose (`prom/prometheus`), Bash script (`start.sh`).
2. **Prometheus Data Integration Strategy**:
   - WebClient configured with configurable Prometheus base URL (`http://localhost:9090` by default).
   - Dynamic Mock Metrics Provider as secondary fallback when Prometheus ping/query fails, returning realistic series for cluster nodes, VMs, CPU, RAM, Network, Storage, and Alerts.

## Risks / Trade-offs

- **[Risk]**: Docker or Prometheus container may not be running locally.
  → **Mitigation**: Implement robust fallback service in Java backend that auto-detects Prometheus availability and seamlessly serves mock operational data; `start.sh` checks for docker availability.
