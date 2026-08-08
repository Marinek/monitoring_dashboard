## ADDED Requirements

### Requirement: Alert List Navigation & Display
The GUI SHALL provide a dedicated view/section displaying all active Prometheus alerts in a structured list/table.

#### Scenario: User views active alerts list
- **WHEN** the user navigates to the Alert Management tab in the GUI
- **THEN** all current alerts are displayed showing alert name, severity, labels, summary, and current acknowledgement status.

### Requirement: Alert Acknowledgment Action
The GUI and backend SHALL allow users to mark an active alert as "Done" / Acknowledged.

#### Scenario: User marks an alert as done
- **WHEN** the user clicks the "Erledigen" / "Acknowledge" button on a firing alert
- **THEN** the backend updates the alert's status to ACKNOWLEDGED and the UI immediately reflects the updated state.
