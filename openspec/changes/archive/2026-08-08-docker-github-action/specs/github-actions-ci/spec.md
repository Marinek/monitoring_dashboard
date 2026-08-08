## ADDED Requirements

### Requirement: Automated GitHub Actions CI Workflow with GHCR Login
The repository SHALL contain a GitHub Actions workflow in `.github/workflows/docker-build.yml` that authenticates to GitHub Container Registry, builds, and pushes the Docker image on code changes.

#### Scenario: GitHub Action execution on push
- **WHEN** code is pushed to the `main` branch or a pull request is created
- **THEN** GitHub Actions logs into `ghcr.io` using `secrets.GITHUB_TOKEN`, builds the Docker container image, and pushes the tagged image.
