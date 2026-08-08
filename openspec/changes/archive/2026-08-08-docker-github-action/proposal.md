## Why

To simplify deployment and enable automated Container CI/CD, we need a multi-stage Dockerfile packaging the React frontend and Spring Boot backend into a single runnable container. Additionally, a GitHub Actions workflow should automatically build and publish the Docker image on code changes. The Prometheus backend URL as well as authentication options (Basic Auth, Bearer Token) must be fully configurable at container runtime via environment variables.

## What Changes

- **Dockerfile (Multi-stage build)**:
  - Stage 1: Build React frontend (`npm run build`).
  - Stage 2: Copy React static assets into Spring Boot `static/` directory and build executable JAR with Gradle.
  - Stage 3: Minimal Java 21 runtime image running the Spring Boot application container.
- **Configurable Prometheus Endpoint & Authentication**:
  - Expose environment variables:
    - `PROMETHEUS_URL` (defaulting to `http://localhost:9091`)
    - `PROMETHEUS_USERNAME` & `PROMETHEUS_PASSWORD` (for Basic Auth, optional)
    - `PROMETHEUS_BEARER_TOKEN` (for Bearer Token Auth, optional)
  - Configure Spring Boot `WebClient` / `PrometheusService` to inject headers when auth properties are set.
- **GitHub Actions Workflow**:
  - Add `.github/workflows/docker-build.yml` to trigger on push to `main` branch or pull requests.
  - Authenticate with GitHub Container Registry (`ghcr.io`) using `GITHUB_TOKEN` and push the image.

## Capabilities

### New Capabilities
- `docker-container-packaging`: Multi-stage Docker containerization and configurable Prometheus target endpoint with Basic/Bearer authentication support.
- `github-actions-ci`: GitHub Actions workflow to build, test, and publish Docker images to GHCR using authentication secrets.

### Modified Capabilities
- none

## Impact

- **Build / Packaging**: Added `Dockerfile`, `.dockerignore`, `.github/workflows/docker-build.yml`.
- **Backend Config & Service**: Updated `PrometheusService` WebClient initialization to dynamically attach Basic Auth or Bearer Token headers based on environment configuration.
