## Context

Users want a clearer visual representation of target nodes in the Target Matrix panel, as well as an interactive way to inspect node details by clicking on any target square.

## Goals / Non-Goals

**Goals:**
- Make target node buttons larger and more readable (`h-14` or `h-16`, larger text, clear status badges).
- Make click-selection active: clicking a node sets `selectedVm` in React state.
- Render a rich target detail inspector box right below the matrix grid showing selected target details (Instance, IP, Role/Job, OS, Status, CPU/RAM placeholders or live metrics).

**Non-Goals:**
- Adding SSH or external terminal execution from the dashboard.

## Decisions

- **Grid Layout Adjustments**:
  - Update `grid-cols-5 sm:grid-cols-10 lg:grid-cols-5` to `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4` with larger tiles (`h-14` / `h-16`).
- **Click Selection & Detail Panel**:
  - Pass `selectedVm` state from `App.jsx` into `VmMatrixGrid.jsx`.
  - Highlight the currently selected target tile with a cyan glow border.
  - Expand the bottom inspector box to show full target details when selected.

## Risks / Trade-offs

- [Risk] Larger tiles mean fewer nodes fit without scrolling → Mitigation: Scrollable matrix container (`overflow-y-auto`) with clean custom scrollbars.
