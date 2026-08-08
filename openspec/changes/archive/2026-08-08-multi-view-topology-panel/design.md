## Context

The HTML template contained a placeholder canvas for `KUBIMETRICS VM TOPOLOGY MESH`. By expanding this area into a multi-tab panel, we combine high-level visual topology with detailed component health and live event logging.

## Goals / Non-Goals

**Goals:**
- Provide a 3-tab panel component (`TopologyPanel.jsx`) in the React dashboard.
- **Tab 1 (Topology Mesh)**: HTML5 Canvas drawing nodes (Prometheus, Targets) with animated glowing particle connections.
- **Tab 2 (System Map)**: Interactive component architecture cards (TSDB, Exporter, Alert Engine).
- **Tab 3 (Event Stream)**: Live scrolling log stream of target scrape events and system checks.

**Non-Goals:**
- 3D WebGL rendering (lightweight HTML5 2D Canvas is sufficient and highly performant).

## Decisions

- **Tab State Management**:
  - `activeTab`: `'mesh'` | `'map'` | `'stream'`.
- **Canvas Rendering for Topology Mesh**:
  - Draw central node `[Prometheus]` and orbiting target nodes (`node-exporter`, `local-host`, `k8s-cluster`).
  - Animate connecting particle lines with color coding (`emerald` for healthy, `amber` / `red` for active alerts).

## Risks / Trade-offs

- [Risk] Canvas animation performance → Mitigation: Use `requestAnimationFrame` and clean up animation loops when switching tabs or unmounting.
