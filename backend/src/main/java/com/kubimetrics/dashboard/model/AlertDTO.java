package com.kubimetrics.dashboard.model;

import java.util.Map;

public class AlertDTO {
    private String id;
    private String alertname;
    private String severity;
    private String title;
    private String description;
    private String state; // e.g. firing, pending
    private String status; // ACTIVE, ACKNOWLEDGED
    private String activeAt;
    private String acknowledgedAt;
    private Map<String, String> labels;
    private Map<String, String> annotations;

    public AlertDTO() {}

    public AlertDTO(String id, String alertname, String severity, String title, String description,
                    String state, String status, String activeAt, String acknowledgedAt,
                    Map<String, String> labels, Map<String, String> annotations) {
        this.id = id;
        this.alertname = alertname;
        this.severity = severity;
        this.title = title;
        this.description = description;
        this.state = state;
        this.status = status;
        this.activeAt = activeAt;
        this.acknowledgedAt = acknowledgedAt;
        this.labels = labels;
        this.annotations = annotations;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAlertname() { return alertname; }
    public void setAlertname(String alertname) { this.alertname = alertname; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getActiveAt() { return activeAt; }
    public void setActiveAt(String activeAt) { this.activeAt = activeAt; }

    public String getAcknowledgedAt() { return acknowledgedAt; }
    public void setAcknowledgedAt(String acknowledgedAt) { this.acknowledgedAt = acknowledgedAt; }

    public Map<String, String> getLabels() { return labels; }
    public void setLabels(Map<String, String> labels) { this.labels = labels; }

    public Map<String, String> getAnnotations() { return annotations; }
    public void setAnnotations(Map<String, String> annotations) { this.annotations = annotations; }
}
