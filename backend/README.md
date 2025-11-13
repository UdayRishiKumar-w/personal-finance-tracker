# Personal Finance Tracker — Backend

This folder contains the Spring Boot REST API that powers the Personal Finance Tracker backend.

Summary

- Java 21, Spring Boot 3.x
- Spring Data JPA for persistence
- Spring Security (JWT + refresh tokens)
- Flyway for schema migrations
- MapStruct + Lombok to reduce mapping/boilerplate
- Integration tests use Testcontainers (Postgres/Redis)

## Features

- **Spring Boot**: The application is built using Spring Boot, which simplifies the development process and provides a robust framework for building Java applications.
- **Spring Data JPA**: For database interactions, Spring Data JPA is used to simplify the data access layer.
- **Spring Security**: Ensures secure access to the application by providing authentication and authorization mechanisms.
- **Spring Validation**: For validating input data, ensuring that the data entered by the user is correct and consistent.
- **Flyway**: For database migrations, Flyway is used to manage and apply database schema changes.
- **Redis**: For caching, Redis is used to improve the performance of the application.
- **MapStruct**: For object mapping, MapStruct is used to simplify the conversion between different data transfer objects (DTOs) and entities.
- **Lombok**: For reducing boilerplate code, Lombok is used to generate getters, setters, and other boilerplate code automatically.
- **JJWT**: For JSON Web Tokens, JJWT is used to handle authentication and authorization tokens.
- **Testcontainers**: For integration testing, Testcontainers is used to run tests in isolated environments.

Prerequisites

- Java 21 (or compatible JDK)
- Maven (wrapper included: use `mvnw`/`mvnw.cmd`)
- Optional: Docker + Docker Compose (for Postgres/Redis)

Quick start (dev profile)

1) Build and run locally (dev profile):

```pwsh
cd backend
.\mvnw clean install
.\mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

2) The API will start on the configured port (default in `application-dev.properties`). Use the frontend `VITE_API_BASE_URL` to point to this address during frontend development.

Environment variables and configuration

- `SPRING_DATASOURCE_URL` — JDBC URL for Postgres (example: `jdbc:postgresql://localhost:5432/pft`)
- `SPRING_DATASOURCE_USERNAME` and `SPRING_DATASOURCE_PASSWORD`
- `SPRING_REDIS_HOST` and `SPRING_REDIS_PORT` — Redis connection
- `JWT_SECRET` — secret used to sign access tokens
- `JWT_REFRESH_SECRET` — secret for refresh tokens (keep this secure)
- `SPRING_PROFILES_ACTIVE` — choose `dev`, `test`, or `prod`

Database migrations (Flyway)

- Migration scripts are under `src/main/resources/db/migration`.
- Flyway runs automatically on application startup (unless disabled). Use migration filenames with the `V{version}__desc.sql` convention.

Run with Docker / docker-compose
If you prefer a production-like stack locally, use the repository root `docker-compose.yaml` which will bring up Postgres and Redis together with the backend.

```pwsh
docker-compose up --build
```

Testing

- Unit tests and component tests:

```pwsh
cd backend
.\mvnw test
```

- Integration tests with Testcontainers (spins up Postgres/Redis):

```pwsh
.\mvnw verify
```

Security

- JWT-based access tokens and refresh tokens are implemented. Review `security/` package for configuration and filters.

Common commands

- Build: `.\mvnw clean package`
- Run tests: `.\mvnw test`
- Run integration tests: `.\mvnw verify`
