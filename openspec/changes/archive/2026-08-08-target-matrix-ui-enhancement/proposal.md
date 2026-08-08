## Why

The Prometheus Target Matrix tiles currently feel too small on modern high-resolution displays, making target names and status indicators hard to read. Furthermore, detailed target information (such as IP, Job/Role, metrics endpoints, status details, and active alerts) should be displayed persistently in a dedicated detail inspector card directly below the target matrix when a user clicks on a node square.

## What Changes

- **Target Matrix Tile Resizing**:
  - Increase tile height, font sizes, padding, and status indicators in `VmMatrixGrid.jsx` to make squares significantly larger and clearer.
  - Adjust grid column layout (e.g. 3-4 columns instead of 5-10 tight columns) to accommodate larger target cards.
- **Click-to-Select Node Details**:
  - Change interaction model: Clicking on a node square selects it persistently (`selectedVm`).
  - Upgrade the detail panel directly below the grid into a rich node inspector card showing target metadata (Instance IP, Job, Operating System, Status badge, and associated alerts).

## Capabilities

### New Capabilities
- `target-matrix-ui`: Enlarged grid tiles and persistent click-to-select node detail inspector panel.

### Modified Capabilities
- none

## Impact

- **Frontend**: Modified `VmMatrixGrid.jsx` and `App.jsx` layout/state handling.
