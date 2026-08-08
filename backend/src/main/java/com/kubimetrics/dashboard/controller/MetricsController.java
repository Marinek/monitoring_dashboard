package com.kubimetrics.dashboard.controller;

import com.kubimetrics.dashboard.model.AlertDTO;
import com.kubimetrics.dashboard.service.AlertService;
import com.kubimetrics.dashboard.service.PrometheusService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MetricsController {

    private final PrometheusService prometheusService;
    private final AlertService alertService;

    public MetricsController(PrometheusService prometheusService, AlertService alertService) {
        this.prometheusService = prometheusService;
        this.alertService = alertService;
    }

    @GetMapping("/metrics/summary")
    public Map<String, Object> getMetricsSummary() {
        Map<String, Object> promData = prometheusService.queryMetrics("up");
        Map<String, Object> result = new HashMap<>();

        if (promData != null && "success".equals(promData.get("status"))) {
            Map<String, Object> data = (Map<String, Object>) promData.get("data");
            List<Map<String, Object>> metricsResult = data != null ? (List<Map<String, Object>>) data.get("result") : Collections.emptyList();

            int onlineCount = 0;
            for (Map<String, Object> metric : metricsResult) {
                List<Object> value = (List<Object>) metric.get("value");
                if (value != null && value.size() > 1 && "1".equals(value.get(1))) {
                    onlineCount++;
                }
            }
            result.put("nodesOnline", onlineCount);
            result.put("totalNodes", metricsResult.size());
            result.put("status", "HEALTHY");
        } else {
            result.put("nodesOnline", 0);
            result.put("totalNodes", 0);
            result.put("status", "UNHEALTHY");
        }
        return result;
    }

    @GetMapping("/vms")
    public List<Map<String, Object>> getVirtualMachines() {
        Map<String, Object> upData = prometheusService.queryMetrics("up");
        Map<String, Object> unameData = prometheusService.queryMetrics("node_uname_info");
        List<AlertDTO> activeAlerts = alertService.getAlerts();

        Map<String, Boolean> upStatusMap = new HashMap<>();
        if (upData != null && "success".equals(upData.get("status"))) {
            Map<String, Object> data = (Map<String, Object>) upData.get("data");
            List<Map<String, Object>> result = data != null ? (List<Map<String, Object>>) data.get("result") : Collections.emptyList();
            for (Map<String, Object> item : result) {
                Map<String, Object> metric = (Map<String, Object>) item.get("metric");
                List<Object> value = (List<Object>) item.get("value");
                if (metric != null && metric.containsKey("instance")) {
                    boolean isUp = value != null && value.size() > 1 && "1".equals(String.valueOf(value.get(1)));
                    upStatusMap.put(String.valueOf(metric.get("instance")), isUp);
                }
            }
        }

        List<Map<String, Object>> vms = new ArrayList<>();
        if (upData != null && "success".equals(upData.get("status"))) {
            Map<String, Object> data = (Map<String, Object>) upData.get("data");
            List<Map<String, Object>> result = data != null ? (List<Map<String, Object>>) data.get("result") : Collections.emptyList();

            int id = 1;
            for (Map<String, Object> item : result) {
                Map<String, Object> metricMeta = (Map<String, Object>) item.get("metric");
                String instance = metricMeta != null ? String.valueOf(metricMeta.getOrDefault("instance", "target-" + id)) : "target-" + id;
                String job = metricMeta != null ? String.valueOf(metricMeta.getOrDefault("job", "prometheus")) : "prometheus";
                boolean isUp = upStatusMap.getOrDefault(instance, true);

                // Check active alerts for this target / instance or global
                boolean hasCritical = false;
                boolean hasWarning = false;
                for (AlertDTO a : activeAlerts) {
                    if ("ACTIVE".equals(a.getStatus())) {
                        if ("critical".equalsIgnoreCase(a.getSeverity())) {
                            hasCritical = true;
                        } else if ("warning".equalsIgnoreCase(a.getSeverity())) {
                            hasWarning = true;
                        }
                    }
                }

                String status = "healthy";
                if (!isUp || hasCritical) {
                    status = "critical";
                } else if (hasWarning) {
                    status = "warning";
                }

                Map<String, Object> vm = new HashMap<>();
                vm.put("id", id++);
                vm.put("name", instance.contains(":") ? instance.split(":")[0] : instance);
                vm.put("instance", instance);
                vm.put("ip", instance.split(":")[0]);
                vm.put("role", job);
                vm.put("status", status);
                vm.put("k8sNode", job);
                vms.add(vm);
            }
        }
        return vms;
    }

    @GetMapping("/alerts")
    public List<AlertDTO> getAlerts() {
        return alertService.getAlerts();
    }

    @PostMapping("/alerts/{id}/acknowledge")
    public ResponseEntity<Map<String, Object>> acknowledgeAlert(@PathVariable("id") String id) {
        boolean success = alertService.acknowledgeAlert(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("alertId", id);
        if (success) {
            response.put("message", "Alert acknowledged successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Failed to acknowledge alert");
            return ResponseEntity.badRequest().body(response);
        }
    }
}
