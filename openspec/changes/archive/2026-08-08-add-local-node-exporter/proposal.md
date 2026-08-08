## Why

To test real metric collection from the local host system (macOS / Host Machine) in Prometheus and verify live target monitoring in the Kubimetrics Command Center dashboard.

## What Changes

- Update `docker-compose.yml` to run a local Node Exporter container (or host monitoring target).
- Update `prometheus.yml` scrape configuration to scrape host/local metrics (`host.docker.internal:9100` or local node-exporter target).

## Capabilities

### New Capabilities
- `local-node-monitoring`: Scrapes real system metrics from the local machine into Prometheus and visualizes host status in the Command Center.

### Modified Capabilities
None.

## Impact

- `docker-compose.yml`
- `prometheus.yml`
