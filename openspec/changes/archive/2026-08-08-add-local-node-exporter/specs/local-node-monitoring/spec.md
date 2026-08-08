## ADDED Requirements

### Requirement: Local Host Node Exporter Integration
The system SHALL configure Node Exporter service in Docker Compose and scrape its metrics via Prometheus.

#### Scenario: Prometheus scrapes node exporter
- **WHEN** Prometheus service starts with `docker-compose.yml`
- **THEN** Prometheus successfully scrapes `node-exporter:9100` and reports `up == 1` for the node target

### Requirement: Alert Simulation via Helper Script
The project SHALL include an `alert.sh` script to simulate active Prometheus alerts or push synthetic alerts into the system.

#### Scenario: Running alert simulation script
- **WHEN** the user executes `./alert.sh`
- **THEN** an active alert rule is generated or triggered in Prometheus and displayed in the Command Center UI ACTIVE ALERTS section
