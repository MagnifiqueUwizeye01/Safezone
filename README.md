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

</div>

---

## About

SafeZone is a full-stack community safety platform built to connect **citizens**, **police officers**, and **administrators** around one shared goal — keeping communities informed and able to respond to safety incidents quickly.

Citizens can report security incidents in their area, police can monitor and act on those reports, and administrators can manage users, locations, alerts, emergency contacts, and system-wide analytics from one place.

What makes SafeZone different is **location-aware design**. The platform is built around Rwanda's administrative structure:

```
Province → District → Sector → Cell → Village
```

Every report, alert, and notification is tied to this five-level hierarchy, so safety information reaches the people in the right area.

On the **frontend**, users interact through role-based dashboards. Citizens manage their own reports and alerts; police handle incident monitoring and alert creation; admins have full control over the system.

On the **backend**, a Spring Boot REST API exposes 56+ endpoints across seven resources — Users, User Profiles, Locations, Reports, Alerts, Notifications, and Emergency Contacts — all persisted in PostgreSQL through JPA/Hibernate.

Together, the frontend and backend live in one **monorepo**, making the full SafeZone system easier to develop and maintain.

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

## Demo

See SafeZone in action through walkthrough videos for each user role.

<br/>

**Citizen** — Submit incident reports, view location-based safety alerts, browse emergency contacts, and manage your profile and notifications.

<video src="https://github.com/user-attachments/assets/27bfed72-bd5a-43ab-afc2-9bb40444896c" autoplay muted loop controls width="100%"></video>

<br/>

**Police** — Monitor incident reports, create and manage location-based alerts, review incident analytics, and access emergency contacts from the police dashboard.

<video src="https://github.com/user-attachments/assets/cdab2d22-6ef1-49cb-8e80-c608fdd31c3f" autoplay muted loop controls width="100%"></video>

<br/>

**Admin** — Manage users, locations, reports, and alerts, oversee emergency contacts, and view system-wide analytics from the admin dashboard.

<video src="https://github.com/user-attachments/assets/c4f12de7-ec92-412c-931d-580decc9f5b5" autoplay muted loop controls width="100%"></video>

<br/>

---

## How It Works

SafeZone is a **monorepo** with two applications that work together:

1. **Frontend** (`frontend/`) — A React + Vite application with public pages (Home, About, Features, Contact), authentication pages (Login, Register, Forgot Password, OTP, 2FA), and protected role-based routes for Admin, Police, and Citizen dashboards.
2. **Backend** (`backend/`) — A Spring Boot REST API organized into controllers, services, repositories, models, and enums. It handles all business logic and data persistence.
3. **Database** — PostgreSQL stores seven core entities: `User`, `UserProfile`, `Location`, `Report`, `Alert`, `Notification`, and `EmergencyContact`.

When a citizen submits a report, the frontend sends a request to the API, the service layer validates and saves it, and relevant users can receive notifications. Alerts work the same way — created by police or admins and targeted to users in the affected location.

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
├── backend/          # Spring Boot API
│   └── src/main/java/com/magnifique/safezone/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── model/
│       └── enums/
├── frontend/         # React application
│   └── src/
│       ├── pages/        # Admin, Police, Citizen, Public
│       ├── components/
│       ├── api/
│       └── routes/
├── videos/           # Demo walkthrough videos
└── README.md
```

---

## API Reference

The backend exposes 56+ REST endpoints. For the full list, see [`backend/README.md`](backend/README.md).

**Base URL:** `http://localhost:8080`

---

## Database Schema

<p align="center">
  <img src="https://github.com/user-attachments/assets/4027c998-2693-463d-863c-cce5a0e4854e" alt="SafeZone ER Diagram" width="80%" />
</p>

---

## Author

**Magnifique Uwizeye**

---

<div align="center">

If you find this project useful, consider giving it a star.

</div>
