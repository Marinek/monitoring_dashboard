## Why

Currently, Prometheus active/firing alerts can be fetched via backend REST API, but there is no dedicated UI table/list view in the frontend to browse alerts, view detailed status/labels, and mark alerts as "acknowledged" or "resolved/done" ("erledigen"). Providing an interactive Alert Management view in the GUI allows operators to track, filter, and acknowledge active alerts directly within the dashboard.

## What Changes

- **Frontend Alert Management GUI**:
  - Add an Alerts page/tab/section in the React dashboard.
  - Display active and firing alerts in a detailed list/table view with status, severity badges, timestamps, labels, and summary/description.
  - Add action buttons to mark an alert as "Done / Erledigt" (Acknowledged / Dismissed).
- **Backend Alert Status & Acknowledgement API**:
  - Extend/update alert endpoint or state storage to support setting and persisting alert lifecycle state (e.g., `ACTIVE`, `ACKNOWLEDGED`, `RESOLVED`).
  - Provide an endpoint `POST /api/alerts/{id}/acknowledge` or similar state transition to mark alerts as handled.

## Capabilities

### New Capabilities
- `alert-management`: Interactive GUI for viewing active Prometheus alerts as a list/table and acknowledging/marking alerts as completed/erledigt.

### Modified Capabilities
- none

## Impact

- **Frontend**: React components for Alerts list/table view, filter controls, state updates.
- **Backend**: Spring Boot alert services, REST controllers, in-memory or persisted alert state tracker for user acknowledgements.
