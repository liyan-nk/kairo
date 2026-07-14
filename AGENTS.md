# AGENTS.md

# KAIRO Engineering Constitution

Version: 1.2
Status: Active
Audience: Any human or AI agent contributing code to this repository
Companion documents: `PRODUCT.md`, `DECISIONS.md`, `UX.md`,
`ARCHITECTURE.md`, `DESIGN_SYSTEM.md`

---

## 0. Read This First

This file is the source of truth for how KAIRO is built. Before writing code,
an agent should:

1. Read the **Product Philosophy** section — it decides *whether* a feature
   should exist.
2. Read the **Architecture Principles** — it decides *where* code goes.
3. Read **Development Rules** — it decides *whether to proceed at all*.

If a request conflicts with this file, flag the conflict instead of silently
picking one side.

---

## 1. What Is KAIRO?

KAIRO is a mobile-first Progressive Web App (PWA) that acts as a student's
daily academic companion.

KAIRO is **NOT**:
- A Student ERP
- An Attendance Management System
- A generic dashboard

KAIRO exists to answer one question, fast:

> "What do I need to know right now?"

Every feature, PR, and refactor must serve that question. If it doesn't,
it doesn't belong in this repo.

---

## 2. Product Philosophy

A feature must satisfy at least one of the following. If it satisfies none,
do not build it.

### 2.1 Time First
Time is the primary axis of the product. Priority order:
1. Current class
2. Next class
3. Today's progress
4. Attendance estimation
5. Live schedule changes

Everything else is secondary and should not compete with these for screen
space or attention.

### 2.2 One Glance
A student must get useful information within **5 seconds** of opening the
app. If a feature requires drilling through multiple screens to answer
"what do I need to know right now," redesign it — don't ship it.

### 2.3 Daily Habit
Features should give students a reason to open KAIRO multiple times a day.

Good: current subject, next class, attendance estimation, schedule updates.
Bad: GPA calculator, PDF viewer, chat system — anything that's a one-off
utility rather than a recurring check-in.

### 2.4 Less Is More
When multiple valid solutions exist, ship the simpler one. Avoid:
- Feature creep
- Unnecessary configuration/settings
- Complexity that adds little user-facing value

---

## 3. Design Philosophy

Visual language is inspired by Apple HIG, Linear, Notion, Arc Browser, and
Things 3.

**Characteristics to aim for:**
- Large typography
- High whitespace
- Rounded corners
- Premium spacing
- Smooth, purposeful animations
- Minimal visual noise
- Clear information hierarchy

**Never use:**
- Gradient-heavy interfaces
- Material Design–style clutter
- Tiny touch targets
- Dense tables on mobile
- Dashboard overload (walls of widgets/stats)

**Preference order when structuring information:**
Cards → Lists → Tables (reach for tables last, and rarely on mobile)

Navigation must always feel effortless — no dead ends, no hidden paths to
core info.

### 3.1 Mobile First
Desktop is secondary. Every feature is designed for mobile first. Before
building a UI, an agent should check:
- Can this be completed one-handed?
- Can it be completed in under three taps?
- Does this require typing? (avoid if possible)
- Can this be simplified further?

### 3.2 Interaction Rules
- Do not interrupt users with unnecessary dialogs, confirmation popups, or
  excessive notifications.
- Motion communicates state changes — loading, success, error, transition.
- Animation must never exist purely for decoration. If you can't name the
  state it communicates, remove it.

### 3.3 Where the Numbers Live
This section states the *qualitative* rules ("large typography," "premium
spacing," "rounded corners"). It does not define exact pixel values, hex
codes, or durations — those live in `DESIGN_SYSTEM.md`, which is the
concrete implementation of this section (`DECISIONS.md` ADR-009). When
building UI, use `DESIGN_SYSTEM.md` for the literal values and this
section for the judgment calls it doesn't cover.

---

## 4. Architecture Principles

Maintain strict separation of responsibilities, flowing in one direction:

```
UI
 ↓
State
 ↓
Business Logic
 ↓
Database
```

Business logic never lives inside UI components. If you catch yourself
writing a calculation, validation rule, or consensus check inside a
component or page file, move it down the stack.

### 4.1 Backend Owns
- Validation
- Attendance calculation
- Consensus logic (see §7)
- Authorization
- Persistence

### 4.2 Frontend Owns
- Rendering
- Interaction handling
- Transitions/animation
- Optimistic updates (with backend as source of truth on reconciliation)

An agent adding a feature should place logic in the correct layer even if
it's more convenient to shortcut it into the UI for a quick fix.

---

## 5. Component Philosophy

- Every component has a single responsibility.
- Prefer composition over configuration/inheritance.
- Avoid duplicating logic across components — extract a hook or shared
  util instead.
- Do not create one-off components unless there's a concrete reason
  (e.g., isolating a complex piece of state or markup); trivial one-time
  markup can stay inline.

---

## 6. Naming Conventions

**Pages**
`TodayPage`, `SubjectsPage`, `CampusPage`, `ProfilePage`
*(Note: `TodayPage` corresponds to the navigation label 'Home' in the bottom navigation system.)*

**Components**
`SubjectCard`, `AttendanceBadge`, `ScheduleCard`, `BottomNavigation`

**Dialogs**
`AttendanceDialog`, `ProxyReportDialog`, `FoundItemDialog`

**Hooks**
`useAttendance()`, `useToday()`, `useSubjects()`

Follow these patterns for any new page/component/dialog/hook rather than
introducing a new naming style. This is the single source of truth for
component names — `DESIGN_SYSTEM.md`'s component library (§26 there) must
match these names exactly; if a new component needs a name, add it here
first, then reference it in `DESIGN_SYSTEM.md`.

---

## 7. Consensus System

Community-submitted input (e.g., proxy reports, lost & found status) is
never trusted immediately. It moves through trust tiers based on report
count:

| Reports | Status        |
|---------|---------------|
| 1–2     | Pending       |
| 3–4     | Likely        |
| 5–9     | Verified      |
| 10+     | Auto Accepted |

Consensus logic is backend-only (see §4.1). The frontend only renders the
current status — it never computes or overrides it. Visual treatment for
each tier is defined in `DESIGN_SYSTEM.md` §8.4, and is deliberately kept
on a separate color scale from attendance status (`DESIGN_SYSTEM.md` §8.3)
— the two are different dimensions and should never be visually confused.

---

## 8. Development Rules — The Gate

Before implementing anything, ask:

1. Does this improve daily usage?
2. Would a student open KAIRO *because* of this?
3. Does it align with the product philosophy (§2)?

**If the answer to any is "no," do not build it** — say so instead of
implementing it anyway, even if the request came from the user directly.
Push back and explain which principle it conflicts with.

### 8.1 Features That Belong
- Attendance estimation
- Current subject
- Next subject
- Proxy verification
- Official attendance synchronization
- Lost & Found
- Timetable

### 8.2 Features That Do NOT Belong
- Social network features
- AI chatbot
- Notes application
- LMS functionality
- Assignment management
- Expense tracker
- Calendar replacement
- Generic productivity features
- A global/app-wide search surface (in-page filtering within a single
  list view, e.g. Subjects or Campus, is fine — see
  `DESIGN_SYSTEM.md` §26)

If a request maps to §8.2, flag it as out of scope rather than quietly
building a version of it.

---

## 9. Performance Goals

- First load should feel instant.
- Interactions should complete within milliseconds, not seconds.
- Avoid unnecessary API calls — batch, debounce, or cache instead of
  polling naively.
- Cache intelligently (favor stale-while-revalidate patterns for
  read-heavy, low-volatility data like timetables).
- Optimize specifically for mobile networks (assume 3G/4G, not fiber).

---

## 10. Accessibility

Always maintain:
- Readable typography (no text below comfortable mobile reading size)
- Sufficient touch targets (44x44pt minimum as a baseline)
- High contrast
- Keyboard accessibility where applicable (desktop/PWA install use cases)
- Screen reader support where feasible

---

## 11. Code Quality

- Prefer readability over cleverness.
- Write self-documenting code — clear names over clever one-liners.
- Comments explain *why*, not *what*.
- Avoid premature optimization; optimize once a real bottleneck is
  measured, not guessed.

---

## 12. Git Workflow

**Branches**
`feature/`, `fix/`, `refactor/`, `docs/`

**Commit style** (Conventional Commits)
`feat:`, `fix:`, `refactor:`, `docs:`, `style:`

---

## 13. Documentation

- Every architectural decision gets recorded in `DECISIONS.md` — do not
  rely on memory or tribal knowledge.
- If an agent makes a nontrivial architectural choice (new dependency,
  new data flow pattern, deviation from this file), it should propose a
  `DECISIONS.md` entry alongside the code change.

---

## 14. Final Rule

Every pull request should answer one question:

> Does this make KAIRO feel more like the student's daily companion?

If not, rethink the implementation before merging.