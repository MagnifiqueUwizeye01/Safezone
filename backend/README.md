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

<img src="https://github.com/user-attachments/assets/4027c998-2693-463d-863c-cce5a0e4854e" alt="ER Diagram" style="width: 100%; height: 500px; object-fit: contain;"/>

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

**Base URL:** `http://localhost:8080`

###  Location Endpoints

#### CRUD Operations
- **POST** `/location/parent` - Create parent location (Province)
- **POST** `/location/child?parentCode={code}` - Create child location (District/Sector/Cell/Village)
- **GET** `/location/all` - Get all locations
- **GET** `/location/{id}` - Get location by ID
- **PUT** `/location/{id}` - Update location
- **DELETE** `/location/{id}` - Delete location

#### Query Endpoints
- **GET** `/location/provinces` - Get all provinces
- **GET** `/location/code/{code}` - Get location by code 
- **GET** `/location/parent/{parentCode}` - Get children by parent code

---

###  User Endpoints

#### CRUD Operations
- **POST** `/user/create` - Create user
- **GET** `/user/all` - Get all users
- **GET** `/user/{id}` - Get user by ID
- **PUT** `/user/{id}` - Update user
- **DELETE** `/user/{id}` - Delete user

#### Query Endpoints
- **GET** `/user/role/{role}` - Get users by role (CITIZEN, POLICE, ADMIN, COMMUNITY_LEADER)
- **GET** `/user/role/{role}/paginated?page=0&size=10` - Get users by role (paginated)
- **GET** `/user/province/code/{code}` - Get users by province code
- **GET** `/user/province/name/{name}` - Get users by province name
- **GET** `/user/location/{locationId}` - Get users by location ID 

---

###  Report Endpoints

#### CRUD Operations
- **POST** `/report` - Create incident report
- **GET** `/report/all` - Get all reports
- **GET** `/report/{id}` - Get report by ID
- **PUT** `/report/{id}` - Update report
- **DELETE** `/report/{id}` - Delete report

#### Query Endpoints
- **GET** `/report/status/{status}/paginated?page=0&size=10` - Get reports by status (PENDING, IN_PROGRESS, RESOLVED, CANCELLED)

**Report Types:** `THEFT`, `VIOLENCE`, `HARASSMENT`, `VANDALISM`, `LOST_ITEM`, `SUSPICIOUS_ACTIVITY`, `EMERGENCY`, `OTHER`

---

###  Alert Endpoints

#### CRUD Operations
- **POST** `/alert` - Create alert (auto-assigns recipients based on location)
- **GET** `/alert/all` - Get all alerts
- **GET** `/alert/{id}` - Get alert by ID
- **PUT** `/alert/{id}` - Update alert
- **DELETE** `/alert/{id}` - Delete alert

#### Query Endpoints
- **GET** `/alert/type/{type}/paginated?page=0&size=10` - Get alerts by type (paginated)

**Alert Types:** `WARNING`, `EMERGENCY`, `INFO`, `SAFETY_ALERT`, `COMMUNITY_UPDATE`

---

###  Emergency Contact Endpoints

#### CRUD Operations
- **POST** `/emergency-contact/create` - Create emergency contact
- **GET** `/emergency-contact/all` - Get all emergency contacts
- **GET** `/emergency-contact/{id}` - Get emergency contact by ID
- **PUT** `/emergency-contact/{id}` - Update emergency contact
- **DELETE** `/emergency-contact/{id}` - Delete emergency contact

#### Query Endpoints
- **GET** `/emergency-contact/department/{department}` - Get contacts by department
- **GET** `/emergency-contact/department/{department}/paginated?page=0&size=10` - Get contacts by department (paginated)
- **GET** `/emergency-contact/location/{locationId}` - Get contacts by location ID
- **GET** `/emergency-contact/active` - Get active emergency contacts
- **GET** `/emergency-contact/active/paginated?page=0&size=10` - Get active contacts (paginated)
- **GET** `/emergency-contact/location/{locationId}/department/{department}` - Get contacts by location and department

---

###  Notification Endpoints

#### CRUD Operations
- **POST** `/notification/create` - Create notification
- **GET** `/notification/all` - Get all notifications
- **GET** `/notification/{id}` - Get notification by ID
- **PUT** `/notification/{id}` - Update notification
- **DELETE** `/notification/{id}` - Delete notification

#### Query Endpoints
- **GET** `/notification/user/{userId}` - Get notifications by user
- **GET** `/notification/user/{userId}/paginated?page=0&size=10` - Get notifications by user (paginated)
- **GET** `/notification/user/{userId}/read/{isRead}` - Get notifications by user and read status
- **GET** `/notification/type/{type}` - Get notifications by type
- **GET** `/notification/type/{type}/paginated?page=0&size=10` - Get notifications by type (paginated)
- **GET** `/notification/user/{userId}/unread` - Get unread notifications by user
- **GET** `/notification/user/{userId}/unread/count` - Get count of unread notifications
- **GET** `/notification/date-range?startDate={date}&endDate={date}` - Get notifications by date range

#### Update Operations
- **PUT** `/notification/{id}/mark-read` - Mark notification as read
- **PUT** `/notification/user/{userId}/mark-all-read` - Mark all user notifications as read

---

### User Profile Endpoints (One-to-One Relationship)

#### CRUD Operations
- **POST** `/user-profile/create` - Create user profile
- **GET** `/user-profile/all` - Get all user profiles
- **GET** `/user-profile/{id}` - Get user profile by ID
- **GET** `/user-profile/user/{userId}` - Get user profile by user ID
- **PUT** `/user-profile/{id}` - Update user profile
- **DELETE** `/user-profile/{id}` - Delete user profile

**Note:** Profile picture is stored as URL string (e.g., `https://example.com/image.jpg`)

---

## API Summary

- **Total Endpoints:** 56+
- **CRUD Operations:** Full CRUD for all 7 entities (including UserProfile)
- **Query Features:** Filtering, sorting, pagination
- **Error Handling:** Comprehensive error messages for all operations
- **Response Format:** JSON with appropriate HTTP status codes

---

  
 

