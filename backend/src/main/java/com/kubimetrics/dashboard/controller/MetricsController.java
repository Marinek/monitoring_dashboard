package com.kubimetrics.dashboard.controller;

import com.kubimetrics.dashboard.service.PrometheusService;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MetricsController {

    private final PrometheusService prometheusService;

    public MetricsController(PrometheusService prometheusService) {
        this.prometheusService = prometheusService;
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
                if (value != null && value.size() > 1 && "1".equals(String.valueOf(value.get(1)))) {
                    onlineCount++;
                }
            }
            int total = metricsResult.size();
            result.put("onlineVms", onlineCount);
            result.put("totalVms", total);
            result.put("clusterPods", metricsResult.size());
            result.put("podsReadyPercent", total > 0 ? (onlineCount * 100 / total) : 0);
            result.put("workerNodes", total);
            result.put("avgCpuPercent", 0);
            result.put("meshTrafficGbps", 0);
            result.put("activeAlertsCount", 0);
        } else {
            result.put("onlineVms", 0);
            result.put("totalVms", 0);
            result.put("clusterPods", 0);
            result.put("podsReadyPercent", 0);
            result.put("workerNodes", 0);
            result.put("avgCpuPercent", 0);
            result.put("meshTrafficGbps", 0);
            result.put("activeAlertsCount", 0);
        }
        return result;
    }

    @GetMapping("/vms")
    public List<Map<String, Object>> getVms() {
        Map<String, Object> promData = prometheusService.queryMetrics("up");
        List<Map<String, Object>> vms = new ArrayList<>();

        if (promData != null && "success".equals(promData.get("status"))) {
            Map<String, Object> data = (Map<String, Object>) promData.get("data");
            List<Map<String, Object>> metricsResult = data != null ? (List<Map<String, Object>>) data.get("result") : Collections.emptyList();

            int id = 1;
            for (Map<String, Object> item : metricsResult) {
                Map<String, Object> metricObj = (Map<String, Object>) item.get("metric");
                List<Object> value = (List<Object>) item.get("value");

                String instance = metricObj != null && metricObj.containsKey("instance") ? String.valueOf(metricObj.get("instance")) : "target-" + id;
                String job = metricObj != null && metricObj.containsKey("job") ? String.valueOf(metricObj.get("job")) : "unknown";
                boolean isUp = value != null && value.size() > 1 && "1".equals(String.valueOf(value.get(1)));

                Map<String, Object> vm = new HashMap<>();
                vm.put("id", id++);
                vm.put("name", instance);
                vm.put("ip", instance.split(":")[0]);
                vm.put("role", job);
                vm.put("status", isUp ? "healthy" : "critical");
                vm.put("cpu", 0);
                vm.put("ramGb", 0);
                vm.put("maxRam", 16);
                vm.put("diskMb", 0);
                vm.put("k8sNode", job);
                vms.add(vm);
            }
        }
        return vms;
    }

    @GetMapping("/alerts")
    public List<Map<String, Object>> getAlerts() {
        Map<String, Object> promAlerts = prometheusService.getAlerts();
        List<Map<String, Object>> alertsList = new ArrayList<>();

        if (promAlerts != null && "success".equals(promAlerts.get("status"))) {
            Map<String, Object> data = (Map<String, Object>) promAlerts.get("data");
            List<Map<String, Object>> alerts = data != null ? (List<Map<String, Object>>) data.get("alerts") : Collections.emptyList();

            int id = 1;
            for (Map<String, Object> alert : alerts) {
                Map<String, Object> labels = (Map<String, Object>) alert.get("labels");
                Map<String, Object> annotations = (Map<String, Object>) alert.get("annotations");

                Map<String, Object> item = new HashMap<>();
                item.put("id", id++);
                item.put("severity", labels != null ? labels.getOrDefault("severity", "warning") : "warning");
                item.put("title", annotations != null ? annotations.getOrDefault("summary", "Alert Active") : "Alert Active");
                item.put("source", labels != null ? labels.getOrDefault("alertname", "Prometheus") : "Prometheus");
                item.put("time", String.valueOf(alert.getOrDefault("activeAt", "now")));
                alertsList.add(item);
            }
        }
        return alertsList;
    }
}
