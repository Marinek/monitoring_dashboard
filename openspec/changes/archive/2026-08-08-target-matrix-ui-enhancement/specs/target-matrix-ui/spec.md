## ADDED Requirements

### Requirement: Enlarged Target Matrix Tiles
The Prometheus Target Matrix SHALL render target squares with enlarged dimensions, prominent status badges, and readable node names.

#### Scenario: User views target matrix
- **WHEN** the dashboard renders the Target Matrix panel
- **THEN** the target tiles are displayed in a larger format with clear status indicators and text.

### Requirement: Click-to-Select Target Detail Inspector
The Target Matrix SHALL allow users to click any target tile to select it and view detailed target information in a dedicated inspector card directly below the grid.

#### Scenario: User clicks a target square
- **WHEN** the user clicks on a target node square in the matrix
- **THEN** the square is highlighted with an active selection border and the detail panel below displays the target's IP, instance name, role, status, and system specifications.
