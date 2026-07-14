# DESIGN_SYSTEM.md

# KAIRO Design System

Version: 1.0
Status: Active
Companion documents: `AGENTS.md`, `PRODUCT.md`, `DECISIONS.md`, `UX.md`,
`ARCHITECTURE.md`

---

## 0. How This Document Relates to the Others

- `PRODUCT.md` defines **what** KAIRO is and why a feature belongs.
- `AGENTS.md` §3 defines the **qualitative** design philosophy — what
  KAIRO should feel like, and the rules that govern interaction
  patterns (e.g. "don't interrupt with unnecessary dialogs").
- `UX.md` defines the **screen-by-screen interaction spec** — what
  happens, in what order, on which screen.
- `DESIGN_SYSTEM.md` (this file) is the **concrete token layer**
  underneath both: exact colors, spacing, radii, type scale, motion
  durations, and the canonical component list. It exists so "large
  typography" and "premium spacing" (`AGENTS.md` §3) stop being
  adjectives and become numbers a developer can implement directly in
  the TailwindCSS config (`ARCHITECTURE.md` §3.1).

**Precedence rule:** if a specific numeric value here ever conflicts
with a number in `UX.md` or `AGENTS.md`, this file is authoritative for
the *number*. `AGENTS.md` and `UX.md` remain authoritative for the
*rule itself* — e.g. this file listing `Dialog` as a component does not
override `AGENTS.md` §3.2's instruction to avoid unnecessary dialogs;
it only defines what a dialog should look like on the rare occasions
`UX.md` calls for one.

All component names in this document must match the canonical naming
list in `AGENTS.md` §6 exactly. If a name is needed here that isn't yet
in `AGENTS.md` §6, add it there first rather than inventing a second
name for the same thing.

---

## 1. Philosophy

KAIRO should feel calm.

Not playful. Not corporate. Not educational.

The application should disappear into the student's routine. The
interface should communicate confidence through simplicity.

---

## 2. Design Keywords

Minimal · Elegant · Modern · Contextual · Premium · Timeless · Calm ·
Focused · Native

---

## 3. Inspirations

Apple Human Interface Guidelines · Linear · Things 3 · Notion ·
Arc Browser · Notion Calendar · Spotify (navigation only)

---

## 4. Design Principles

- Remove before adding.
- Whitespace is a feature.
- Motion communicates state.
- Typography creates hierarchy.
- Cards replace tables.
- Information replaces decoration.

---

## 5. Grid System

**Base unit:** 8px

**Spacing scale:** 4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64

Never use arbitrary spacing values outside this scale.

---

## 6. Border Radius

| Token  | Value  |
|--------|--------|
| Small  | 10px   |
| Medium | 16px   |
| Large  | 24px   |
| Pill   | 999px  |

---

## 7. Shadows

Very subtle. Prefer elevation through spacing and surface color rather
than shadow. Large floating shadows are prohibited — they read as
"web app," not native (`DECISIONS.md` ADR-005, ADR-009).

---

## 8. Colors — Light Mode

### 8.1 Core Palette
| Token             | Value     |
|--------------------|-----------|
| Background         | `#FFFFFF` |
| Surface            | `#FFFFFF` |
| Secondary Surface  | `#F6F6F7` |
| Border             | `#E7E7EA` |
| Primary Text       | `#111111` |
| Secondary Text     | `#7A7A80` |

### 8.2 System Semantic Colors
Used for form validation, generic success/error feedback, and the
Info accent (see §8.4). **Not** the palette used for attendance tiers —
see §8.3.

| Token   | Value     |
|---------|-----------|
| Success | `#2E7D32` |
| Warning | `#F9A825` |
| Danger  | `#D32F2F` |
| Info    | `#1976D2` |

### 8.3 Attendance Status Colors
These are the four colors referenced in `UX.md` §6.1. They are a
distinct four-stop scale, not a reuse of the three-stop system palette
above — attendance needs a fourth "needs attention" stop between
Warning and Danger that §8.2 doesn't otherwise provide.

| Color  | Value     | Meaning          | Maps to `UX.md` §6.1 |
|--------|-----------|------------------|------------------------|
| Green  | `#2E7D32` | Comfortable      | Green                  |
| Yellow | `#F9A825` | Watch carefully  | Yellow                 |
| Orange | `#EF6C00` | Needs attention  | Orange                 |
| Red    | `#D32F2F` | Critical         | Red                    |

Color is always paired with text — see `UX.md` §6.1 and §14.
(Accessibility.)

### 8.4 Consensus Status Colors
The four community-report tiers (`AGENTS.md` §7, `PRODUCT.md` §7.4,
`DECISIONS.md` ADR-004) are a **separate dimension from attendance** —
never reuse the Green/Yellow/Orange/Red attendance scale for these, or
a "Verified" proxy report will look indistinguishable from a "Critical"
attendance card at a glance.

| Status        | Treatment                              |
|---------------|-----------------------------------------|
| Pending       | Secondary Text, outlined badge          |
| Likely        | Info (`#1976D2`), outlined badge        |
| Verified      | Success (`#2E7D32`), filled badge       |
| Auto Accepted | Primary Text (`#111111`), filled badge  |

Only the tier name renders (`UX.md` §10) — never a report count, a
percentage, or the word "consensus" in the UI copy.

---

## 9. Colors — Dark Mode

| Token              | Value     |
|---------------------|-----------|
| Background           | `#090909` |
| Surface               | `#151515` |
| Secondary Surface     | `#1F1F1F` |
| Border                | `#303030` |
| Primary Text          | `#FFFFFF` |
| Secondary Text        | `#A5A5A5` |
| Success (dark)        | `#4CAF50` |
| Warning (dark)        | `#FFB74D` |
| Orange / Attention (dark) | `#FF9800` |
| Danger (dark)         | `#EF5350` |
| Info (dark)           | `#42A5F5` |

Dark-mode variants are brightened/desaturated versions of the light-mode
tokens for contrast on dark surfaces — the *meaning* of each color
(§8.3, §8.4) does not change between modes.

Dark mode is tracked as a formal decision in `DECISIONS.md` ADR-012.

---

## 10. Typography

**Font family:** Inter
**Fallback:** System UI
**Weights:** 400, 500, 600, 700 — avoid ultra-bold (800+).

### 10.1 Type Scale
| Token     | Size (px) |
|-----------|-----------|
| Display   | 40        |
| Heading 1 | 32        |
| Heading 2 | 28        |
| Heading 3 | 24        |
| Title     | 20        |
| Body      | 16        |
| Caption   | 14        |
| Micro     | 12        |

Never shrink below this scale to fit content (`UX.md` §17) — content
adapts to the scale, not the reverse.

---

## 11. Icons

- Outlined style, rounded corners, single icon family throughout
  (`UX.md` §18, `AGENTS.md` §3).
- Recommended library: **Lucide**.
- Never mix icon packs.
- Icons support meaning; they never replace a text label.

---

## 12. Buttons

| Variant   | Style              |
|-----------|---------------------|
| Primary   | Filled, large touch target |
| Secondary | Outlined             |
| Tertiary  | Text only            |
| Danger    | Red (Danger token)   |

**Minimum height:** 48px (exceeds the 44px accessibility floor in
§17 / `AGENTS.md` §10 / `UX.md` §20).

---

## 13. Cards

Cards are the primary layout primitive (`AGENTS.md` §3, "Cards → Lists
→ Tables"). Every important piece of information lives inside a card.

A card contains:
- Title
- Content
- Optional actions

Avoid excessive borders — prefer Secondary Surface fill over a hard
border where possible.

---

## 14. Navigation

**Bottom navigation only. Maximum 4 items, always visible**
(`DECISIONS.md` ADR-006, `PRODUCT.md` §8, `UX.md` §12).

Never hide navigation inside a menu.

---

## 15. Motion

| Use case                                   | Duration       |
|---------------------------------------------|----------------|
| Micro-feedback (press state, tap ripple)     | 150ms          |
| State-change animation (current class swap, attendance updated, proxy verified) | 200–300ms |

No animation should ever exceed 400ms. The 200–300ms band matches
`UX.md` §15 exactly for the state-change events it names; 150ms is
reserved for the smaller press/tap acknowledgments `UX.md` doesn't
separately enumerate.

Motion communicates state — never decoration. If you can't name the
state an animation communicates, cut it (`AGENTS.md` §3.2, `UX.md` §15).

---

## 16. Lists

- Use cards instead of dense tables, especially on mobile.
- Every list item should feel tappable (adequate padding, clear tap
  target).
- Swipe actions remain optional — every gesture needs a visible,
  tappable alternative (`UX.md` §19).

---

## 17. Inputs

- Large, comfortable, minimal labels.
- Clear validation, in plain language (`ARCHITECTURE.md` §15 /
  `UX.md` §23 — never surface a raw backend error code).
- Never require typing where a tap will do (`AGENTS.md` §3.1).

---

## 18. Empty States

Every empty state teaches or reassures — never just reports absence
(`UX.md` §13).

**Example:**
"No Attendance Yet — Start by entering your official attendance from
the latest publication."

---

## 19. Loading

Preference order:
1. Skeletons
2. Optimistic UI
3. Background refresh

Avoid blocking screens and spinners unless truly unavoidable
(`UX.md` §14).

---

## 20. Feedback

Every important interaction receives lightweight, non-blocking
feedback — a toast or inline checkmark, never a popup requiring
dismissal (`AGENTS.md` §3.2, `UX.md` §8).

**Examples:** "Attendance Updated ✓" · "Proxy Submitted ✓" ·
"Item Reported ✓"

---

## 21. Charts

**Never use charts, graphs, or pie charts to represent attendance**
(`UX.md` §6 is absolute on this point — "No graphs. No pie charts. No
dashboards.").

For attendance, prefer, in this order:
1. Status word ("Safe," "Critical")
2. Percentage as plain text
3. Card / badge color (paired with the text above, never alone)

A subtle horizontal progress bar may accompany the percentage as a
secondary accent, but it must never replace the status word or
percentage, and must never become the primary way the number is
communicated — the text is the answer, the bar is decoration on top
of an already-complete answer.

**A circular "Progress Ring" is explicitly out of scope for attendance
display** — it is functionally a pie chart and directly conflicts with
`UX.md` §6. (See `DECISIONS.md` ADR-011 for this reconciliation.)

---

## 22. Accessibility

- Minimum touch target: 44px (`AGENTS.md` §10, `UX.md` §20).
- Contrast: WCAG AA minimum.
- Readable at arm's length; support dynamic/larger text.

---

## 23. Mobile First

Portrait first. Landscape supported. Desktop responsive. The
experience should always feel designed for phones first, scaled up —
never the reverse (`AGENTS.md` §3.1, `ARCHITECTURE.md` §3.1).

---

## 24. Native Feel

- Scrolling should feel natural, not web-like.
- Transitions should feel smooth (see §15 for durations).
- Interactions should feel immediate — optimistic UI first, background
  sync second (`AGENTS.md` §4.2, `ARCHITECTURE.md` §18).

Students should forget they are using a web application
(`DECISIONS.md` ADR-005).

---

## 25. Brand Voice

Confident. Helpful. Minimal.

Never robotic. Never overly enthusiastic. Never unnecessary technical
language (see `UX.md` §23 and §10 — no "algorithm," no "consensus," no
raw error codes in user-facing copy).

---

## 26. UI Component Library

Canonical component names — must match `AGENTS.md` §6:

- Button
- `SubjectCard`
- `ScheduleCard`
- `AttendanceBadge`
- `BottomNavigation`
- Timeline Card
- `AttendanceDialog`, `ProxyReportDialog`, `FoundItemDialog` (Dialog
  family — reserved for the specific flows `UX.md` calls for; never a
  generic confirmation popup, per `AGENTS.md` §3.2)
- Toast
- Search (scoped in-page filtering within `Subjects` / `Campus` list
  views only — **not** a global search surface. A global search bar is
  not part of MVP scope; see `PRODUCT.md` §7. If a global search is
  proposed later, it needs a `PRODUCT.md` scope update and a
  `DECISIONS.md` ADR first, per `AGENTS.md` §8.)
- Segmented Control
- Avatar

Every component has one clear responsibility (`AGENTS.md` §5).

---

## 27. Final Principle

A student should think: **"This feels like an app made by Apple."**

Not: "This feels like a college project."