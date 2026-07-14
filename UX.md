# UX.md

# KAIRO User Experience Specification

Version: 1.1
Status: Active
Companion documents: `AGENTS.md`, `PRODUCT.md`, `DECISIONS.md`

---

## 0. How This Document Relates to the Others

- `PRODUCT.md` defines **what** KAIRO is and **why** a feature exists.
- `AGENTS.md` defines **how** the codebase is structured and which rules
  govern implementation.
- `DECISIONS.md` records **why past choices were made**, so they aren't
  silently re-litigated.
- `UX.md` (this file) defines **exactly what the interaction should feel
  like** — screen by screen, tap by tap.

If a UX pattern here seems to contradict `PRODUCT.md` or `AGENTS.md`,
that's a documentation bug — flag it rather than quietly picking a side.
One reconciliation is already made below: `PRODUCT.md` §9 defines the
Home screen around **three** questions (Where am I? What comes next?
What changed?). This file expands "Where am I?" into two concrete
lenses — *what's happening now* and *am I okay (attendance-wise)* —
because both need distinct UI treatment. That's an elaboration, not a
contradiction: still three questions at the product level, four lenses
at the interaction level.

---

## 1. Introduction

KAIRO is designed to feel like a native mobile application despite being
a Progressive Web App (`DECISIONS.md` ADR-005).

Every interaction should feel intentional. The application should
disappear into the user's routine. Students should never "use" KAIRO —
they should simply **check** it, the way they'd check the time, the
weather, or a calendar.

---

## 2. Design Goals

KAIRO should feel:
- Fast
- Calm
- Predictable
- Premium
- Native

KAIRO should never feel:
- Busy
- Corporate
- Academic
- Administrative
- Dashboard-heavy

**Design keywords to hold in mind while building anything:** minimal,
focused, contextual, elegant, responsive, fluid, readable, delightful.

---

## 3. The Home Screen

The Home screen is the product (`PRODUCT.md` §9). Nothing is more
important, and every design decision starts here.

### 3.1 What It Must Answer
At the product level, exactly three questions (`PRODUCT.md` §9):
1. Where am I?
2. What comes next?
3. What changed?

At the interaction level, this splits into four concrete lenses the UI
needs to serve:
1. What is happening now?
2. What comes next?
3. Am I okay? (attendance-wise)
4. Has anything changed?

Nothing else belongs above the fold.

### 3.2 Information Priority (highest to lowest)
1. Current Class
2. Next Class
3. Attendance Status
4. Today's Timeline
5. Community Updates
6. Everything else

This ordering mirrors `DECISIONS.md` ADR-007 and should not be
reshuffled without a new ADR.

---

## 4. Current Class Card

Always the largest element on Home. Displays:
- Subject
- Faculty
- Room
- Time
- Attendance status
- Time remaining
- Possible substitute (if a proxy report is Likely or above)

**Actions:** Present · Absent · Report Change

The card updates automatically as time passes — students should never
need to manually refresh (`AGENTS.md` §9, "avoid unnecessary API calls,"
still applies: update via a client-side ticking clock, not a poll loop).

---

## 5. Next Class Card

Shows:
- Subject
- Faculty
- Room
- Start time
- Attendance percentage for that subject

Students should always know where they're going next without having to
tap into a separate timetable view.

---

## 6. Attendance Cards

Attendance should never feel like a spreadsheet. Every subject is a
card, not a row in a table (`AGENTS.md` §3, "Cards → Lists → Tables").

**Example:**
```
Java Programming        DBMS                     Operating Systems
92%                     77%                      74%
Safe                    Attend next class        Critical
Can miss 3 classes
```

No graphs. No pie charts. No dashboards. Only the information a student
needs to make one decision: *can I skip this?*

### 6.1 Attendance Colors
| Color  | Meaning          |
|--------|------------------|
| Green  | Comfortable      |
| Yellow | Watch carefully  |
| Orange | Needs attention  |
| Red    | Critical         |

Use color sparingly, and **never rely on color alone** — always pair it
with text (accessibility requirement, see §14).

---

## 7. Daily Timeline

Students should understand today's schedule at a glance.

**Example:**
```
09:00  Java             Completed
10:00  DBMS             Current
11:00  Break
11:15  OS               Upcoming
```

Status (Completed / Current / Upcoming) matters more than the raw time —
lead with status, not the clock.

---

## 8. Reporting Attendance

Marking attendance is a single interaction: **Present** or **Absent**.

No save button. No confirmation dialog. Changes save immediately — this
follows `AGENTS.md` §3.2 ("do not interrupt users with unnecessary
dialogs or confirmation popups").

---

## 9. Proxy Reporting

If the class changed:

```
Tap "Report Change"
      ↓
Choose Subject
      ↓
Submit
```

Target completion time: **under 10 seconds**, consistent with the
product-wide success metric in `PRODUCT.md` §12.

---

## 10. Community Confidence

Never expose raw technical confidence scores (report counts, percentages,
or algorithms) to the user. Show only the human-readable status tier —
the same canonical tiers used everywhere else in the system
(`AGENTS.md` §7, `PRODUCT.md` §7.4, `DECISIONS.md` ADR-004):

| Status        |
|---------------|
| Pending       |
| Likely        |
| Verified      |
| Auto Accepted |

Language stays human throughout — never surface the word "consensus,"
"algorithm," or a raw report count in the UI copy itself.

---

## 11. Lost & Found

Lightweight by design — no long forms.

**Reporting a found item:**
- Category
- Location
- Date
- Optional image

That's the entire form.

**Claiming an item:** simple verification questions about the item
(matching `PRODUCT.md` §7.5's ownership model). No public exposure of
identifying details.

---

## 12. Navigation

Maximum of four destinations, no exceptions without a new ADR
(`DECISIONS.md` ADR-006):

```
Home · Subjects · Campus · Profile
```
*(Note: The 'Home' navigation label renders the internal page component `TodayPage`.)*

No hamburger menus. No nested navigation. No hidden functionality.

---

## 13. Empty States

Every empty screen should teach or reassure, not just report absence.

**Do:** "No Lost Items — Great! Nothing has been reported today."
**Don't:** "No Data."

---

## 14. Loading States

Avoid spinners unless truly unavoidable. Prefer, in order of preference:
1. Skeleton cards
2. Progressive loading
3. Optimistic updates

---

## 15. Animation

Animation communicates state change, never decoration
(`AGENTS.md` §3.2).

**Use animation for:**
- Current class changing
- Attendance updated
- Proxy verified

**Duration:** 200–300ms, natural easing. If you can't name the state
an animation communicates, cut it.

---

## 16. Haptics

Where supported by the device:

| Event            | Haptic |
|------------------|--------|
| Attendance marked | Light  |
| Proxy verified    | Medium |
| Official sync     | Success |

Haptics reinforce important actions only — not every tap needs one.

---

## 17. Typography

- Large headings, comfortable spacing, readable at arm's length.
- Never shrink font size to fit content — the content adapts to the
  type scale, not the other way around.

---

## 18. Icons

- Icons support meaning; they never replace labels.
- Use a single icon family throughout the app.
- Prefer outlined icons over filled, in line with the minimalist design
  language (`AGENTS.md` §3).

---

## 19. Gestures

**Supported:**
- Pull to refresh
- Swipe between days
- Long press for context actions

Avoid hidden gestures — every gesture must have a visible, tappable
alternative. A student should never be stuck because they didn't know a
swipe existed.

---

## 20. Accessibility

- Minimum touch target: 44px (`AGENTS.md` §10)
- Contrast: WCAG AA minimum
- Support dynamic text sizing
- Keyboard support where applicable (PWA install / desktop use)

---

## 21. Notifications

**Allowed:**
- Official attendance released
- Verified proxy change
- Attendance warning (approaching a critical threshold)
- Lost item match

**Not allowed:**
- Daily motivation messages
- Random tips
- Promotional messages

If a notification doesn't map to one of the four allowed categories,
don't send it — this protects the "never interrupt unnecessarily"
principle (`AGENTS.md` §3.2) even outside the app itself.

---

## 22. Offline Behavior

Students should always be able to, even offline:
- View timetable
- View attendance
- View subjects
- Mark attendance (queued locally)

Changes synchronize automatically once the connection returns — no
manual "sync" button, no lost input.

---

## 23. Error Messages

Never blame the user.

**Don't:** "Invalid Request."
**Do:** "Something went wrong. Please try again."

---

## 24. Success Metrics

- A first-time student understands the application within **one
  minute**.
- A returning student completes their primary task within **five
  seconds**.

If a feature slows either goal, redesign it — don't ship it and plan to
fix it later.

---

## 25. The Final Rule

- Every screen should answer one question.
- Every tap should have a purpose.
- Every animation should communicate state.
- Every feature should earn its place.

If something feels unnecessary, remove it.