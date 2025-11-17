# Personal Finance Tracker

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/331e9127a8d749db9659dffd3dd20b26)](https://app.codacy.com/gh/UdayRishiKumar-w/personal-finance-tracker/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

## Overview

The Personal Finance Tracker is a web application designed to help users manage their finances effectively. It provides features for tracking transactions, generating reports, and managing user authentication.

## Project Structure

Repository layout

- `backend/` — Spring Boot REST API (Java 21, Maven)
- `frontend/` — React + TypeScript app (Vite)
- `docker-compose.yaml` — To serve - with Postgres/Redis and the app

- Quickly understand the app's core capabilities and architecture
- See technologies and libraries used (frontend and backend)
- Follow step-by-step instructions to run locally or with Docker

Key features

- Transaction management (create/read/update/delete)
- Budget and savings goals tracking
- Reports & charts (monthly spends, trends)
- Authentication (JWT, Bcrypt) with refresh tokens
- Role-based access control (users/admin)
- Internationalization (i18n) and RTL support
- PWA-ready frontend (offline support, installable)

Architecture & Tech stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS, MUI, React Query
- Backend: Spring Boot 3.x, Java 21, Spring Data JPA, Spring Security, Flyway
- Database: PostgreSQL (production), H2 available for local development
- Cache: Redis
- Auth: JWT using JJWT, Bcrypt
- Mapping/Boilerplate: MapStruct + Lombok
- Testing: JUnit, Spring Test, Testcontainers (integration), Vitest & Playwright on frontend

Quick start:-
Prerequisites: Java 21, Maven, Node.js (>=16), npm, Docker

1) Clone the repository:

```pwsh
cd backend
.\mvnw clean install
.\mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

2) Start the backend (from repository root):

```pwsh
cd backend
.\mvnw clean install
.\mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

Notes:

- The dev profile uses `application-dev.properties` (see `backend/src/main/resources`).
- To run against a real Postgres or Redis, set the corresponding environment variables (see `backend/README.md`).

3) Start the frontend (separate terminal):

```pwsh
cd frontend
npm install
npm run dev
```

The Vite server will print an address (default `http://localhost:5173`). The frontend uses `VITE_API_BASE_URL` from `.env` or environment to contact the backend.

4) Run everything with Docker:

```pwsh
docker-compose up --build
```

This will start the services defined in `docker-compose.yaml` (Postgres, Redis, backend, etc.).

Testing

- Backend unit & integration tests:

```pwsh
cd backend
.\mvnw test
# or run integration tests including Testcontainers:
.\mvnw verify
```

- Frontend unit & e2e tests:

```pwsh
cd frontend
npm install
npm run test
npm run e2e
```

Where to look in the codebase

- Backend: `backend/src/main/java` — controllers, services, repositories, security
- Frontend: `frontend/src` — pages, components, store, api
- Migrations: `backend/src/main/resources/db/migration` (Flyway)

## Technologies Used

- **Frontend**: React, Material UI, React Query, React-Router, Chart.js, Axios, React hook form, React-i18next, React Testing Library, Vite, Tailwind CSS, Redux, Redux toolkit, Vitest, Playwright.
- **Backend**: Spring Boot, Java, Maven, JWT for authentication, Spring Data JPA, Redis, PostgreSQL,Lombok, Mapstruct, Flyway, Spring Security, Spring Actuator, Open API for Documentation.
- **Deployment**: Docker, Docker-compose, Nginx.

Contact

- Author: Ganji Uday Rishi Kumar — `udayrishi.ganji.w@gmail.com`
- GitHub: `https://github.com/UdayRishiKumar-w/personal-finance-tracker`
