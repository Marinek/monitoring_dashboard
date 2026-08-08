## 1. Node Exporter Configuration

- [x] 1.1 Add `node-exporter` container service to `docker-compose.yml`
- [x] 1.2 Update `prometheus.yml` scrape targets to include `node-exporter:9100`

## 2. Alert Simulation via alert.sh

- [x] 2.1 Create `alert_rules.yml` for Prometheus rule evaluations
- [x] 2.2 Create executable `./alert.sh` script to toggle/trigger simulated alerts
- [x] 2.3 Mount `alert_rules.yml` in `docker-compose.yml` and update `prometheus.yml`

## 3. Verification

- [x] 3.1 Verify triggered alerts appear in backend `/api/alerts` and Command Center UI
