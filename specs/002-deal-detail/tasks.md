# Implementation Tasks: Deal Detail View

**Feature**: `specs/002-deal-detail`
**Total tasks**: 52 | **MVP scope**: Phase 3 (User Story 1 — view deal info on one page)

---

## Dependencies

```
Phase 1 (Setup)
  └── Phase 2 (Foundational — types, mock data, backend, store)
        └── Phase 3 (US1: view deal page)       ← entry point, required first
              ├── Phase 4 (US2: inline edit)     ← [P] after Phase 3
              ├── Phase 5 (US3: won/lost)        ← [P] after Phase 3
              ├── Phase 6 (US4: stage bar)       ← [P] after Phase 3
              ├── Phase 7 (US5: log activity)    ← [P] after Phase 3
              ├── Phase 8 (US6: notes)           ← [P] after Phase 3
              ├── Phase 9 (US7: linked contacts) ← [P] after Phase 3
              └── Phase 10 (US8: feed render)    ← after Phase 7 + 8 (needs feed items)
                    └── Final Phase (Polish)
```

---

## Phase 1 — Setup

*Create directory; no new packages required (lucide-react, react-query, zustand already installed)*

- [ ] T001 Create component directory `frontend/src/components/deal-detail/`
- [ ] T002 Create shared types file `shared/types/activity.ts` (ActivityType union, Activity interface)

---

## Phase 2 — Foundational *(CRITICAL — completes before all story phases)*

*Types, mock data, backend routes, and Zustand store that all story phases depend on*

- [ ] T003 [P] Extend `shared/types/deal.ts` with: `StageTimeEntry`, `Note`, `FeedItem` (discriminated union), `FeedItemType`, `SystemEventKind` interfaces
- [ ] T004 [P] Create mock data `backend/data/stageTimeEntries.json` (2–3 entries per deal: enteredAt/exitedAt; 1 open entry per deal with `exitedAt: null`)
- [ ] T005 [P] Create mock data `backend/data/notes.json` (20 notes across deals with realistic content)
- [ ] T006 Implement `GET /api/deals/:id` in `backend/routes/deals.ts` (join person, org, stage, pipeline names from in-memory store)
- [ ] T007 [P] Implement `GET /api/deals/:id/stages` in `backend/routes/deals.ts` (pipeline stages with `daysInStage` computed from stageTimeEntries; `isCurrent` flag)
- [ ] T008 [P] Implement `GET /api/deals/:id/feed` in `backend/routes/deals.ts` (aggregate activities + notes + stageTimeEntries into `FeedItem[]` sorted newest-first)
- [ ] T009 Create `backend/routes/notes.ts` (stubs for PUT /api/notes/:id and DELETE /api/notes/:id)
- [ ] T010 Register notes router in `backend/index.ts` under `/api/notes`
- [ ] T011 Create `frontend/src/store/dealDetailStore.ts` (Zustand store: `{ activeLogType: ActivityType | null, setActiveLogType, editingField: string | null, setEditingField }`)
- [ ] T012 Create `frontend/src/api/useDealDetail.ts` with `useDeal(id)` query (`['deal', id]`) and `useDealFeed(id)` query (`['deal-feed', id]`) and `useDealStages(id)` query

---

## Phase 3 — User Story 1 (P1): View all deal information on one page

*Goal*: Render the two-panel deal detail page with header, stage bar, left info panel, and right feed panel.
*Independent test*: Navigate to `/deals/deal-001` — verify title, stage bar, value, owner, person, org, and feed all visible.

- [ ] T013 [P] [US1] Create `DealHeader` component (deal title display, "Won" + "Lost" button stubs) in `frontend/src/components/deal-detail/DealHeader.tsx`
- [ ] T014 [P] [US1] Create `DealInfoPanel` component (left 45%: value, currency, close date, probability, source, owner — read-only display) in `frontend/src/components/deal-detail/DealInfoPanel.tsx`
- [ ] T015 [P] [US1] Create `ActivityFeed` stub component (right 55%: renders placeholder "No activity yet") in `frontend/src/components/deal-detail/ActivityFeed.tsx`
- [ ] T016 [US1] Create `DealDetailPage` in `frontend/src/pages/DealDetailPage.tsx` (reads `:id` param; calls `useDeal`; renders `DealHeader` + two-column layout with `DealInfoPanel` + `ActivityFeed`)
- [ ] T017 [US1] Add route `/deals/:id` → `DealDetailPage` in `frontend/src/App.tsx`
- [ ] T018 [US1] Make deal titles in `DealCard` and deals list navigate to `/deals/:id` with a `<Link>` in `frontend/src/components/pipeline/DealCard.tsx`

---

## Phase 4 — User Story 2 (P1): Update deal fields inline

*Goal*: Click any editable field, change it, and have the change persist without navigating away.
*Independent test*: Click deal title → change to "Updated Title" → Enter → verify persisted on refresh.

- [ ] T019 [P] [US2] Implement `PATCH /api/deals/:id` in `backend/routes/deals.ts` (accept partial body of editable fields; set `updatedAt = now`; return full updated deal)
- [ ] T020 [US2] Create `InlineEdit` reusable component in `frontend/src/components/deal-detail/InlineEdit.tsx` (props: `value`, `onSave(v)`, `type: 'text'|'number'|'date'`; click to activate `<input>`; Enter/blur → call `onSave`; Esc → restore original)
- [ ] T021 [US2] Add `useUpdateDeal` mutation to `frontend/src/api/useDealDetail.ts` (PATCH /api/deals/:id; on success invalidate `['deal', id]`)
- [ ] T022 [US2] Wrap title in `DealHeader` with `InlineEdit` wired to `useUpdateDeal` in `frontend/src/components/deal-detail/DealHeader.tsx`
- [ ] T023 [US2] Wrap value, close date, and probability fields in `DealInfoPanel` with `InlineEdit` wired to `useUpdateDeal` in `frontend/src/components/deal-detail/DealInfoPanel.tsx`

---

## Phase 5 — User Story 3 (P1): Mark a deal as Won or Lost

*Goal*: Won/Lost buttons open dialogs, confirm, change deal status, and append a feed event.
*Independent test*: Click Won → confirm → deal shows Won badge + "Deal marked as Won" feed event.

- [ ] T024 [P] [US3] Implement `PATCH /api/deals/:id/won` in `backend/routes/deals.ts` (set `status="won"`, `wonTime=now`; append `deal_won` system event to feed)
- [ ] T025 [P] [US3] Implement `PATCH /api/deals/:id/lost` in `backend/routes/deals.ts` (require `lostReason`; set `status="lost"`, `lostTime=now`; append `deal_lost` system event)
- [ ] T026 [US3] Create `WonDialog` component in `frontend/src/components/deal-detail/WonDialog.tsx` (optional note textarea + Confirm/Cancel buttons)
- [ ] T027 [US3] Create `LostDialog` component in `frontend/src/components/deal-detail/LostDialog.tsx` (required lostReason text input + Confirm/Cancel buttons; validates lostReason is non-empty)
- [ ] T028 [US3] Add `useWonDeal` and `useLostDeal` mutations to `frontend/src/api/useDealDetail.ts` (on success invalidate `['deal', id]` and `['deal-feed', id]`)
- [ ] T029 [US3] Wire Won/Lost buttons in `DealHeader` to open `WonDialog`/`LostDialog` and call mutations in `frontend/src/components/deal-detail/DealHeader.tsx`

---

## Phase 6 — User Story 4 (P1): Advance deal through stages via progress bar

*Goal*: Clicking a stage chevron moves the deal; past-stage clicks require confirmation.
*Independent test*: Click "Negotiations" on a deal in "Proposal Made" → stage bar updates + stage-change event in feed.

- [ ] T030 [P] [US4] Implement `PATCH /api/deals/:id/stage` in `backend/routes/deals.ts` (validate stageId belongs to deal's pipeline; close current StageTimeEntry; open new one; append `stage_change` system event; update `deal.stageId` and `updatedAt`)
- [ ] T031 [US4] Add `useChangeStage` mutation to `frontend/src/api/useDealDetail.ts` (on success invalidate `['deal', id]`, `['deal-feed', id]`, `['deal-stages', id]`)
- [ ] T032 [US4] Create `StageProgressBar` component in `frontend/src/components/deal-detail/StageProgressBar.tsx` (renders chevron segments from stages array; highlights `isCurrent`; "done" style for past stages; shows `daysInStage`; onClick fires `useChangeStage` or opens backward-move confirmation)
- [ ] T033 [US4] Integrate `StageProgressBar` into `DealHeader` below the title row in `frontend/src/components/deal-detail/DealHeader.tsx`

---

## Phase 7 — User Story 5 (P2): Log an activity inline

*Goal*: Click activity type button → inline form appears → save → activity in feed immediately.
*Independent test*: Click "Call" → fill "Follow-up call" → Save → phone icon + subject in feed.

- [ ] T034 [P] [US5] Implement `POST /api/deals/:id/activities` in `backend/routes/deals.ts` (create Activity; update `deal.nextActivityDate`, `deal.nextActivityType`, `deal.updatedAt`; return 201)
- [ ] T035 [US5] Add `useLogActivity` mutation to `frontend/src/api/useDealDetail.ts` (on success invalidate `['deal-feed', id]` and `['deal', id]`)
- [ ] T036 [US5] Create `QuickLogForm` component in `frontend/src/components/deal-detail/QuickLogForm.tsx` (props: `activityType`, `onSave`, `onCancel`; fields: subject, dueDate, dueTime, note, outcome)
- [ ] T037 [US5] Create `QuickLogBar` component in `frontend/src/components/deal-detail/QuickLogBar.tsx` (5 icon buttons: Call/Meeting/Task/Email/Deadline; clicking sets `dealDetailStore.activeLogType`; renders `QuickLogForm` below when type is active)
- [ ] T038 [US5] Integrate `QuickLogBar` above `ActivityFeed` in `DealDetailPage` in `frontend/src/pages/DealDetailPage.tsx`

---

## Phase 8 — User Story 6 (P2): Add and view notes

*Goal*: Compose a note, save it, edit it, delete it — all from the feed area.
*Independent test*: Write "Very interested in Q3 delivery" → Save → note in feed; edit → delete → gone.

- [ ] T039 [P] [US6] Implement `POST /api/deals/:id/notes` in `backend/routes/deals.ts` (create Note with `dealId`; return 201)
- [ ] T040 [P] [US6] Implement `PUT /api/notes/:id` in `backend/routes/notes.ts` (update `content`, set `updatedAt`)
- [ ] T041 [P] [US6] Implement `DELETE /api/notes/:id` in `backend/routes/notes.ts`
- [ ] T042 [US6] Add `useCreateNote`, `useUpdateNote`, `useDeleteNote` mutations to `frontend/src/api/useDealDetail.ts` (each invalidates `['deal-feed', id]` on success)
- [ ] T043 [US6] Create `NoteComposer` component in `frontend/src/components/deal-detail/NoteComposer.tsx` (textarea + "Save Note" button; calls `useCreateNote` on submit)
- [ ] T044 [US6] Add edit/delete controls to the note variant of `ActivityFeedItem` (pencil icon → inline edit; trash icon → `useDeleteNote`)

---

## Phase 9 — User Story 7 (P2): View linked person and organization

*Goal*: Left panel shows person's name/email/phone and org name/address; both are navigation links.
*Independent test*: On deal linked to "Sarah Jenkins" + "Acme Corp" — verify both appear with correct details and links.

- [ ] T045 [P] [US7] Create `LinkedContactCard` component in `frontend/src/components/deal-detail/LinkedContactCard.tsx` (renders person avatar, name, email (mailto), phone (tel), job title; org name, address; navigation `<Link>` to `/contacts/people/:id` and `/contacts/organizations/:id`)
- [ ] T046 [US7] Integrate `LinkedContactCard` into `DealInfoPanel` below the deal fields section in `frontend/src/components/deal-detail/DealInfoPanel.tsx`
- [ ] T047 [US7] Add "+ Add person" link stub to `DealInfoPanel` (navigates to person picker — full implementation in 004-contacts) in `frontend/src/components/deal-detail/DealInfoPanel.tsx`

---

## Phase 10 — User Story 8 (P3): Unified mixed activity feed

*Goal*: Feed renders activities, notes, and system events interleaved in reverse chronological order with date dividers.
*Independent test*: Seed deal with 1 activity (done), 1 note, 1 stage change — verify all three in feed in correct order.

- [ ] T048 [P] [US8] Create `ActivityFeedItem` component in `frontend/src/components/deal-detail/ActivityFeedItem.tsx` (renders by `type`: 'activity' → icon+subject+outcome; 'note' → text+edit/delete; 'system' → stage-change/won/lost message)
- [ ] T049 [US8] Update `ActivityFeed` in `frontend/src/components/deal-detail/ActivityFeed.tsx` to consume `useDealFeed(id)` data; group items by calendar date; render date divider headers between groups; render `ActivityFeedItem` for each item
- [ ] T050 [US8] Apply overdue styling (Tailwind `text-red-500`) in `ActivityFeedItem` when `type === 'activity'` and `dueDate < today && !done`
- [ ] T051 [US8] Apply done styling (Tailwind `line-through text-gray-400`) in `ActivityFeedItem` when `type === 'activity'` and `done === true`

---

## Final Phase — Polish

- [ ] T052 Add skeleton loading card to `DealDetailPage` shown while `useDeal` is loading in `frontend/src/pages/DealDetailPage.tsx`
- [ ] T053 Add empty state to `ActivityFeed` ("No activity yet — log a call or add a note to get started") in `frontend/src/components/deal-detail/ActivityFeed.tsx`
- [ ] T054 Wrap `DealDetailPage` route with an `ErrorBoundary` in `frontend/src/App.tsx`
- [ ] T055 [P] Write Playwright E2E test covering Scenarios 1–3 from quickstart.md in `frontend/tests/deal-detail.spec.ts`

---

## Parallel Execution Opportunities

**Phase 2** (most tasks parallelizable — different files):
- Agent A: T003 + T002 (type files)
- Agent B: T004 + T005 (mock data)
- Agent C: T006 + T007 + T008 (backend endpoints)
- Agent D: T011 + T012 (store + hook scaffold)
Then sequential: T009 → T010

**Phases 4–9** (all parallelizable with each other after Phase 3):
- Phase 4 (inline edit): T019 backend, then T020–T023 frontend
- Phase 5 (won/lost): T024 + T025 backend [P], then T026–T029 frontend
- Phase 6 (stage bar): T030 backend, then T031–T033 frontend
- Phase 7 (log activity): T034 backend, then T035–T038 frontend
- Phase 8 (notes): T039+T040+T041 backend [P], then T042–T044 frontend
- Phase 9 (contacts): T045 + T046 + T047 (independent of other phases)
