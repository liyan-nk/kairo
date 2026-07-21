# DECISIONS.md

# KAIRO Architecture Decision Records (ADR)

Version: 1.2
Status: Active
Companion documents: `AGENTS.md`, `PRODUCT.md`, `UX.md`, `ARCHITECTURE.md`,
`DESIGN_SYSTEM.md`

---

## 0. Purpose

This document records the architectural and product decisions made during
KAIRO's development, so no one — human or agent — has to rely on memory or
tribal knowledge (`AGENTS.md` §13).

Every ADR should answer:
- Why was this decision made?
- What alternatives were considered?
- What trade-offs were accepted?

**Before implementing a nontrivial change** (new dependency, new data flow
pattern, deviation from `AGENTS.md` or `PRODUCT.md`), propose a new ADR
here first. Don't retroactively document — record decisions as they
happen.

### Status values
- `Proposed` — under discussion, not yet implemented
- `Accepted` — decided and implemented (or actively being implemented)
- `Deprecated` — no longer recommended, but still present in the codebase
- `Rejected` — considered and explicitly not adopted
- `Superseded` — replaced by a later ADR (link to it)

### ADR Template
```
# ADR-NNN

Title:        <short name>
Status:       <Proposed | Accepted | Deprecated | Rejected | Superseded>
Date:         <YYYY-MM-DD>
Supersedes:   <ADR-NNN, if applicable>

## Decision
<one or two sentences, stated plainly>

## Context
<what situation forced this decision>

## Reasoning
<why this option over the alternatives>

## Consequences
<what this commits us to, including downsides accepted>
```

---

## ADR-001 — Project Name

Status: Accepted

**Decision**
The project shall be named **KAIRO**.

**Context**
The project needed a unique, memorable, premium identity that doesn't
read as a traditional college project or attendance system.

**Reasoning**
KAIRO derives from *Kairos*, the Greek word for "the right moment." The
application is built around helping students know the right information
at the right time — this is the naming rationale behind the product
tagline in `PRODUCT.md` ("Know the Right Moment").

**Consequences**
All branding and documentation should present KAIRO as a real software
product, not an academic submission.

---

## ADR-002 — Product Identity

Status: Accepted

**Decision**
KAIRO is a **time-first academic companion**.

**Context**
Early concepts resembled student portals and attendance management
systems.

**Reasoning**
Those approaches became feature-heavy and lacked a strong identity. The
product instead revolves around the student's current academic moment —
formalized as the "Time First" principle in `PRODUCT.md` §4.1.

**Consequences**
Every feature must support the central experience of daily awareness, not
administrative record-keeping.

---

## ADR-003 — Attendance Model

Status: Accepted

**Decision**
Attendance shall be estimated between official college attendance
publications.

**Context**
Most colleges publish official attendance only a few times per semester.
Students have no accurate way to track attendance in between.

**Reasoning**
Students initialize attendance using the official institutional figure.
Daily marked attendance then updates a local estimate until the next
official publication resets the baseline. Full detail in `PRODUCT.md`
§7.2 and §10.

**Consequences**
Official attendance is always authoritative over the estimate. Estimated
attendance only exists, and only matters, between publication cycles.

---

## ADR-004 — Proxy Verification / Consensus Thresholds

Status: Accepted

**Decision**
Schedule changes shall be verified through community consensus rather
than trusted on a single report.

**Context**
Faculty substitutions and last-minute schedule changes are unpredictable,
and administrators can't manually update every timetable change in real
time.

**Reasoning**
Multiple matching student reports build confidence in a change. The
system automatically escalates trust as reports accumulate, and only
sufficiently-verified changes are allowed to affect attendance
estimation.

**Thresholds** (canonical — also defined in `AGENTS.md` §7 and
`PRODUCT.md` §7.4; update all three together if this ever changes):

| Reports | Status        |
|---------|---------------|
| 1–2     | Pending       |
| 3–4     | Likely        |
| 5–9     | Verified      |
| 10+     | Auto Accepted |

**Consequences**
A single incorrect report can never immediately affect a student's
attendance estimation. Consensus logic lives entirely on the backend
(`AGENTS.md` §4.1) — the frontend only ever renders a status, never
computes one. Status colors and treatment for these four tiers are
defined in `DESIGN_SYSTEM.md` §8.4, and are a deliberately separate
color scale from the attendance-percentage colors in §8.3 — the two
are different dimensions and must never share a color scale.

---

## ADR-005 — Platform

Status: Accepted

**Decision**
KAIRO shall be developed as a Progressive Web Application (PWA).

**Context**
Publishing separate native Android and iOS applications is outside the
project's scope.

**Reasoning**
A PWA provides a mobile-first experience, home-screen installability,
cross-platform compatibility, offline capability, and a single codebase —
without the overhead of maintaining native builds.

**Consequences**
Every interface must feel indistinguishable from a native mobile app.
"It's a PWA" is never an acceptable excuse for a janky or web-feeling
interaction.

---

## ADR-006 — Navigation Philosophy

Status: Accepted

**Decision**
Bottom navigation shall contain only the application's primary
destinations.

**Context**
Large navigation structures increase cognitive load and work against the
"One Glance" principle (`PRODUCT.md` §4.2).

**Reasoning**
Students should immediately understand where to go without thinking
about it.

**Current structure**
`Home · Subjects · Campus · Profile`

**Consequences**
New features should extend an existing section rather than introduce a
new top-level navigation item. Adding a 5th nav item requires a new ADR,
not a quiet addition.

---

## ADR-007 — Home Screen Priority Order

Status: Accepted

**Decision**
The Home screen shall always prioritize the current academic moment,
in this order:

1. Current Class
2. Next Class
3. Attendance Status
4. Important Updates
5. Campus Activity

**Context**
Students open KAIRO primarily to know what's happening *right now*, not
to review historical data.

**Reasoning**
This ordering directly encodes the "Time First" principle into UI
layout, so the most time-sensitive information is physically closest to
the top of the screen.

**Consequences**
The Home screen must never become a statistics-heavy dashboard. Any
addition to Home must slot into this priority order, not compete above
Current Class.

---

## ADR-008 — Feature Scope

Status: Accepted

**Decision**
KAIRO intentionally excludes generic productivity features.

**Context**
Feature requests routinely drift toward turning KAIRO into a general
student utility app.

**Rejected features**
Chat, Assignment Manager, Notes, Expense Tracker, Calendar, AI Chatbot,
Student Social Feed, Learning Management System.

**Reasoning**
These features dilute the product identity established in ADR-002 and
compete with the core "daily awareness" loop for attention.

**Consequences**
Future development must remain focused on daily academic awareness. This
list mirrors `PRODUCT.md` §13 and `AGENTS.md` §8.2 — if a rejected
feature is ever reconsidered, update all three documents together and
mark this ADR `Superseded` rather than silently editing the list.

---

## ADR-009 — Design Language

Status: Accepted

**Decision**
The visual identity shall follow premium, minimalist design principles.

**Context**
KAIRO needed a visual identity distinct from cluttered, dashboard-style
Indian student ERP portals.

**Inspired by**
Apple Human Interface Guidelines, Linear, Notion, Things 3, Arc Browser.

**Rules**
Large typography, high whitespace, rounded cards, minimal motion, no
visual clutter, no unnecessary gradients.

**Consequences**
Design consistency takes priority over experimentation. Full qualitative
rules live in `AGENTS.md` §3; exact tokens (colors, spacing, radii, type
scale) live in `DESIGN_SYSTEM.md`, which is the concrete implementation
of this ADR.

---

## ADR-010 — Product Philosophy (Habit Over Utility)

Status: Accepted

**Decision**
KAIRO should become a habit rather than a one-off utility.

**Context**
Utility apps get opened only when needed and are easily forgotten;
habit-forming apps get opened unprompted.

**Reasoning**
The most successful consumer products become part of a daily routine.
Students should naturally open KAIRO several times a day without push
reminders forcing them to.

**Consequences**
Every feature proposal must answer: "Will this increase meaningful daily
engagement?" If the answer is no, it should be reconsidered rather than
built — this is the gating question formalized in `AGENTS.md` §8.

---

## ADR-011 — Design System Adoption & Progress Ring Reconciliation

Status: Accepted
Date: 2026-07-14

**Decision**
`DESIGN_SYSTEM.md` is adopted as the canonical token layer (colors,
spacing, radii, type scale, motion durations, component list) beneath
`AGENTS.md` §3 and `UX.md`. As part of adopting it, a **circular
"Progress Ring" component is explicitly rejected** for attendance
display and removed from the component list.

**Context**
An early draft of `DESIGN_SYSTEM.md` listed both a "Progress Ring" and
an "Attendance Chip" as UI components. A circular progress indicator is
functionally a pie chart, which directly conflicts with `UX.md` §6:
"No graphs. No pie charts. No dashboards." The draft also used
"Attendance Chip" and "Modal" — names that don't match the canonical
component names already defined in `AGENTS.md` §6 (`AttendanceBadge`,
and the `*Dialog` family).

**Reasoning**
`UX.md` §6 is unambiguous and product-critical: attendance must answer
one question ("can I skip this?") through status text and a percentage,
not a visualization. A progress ring, however subtle, reintroduces the
"dashboard" feel the product explicitly rejects (`UX.md` §2,
`PRODUCT.md` §4.3). Naming was reconciled to `AGENTS.md` §6 rather than
introducing parallel terminology, since `AGENTS.md` §6 is the single
source of truth for component names.

**Consequences**
- Attendance is represented only via status word + percentage text,
  with an optional subtle horizontal progress bar as a secondary accent
  (never the primary signal) — see `DESIGN_SYSTEM.md` §21.
- `AttendanceBadge` (not "Attendance Chip") and the `*Dialog` family
  (not "Modal") are the only sanctioned names — matching `AGENTS.md` §6.
- Any future request to add a radial/circular data visualization
  anywhere in the product needs a new ADR and a `UX.md` §6 amendment
  first, not a quiet re-introduction through the design system.

---

## ADR-012 — Dark Mode Support

Status: Accepted
Date: 2026-07-14

**Decision**
KAIRO shall support a dark color mode, using the token set defined in
`DESIGN_SYSTEM.md` §9.

**Context**
`DESIGN_SYSTEM.md` was drafted with a full dark-mode palette, but no
prior document (`PRODUCT.md`, `UX.md`, `AGENTS.md`, `ARCHITECTURE.md`)
had scoped dark mode as a feature. Per `DECISIONS.md` §0, a nontrivial
UI capability like this needs a recorded decision rather than arriving
silently through a token file.

**Reasoning**
A native-feeling, Apple-HIG-inspired app (`DECISIONS.md` ADR-009) is
expected to support system-level light/dark switching by default; its
absence would itself read as a gap against the "feels native" bar in
`UX.md` §1 and `DECISIONS.md` ADR-005.

**Consequences**
- Every semantic and attendance color token needs a light and dark
  variant (`DESIGN_SYSTEM.md` §8–§9) — a color must never be added to
  one mode without the other.
- Mode should follow the device/system preference by default; no
  in-app dark-mode toggle should be added without weighing it against
  `AGENTS.md` §2.4 (Less Is More — avoid unnecessary settings/config).
- QA and design review must check both modes before a UI change ships.

---

## ADR-013 — Sustainable Zero-Cost Infrastructure Philosophy

Status:       Accepted
Date:         2026-07-14

### Decision
KAIRO must be deployable and sustainably usable at zero recurring cost. All cloud infrastructure, hosting, database, and background services must leverage permanent free tiers or self-hosted open standards. The application maintains Deployment Independence: it depends on standard PostgreSQL, while deployment targets (Supabase, Neon, self-hosted PostgreSQL, Docker, etc.) remain interchangeable implementation choices, and provider-specific features or proprietary extensions are prohibited.

### Context
College students and educational institutions often operate without budget for recurring SaaS or cloud infrastructure costs. Time-limited trials or tiered dependencies that require payment for regular usage limit KAIRO's long-term sustainability and usability.

### Reasoning
Relying on standard open-source tools (like PostgreSQL, Java, React) and self-hostable configurations (Docker) guarantees that students can deploy and run the app for free. Permanent free hosting tiers (e.g., Vercel, Render) are suitable for small-scale deployments, but we must avoid vendor lock-in (e.g., Neon serverless branching, Supabase-specific extensions) to keep the app portable and deployment-independent.

### Consequences
- Database interaction must be built on top of standard SQL and JPA/Hibernate.
- The project will avoid proprietary database hosting integrations, preserving Deployment Independence.
- Application resource footprints must remain small enough to run stably on standard free-tier hosting limits.

---

## ADR-014 — Offline Storage Mechanism

Status:       Proposed
Date:         2026-07-14

### Decision
The Progressive Web Application (PWA) shall utilize **IndexedDB** as its primary client-side persistent storage mechanism for cached schedules, local logs, and offline synchronization queues.

### Context
KAIRO's offline-first strategy requires students to view timetables, view attendance status, and log attendance marks while completely offline. These offline actions are queued and synced when the connection returns. This necessitates storing structured relational data and queued sync operations client-side.

### Reasoning
- **IndexedDB** is asynchronous, transactional, and supports storing large amounts of structured JavaScript objects. It does not block the browser's UI thread.
- **LocalStorage** is synchronous (blocking the main thread) and restricted to a 5MB storage limit of string-only key-value pairs, which is insufficient for relational data models and offline queues.
- Standard libraries (e.g., Dexie.js or localForage) will be used to wrap the IndexedDB API for clean developer ergonomics and type safety.

### Consequences
- Synchronization and client data-caching logic must handle asynchronous database reads/writes.
- Local data sync schemas must match standard Java entities where appropriate.

---

## ADR-015 — Single Source of Truth Live Schedule Engine

Status:       Accepted
Date:         2026-07-21

### Decision
`liveSchedule.ts` shall serve as the single source of truth for all time-based schedule intelligence (current class, next class, countdowns, progress, break detection, day status). All presentation logic receives derived view models from `timetableViewModel.ts` and performs zero independent time calculations in UI component layers. Timer state synchronizes to minute boundaries (`:00` seconds) and automatically pauses during tab hidden states.

### Context
KAIRO requires real-time schedule awareness, automatic class progression, countdowns, and timeline state rendering on the Today screen. Performing ad-hoc time calculations inside React components leads to inconsistent time displays, contradictory states, and timer drift during long-running sessions.

### Reasoning
- **Pure Time-Based Computation**: Computing current/next class and progress percentages at render time from canonical timetable data ensures zero persistent state corruption in IndexedDB.
- **Minute-Boundary Synchronization**: Synchronizing timer ticks to the exact `:00` second boundary of each minute ensures clock alignment and eliminates countdown drift.
- **Separation of Concerns**: Keeping all schedule math inside `liveSchedule.ts` and `timetableViewModel.ts` preserves the core architecture principles (`AGENTS.md` §4).

### Consequences
- UI components remain pure presenters.
- Time-based state is non-persisted and automatically recalculates on system time changes or tab visibility changes.

---

## ADR-016 — Pure Attendance Analytics & Presentation View Models

Status:       Accepted
Date:         2026-07-21

### Decision
All attendance trends, streaks, risk scores, and semester health metrics shall be derived as a pure calculation layer from canonical `Subject` and `AttendanceHistory` data at render time. Presentation view models (`SemesterInsightsViewModel`, `SubjectInsightsViewModel`) expose sanitized presentation-ready summaries (`SubjectInsightSummary`) rather than leaking domain entities into UI components. No analytical metrics or trend calculations shall be persisted to IndexedDB.

### Context
Phase 8A introduces long-term attendance analytics, streaks, and semester health indicators. Persisting derived analytics or leaking full domain entities into presentation components risks data duplication, cache invalidation drift, and tight coupling between database entities and UI components.

### Reasoning
- **Data Integrity**: Computing trends and streaks dynamically on read ensures analytics always reflect the true underlying attendance history.
- **Layer Separation**: Exposing presentation summaries (`SubjectInsightSummary`) keeps the domain model isolated from presentation requirements (`AGENTS.md` §4).

### Consequences
- Analytics calculations remain computational and lightweight at render time.
- Database schema remains clean and unburdened by derived analytics stores.

---

## ADR-017 — Non-Destructive Live Schedule Discrepancy Overlays

Status:       Accepted
Date:         2026-07-21

### Decision
Community discrepancy reports (Expected vs Actual Subject, Room, Faculty, Slot) shall be processed through the consensus engine, but they must never mutate the canonical timetable records stored in IndexedDB. Instead, the Live Schedule Resolver will dynamically overlay verified consensus reports on top of the canonical timetable items at render time.

### Context
Allowing user reports to overwrite the database introduces significant risk of schedule desynchronization or corrupted timetable recovery. If a consensus report is later rejected or expires, returning to the correct timetable requires complex backups or server queries.

### Reasoning
- **Data Integrity**: Preserving a single, unmutated canonical timetable makes schedule tracking fully non-destructive and robust.
- **Fail-safe Recovery**: If reports expire or are flagged incorrect, KAIRO automatically falls back to the official timetable timeline.

### Consequences
- Timetable database records remain clean and unchanged.
- The overlay logic runs computationally during render.

---

## ADR-018 — Minimal Institutional Synchronization Profile

Status:       Accepted
Date:         2026-07-21

### Decision
The Student Profile screen shall remain strictly minimal and focus purely on Student Identity (Name, Roll, Dept, Semester, Section), Official Baseline Sync (date and percentage inputs), and About details. All configurations like configurable target attendance thresholds (fixed at 75% across the entire application) and storage backup/reset clutter are excluded.

### Context
Exposing low-level database actions (export/import data) or shifting target attendance thresholds (e.g. 75%, 80%) into user settings exposes internal details and administrative rules that conflict with KAIRO's "One Glance" and "Less Is More" philosophy.

### Reasoning
- **Clutter Reduction**: Keeps the profile clean and focused purely on synchronization.
- **Product Focus**: Ensures all computations follow consistent rules aligned with institutional policies.

---

## ADR-019 — Canonical Weekday Timetable Navigation & Baseline Terminology

Status:       Accepted
Date:         2026-07-21

### Decision
1. **Canonical Timetable Source**: A dedicated Timetable screen (`/timetable`) shall serve as KAIRO's second major navigation tab. The Timetable page, Today page, and Live Schedule Resolver must all consume the exact same database timetable store. No duplicated timetable data or secondary schedule arrays are permitted.
2. **Official Baseline Terminology**: The Profile page shall display the Last Official Attendance Baseline (e.g. 80.0%) and Last Official Update Date without exposing manual sync triggers in V1. Institutional minimum requirement (75%) remains fixed across all estimation algorithms.

### Context
Allowing duplicate timetable arrays or exposing manual sync controls created UX inconsistencies and risks of state desynchronization.

### Reasoning
- **Data Integrity**: Single source of truth across Today, Timetable, and Campus.
- **Product Clarity**: The student receives instant schedule answers for any weekday (Mon-Fri).

---

## Future ADRs

Every major technical or product decision must be recorded here **before**
implementation, not after. Anticipated topics:

- Authentication strategy
- Database design
- Offline support
- Synchronization strategy
- Notification strategy
- API architecture
- Deployment
- Security
- Data privacy
- Attendance algorithms (the actual estimation formula, once designed)

Do not rely on memory. Record decisions as they happen, using the
template in §0.