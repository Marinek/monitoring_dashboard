## ADDED Requirements

### Requirement: Prometheus Backend Integration
The Java Spring Boot backend SHALL query Prometheus TSDB HTTP API endpoints or generate synthetic fallback data when Prometheus is offline.

#### Scenario: Prometheus endpoint query
- **WHEN** client requests metrics from `/api/metrics/summary`
- **THEN** backend fetches Prometheus metrics or falls back to synthetic metrics and returns aggregated VM and cluster metrics JSON.

#### Scenario: Real-time alerts feed
- **WHEN** client connects to `/api/alerts`
- **THEN** backend provides active warning and critical alerts with status indicators.

### Requirement: Command Center React Frontend
The React frontend SHALL render the futuristic Kubimetrics Command Center design matching the visual styling, canvas animation, metric KPI cards, Chart.js visualizers, VM instance table, and alert logs from `kubimetrics_vm_operations_command_center.html`.

#### Scenario: Dashboard initialization
- **WHEN** user opens the application in a browser
- **THEN** dashboard displays header status, background fiber canvas animation, 6 KPI cards, 4 chart sections, VM instances list, and real-time alert feed.

#### Scenario: Time range selection
- **WHEN** user selects a time range button (5m, 15m, 1h, 24h)
- **THEN** dashboard updates charts and metric request queries accordingly.
