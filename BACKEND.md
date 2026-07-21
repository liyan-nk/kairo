# BACKEND.md — KAIRO Backend Architecture Specification

Version: 1.0  
Status: Active — Implementation Ready  
Target Platform: Java 21 LTS / Spring Boot 3.4.x / PostgreSQL 16  
Companion documents: `AGENTS.md`, `PRODUCT.md`, `DECISIONS.md` (ADR-020), `DATABASE.md`, `API.md`

---

## 1. Architectural Overview

KAIRO's backend is a high-performance, stateless, domain-driven REST API built using **Java 21 LTS** and **Spring Boot 3.4.x**. The backend acts as the authoritative source of truth for all business logic, consensus calculation, authorization, and persistence (`AGENTS.md` §4.1).

### 1.1 Core Principles
1. **Stateless & Scalable**: Authentication uses short-lived JWT access tokens with database-managed refresh tokens. No HTTP server sessions are maintained.
2. **Domain-Driven Isolation**: Business logic resides strictly within Service layers—never in Controllers or UI components.
3. **Repository Pattern**: Data access is decoupled via Spring Data JPA interfaces.
4. **Strict DTO Encapsulation**: Internal database entities are never exposed directly to external clients. All input/output crosses API boundaries via validated DTOs.
5. **Zero-Trust Community Consensus**: Community reports (proxy reports, lost items) are evaluated purely on the backend according to consensus threshold rules (`AGENTS.md` §7).

---

## 2. Recommended Package & Project Structure

The project follows a standard modular Spring Boot architecture:

```
com.kairo.backend/
├── KairoBackendApplication.java
├── config/
│   ├── CorsConfig.java
│   ├── JpaAuditingConfig.java
│   └── SecurityConfig.java
├── controller/
│   ├── AuthController.java
│   ├── UserController.java
│   ├── CourseController.java
│   ├── TimetableController.java
│   ├── AttendanceController.java
│   ├── ProxyReportController.java
│   └── LostFoundController.java
├── service/
│   ├── AuthService.java
│   ├── UserService.java
│   ├── CourseService.java
│   ├── TimetableService.java
│   ├── AttendanceService.java
│   ├── ConsensusService.java
│   └── LostFoundService.java
├── repository/
│   ├── UserRepository.java
│   ├── RefreshTokenRepository.java
│   ├── CourseRepository.java
│   ├── EnrollmentRepository.java
│   ├── TimetableSlotRepository.java
│   ├── OfficialBaselineRepository.java
│   ├── AttendanceLogRepository.java
│   ├── ProxyReportRepository.java
│   └── LostFoundItemRepository.java
├── entity/
│   ├── BaseAuditEntity.java
│   ├── UserEntity.java
│   ├── UserRole.java
│   ├── RefreshTokenEntity.java
│   ├── AcademicTermEntity.java
│   ├── CourseEntity.java
│   ├── EnrollmentEntity.java
│   ├── TimetableSlotEntity.java
│   ├── OfficialBaselineEntity.java
│   ├── AttendanceLogEntity.java
│   ├── ProxyReportEntity.java
│   └── LostFoundItemEntity.java
├── dto/
│   ├── request/
│   │   ├── SignupRequest.java
│   │   ├── LoginRequest.java
│   │   ├── RefreshTokenRequest.java
│   │   ├── UpdateProfileRequest.java
│   │   ├── CreateCourseRequest.java
│   │   ├── AttendanceLogRequest.java
│   │   ├── CreateProxyReportRequest.java
│   │   ├── CreateLostFoundRequest.java
│   │   └── ClaimItemRequest.java
│   └── response/
│       ├── AuthResponse.java
│       ├── UserProfileResponse.java
│       ├── TodayOverviewResponse.java
│       ├── TimetableSlotResponse.java
│       ├── CourseSummaryResponse.java
│       ├── AttendanceLogResponse.java
│       ├── ProxyReportResponse.java
│       ├── LostFoundItemResponse.java
│       └── ApiErrorResponse.java
├── mapper/
│   ├── UserMapper.java
│   ├── CourseMapper.java
│   ├── TimetableMapper.java
│   ├── AttendanceMapper.java
│   ├── ProxyReportMapper.java
│   └── LostFoundMapper.java
├── security/
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   ├── UserPrincipal.java
│   ├── CustomUserDetailsService.java
│   └── JwtAuthenticationEntryPoint.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   ├── UnauthorizedException.java
│   ├── DuplicateResourceException.java
│   └── InvalidOperationException.java
└── validation/
    ├── ValidTimeSlot.java
    └── ValidTimeSlotValidator.java
```

### 2.1 Package Responsibility Justification
- `controller/`: REST API boundary. Annotates methods with Spring Web MVC (`@RestController`, `@GetMapping`, `@PostMapping`), validates DTOs (`@Valid`), and delegates immediately to services.
- `service/`: Encapsulates all transaction boundaries (`@Transactional`), attendance estimations, threshold calculations, and state transition logic.
- `repository/`: Spring Data JPA interfaces extending `JpaRepository<T, ID>` with custom JPQL queries.
- `entity/`: Database domain entities mapping directly to PostgreSQL 3NF tables using JPA/Hibernate annotations.
- `dto/`: Immutable data containers (using Java 21 `record` types where appropriate) defining API payload contracts.
- `mapper/`: Converts domain entities to response DTOs and request DTOs to entities.
- `security/`: Spring Security 6 filter chain, JWT validation, UserDetails implementation, and password hashing (`BCryptPasswordEncoder`).
- `exception/`: `@RestControllerAdvice` converting application exceptions to standard HTTP error responses (RFC 7807).

---

## 3. Authentication & Security Architecture

KAIRO uses a stateless **JWT (JSON Web Token)** access token model paired with database-backed **Refresh Tokens**.

```
Client (PWA)                     Spring Boot Backend                   PostgreSQL DB
    │                                     │                                 │
    │─── 1. POST /api/v1/auth/login ─────>│                                 │
    │                                     │─── 2. Validate Credentials ────>│
    │                                     │<─── User Entity + Hash ─────────│
    │                                     │
    │                                     │─── 3. Generate Access JWT & ───>│
    │                                     │      Save Refresh Token         │
    │<── 4. 200 OK (JWT + RefreshToken) ──│                                 │
    │                                     │                                 │
    │─── 5. GET /api/v1/today ───────────>│                                 │
    │      (Bearer <Access JWT>)          │─── 6. Validate Signature/Expiry │
    │<── 6. 200 OK (Today Overview) ──────│                                 │
```

### 3.1 Token Strategy
- **Access Token**: HMAC-SHA256 signed JWT. Expiration: **15 minutes**. Contains `sub` (User ID), `email`, and `roles`.
- **Refresh Token**: Cryptographically secure UUID string stored in the `refresh_tokens` database table. Expiration: **7 days**. Supports revocation on logout or security invalidation.
- **Password Hashing**: BCrypt with strength factor `12`.

### 3.2 Security Filter Chain Configuration
- Disabled Session Management (`SessionCreationPolicy.STATELESS`).
- Enabled CORS with explicit origin whitelist.
- Disabled CSRF (not required for stateless bearer JWT APIs).
- Public Endpoints:
  - `POST /api/v1/auth/signup`
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/refresh`
  - `/actuator/health`
- Authenticated Endpoints: All other `/api/v1/**` endpoints require valid `Bearer` JWT authorization.

---

## 4. Sequence Diagrams for Core Flows

### 4.1 Signup Flow
```mermaid
sequenceDiagram
    autonumber
    actor User as Student (PWA)
    participant AuthCtrl as AuthController
    participant AuthSvc as AuthService
    participant UserRepo as UserRepository
    participant PasswordEnc as BCryptPasswordEncoder
    participant JwtProv as JwtTokenProvider
    participant RefreshRepo as RefreshTokenRepository

    User->>AuthCtrl: POST /api/v1/auth/signup (email, password, name)
    AuthCtrl->>AuthSvc: registerUser(SignupRequest)
    AuthSvc->>UserRepo: existsByEmail(email)
    alt Email Already Exists
        UserRepo-->>AuthSvc: true
        AuthSvc-->>AuthCtrl: throw DuplicateResourceException
        AuthCtrl-->>User: 409 Conflict ("Email already registered")
    else Email Available
        UserRepo-->>AuthSvc: false
        AuthSvc->>PasswordEnc: encode(rawPassword)
        PasswordEnc-->>AuthSvc: hashedPassword
        AuthSvc->>UserRepo: save(UserEntity)
        UserRepo-->>AuthSvc: savedUserEntity
        AuthSvc->>JwtProv: generateAccessToken(user)
        JwtProv-->>AuthSvc: accessToken
        AuthSvc->>AuthSvc: createRefreshToken(user)
        AuthSvc->>RefreshRepo: save(RefreshTokenEntity)
        RefreshRepo-->>AuthSvc: savedRefreshToken
        AuthSvc-->>AuthCtrl: AuthResponse(user, accessToken, refreshToken)
        AuthCtrl-->>User: 201 Created (AuthResponse DTO)
    end
```

### 4.2 Login Flow
```mermaid
sequenceDiagram
    autonumber
    actor User as Student (PWA)
    participant AuthCtrl as AuthController
    participant AuthSvc as AuthService
    participant AuthMgr as AuthenticationManager
    participant JwtProv as JwtTokenProvider
    participant RefreshRepo as RefreshTokenRepository

    User->>AuthCtrl: POST /api/v1/auth/login (email, password)
    AuthCtrl->>AuthSvc: authenticate(LoginRequest)
    AuthSvc->>AuthMgr: authenticate(UsernamePasswordAuthenticationToken)
    alt Invalid Credentials
        AuthMgr-->>AuthSvc: throw BadCredentialsException
        AuthSvc-->>AuthCtrl: throw UnauthorizedException
        AuthCtrl-->>User: 401 Unauthorized ("Invalid email or password")
    else Valid Credentials
        AuthMgr-->>AuthSvc: Authentication (UserPrincipal)
        AuthSvc->>JwtProv: generateAccessToken(userPrincipal)
        JwtProv-->>AuthSvc: accessToken
        AuthSvc->>RefreshRepo: deleteByUserId(userId)
        AuthSvc->>RefreshRepo: save(new RefreshTokenEntity)
        RefreshRepo-->>AuthSvc: savedRefreshToken
        AuthSvc-->>AuthCtrl: AuthResponse(userProfile, accessToken, refreshToken)
        AuthCtrl-->>User: 200 OK (AuthResponse DTO)
    end
```

### 4.3 Load Today Screen Flow
```mermaid
sequenceDiagram
    autonumber
    actor User as Student (PWA)
    participant TodayCtrl as TodayController
    participant TodaySvc as TodayService
    participant TimetableRepo as TimetableSlotRepository
    participant AttendanceRepo as AttendanceLogRepository
    participant ProxyRepo as ProxyReportRepository

    User->>TodayCtrl: GET /api/v1/today (Header: Bearer JWT)
    TodayCtrl->>TodaySvc: getTodayOverview(userId, currentDate, currentDayOfWeek)
    TodaySvc->>TimetableRepo: findByUserIdAndDayOfWeek(userId, dayOfWeek)
    TimetableRepo-->>TodaySvc: List<TimetableSlotEntity>
    TodaySvc->>AttendanceRepo: findByUserIdAndDate(userId, currentDate)
    AttendanceRepo-->>TodaySvc: List<AttendanceLogEntity>
    TodaySvc->>ProxyRepo: findActiveReportsByDate(currentDate)
    ProxyRepo-->>TodaySvc: List<ProxyReportEntity>
    TodaySvc->>TodaySvc: resolveLiveScheduleState(slots, logs, proxyOverlays, currentTime)
    TodaySvc-->>TodayCtrl: TodayOverviewResponse DTO
    TodayCtrl-->>User: 200 OK (TodayOverviewResponse DTO)
```

### 4.4 Load Timetable Flow
```mermaid
sequenceDiagram
    autonumber
    actor User as Student (PWA)
    participant TimetableCtrl as TimetableController
    participant TimetableSvc as TimetableService
    participant TimetableRepo as TimetableSlotRepository

    User->>TimetableCtrl: GET /api/v1/timetable (Header: Bearer JWT)
    TimetableCtrl->>TimetableSvc: getFullTimetable(userId)
    TimetableSvc->>TimetableRepo: findByUserIdOrderByDayOfWeekAndStartTime(userId)
    TimetableRepo-->>TimetableSvc: List<TimetableSlotEntity>
    TimetableSvc->>TimetableSvc: mapToTimetableByDay(slots)
    TimetableSvc-->>TimetableCtrl: Map<DayOfWeek, List<TimetableSlotResponse>>
    TimetableCtrl-->>User: 200 OK (Timetable DTO)
```

### 4.5 Mark / Edit Attendance Flow
```mermaid
sequenceDiagram
    autonumber
    actor User as Student (PWA)
    participant AttCtrl as AttendanceController
    participant AttSvc as AttendanceService
    participant AttRepo as AttendanceLogRepository
    participant CourseRepo as CourseRepository

    User->>AttCtrl: POST /api/v1/attendance-logs (courseId, slotId, date, status, notes)
    AttCtrl->>AttSvc: logAttendance(userId, AttendanceLogRequest)
    AttSvc->>AttRepo: findByUserIdAndCourseIdAndDateAndTimetableSlotId(...)
    alt Existing Log Found
        AttRepo-->>AttSvc: AttendanceLogEntity
        AttSvc->>AttSvc: updateExistingLog(status, notes)
    else New Log
        AttRepo-->>AttSvc: Optional.empty()
        AttSvc->>AttSvc: createNewLogEntity(...)
    end
    AttSvc->>AttRepo: save(AttendanceLogEntity)
    AttRepo-->>AttSvc: savedLog
    AttSvc->>CourseRepo: recalculateCourseCounters(courseId)
    CourseRepo-->>AttSvc: updatedCounters
    AttSvc-->>AttCtrl: AttendanceLogResponse DTO
    AttCtrl-->>User: 200 OK / 201 Created (AttendanceLogResponse DTO)
```

### 4.6 Report Schedule Change (Proxy Report) Flow
```mermaid
sequenceDiagram
    autonumber
    actor User as Student (PWA)
    participant ProxyCtrl as ProxyReportController
    participant ConsensusSvc as ConsensusService
    participant ProxyRepo as ProxyReportRepository

    User->>ProxyCtrl: POST /api/v1/campus/proxy-reports (slotId, actualCourseId, room, faculty)
    ProxyCtrl->>ConsensusSvc: submitProxyReport(userId, CreateProxyReportRequest)
    ConsensusSvc->>ProxyRepo: findMatchingReport(slotId, date, actualCourseId)
    alt Existing Report Group Found
        ProxyRepo-->>ConsensusSvc: ProxyReportEntity
        ConsensusSvc->>ConsensusSvc: incrementReportCount()
        ConsensusSvc->>ConsensusSvc: evaluateConsensusStatus(count)
    else First Report
        ProxyRepo-->>ConsensusSvc: Optional.empty()
        ConsensusSvc->>ConsensusSvc: initializeNewReport(count = 1, status = PENDING)
    end
    ConsensusSvc->>ProxyRepo: save(ProxyReportEntity)
    ProxyRepo-->>ConsensusSvc: savedReport
    ConsensusSvc-->>ProxyCtrl: ProxyReportResponse DTO
    ProxyCtrl-->>User: 201 Created (ProxyReportResponse DTO)
```

### 4.7 Report / Claim Lost & Found Item Flow
```mermaid
sequenceDiagram
    autonumber
    actor User as Student (PWA)
    participant LFCtrl as LostFoundController
    participant LFSvc as LostFoundService
    participant LFRepo as LostFoundItemRepository

    alt Student Reports Item
        User->>LFCtrl: POST /api/v1/campus/lost-found (title, desc, category, location, question, contact)
        LFCtrl->>LFSvc: createItem(userId, CreateLostFoundRequest)
        LFSvc->>LFRepo: save(LostFoundItemEntity)
        LFRepo-->>LFSvc: savedItem
        LFSvc-->>LFCtrl: LostFoundItemResponse DTO
        LFCtrl-->>User: 201 Created (LostFoundItemResponse DTO)
    else Student Claims Item
        User->>LFCtrl: PATCH /api/v1/campus/lost-found/{id}/claim (answer)
        LFCtrl->>LFSvc: claimItem(id, userId, ClaimItemRequest)
        LFSvc->>LFRepo: findById(id)
        LFRepo-->>LFSvc: LostFoundItemEntity
        LFSvc->>LFSvc: updateStatusToClaimed()
        LFSvc->>LFRepo: save(item)
        LFRepo-->>LFSvc: savedItem
        LFSvc-->>LFCtrl: LostFoundItemResponse DTO
        LFCtrl-->>User: 200 OK (LostFoundItemResponse DTO)
    end
```

---

## 5. Global Exception Handling & Error Standard

All exceptions thrown across the application are intercepted by `GlobalExceptionHandler` (`@RestControllerAdvice`) and converted into standardized JSON error responses:

```json
{
  "timestamp": "2026-07-21T19:50:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Course with ID 'cs101-uuid' not found.",
  "path": "/api/v1/courses/cs101-uuid"
}
```

| Exception Type | HTTP Status | Description |
|----------------|-------------|-------------|
| `MethodArgumentNotValidException` | 400 Bad Request | Request DTO validation failed (`@NotNull`, `@Email`, etc.) |
| `UnauthorizedException` | 401 Unauthorized | Missing, expired, or invalid JWT access token |
| `AccessDeniedException` | 403 Forbidden | User lacks necessary role or resource ownership |
| `ResourceNotFoundException` | 404 Not Found | Requested entity ID does not exist in PostgreSQL |
| `DuplicateResourceException` | 409 Conflict | Unique constraint violation (e.g. duplicate email) |
| `InvalidOperationException` | 422 Unprocessable Entity | Business rule violation |
| `Exception` | 500 Internal Error | Unhandled server error |
