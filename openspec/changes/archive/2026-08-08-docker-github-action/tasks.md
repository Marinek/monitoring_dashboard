## 1. Configurable Prometheus Endpoint & Authentication

- [x] 1.1 Add/update `application.yml` or `application.properties` in Spring Boot backend to bind `prometheus.url`, `prometheus.username`, `prometheus.password`, and `prometheus.bearer-token` to environment variables (`PROMETHEUS_URL`, `PROMETHEUS_USERNAME`, `PROMETHEUS_PASSWORD`, `PROMETHEUS_BEARER_TOKEN`).
- [x] 1.2 Update `PrometheusService.java` `WebClient` builder to dynamically attach Basic Auth or Bearer Token headers based on configured credentials.

## 2. Dockerfile & Containerization

- [x] 2.1 Create multi-stage `Dockerfile` in the project root to build React frontend, assemble Spring Boot executable JAR, and define runtime container.
- [x] 2.2 Create `.dockerignore` to exclude node_modules, build caches, and local configuration files.

## 3. GitHub Actions Workflow

- [x] 3.1 Create `.github/workflows/docker-build.yml` for automated CI building, authenticating with GHCR (`ghcr.io`), and pushing the Docker image.

## 4. Verification

- [x] 4.1 Validate Dockerfile build locally with `docker build` (or verify config mapping and auth header injection).
