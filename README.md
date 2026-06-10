<div align="center">

<br/>

# SafeZone

**Smart Community Safety & Incident Reporting Platform**

<br/>

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)

<br/>

[About](#about) · [Features](#what-it-does) · [User Roles](#user-roles) · [How It Works](#how-it-works) · [Getting Started](#getting-started) · [Demo](DEMO.md)

</div>

---

## About

**SafeZone** is a full-stack community safety platform that helps people report security incidents, respond to them faster, and stay informed about safety in their area.

The platform brings three groups together:

- **Citizens** who report what they see and receive safety alerts
- **Police officers** who monitor incidents and broadcast warnings
- **Administrators** who manage the entire system

### The problem it solves

Communities often lack a single place to report incidents, alert nearby residents, and coordinate with local authorities. SafeZone solves this by combining **incident reporting**, **location-based alerts**, **notifications**, and **role-based dashboards** in one application.

### What makes it unique

SafeZone is built around **Rwanda's administrative geography**. Every user, report, and alert is connected to a real location in this hierarchy:

```
Province → District → Sector → Cell → Village
```

This means a report filed in one village does not get lost in a generic inbox — it is tied to the correct area, and alerts can reach the people who actually live there.

### How the system is organized

SafeZone is a **monorepo** — one repository containing two applications:

| Part | Folder | Purpose |
|---|---|---|
| **Frontend** | `frontend/` | React web app — what users see and interact with |
| **Backend** | `backend/` | Spring Boot REST API — business logic and database access |

The frontend talks to the backend over HTTP. The backend stores everything in **PostgreSQL** using JPA/Hibernate.

---

## What It Does

| Feature | Description |
|---|---|
| **Incident Reporting** | Citizens submit reports with types such as theft, violence, harassment, vandalism, suspicious activity, and emergencies. Each report moves through statuses: `PENDING`, `IN_PROGRESS`, `RESOLVED`, or `CANCELLED`. |
| **Safety Alerts** | Police and admins create location-based alerts (`WARNING`, `EMERGENCY`, `INFO`, `SAFETY_ALERT`, `COMMUNITY_UPDATE`) targeted to users in the affected area. |
| **Notifications** | Users receive notifications linked to reports and alerts, with read/unread tracking and mark-all-read support. |
| **Emergency Contacts** | A location-based directory of police, fire, medical, ambulance, and other emergency services. |
| **Location Management** | Admins build and maintain the full Rwanda administrative hierarchy from province down to village. |
| **User Management** | Role-based access for **Citizen**, **Police**, and **Admin** users, with profile management for each account. |
| **Dashboards & Analytics** | Role-specific dashboards with statistics, charts, recent activity, and management tools. |

---

## User Roles

Each role sees a different part of the platform after logging in.

| Role | What they do |
|---|---|
| **Citizen** | Submit and track incident reports, view regional safety alerts, browse emergency contacts, manage profile and notifications |
| **Police** | Monitor all reports, update report status, create and manage location-based alerts, view incident analytics |
| **Admin** | Full system control — manage users, locations, reports, alerts, emergency contacts, analytics, and system settings |

---

## How It Works

### Architecture

```
User (Browser)
      ↓
React Frontend  →  Axios HTTP requests  →  Spring Boot API  →  PostgreSQL
```

### Step-by-step flow

1. A user opens the React app and logs in with their role (Citizen, Police, or Admin).
2. The frontend sends API requests to the Spring Boot backend (`http://localhost:8080`).
3. The backend processes the request through its **controller → service → repository** layers.
4. Data is saved to or read from PostgreSQL.
5. The response is sent back to the frontend and displayed in the user's dashboard.

### Example: submitting a report

1. A **citizen** fills out a report form on the frontend.
2. The frontend sends a `POST /report` request to the backend.
3. The backend saves the report with its location and status (`PENDING`).
4. Relevant users may receive a **notification** about the new report.
5. A **police officer** sees the report on their dashboard and updates its status.

### Backend resources

The API covers **seven core entities**:

| Entity | Purpose |
|---|---|
| `User` | Platform accounts with roles and location |
| `UserProfile` | Extended profile info (one-to-one with User) |
| `Location` | Rwanda administrative hierarchy |
| `Report` | Citizen-submitted incident reports |
| `Alert` | Location-based safety alerts |
| `Notification` | User notifications for reports and alerts |
| `EmergencyContact` | Emergency service contacts per location |

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 7, Tailwind CSS, React Router, Axios, Lucide React |
| **Backend** | Java 17, Spring Boot 3.5.6, Spring Data JPA, Maven |
| **Database** | PostgreSQL |

---

## Getting Started

### Prerequisites

Java 17, Node.js 18+, PostgreSQL 13+, and Git.

### 1. Clone the repository

```bash
git clone https://github.com/MagnifiqueUwizeye01/Safezone.git
cd Safezone
```

### 2. Set up the database

```sql
CREATE DATABASE safezone_db;
```

Update credentials in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/safezone_db
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

### 3. Run the backend

```bash
cd backend
./mvnw spring-boot:run        # macOS / Linux
mvnw.cmd spring-boot:run      # Windows
```

> API runs at **http://localhost:8080**

### 4. Run the frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

```bash
npm run dev
```

> App runs at **http://localhost:5173**

---

## Project Structure

```
Safezone/
├── backend/          # Spring Boot REST API
│   └── src/main/java/com/magnifique/safezone/
│       ├── controller/   # REST endpoints
│       ├── service/        # Business logic
│       ├── repository/     # Database access
│       ├── model/          # JPA entities
│       └── enums/          # Domain types
├── frontend/         # React web application
│   └── src/
│       ├── pages/        # Admin, Police, Citizen, Public
│       ├── components/   # Reusable UI
│       ├── api/            # HTTP services
│       └── routes/         # Route protection
├── videos/           # Demo video files
├── DEMO.md           # Role-based walkthrough videos
└── README.md
```

---

## API Reference

The backend exposes **56+ REST endpoints** across all seven resources.

For the complete endpoint list with HTTP methods and query parameters, see [`backend/README.md`](backend/README.md).

**Base URL:** `http://localhost:8080`

---

## Database Schema

<p align="center">
  <img src="https://github.com/user-attachments/assets/4027c998-2693-463d-863c-cce5a0e4854e" alt="SafeZone ER Diagram" width="80%" />
</p>

The system uses seven entities with relationships mapped through JPA/Hibernate, supporting Rwanda's full location hierarchy.

---

## Demo

Watch role-based walkthrough videos showing the Citizen, Police, and Admin dashboards in action.

** [View Demo Videos](DEMO.md)**

---

## Author

**Magnifique Uwizeye**

---

<div align="center">

If you find this project useful, consider giving it a star.

</div>
