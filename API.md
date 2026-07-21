# API.md — KAIRO Domain-Driven REST API Specification

Version: 1.0  
Status: Active — Implementation Ready  
Base URL: `/api/v1`  
Companion documents: `AGENTS.md`, `PRODUCT.md`, `DECISIONS.md` (ADR-020), `BACKEND.md`, `DATABASE.md`

---

## 1. API Design Guidelines

1. **Clean Domain Resources**: Endpoints represent domain resources (`/auth`, `/users`, `/courses`, `/timetable-slots`, `/attendance-logs`, `/campus/proxy-reports`, `/campus/lost-found`), not specific UI widgets.
2. **Stateless Bearer Tokens**: All authenticated endpoints require `Authorization: Bearer <access_jwt_token>`.
3. **Consistent Error Schema**: All non-2xx responses return standard JSON error objects.

---

## 2. Endpoint Reference & JSON Contracts

### 2.1 Authentication Resource (`/api/v1/auth`)

#### `POST /api/v1/auth/signup`
Creates a new student account.

- **Request Body**:
```json
{
  "name": "Liyan",
  "email": "liyan@example.com",
  "password": "SecurePassword123!"
}
```
- **Response `201 Created`**:
```json
{
  "user": {
    "id": "u-1001-uuid",
    "email": "liyan@example.com",
    "name": "Liyan",
    "rollNumber": null,
    "department": null,
    "semester": null,
    "section": null
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
  "refreshToken": "rf-9002-uuid"
}
```
- **Status Codes**: `201 Created`, `400 Bad Request`, `409 Conflict`

---

#### `POST /api/v1/auth/login`
Authenticates student credentials.

- **Request Body**:
```json
{
  "email": "liyan@example.com",
  "password": "SecurePassword123!"
}
```
- **Response `200 OK`**:
```json
{
  "user": {
    "id": "u-1001-uuid",
    "email": "liyan@example.com",
    "name": "Liyan",
    "rollNumber": "CS-2026-104",
    "department": "Computer Science & Engineering",
    "semester": "5th Semester",
    "section": "Section A"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
  "refreshToken": "rf-9002-uuid"
}
```
- **Status Codes**: `200 OK`, `401 Unauthorized`

---

#### `POST /api/v1/auth/refresh`
Exchanges a valid refresh token for a new access token.

- **Request Body**:
```json
{
  "refreshToken": "rf-9002-uuid"
}
```
- **Response `200 OK`**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
  "refreshToken": "rf-9003-uuid"
}
```
- **Status Codes**: `200 OK`, `401 Unauthorized`

---

#### `POST /api/v1/auth/logout`
Revokes an active refresh token session.

- **Request Body**:
```json
{
  "refreshToken": "rf-9002-uuid"
}
```
- **Response `204 No Content`**
- **Status Codes**: `204 No Content`

---

### 2.2 User Profile Resource (`/api/v1/users`)

#### `GET /api/v1/users/me`
Fetches authenticated student profile.

- **Response `200 OK`**:
```json
{
  "id": "u-1001-uuid",
  "email": "liyan@example.com",
  "name": "Liyan",
  "rollNumber": "CS-2026-104",
  "department": "Computer Science & Engineering",
  "semester": "5th Semester",
  "section": "Section A",
  "lastOfficialBaseline": 80.0,
  "lastOfficialUpdateDate": "2026-07-15"
}
```
- **Status Codes**: `200 OK`, `401 Unauthorized`

---

### 2.3 Courses Resource (`/api/v1/courses`)

#### `GET /api/v1/courses`
Lists all enrolled academic subjects for the student.

- **Response `200 OK`**:
```json
[
  {
    "id": "course-1-uuid",
    "code": "CS101",
    "name": "Java Programming",
    "faculty": "Dr. Sarah Jenkins",
    "room": "Room 404",
    "attendedClasses": 23,
    "totalClasses": 25,
    "percentage": 92.0,
    "status": "Safe"
  }
]
```
- **Status Codes**: `200 OK`, `401 Unauthorized`

---

#### `GET /api/v1/courses/{id}/history`
Fetches chronological attendance logs for a specific course.

- **Response `200 OK`**:
```json
[
  {
    "id": "log-101-uuid",
    "subjectId": "course-1-uuid",
    "date": "2026-07-15",
    "status": "Present",
    "timetableSlot": "09:00 AM",
    "notes": null
  }
]
```
- **Status Codes**: `200 OK`, `401 Unauthorized`, `404 Not Found`

---

### 2.4 Timetable Resource (`/api/v1/timetable-slots`)

#### `GET /api/v1/timetable-slots`
Fetches full weekly timetable slots grouped by day.

- **Response `200 OK`**:
```json
{
  "MON": [
    {
      "id": "slot-mon-1-uuid",
      "dayOfWeek": "MON",
      "startTime": "09:00",
      "endTime": "10:00",
      "subject": "Java Programming",
      "room": "Room 404",
      "faculty": "Dr. Sarah Jenkins",
      "isBreak": false
    }
  ]
}
```
- **Status Codes**: `200 OK`, `401 Unauthorized`

---

### 2.5 Today Aggregator Resource (`/api/v1/today`)

#### `GET /api/v1/today`
Aggregates live schedule state, active current class, next class, and overlays for immediate 5-second initial load (`AGENTS.md` §2.2).

- **Query Parameters**: `date=2026-07-21` (optional, defaults to current server date)
- **Response `200 OK`**:
```json
{
  "currentClass": {
    "subject": "Operating Systems",
    "room": "Room 102",
    "faculty": "Prof. Alok Verma",
    "remainingMinutes": 25,
    "progress": 58
  },
  "nextClass": {
    "subject": "Computer Networks",
    "room": "Room 404",
    "faculty": "Dr. Sarah Jenkins",
    "startTime": "12:15 PM"
  },
  "dayStatus": "in-class",
  "timeline": [
    {
      "id": "slot-1-uuid",
      "subject": "Operating Systems",
      "time": "11:15 AM - 12:15 PM",
      "status": "current",
      "room": "Room 102",
      "faculty": "Prof. Alok Verma",
      "day": "Mon"
    }
  ]
}
```
- **Status Codes**: `200 OK`, `401 Unauthorized`

---

### 2.6 Attendance Logs Resource (`/api/v1/attendance-logs`)

#### `POST /api/v1/attendance-logs`
Creates or updates a period attendance entry.

- **Request Body**:
```json
{
  "courseId": "course-1-uuid",
  "timetableSlotId": "slot-mon-1-uuid",
  "date": "2026-07-21",
  "status": "PRESENT",
  "notes": "Attended lab session"
}
```
- **Response `200 OK / 201 Created`**:
```json
{
  "id": "log-501-uuid",
  "courseId": "course-1-uuid",
  "timetableSlotId": "slot-mon-1-uuid",
  "date": "2026-07-21",
  "status": "PRESENT",
  "notes": "Attended lab session"
}
```
- **Status Codes**: `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`

---

### 2.7 Campus Community Resource (`/api/v1/campus`)

#### `GET /api/v1/campus/proxy-reports`
Lists active proxy reports with zero-trust consensus status.

- **Response `200 OK`**:
```json
[
  {
    "id": "proxy-1-uuid",
    "timetableSlotId": "slot-mon-1-uuid",
    "expectedSubject": "Operating Systems",
    "actualSubject": "Database Management Systems",
    "room": "Room 102",
    "faculty": "Prof. Alok Verma",
    "reportCount": 3,
    "status": "Likely",
    "date": "2026-07-21"
  }
]
```

#### `POST /api/v1/campus/proxy-reports`
Submits a schedule discrepancy report.

- **Request Body**:
```json
{
  "timetableSlotId": "slot-mon-1-uuid",
  "actualSubject": "Database Management Systems",
  "room": "Room 102",
  "faculty": "Prof. Alok Verma",
  "date": "2026-07-21"
}
```
- **Response `201 Created`**:
```json
{
  "id": "proxy-1-uuid",
  "timetableSlotId": "slot-mon-1-uuid",
  "expectedSubject": "Operating Systems",
  "actualSubject": "Database Management Systems",
  "room": "Room 102",
  "faculty": "Prof. Alok Verma",
  "reportCount": 1,
  "status": "Pending",
  "date": "2026-07-21"
}
```

#### `GET /api/v1/campus/lost-found`
Lists lost & found items.

- **Response `200 OK`**:
```json
[
  {
    "id": "lf-1-uuid",
    "title": "Scientific Calculator",
    "description": "Found in Lab 2. FX-991EX model.",
    "category": "Electronics",
    "location": "Lab 2",
    "date": "2026-07-21",
    "status": "Found",
    "question": "What name is written on the back cover?",
    "contactInfo": "Prof. Alok Verma"
  }
]
```

#### `PATCH /api/v1/campus/lost-found/{id}/claim`
Claims a lost & found item.

- **Request Body**:
```json
{
  "answer": "Liyan"
}
```
- **Response `200 OK`**:
```json
{
  "id": "lf-1-uuid",
  "status": "Claimed"
}
```

---

## 3. Frontend Repository Adaptations

The existing TypeScript repository interfaces adapt seamlessly to these clean REST endpoints via HTTP provider implementations (`HttpAuthRepository`, `HttpTodayRepository`, `HttpSubjectRepository`, `HttpCampusRepository`, `HttpProfileRepository`):

| Frontend Repository | Method | Target Backend REST Endpoint |
|---------------------|--------|------------------------------|
| `AuthRepository` | `login()` | `POST /api/v1/auth/login` |
| `AuthRepository` | `signup()` | `POST /api/v1/auth/signup` |
| `AuthRepository` | `logout()` | `POST /api/v1/auth/logout` |
| `TodayRepository` | `getCurrentClass()` / `getTimeline()` | `GET /api/v1/today` |
| `SubjectRepository` | `getSubjects()` | `GET /api/v1/courses` |
| `SubjectRepository` | `getAttendanceHistory()` | `GET /api/v1/courses/{id}/history` |
| `CampusRepository` | `getProxyReports()` | `GET /api/v1/campus/proxy-reports` |
| `CampusRepository` | `reportProxy()` | `POST /api/v1/campus/proxy-reports` |
| `CampusRepository` | `getLostFoundItems()` | `GET /api/v1/campus/lost-found` |
| `CampusRepository` | `claimItem()` | `PATCH /api/v1/campus/lost-found/{id}/claim` |
| `ProfileRepository` | `getProfile()` | `GET /api/v1/users/me` |
