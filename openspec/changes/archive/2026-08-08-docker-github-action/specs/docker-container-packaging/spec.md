## ADDED Requirements

### Requirement: Multi-Stage Dockerfile Packaging
The repository SHALL contain a multi-stage Dockerfile that builds the React frontend, embeds static assets into Spring Boot, and packages a lightweight executable container image.

#### Scenario: Building the container image
- **WHEN** running `docker build -t kubimetrics-dashboard .`
- **THEN** the image builds successfully and produces a runnable container serving both GUI and backend API on port 8080.

### Requirement: Configurable Prometheus Endpoint and Authentication
The Spring Boot backend SHALL allow overriding the Prometheus endpoint URL as well as Basic Auth / Bearer Token credentials via environment variables at runtime.

#### Scenario: Overriding Prometheus URL and Basic Auth Credentials
- **WHEN** running the container with `docker run -e PROMETHEUS_URL=http://my-prometheus:9090 -e PROMETHEUS_USERNAME=admin -e PROMETHEUS_PASSWORD=secret -p 8080:8080 kubimetrics-dashboard`
- **THEN** the backend connects to `http://my-prometheus:9090` using HTTP Basic Authentication headers.

#### Scenario: Overriding Prometheus Bearer Token Credentials
- **WHEN** running the container with `docker run -e PROMETHEUS_URL=https://my-prometheus:9090 -e PROMETHEUS_BEARER_TOKEN=my-token -p 8080:8080 kubimetrics-dashboard`
- **THEN** the backend connects to `https://my-prometheus:9090` using `Authorization: Bearer my-token` header.
