# SafeZone

A community safety platform for reporting incidents and broadcasting alerts based on location.

## Overview

SafeZone enables citizens to report security incidents, police to respond, and the community to receive real-time alerts. All operations are tied to the Rwandan administrative structure (Province → District → Sector → Cell → Village).

## Tech Stack

- **Backend**: Spring Boot
- **Database**: PostgreSQL
- **ORM**: JPA/Hibernate

## Project Structure

```
safezone/
├── src/main/java/com/magnifique/safezone/
│   ├── model/           # Entities
│   ├── enums/           # Enumeration types
│   ├── repository/      # Data access layer
│   ├── service/         # Business logic
│   └── controller/      # REST endpoints
└── README.md
```

## Database Schema

[ER Diagram Image Goes Here]

The system includes 6 core entities with Rwandan location hierarchy support.

## Key Features

- **Location Management**: Hierarchical structure reflecting Rwanda's administrative divisions
- **Incident Reporting**: Citizens submit reports with types and status tracking
- **Alert System**: Regional alerts auto-assign recipients based on location
- **Notifications**: User-specific notifications for reports and alerts
- **Emergency Contacts**: Location-based emergency services directory

## Running the Project

1. Ensure PostgreSQL is running
2. Update `application.properties` with your database credentials
3. Run: `mvn spring-boot:run`
4. Server starts at `http://localhost:8080`

## API Endpoints

- `POST /user/create` - Create user
- `GET /user/all` - Get all users
- `POST /location/parent` - Create parent location
- `POST /location/child?parentCode={code}` - Create child location
- `POST /report` - Submit incident report
- `POST /alert` - Broadcast safety alert
- `POST /emergency-contact/create` - Add emergency contact
- `POST /notification/create` - Send notification

---

**Student**: Magnifique  
**Course**: Web Technology  
**Institution**: AUCA
