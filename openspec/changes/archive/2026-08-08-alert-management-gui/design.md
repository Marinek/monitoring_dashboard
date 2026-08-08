## Context

The monitoring dashboard fetches active Prometheus alerts via the backend endpoint `/api/alerts`. Currently, the dashboard only shows count metrics or basic summary cards without interactive state management. Users need to view firing alerts in a dedicated GUI list/table and acknowledge/resolve ("erledigen") alerts so they can track handled issues.

## Goals / Non-Goals

**Goals:**
- Provide a dedicated UI component/tab for Alert Management listing active alerts.
- Display alert severity, state (Active, Acknowledged, Resolved), labels, annotations, and timestamps.
- Enable users to click "Mark as Done / Acknowledge" on an active alert.
- Persist acknowledgement status in the backend memory or local state so acknowledged alerts are visually styled or hidden based on filter settings.

**Non-Goals:**
- Permanent mutation of upstream Prometheus alert rules (Prometheus rules remain evaluated by Prometheus; acknowledgment is tracked in the monitoring dashboard backend).

## Decisions

- **Decision 1: Alert State Model in Backend**:
  - Extend the `AlertDTO` in Java to include `id` (fingerprint or hash of alert labels + alertname), `status` (`ACTIVE`, `ACKNOWLEDGED`), and `acknowledgedAt`.
  - Provide `POST /api/alerts/{id}/acknowledge` endpoint in `MetricsController` / `AlertService`.
- **Decision 2: Interactive Alert Table in Frontend**:
  - Add an Alerts section/view with filter tabs (e.g. "All", "Firing/Active", "Acknowledged").
  - Add a distinct action button "Erledigen" / "Acknowledge" on each alert row.

## Risks / Trade-offs

- [Risk] Prometheus rule reload or alert resolving might clear alert fingerprints. → Mitigation: Generate consistent unique alert identifiers using hashing over `alertname` + key labels (`instance`, `job`, `severity`).
