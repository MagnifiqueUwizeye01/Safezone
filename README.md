<div align="center">

# 🛡️ SafeZone

### A community safety platform for incident reporting and location-based alerts

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vite.dev/)

</div>



## 📌 About

SafeZone is a full-stack web application that helps communities stay informed and respond to safety incidents faster. Citizens can report problems in their area, police can monitor and act on those reports, and administrators can manage the entire system from one place.

What makes SafeZone different is **location-aware design**. The platform is built around Rwanda's administrative structure — Province, District, Sector, Cell, and Village — so reports, alerts, and notifications always reach the people in the right area.

---

## ✨ What It Does

- **Incident reporting** — Citizens submit reports (theft, violence, emergencies, and more) with status tracking from pending to resolved.
- **Safety alerts** — Police and admins broadcast warnings or emergency notices to users based on location.
- **Notifications** — Users receive updates on reports and alerts, with read/unread tracking.
- **Emergency contacts** — Location-based directory of police, fire, medical, and other services.
- **User management** — Role-based access for citizens, police, admins, and community leaders.
- **Dashboards & analytics** — Role-specific views with stats, charts, and management tools.

---

## 🎥 Demo

Explore the core workflows of SafeZone through these interactive walkthroughs:

### 🚀 Platform Overview & Authentication
See how users navigate the login flow and access role-based dashboards.

https://github.com/user-attachments/assets/27bfed72-bd5a-43ab-afc2-9bb40444896c


### 📝 Incident Reporting Flow
Watch a citizen submit a new safety report and track its status in real-time.

https://github.com/user-attachments/assets/c4f12de7-ec92-412c-931d-580decc9f5b5

### 📊 Admin & Analytics Dashboard
Experience the administrative panel where system-wide analytics and user management are handled.

https://github.com/user-attachments/assets/27bfed72-bd5a-43ab-afc2-9bb40444896c

---

## ⚙️ How It Works

SafeZone is a **monorepo** with two applications that work together:

1. **Frontend** (`frontend/`) — A React app where users log in, submit reports, view alerts, and manage their profile. Routes and pages are protected by role (Citizen, Police, Admin).
2. **Backend** (`backend/`) — A Spring Boot REST API that handles business logic, stores data in PostgreSQL, and exposes endpoints for users, reports, alerts, locations, notifications, and more.
3. **Database** — PostgreSQL stores seven core entities (User, UserProfile, Location, Report, Alert, Notification, EmergencyContact) connected through JPA/Hibernate.

When a citizen submits a report, the frontend sends a request to the API, the service layer validates and saves it, and relevant users can receive notifications. Alerts work the same way — created by police or admins and targeted to users in the affected location.

---

## 🧰 Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React 19, Vite, Tailwind CSS, React Router, Axios |
| Backend | Java 17, Spring Boot 3.5, Spring Data JPA |
| Database | PostgreSQL |

---

## 🚦 Getting Started

### Prerequisites

Java 17, Node.js 18+, PostgreSQL 13+, and Git.

### 1. Clone the repository

```bash
git clone https://github.com/MagnifiqueUwizeye01/Safezone.git
cd Safezone

2. Set up the database
CREATE DATABASE safezone_db;

Update credentials in backend/src/main/resources/application.properties:
spring.datasource.url=jdbc:postgresql://localhost:5432/safezone_db
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

## Project Structure
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
└── README.md

📡 API Reference
The backend exposes 56+ REST endpoints. For the full list, see backend/README.md.

Base URL: http://localhost:8080

🗄️ Database Schema
<p align="center"> <img src="https://github.com/user-attachments/assets/4027c998-2693-463d-863c-cce5a0e4854e" alt="SafeZone ER Diagram" width="80%" /> </p>


👤 Author
Magnifique Uwizeye


Update credentials in backend/src/main/resources/application.properties:

