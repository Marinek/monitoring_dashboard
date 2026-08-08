package com.kubimetrics.dashboard.service;

import com.kubimetrics.dashboard.model.AlertDTO;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AlertService {

    private final PrometheusService prometheusService;
    // Track acknowledged alerts by alert fingerprint/ID -> acknowledged timestamp string
    private final Map<String, String> acknowledgedAlerts = new ConcurrentHashMap<>();

    public AlertService(PrometheusService prometheusService) {
        this.prometheusService = prometheusService;
    }

    public List<AlertDTO> getAlerts() {
        Map<String, Object> promAlerts = prometheusService.getAlerts();
        List<AlertDTO> result = new ArrayList<>();

        if (promAlerts != null && "success".equals(promAlerts.get("status"))) {
            Map<String, Object> data = (Map<String, Object>) promAlerts.get("data");
            List<Map<String, Object>> alerts = data != null ? (List<Map<String, Object>>) data.get("alerts") : Collections.emptyList();

            for (Map<String, Object> alert : alerts) {
                Map<String, Object> rawLabels = (Map<String, Object>) alert.get("labels");
                Map<String, Object> rawAnnotations = (Map<String, Object>) alert.get("annotations");

                Map<String, String> labels = convertMap(rawLabels);
                Map<String, String> annotations = convertMap(rawAnnotations);

                String alertname = labels.getOrDefault("alertname", "UnknownAlert");
                String severity = labels.getOrDefault("severity", "warning");
                String instance = labels.getOrDefault("instance", "unknown");
                String job = labels.getOrDefault("job", "unknown");
                String activeAt = String.valueOf(alert.getOrDefault("activeAt", Instant.now().toString()));

                // Include activeAt to ensure a re-created/new alert instance gets a new ID and resets acknowledgement state
                String id = generateAlertId(alertname, instance, job, severity, activeAt);

                String title = annotations.getOrDefault("summary", alertname);
                String description = annotations.getOrDefault("description", "No description available.");
                String state = String.valueOf(alert.getOrDefault("state", "firing"));

                boolean isAcked = acknowledgedAlerts.containsKey(id);
                String status = isAcked ? "ACKNOWLEDGED" : "ACTIVE";
                String acknowledgedAt = acknowledgedAlerts.get(id);

                AlertDTO dto = new AlertDTO(
                        id, alertname, severity, title, description,
                        state, status, activeAt, acknowledgedAt, labels, annotations
                );
                result.add(dto);
            }
        }
        return result;
    }

    public boolean acknowledgeAlert(String alertId) {
        if (alertId == null || alertId.isBlank()) {
            return false;
        }
        acknowledgedAlerts.put(alertId, Instant.now().toString());
        return true;
    }

    private String generateAlertId(String alertname, String instance, String job, String severity, String activeAt) {
        String raw = alertname + "|" + instance + "|" + job + "|" + severity + "|" + activeAt;
        return Integer.toHexString(raw.hashCode());
    }

    private Map<String, String> convertMap(Map<String, Object> input) {
        if (input == null) return Collections.emptyMap();
        Map<String, String> res = new HashMap<>();
        for (Map.Entry<String, Object> entry : input.entrySet()) {
            res.put(entry.getKey(), String.valueOf(entry.getValue()));
        }
        return res;
    }
}

