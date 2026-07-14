# ARCHITECTURE.md

# KAIRO Technical Architecture

Version: 1.1
Status: Active
Companion documents: `AGENTS.md`, `PRODUCT.md`, `DECISIONS.md`, `UX.md`

---

## 0. How This Document Relates to the Others

- `PRODUCT.md` defines **what** KAIRO is and why a feature belongs.
- `AGENTS.md` defines the **engineering rules** — layering, naming,
  design system, what a PR must justify.
- `DECISIONS.md` records **why** past choices were made.
- `UX.md` defines what the interaction should **feel** like.
- `ARCHITECTURE.md` (this file) defines the **concrete technical
  system** that implements all of the above — the actual stack, folder
  structure, data flow, and engines behind the rules.

`AGENTS.md` §4 describes the architecture in stack-agnostic terms
(`UI → State → Business Logic → Database`). This document is the
concrete realization of that principle: Frontend Pages/Components/Hooks
map to `UI` and `State`, and the Spring Boot Controller/Service layers
map to `Business Logic`, with PostgreSQL as `Database`. If this file and
`AGENTS.md` ever disagree on layering responsibility, `AGENTS.md` wins —
it's the constitution; this file is the implementation.

---

## 1. Overview

KAIRO follows a client-server architecture built around a mobile-first
Progressive Web Application (`DECISIONS.md` ADR-005). The architecture
prioritizes:

- Simplicity
- Scalability
- Offline-first thinking
- Clear separation of responsibilities (`AGENTS.md` §4)
- Maintainability

---

## 2. High-Level Architecture

```
┌───────────────────────┐
│       React PWA       │
│  UI + Local Cache      │
└──────────┬─────────────┘
           │
      HTTPS / REST
           │
┌──────────▼─────────────┐
│    Spring Boot API      │
│  Business Logic         │
│  Validation              │
│  Consensus Engine         │
└──────────┬─────────────┘
           │
┌──────────▼─────────────┐
│      PostgreSQL          │
└───────────────────────┘
```

---

## 3. Technology Stack

| Layer          | Choice                                            |
|----------------|----------------------------------------------------|
| Frontend       | React, Vite, TypeScript, TailwindCSS, PWA           |
| Backend        | Spring Boot, Java 21, Spring Security, Spring Data JPA |
| Database       | PostgreSQL                                          |
| ORM            | Hibernate                                           |
| Authentication | JWT                                                 |
| Deployment     | Docker, NGINX                                       |

### 3.1 Why React?
Fast development, a strong mobile rendering story, a large ecosystem, and
straightforward PWA support — all of which serve the mobile-first,
"feels native" requirement in `UX.md` §1.

### 3.2 Why Spring Boot?
Meets the project's platform requirement, sits on a mature and
production-ready Java ecosystem, and makes building REST APIs
straightforward.

### 3.3 Why PostgreSQL?
Reliable, powerful, open source, with excellent relational support —
appropriate for the structured entities (students, subjects, attendance
logs) KAIRO is built on.

These choices are recorded as accepted decisions; changing any of them
requires a new ADR in `DECISIONS.md`, not a quiet swap.

---

## 4. Folder Structure

### 4.1 Frontend
```
src/
  app/
  components/
  features/
  hooks/
  services/
  types/
  utils/
  assets/
```

### 4.2 Backend
```
controller/
service/
repository/
entity/
dto/
config/
security/
exception/
util/
```

Naming within these folders should follow the conventions in `AGENTS.md`
§6 (`SubjectCard`, `useAttendance()`, `AttendanceDialog`, etc.).

---

## 5. Backend Layers

```
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

- **Controllers** never access the database directly — they parse
  requests, call a service, and shape the response.
- **Business rules live in Services** — this is where validation,
  attendance calculation, and consensus logic belong (`AGENTS.md` §4.1).
- **Repositories only perform persistence** — no business logic, no
  conditionals beyond query construction.

---

## 6. Frontend Layers

```
Pages
    ↓
Components
    ↓
Hooks
    ↓
API Services
    ↓
Backend
```

Components should remain stateless whenever possible — push state into
hooks (`useAttendance()`, `useToday()`, `useSubjects()`) rather than
holding it in component-local state that's hard to reuse or test.

---

## 7. Authentication Flow

```
Student logs in
      ↓
JWT issued
      ↓
Stored securely
      ↓
Attached to every request
      ↓
Backend validates
```

Admin authentication uses role-based authorization on top of the same
JWT mechanism — no separate auth system for admins.

---

## 8. Core Modules

- Authentication
- Student
- Subjects
- Attendance
- Timetable
- Proxy Verification
- Lost & Found
- Notifications

This list should track `PRODUCT.md` §7 (MVP Scope) — a new core module
here implies a corresponding MVP scope entry there, and vice versa.

---

## 9. Database Modules (Entities)

- Student
- Subject
- AttendanceBaseline
- AttendanceLog
- Timetable
- TimetableOverride
- LostItem
- Claim
- Notification
- Admin

---

## 10. Attendance Engine

```
Official Attendance
        ↓
Student Daily Attendance
        ↓
Attendance Estimator
        ↓
Estimated Attendance
```

Official attendance always overrides the estimate — this is the
technical implementation of `PRODUCT.md` §10 (Attendance Philosophy) and
`DECISIONS.md` ADR-003. `AttendanceBaseline` holds the official figure;
`AttendanceLog` accumulates daily marks; the Estimator combines the two
on read, it does not mutate the baseline.

---

## 11. Proxy Verification Engine

```
Student Report
      ↓
Store Report
      ↓
Count Similar Reports
      ↓
Calculate Confidence Tier
      ↓
Threshold Reached (Verified or Auto Accepted)
      ↓
Update Timetable
      ↓
Notify Students
```

The confidence tiers here are the canonical thresholds defined in
`AGENTS.md` §7 / `PRODUCT.md` §7.4 / `DECISIONS.md` ADR-004 — this engine
is where those tiers are actually computed, and it is backend-only
(`AGENTS.md` §4.1). Only **Verified** or **Auto Accepted** reports reach
the "Update Timetable" step; **Pending** and **Likely** reports are
stored and visible but never mutate the live timetable.

---

## 12. Notification Engine

```
Official Attendance Released  → Push Notification
Verified Proxy Change          → Push Notification
Attendance Warning             → Push Notification
Lost Item Match                 → Push Notification
```

Only these events generate notifications — this matches the allow-list
in `UX.md` §21 exactly. No motivational, tip-of-the-day, or promotional
notifications should ever be added to this engine without updating
`UX.md` first.

---

## 13. Offline Strategy

Students should still be able to, while offline:
- View timetable
- View attendance
- View today's schedule
- Mark attendance

Changes made offline remain queued locally until the device
synchronizes — see §14.

---

## 14. Sync Strategy

```
Offline
    ↓
Store Pending Actions
    ↓
Internet Available
    ↓
Sync Queue
    ↓
Resolve Conflicts
    ↓
Clear Queue
```

Conflict resolution should generally favor server state for anything
backend-owned (official attendance, verified timetable) and client state
for anything student-owned (their own attendance mark), consistent with
the data ownership model in `PRODUCT.md` §11.

---

## 15. Error Handling

**Frontend:** human-readable errors only (`UX.md` §23 — "Something went
wrong. Please try again," never "Invalid Request").

**Backend:** structured error responses, e.g.:

```json
{
  "success": false,
  "code": "ATTENDANCE_NOT_FOUND",
  "message": "Attendance record does not exist."
}
```

The frontend is responsible for translating structured backend error
codes into the human-readable copy `UX.md` requires — never surface a
raw backend `code` or stack trace to the student.

---

## 16. Security

- Passwords hashed (never stored in plaintext)
- JWT authentication on every request
- Input validation on the backend, regardless of frontend validation
- SQL injection prevention (parameterized queries via JPA/Hibernate)
- XSS protection
- CSRF protection where applicable
- **Never trust frontend validation** — the frontend validates for UX
  responsiveness; the backend validates because it's the actual
  authority (`AGENTS.md` §4.1)

---

## 17. Logging

Logged categories:
- Application logs
- Authentication logs
- Attendance logs
- Proxy reports
- Synchronization logs

**No sensitive information inside logs** — this includes passwords, raw
JWTs, and any personally identifying detail beyond what's needed to
debug an issue.

---

## 18. Performance Goals

| Metric              | Target           |
|----------------------|------------------|
| API response         | < 300ms          |
| Screen transition    | < 200ms          |
| App launch           | < 2 seconds      |
| Attendance update    | Instant UI (optimistic), background sync |

These targets are the technical backbone of `PRODUCT.md` §12's
success metrics (sub-10-second interactions) and `AGENTS.md` §9
(performance goals) — if a feature can't hit these, it needs a redesign
before it ships, not after.

---

## 19. Scalability

The architecture should support, without a redesign:
- Multiple colleges
- Multiple departments
- Multiple semesters
- Thousands of concurrent students

This is a design constraint to keep in mind (e.g., avoid hardcoding
single-college assumptions into schema or business logic), not an MVP
requirement — multi-college deployment itself is explicitly a
post-MVP item (`PRODUCT.md` §14).

---

## 20. Future Extensions

Outside MVP scope, tracked here for awareness (mirrors `PRODUCT.md` §14):
- Faculty portal
- College integration APIs
- QR attendance
- Biometric integration
- Analytics
- Calendar sync
- Push notifications (richer than the MVP's four allowed categories)

Do not build toward these preemptively — see `AGENTS.md` §2.4
(Less Is More).

---

## 21. Infrastructure Philosophy & Deployment Independence

KAIRO must be deployable and sustainably usable at zero recurring cost.
- Permanent free plans (e.g., free tiers of cloud platforms, hosting, or database services) are acceptable.
- Trial-based services or architectures that require payment for normal educational use are prohibited.
- Open standards must be preferred to avoid vendor lock-in.
- **Deployment Independence**: The application architecture depends purely on standard PostgreSQL. The actual deployment targets (Supabase, Neon, self-hosted PostgreSQL, Docker, etc.) remain interchangeable implementation choices, not architectural dependencies. Provider-specific database features or proprietary extensions are prohibited.

---

## 22. Engineering Principles

- Prefer simplicity.
- Prefer readability.
- Prefer explicit code over clever abstractions.
- Avoid premature optimization.
- Write code for the next developer, not the current one.

These restate `AGENTS.md` §11 (Code Quality) in the context of this
specific stack.

---

## 23. Final Rule

Architecture should evolve. The product philosophy should not.

Every technical decision must support KAIRO's mission:

> Know the Right Moment.