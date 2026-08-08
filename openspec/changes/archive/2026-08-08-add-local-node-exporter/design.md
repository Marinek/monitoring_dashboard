## Context

The monitoring dashboard displays Prometheus target metrics. To test live telemetry on the local developer machine, Prometheus needs a node exporter target configured to collect host OS metrics.

## Goals / Non-Goals

**Goals:**
- Add `node-exporter` service in `docker-compose.yml`.
- Configure `prometheus.yml` to scrape `node-exporter:9100`.
- Verify the local host node appears dynamically in the Command Center UI.

**Non-Goals:**
- Production security hardening of node-exporter metrics.

## Decisions

- **Node Exporter Container**: Use `prom/node-exporter:latest` in Docker Compose exposed on port 9100.
- **Prometheus Scrape Job**: Add `node-exporter` scrape job to `prometheus.yml` with target `node-exporter:9100`.

## Risks / Trade-offs

- **[Risk]**: Port 9100 already in use on host.
  → **Mitigation**: Standardize on port 9100 inside the Docker network and map externally if needed.
