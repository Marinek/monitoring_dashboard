#!/usr/bin/env bash
set -e

echo "=========================================================="
echo " 🚨 Kubimetrics Prometheus Alert Simulator Script "
echo "=========================================================="

ACTION="${1:-trigger}"

if [ "$ACTION" = "trigger" ]; then
    echo "⚡ Injecting active alert rule into Prometheus..."
    cat <<EOF > alert_rules.yml
groups:
  - name: simulated_alerts
    rules:
      - alert: HostHighCpuLoad
        expr: vector(1)
        for: 0m
        labels:
          severity: critical
          alertname: HostHighCpuLoad
        annotations:
          summary: "CRITICAL: CPU Load on local node exceeded 95%"
          description: "Node CPU utilization is critically high."
      - alert: MemoryPressureWarning
        expr: vector(1)
        for: 0m
        labels:
          severity: warning
          alertname: MemoryPressureWarning
        annotations:
          summary: "WARNING: High memory usage detected on host"
EOF
    echo "✅ Alert rules updated."
elif [ "$ACTION" = "clear" ]; then
    echo "🧹 Clearing simulated alert rules..."
    cat <<EOF > alert_rules.yml
groups:
  - name: simulated_alerts
    rules: []
EOF
    echo "✅ Alert rules cleared."
else
    echo "Usage: ./alert.sh [trigger|clear]"
    exit 1
fi

# Reload Prometheus configuration if container is running
if command -v docker &> /dev/null && docker ps | grep -q kubimetrics-prometheus; then
    echo "🔄 Reloading Prometheus configuration..."
    curl -X POST http://localhost:9091/-/reload 2>/dev/null || docker restart kubimetrics-prometheus 2>/dev/null || true
    echo "✅ Prometheus reloaded."
fi

echo ""
echo "Current Alerts in Dashboard:"
echo "👉 Open http://localhost:8080 or check http://localhost:8080/api/alerts"
