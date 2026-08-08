## Context

Currently, running the monitoring dashboard locally relies on `./start.sh`, which builds React and Spring Boot locally on the developer machine. To enable containerized deployments (Docker, Kubernetes, Cloud platforms), we need a single production-ready Dockerfile and a GitHub Actions workflow to build the image automatically in CI. Secure Prometheus instances also require authentication support.

## Goals / Non-Goals

**Goals:**
- Provide a multi-stage `Dockerfile` in the repository root.
- Ensure the Prometheus endpoint URL and authentication (Basic Auth or Bearer Token) can be configured at container runtime via environment variables (`PROMETHEUS_URL`, `PROMETHEUS_USERNAME`, `PROMETHEUS_PASSWORD`, `PROMETHEUS_BEARER_TOKEN`).
- Create `.github/workflows/docker-build.yml` for automated CI build, testing, and login/push to GitHub Container Registry (GHCR).

**Non-Goals:**
- Managing external secret vaults outside standard environment variables and GitHub Secrets.

## Decisions

- **Multi-Stage Build Pattern**:
  - Stage 1 (`node:20-alpine`): Build React production bundle (`dist`).
  - Stage 2 (`eclipse-temurin:21-jdk-alpine`): Copy built React assets into `src/main/resources/static` and run `./gradlew bootJar`.
  - Stage 3 (`eclipse-temurin:21-jre-alpine`): Minimal runtime container running `java -jar app.jar` exposing port 8080.
- **Configurable Prometheus URL & Authentication**:
  - Bind Spring Boot properties:
    - `prometheus.url=${PROMETHEUS_URL:http://localhost:9091}`
    - `prometheus.username=${PROMETHEUS_USERNAME:}`
    - `prometheus.password=${PROMETHEUS_PASSWORD:}`
    - `prometheus.bearer-token=${PROMETHEUS_BEARER_TOKEN:}`
  - Configure `PrometheusService` `WebClient` builder to conditionally register `ExchangeFilterFunctions.basicAuthentication()` or `defaultHeader("Authorization", "Bearer " + token)`.
- **GitHub Actions Registry Authentication**:
  - Use `docker/login-action` with `registry: ghcr.io`, `username: ${{ github.actor }}`, `password: ${{ secrets.GITHUB_TOKEN }}`.

## Risks / Trade-offs

- [Risk] Plaintext passwords in container env if not injected via secret managers → Mitigation: Follow Docker standard practice using environment variable injection / Kubernetes Secrets.
