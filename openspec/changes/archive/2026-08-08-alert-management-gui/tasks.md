## 1. Backend Alert Management & Acknowledgement API

- [x] 1.1 Update Java Alert data model (`AlertDTO`) to include unique alert ID, `status` (`ACTIVE`, `ACKNOWLEDGED`), and `acknowledgedAt` timestamp.
- [x] 1.2 Implement in-memory state tracking for acknowledged alerts in Spring Boot service layer (`AlertService` / `PrometheusService`).
- [x] 1.3 Add backend REST endpoint `POST /api/alerts/{id}/acknowledge` to allow marking alerts as handled/acknowledged.

## 2. Frontend Alert Management GUI

- [x] 2.1 Build an Alert List view component (`AlertsList.jsx` / `AlertsPanel.jsx`) in React displaying all active alerts in a list/table format with filter options (All, Active, Acknowledged).
- [x] 2.2 Add interactive "Erledigen" / "Acknowledge" button for each alert item that triggers backend acknowledgement API and updates UI state dynamically.
- [x] 2.3 Integrate the new Alert Management section into the main React dashboard layout with badge counters.

## 3. Verification & Testing

- [x] 3.1 Verify backend API endpoints with `./gradlew test` or HTTP calls.
- [x] 3.2 Run `./alert.sh` to trigger simulated Prometheus alerts and verify real-time list rendering and acknowledgement behavior in the browser UI.
