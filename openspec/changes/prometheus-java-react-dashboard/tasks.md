## 1. Project Setup & Architecture

- [x] 1.1 Scaffold Java Spring Boot backend project with Maven/Gradle (`backend/`)
- [x] 1.2 Scaffold React Vite frontend project with Tailwind CSS (`frontend/`)

## 2. Java Spring Boot Prometheus Service Implementation

- [x] 2.1 Create Prometheus WebClient service to query metrics (`/api/v1/query`, `/api/v1/query_range`, `/api/v1/alerts`)
- [x] 2.2 Implement synthetic dynamic metrics generator fallback when Prometheus TSDB is offline
- [x] 2.3 Expose REST Controller for metrics summary, alerts, and VM instance status
- [x] 2.4 Add CORS support for React frontend connection

## 3. React Cyberpunk Command Center UI Implementation

- [x] 3.1 Setup Tailwind CSS configuration matching Cyberpunk theme (`cyber-*` palette, Orbitron/Rajdhani/Share Tech Mono fonts, glassmorphism styles)
- [x] 3.2 Implement Header, Canvas Fiber Background animation, and System Operational HUD controls
- [x] 3.3 Build dynamic visual chart components using Chart.js (CPU/RAM, Storage I/O, Network Traffic, Node Status)
- [x] 3.4 Build VM Instances data grid table with real-time filtering, search, and status indicators
- [x] 3.5 Build Active Alerts log panel feed with severity filtering

## 4. Local Infrastructure & Tooling

- [x] 4.1 Create `docker-compose.yml` and `prometheus.yml` for running local Prometheus instance
- [x] 4.2 Create `start.sh` bash script to easily spin up Prometheus, Java Backend, and React Frontend
- [x] 4.3 Create comprehensive `README.md` with setup instructions and architecture details

## 5. Integration & End-to-End Verification

- [x] 5.1 Connect React Client to Java Spring Boot REST API
- [x] 5.2 Verify time range toggling (5m, 15m, 1h, 24h) and live metrics update cycle
