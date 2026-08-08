## ADDED Requirements

### Requirement: Cyberpunk Dashboard UI & Controls
The React application SHALL render the full Cyberpunk dashboard interface with dark mode theme, custom Orbitron/Rajdhani fonts, fiber canvas animation, and responsive panel grid.

#### Scenario: Full-screen command center rendering
- **WHEN** user loads the React client
- **THEN** user views the header navbar, operational KPI counters, Chart.js metric visualizers, VM list with search, and active alerts panel.

#### Scenario: Dynamic metric refreshes
- **WHEN** refresh button is clicked or auto-refresh timer triggers
- **THEN** frontend updates metric values and Chart.js datasets smoothly.
