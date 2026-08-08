## ADDED Requirements

### Requirement: Local Development Setup
The project SHALL include local deployment assets including Docker Compose for Prometheus, a comprehensive README.md, and a single launch script `start.sh`.

#### Scenario: Running launch script
- **WHEN** developer executes `./start.sh`
- **THEN** script checks requirements, starts Prometheus via Docker Compose (if Docker is available), builds and launches Java Spring Boot backend, and starts React frontend.

#### Scenario: Reading README documentation
- **WHEN** developer inspects `README.md`
- **THEN** README provides architectural overview, API documentation, and instructions for running backend, frontend, and Prometheus.
