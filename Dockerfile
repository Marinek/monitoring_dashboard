# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM eclipse-temurin:21-jdk-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/gradlew backend/build.gradle backend/settings.gradle ./
COPY backend/gradle ./gradle
RUN ./gradlew --version
COPY backend/src ./src
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static
RUN ./gradlew bootJar --no-daemon

# Stage 3: Runtime Container
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend/build/libs/*.jar app.jar

EXPOSE 8080

ENV PROMETHEUS_URL=http://localhost:9091
ENV PROMETHEUS_USERNAME=
ENV PROMETHEUS_PASSWORD=
ENV PROMETHEUS_BEARER_TOKEN=

ENTRYPOINT ["java", "-jar", "app.jar"]
