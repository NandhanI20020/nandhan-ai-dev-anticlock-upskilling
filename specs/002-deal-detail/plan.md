# Implementation Plan: Deal Detail View

**Branch**: `002-deal-detail` | **Date**: 2026-06-15 | **Spec**: [spec.md](spec.md)

---

## Technical Context

**Tech stack**: React 18 + Vite + Tailwind CSS (frontend) / Node.js + Express + mock JSON store (backend)

**Libraries used in this feature**:
- `lucide-react` — activity type icons (Phone, Calendar, CheckSquare, Mail, Clock), Trophy (Won), XCircle (Lost), FileText (Note), Building2 (Org)
- `@tanstack/react-query` — `useQuery` for deal + feed, `useMutation` for inline edits / stage change / Won/Lost / log activity / notes
- `zustand` — `dealDetailStore` for UI state: which quick-log form is open, which field is being edited

**Project structure changes**:
```
frontend/src/
  pages/
    DealDetailPage.tsx            ← route /deals/:id; owns page layout
  components/deal-detail/
    DealHeader.tsx                ← title (InlineEdit), Won/Lost buttons, stage bar row
    StageProgressBar.tsx          ← clickable chevron segments with days-in-stage
    DealInfoPanel.tsx             ← left 45%: value/date/prob/source fields + contacts
    InlineEdit.tsx                ← reusable click-to-edit wrapper (text/number/date)
    LinkedContactCard.tsx         ← person name/email/phone + org name/address
    ActivityFeed.tsx              ← right 55%: feed list with date dividers
    ActivityFeedItem.tsx          ← renders activity | note | system event by type
    QuickLogBar.tsx               ← 5 activity-type buttons above the feed
    QuickLogForm.tsx              ← inline form (subject, date, time, note, outcome)
    NoteComposer.tsx              ← textarea + Save Note button
    WonDialog.tsx                 ← optional-note confirm dialog
    LostDialog.tsx                ← required-reason dialog
  api/
    useDealDetail.ts              ← useQuery(['deal', id]) + ['deal-feed', id] + all mutations
  store/
    dealDetailStore.ts            ← { activeLogType: ActivityType | null, editingField: string | null }
backend/
  routes/
    deals.ts                      ← extend: GET/:id, PATCH/:id/stage, /won, /lost, feed, activities, notes
    notes.ts                      ← PUT /api/notes/:id, DELETE /api/notes/:id
  data/
    stageTimeEntries.json         ← 50+ entries (2–3 per deal)
    notes.json                    ← 20 seeded notes
shared/
  types/
    deal.ts                       ← extend with FeedItem, StageTimeEntry, Note types
    activity.ts                   ← Activity, ActivityType
```

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| Spec-First | ✓ | spec.md approved before this plan |
| Mock-Data Simplicity | ✓ | StageTimeEntries and Notes are flat JSON arrays in `backend/data/` |
| Type Safety | ✓ | FeedItem is a discriminated union type; no `any` |
| Component Sovereignty | ✓ | `DealHeader`, `ActivityFeed` etc. receive data via props; fetching only in `useDealDetail` |
| Tailwind Only | ✓ | Two-panel layout via `flex`; chevron stage bar via CSS clip-path polygon in Tailwind arbitrary values |

---

## Research Findings

*(See research.md for full rationale)*

| Decision | Chosen | Rationale |
|----------|--------|-----------|
| Inline editing | `InlineEdit` wrapper component | Reusable; handles Enter/blur-save, Esc-cancel with single implementation |
| Won/Lost dialogs | Local state + conditional render | No dialog library in approved stack |
| Activity feed | Backend `/api/deals/:id/feed` aggregates all event types | Keeps join logic server-side; cleaner client rendering |
| Stage time tracking | `StageTimeEntry` records in `stageTimeEntries.json` | Only accurate way to show days per stage from spec |
| Quick-log form | Inline below activity type buttons | Spec explicitly says inline; modal would violate spec |
| Zustand for detail UI | `dealDetailStore` | 3-level prop-drilling depth justifies global store |

---

## Architecture Decisions

- `DealDetailPage` has a two-column layout: left panel 45% (`DealInfoPanel`) + right panel 55% (`ActivityFeed` + `QuickLogBar` + `NoteComposer`).
- `StageProgressBar` receives the full `stages` array from `GET /api/deals/:id/stages` (which includes `daysInStage` and `isCurrent`). Click handlers fire `useChangeStage` mutation.
- `InlineEdit` is a generic component: renders display text normally, swaps to `<input>` on click. Accepts `value`, `onSave(newValue)`, `type` ("text" | "number" | "date").
- `ActivityFeed` receives `FeedItem[]` from `useQuery(['deal-feed', id])`. Date divider labels ("Today", "Yesterday", "Jun 10") are computed client-side by grouping items by calendar date.
- All mutations in `useDealDetail` call `queryClient.invalidateQueries(['deal', id])` and `queryClient.invalidateQueries(['deal-feed', id])` in `onSuccess` to keep both queries fresh.
- `WonDialog` and `LostDialog` are rendered inline inside `DealHeader` behind `useState` gates — no portal required.

---

## Complexity Notes

- **Risk areas**: The chevron shape for `StageProgressBar` requires a CSS clip-path. Use Tailwind's arbitrary value `[clip-path:polygon(...)]` on each segment. Test for cross-browser support.
- **Risk areas**: `InlineEdit` for date type must map between ISO string (`"2026-08-15"`) and the `<input type="date">` format — both happen to be `YYYY-MM-DD` so no conversion needed, but currency display requires formatting.
- **Dependencies on other features**: `DealInfoPanel` links to Person Detail (005) and Org Detail (006) — use `<Link to="/contacts/people/:id">` even before those features exist.
- **Estimated phases**: 7 phases covering 8 user stories (US1–US4 are P1, US5–US7 are P2, US8 is P3).
