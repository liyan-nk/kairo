# PRODUCT.md

# KAIRO
## Know the Right Moment.

Version: 1.1
Status: Active
Companion document to: `AGENTS.md`

---

## 0. How This Document Relates to AGENTS.md

`PRODUCT.md` defines **what KAIRO is and why** — vision, mission, scope,
and what's out of bounds.

`AGENTS.md` defines **how KAIRO is built** — architecture, design system,
naming, and engineering rules.

When evaluating a feature request, check this file first (does it belong
in the product at all?), then `AGENTS.md` (how should it be built, if so?).
If the two ever appear to conflict, that's a bug in the docs — flag it
rather than picking one silently.

---

## 1. Vision

KAIRO is a mobile-first Progressive Web App that helps college students
stay synchronized with their academic day.

Unlike traditional student portals, KAIRO is designed around **time**, not
administration. Every interaction begins with the present moment.

The application answers one question:

> "What do I need to know right now?"

---

## 2. Mission

Reduce the cognitive effort required for students to manage their
academic day.

Students should never have to wonder:
- Which class is next?
- Did today's timetable change?
- What's my estimated attendance?
- Can I safely miss this class?

KAIRO should answer these questions before the student even asks them.

---

## 3. Problem Statement

- Most colleges publish official attendance only a few times per semester.
- Between publications, students estimate attendance manually — mentally
  or via spreadsheets.
- Daily timetable changes (substitute faculty, room swaps, cancellations)
  are communicated inconsistently through WhatsApp groups and word of
  mouth.
- Students switch between multiple, inconsistent sources just to answer
  simple, recurring questions.

KAIRO consolidates these interactions into one focused experience.

---

## 4. Product Philosophy

KAIRO is **not** another Student ERP. KAIRO is **not** a feature-rich
portal. KAIRO is intentionally small.

The goal is to become an application students naturally open several
times every day. Every feature must contribute to that habit — see
`AGENTS.md` §2 for how this philosophy translates into build decisions.

### 4.1 Time First
Everything revolves around the current academic hour. The current class
outranks tomorrow's timetable. The next class outranks semester
statistics.

### 4.2 One Glance
A student should understand their current academic state within five
seconds. The home screen should never feel overwhelming.

### 4.3 Minimal by Design
If a feature introduces complexity without increasing daily usefulness,
it should not be implemented. Fewer features executed exceptionally beat
many features executed averagely.

### 4.4 Community Assisted
Some academic information changes faster than administrators can update
it. Students collectively become the fastest source of truth. Consensus
is always preferred over any single individual report.

---

## 5. Target Users

**Primary**
- Undergraduate students

**Secondary**
- Class representatives
- Faculty coordinators
- Department administrators

---

## 6. Primary Use Cases

A student opens KAIRO to:
- Check the current class
- Check the next class
- View attendance estimation
- Mark attendance
- Report timetable changes
- View verified timetable corrections
- Check Lost & Found items

---

## 7. MVP Scope

### 7.1 Home
Shows:
- Current class
- Next class
- Attendance status
- Today's progress
- Important updates

See §9 for the full home screen philosophy — this screen *is* the product.

### 7.2 Attendance
- Students initialize attendance after every official publication.
- From that point, daily attendance updates generate an estimated
  attendance figure on top of the official baseline.
- When the next official attendance is released, the baseline resets and
  the cycle repeats.

### 7.3 Timetable
- Displays today's schedule.
- Automatically updates when community consensus verifies a timetable
  change.

### 7.4 Proxy Verification
Students may report a schedule discrepancy as:

```
Expected Subject
      ↓
Actual Subject
```

Multiple matching reports increase confidence. This uses the same
consensus tiers defined in `AGENTS.md` §7:

| Reports | Status        |
|---------|---------------|
| 1–2     | Pending       |
| 3–4     | Likely        |
| 5–9     | Verified      |
| 10+     | Auto Accepted |

**Only Verified (or higher) changes affect attendance estimation.**
Pending and Likely reports are visible but do not alter any student's
attendance numbers.

### 7.5 Lost & Found
Students may:
- Report Lost
- Report Found
- Claim Item

Ownership is verified through descriptive questions about the item
rather than public exposure of identifying details — this protects both
the finder and the claimant from oversharing personal information in a
public thread.

---

## 8. Information Architecture

Bottom Navigation:

```
Home  ·  Subjects  ·  Campus  ·  Profile
```
*(Note: The 'Home' navigation label renders the internal page component `TodayPage`.)*

No other primary navigation surface should be introduced without a
strong justification — see `AGENTS.md` §2.4 (Less Is More).

---

## 9. Home Screen Philosophy

The home screen is the product. It should answer exactly three
questions:

1. Where am I?
2. What comes next?
3. What changed?

Nothing more. Any addition to the home screen must map to one of these
three questions or it doesn't belong there.

---

## 10. Attendance Philosophy

Attendance is an **estimation layer** built on top of official
institutional data. The application never replaces official attendance —
it extends it between publication cycles.

Official attendance always outranks estimated attendance. If the two
ever disagree, official data wins and estimated data resets against it.

---

## 11. Data Ownership

| Data                     | Owned By     |
|--------------------------|--------------|
| Official attendance      | Institution  |
| Estimated attendance     | Student      |
| Schedule verification    | Community    |

This ownership model determines who can edit what, and should inform any
permissions/authorization logic on the backend (`AGENTS.md` §4.1).

---

## 12. Success Metrics

- A successful interaction completes in **under ten seconds**.
- A successful user opens KAIRO **multiple times per day**, unprompted.
- A successful home screen requires **no scrolling** on most devices.

Any feature proposal should be evaluated against whether it moves these
three metrics in the right direction — not just whether it's "useful" in
the abstract.

---

## 13. Non-Goals

KAIRO will not become:
- Student ERP
- Learning Management System
- Notes Application
- Chat Platform
- Social Network
- Assignment Tracker
- Expense Manager
- Calendar Replacement
- AI Assistant

Requests that move the product toward any of these should generally be
rejected — this list mirrors `AGENTS.md` §8.2 ("Features That Do NOT
Belong") intentionally; the two lists should be kept in sync if either
changes.

---

## 14. Future Vision (Post-MVP)

Intentionally excluded from the MVP, but plausible later:
- QR-based attendance synchronization
- Faculty verification
- Push notifications for verified timetable changes
- Smart attendance forecasting
- Multi-college deployment
- Institutional integrations

None of these should be pulled into scope early just because they're
easy to build alongside a related feature — MVP discipline holds until
a deliberate decision to expand scope is made and recorded in
`DECISIONS.md` (`AGENTS.md` §13).

---

## 15. Product Identity

KAIRO is not built around attendance. Attendance is only one capability.

KAIRO is built around **awareness**. Students should always know:
- where they are,
- what comes next, and
- what changed.

That is the product.

---

## 16. Product Statement

KAIRO is a time-first academic companion that keeps students synchronized
with their college day through real-time schedules, attendance
estimation, and community-verified updates.