## Why

The left top panel in the dashboard was originally designed in the HTML template as a visual topology mesh. Implementing an interactive multi-view panel with tabs allows operators to switch between a visual Topology Mesh, an Architectural System Heatmap, and a Real-time Telemetry Event Stream without cluttering the screen layout.

## What Changes

- **Multi-Tab Topology & Inspector Panel**:
  - Add a new React component (`TopologyPanel.jsx`) placed above the Grafana chart on the left side of the dashboard.
  - Implement 3 view tabs:
    1. **Topology Mesh**: Interactive Canvas graph rendering central Prometheus instance, connected target nodes, animated pulse particles, and status colors.
    2. **System Map**: Architectural diagram showing Prometheus TSDB, Scrape Engine, Node Exporters, and Alert Manager health.
    3. **Event Stream**: Real-time scrolling telemetry stream displaying target scrape status events, rule evaluations, and system notifications.

## Capabilities

### New Capabilities
- `multi-view-topology`: Tabbed panel featuring an interactive Topology Mesh canvas, System Architecture Map, and Realtime Telemetry Event Log Stream.

### Modified Capabilities
- none

## Impact

- **Frontend**: Created `TopologyPanel.jsx` component and integrated it into the left column of `App.jsx`.
