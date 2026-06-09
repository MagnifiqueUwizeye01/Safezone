# SafeZone

A community safety platform for reporting incidents and broadcasting location-based alerts.

## Repository structure

| Directory   | Description                          | Stack                          |
|------------|--------------------------------------|--------------------------------|
| `backend/` | REST API, business logic, data layer | Spring Boot, PostgreSQL, JPA   |
| `frontend/`| Web application UI                   | React, Vite, Tailwind CSS      |

## Getting started

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

See [backend/README.md](backend/README.md) for database setup and API details.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

See [frontend/README.md](frontend/README.md) for environment configuration and available scripts.

## Legacy repositories

This monorepo combines the histories of:

- Backend: `MagnifiqueUwizeye01/safeZone_26676`
- Frontend: `MagnifiqueUwizeye01/Safezone-frontend`
