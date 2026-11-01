# BookLoop

BookLoop is a full-stack peer-to-peer platform for college students to share,
discover, and borrow academic books.

## Features

- Register and authenticate with email OTP verification and JWT sessions.
- Discover and search books shared by other students.
- Add, update, and manage a personal book collection.
- Send borrowing requests, review incoming requests, and manage returns.
- View a dashboard with collection and lending activity.
- Update profile and academic details.

## Technology

| Area | Technologies |
| --- | --- |
| Frontend | React 18, Vite, Tailwind CSS, Lucide |
| Backend | Java 17, Spring Boot 3, Spring Security, Spring Data JPA |
| Authentication | JWT and email OTP |
| Database | MySQL, with an H2 in-memory fallback |
| Build tools | npm and Maven |

## Architecture

```text
Browser
  React + Vite (Frontend, port 5173)
       │ /api requests (Vite proxy)
       ▼
  Spring Boot REST API (Backend, port 8080)
       │
       ├── Spring Security and JWT
       ├── Services, repositories, and JPA entities
       └── MySQL (or H2 fallback)
```

The frontend is in `Frontend/`; the Spring Boot Maven project is in
`Backend/`. The Vite development server proxies `/api` requests to the backend.

## Requirements

- Node.js 18 or later and npm
- Java 17
- Maven 3.6 or later
- MySQL for persistent storage (optional; the backend falls back to in-memory
  H2 if the configured MySQL connection cannot be established)

## Setup

### 1. Configure the backend

Copy `Backend/src/main/resources/application-example.properties` to
`Backend/src/main/resources/application.properties`. The local configuration
file is ignored by Git. Set the following environment variables before starting
the backend:

| Variable | Purpose |
| --- | --- |
| `BOOKLOOP_JWT_SECRET` | Required signing secret; use a random value of at least 32 bytes. |
| `BOOKLOOP_DB_URL` | Optional JDBC URL; defaults to local `bookloop_db` MySQL. |
| `BOOKLOOP_DB_USERNAME` | Optional database username; defaults to `root`. |
| `BOOKLOOP_DB_PASSWORD` | Optional database password. |
| `BOOKLOOP_MAIL_USERNAME` | Optional SMTP sender account. |
| `BOOKLOOP_MAIL_PASSWORD` | Optional SMTP password or app password. |
| `BOOKLOOP_DEMO_PASSWORD` | Optional password enabling the sample campus account and books. |

The example configuration uses environment-variable placeholders and contains
no private credentials. For local testing, OTP codes are printed in the backend
console when mail delivery is not configured. Do not expose this development
behavior on a public deployment.

PowerShell example:

```powershell
$env:BOOKLOOP_JWT_SECRET = "<generate-a-random-secret-of-at-least-32-bytes>"
$env:BOOKLOOP_DB_USERNAME = "root"
$env:BOOKLOOP_DB_PASSWORD = "<your-local-mysql-password>"
```

Run the backend:

```powershell
cd Backend
mvn spring-boot:run
```

If MySQL is not available, the backend uses its H2 fallback. To load the sample
campus account and sample books, also set `BOOKLOOP_DEMO_PASSWORD` to a
non-default password before startup. Sample data is not created unless this
variable is explicitly set.

### 2. Install and start the frontend

In another terminal:

```powershell
cd Frontend
npm ci
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The Vite development
server forwards API requests to `http://localhost:8080`.

On Windows, `start-bookloop.bat` launches the backend and frontend in separate
command windows after their requirements and local configuration are ready.

### Production frontend build

```powershell
cd Frontend
npm ci
npm run build
```

Vite writes the production bundle to `Frontend/dist/`, which is generated and
excluded from version control.

## Repository layout

```text
Backend/
  pom.xml
  src/main/java/com/bookloop/
    config/       Database and initialization configuration
    controller/   REST endpoints
    dto/          API request and response models
    model/        JPA entities
    repository/   Spring Data repositories
    security/     JWT and Spring Security
    service/      Application services
  src/main/resources/
Frontend/
  package.json
  src/
    components/
    context/
    pages/
    services/
start-bookloop.bat
```

## Notes

- Never commit `application.properties`, credentials, JWT signing secrets, or
  environment files. Use the example configuration as a starting point.
- `Backend/src/main/resources/application-dev.properties` is a local
  configuration file and is intentionally excluded from Git.
- The database schema is managed by Hibernate using the existing JPA settings.
