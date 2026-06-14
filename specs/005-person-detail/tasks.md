# Implementation Tasks: Person Detail View

**Feature**: `specs/005-person-detail`
**Total tasks**: 32 | **MVP scope**: Phase 3 (User Story 1 — view contact profile and details)

---

## Dependencies

```
Phase 1 (Setup)
  └── Phase 2 (Foundational)
        └── Phase 3 (US1: view profile)         ← entry point
              ├── Phase 4 (US2: active deals)    ← [P]
              ├── Phase 5 (US3: log note)        ← [P] (reuses NoteComposer from 002)
              ├── Phase 6 (US4: activity feed)   ← [P] (reuses ActivityFeedItem from 002)
              ├── Phase 7 (US5: inline edit)     ← [P] (reuses InlineEdit from 002)
              ├── Phase 8 (US6: log call)        ← [P]
              ├── Phase 9 (US7: add deal)        ← [P] (reuses AddDealModal from 001)
              └── Phase 10 (US8: labels)         ← [P]
                    └── Final Phase (Polish)
```

---

## Phase 1 — Setup

- [ ] T001 Create component directory `frontend/src/components/person-detail/`
- [ ] T002 Create `shared/types/personDetail.ts` (`PersonDetail`, `ActiveDeal` interfaces)

---

## Phase 2 — Foundational *(CRITICAL)*

- [ ] T003 [P] Implement `GET /api/people/:id` in `backend/routes/people.ts` (join orgName; join activeDeals from deals.json where personId matches and status=open)
- [ ] T004 [P] Implement `GET /api/people/:id/feed` in `backend/routes/people.ts` (aggregate activities + notes filtered by personId; sort newest-first; return `FeedItem[]`)
- [ ] T005 [P] Create `frontend/src/store/personDetailStore.ts` (Zustand: `{ activeLogType: ActivityType | null, isEditing: boolean }`)
- [ ] T006 Create `frontend/src/api/usePersonDetail.ts` (`usePerson(id)`, `usePersonFeed(id)`, plus mutation stubs)

---

## Phase 3 — User Story 1 (P1): View profile and contact details

*Goal*: Two-panel page showing avatar, name, org/title, all emails/phones/LinkedIn/address.
*Independent test*: Navigate to `/contacts/people/person-001` — name, org, job title, email, phone all visible.

- [ ] T007 [P] [US1] Create `PersonHeader` component in `frontend/src/components/person-detail/PersonHeader.tsx` (large initials avatar; name heading; org + job title subheading; label chips; "+ Add Deal" and "Edit" button stubs)
- [ ] T008 [P] [US1] Create `PersonContactPanel` component in `frontend/src/components/person-detail/PersonContactPanel.tsx` (left 45%: emails as `<a href="mailto:">`, phones as `<a href="tel:">`, LinkedIn as external link, address text)
- [ ] T009 [US1] Create `PersonDetailPage` in `frontend/src/pages/PersonDetailPage.tsx` (reads `:id` param; calls `usePerson`; renders `PersonHeader` + two-column layout)
- [ ] T010 [US1] Add route `/contacts/people/:id` → `PersonDetailPage` in `frontend/src/App.tsx`

---

## Phase 4 — User Story 2 (P1): Active deals section

*Goal*: Left panel shows all open deals linked to this person with title, value, stage, next-activity status.
*Independent test*: Navigate to person linked to 2 seeded deals — both appear with correct stage and status.

- [ ] T011 [P] [US2] Create `ActiveDealsSection` component in `frontend/src/components/person-detail/ActiveDealsSection.tsx` (deal count badge; list of `ActiveDeal` items; each shows title as `<Link>`, value, stageName, nextActivityStatus with overdue orange accent; clicking navigates to `/deals/:id`)
- [ ] T012 [US2] Integrate `ActiveDealsSection` into `PersonContactPanel` below the contact fields

---

## Phase 5 — User Story 3 (P1): Log a note

*Goal*: Write and save a note; it appears in the feed immediately.
*Independent test*: Write "Interested in enterprise plan" → Save → appears in feed with current date.

- [ ] T013 [P] [US3] Implement `POST /api/people/:id/notes` in `backend/routes/people.ts` (create Note with `personId`; return 201)
- [ ] T014 [US3] Add `useCreatePersonNote` mutation to `frontend/src/api/usePersonDetail.ts` (on success invalidate `['person-feed', id]`)
- [ ] T015 [US3] Import and render `NoteComposer` (from `frontend/src/components/deal-detail/NoteComposer.tsx`) in the right panel of `PersonDetailPage`; wire to `useCreatePersonNote`

---

## Phase 6 — User Story 4 (P1): Activity history feed

*Goal*: Chronological feed of all interactions: calls, emails, notes, system events.
*Independent test*: Seed person with 1 call (positive outcome), 1 email (opened twice), 1 task (done) — all three in feed.

- [ ] T016 [P] [US4] Create `PersonActivityFeed` component in `frontend/src/components/person-detail/PersonActivityFeed.tsx` (calls `usePersonFeed`; renders date dividers + `ActivityFeedItem` per item; reuses `ActivityFeedItem` from `frontend/src/components/deal-detail/ActivityFeedItem.tsx`)
- [ ] T017 [US4] Integrate `PersonActivityFeed` into right panel of `PersonDetailPage`

---

## Phase 7 — User Story 5 (P2): Edit contact information

*Goal*: Edit button opens form; all fields editable; multiple emails/phones; save persists changes.
*Independent test*: Click Edit → change email → Save → new email shown on page.

- [ ] T018 [P] [US5] Implement `PATCH /api/people/:id` in `backend/routes/people.ts` (accept partial body; update in-memory store)
- [ ] T019 [US5] Add `useUpdatePerson` mutation to `frontend/src/api/usePersonDetail.ts`
- [ ] T020 [US5] Create `PersonEditModal` in `frontend/src/components/person-detail/PersonEditModal.tsx` (all contact fields; dynamic add/remove email+phone rows; Cancel restores original; Save calls `useUpdatePerson`)
- [ ] T021 [US5] Wire "Edit" button in `PersonHeader` to open `PersonEditModal`

---

## Phase 8 — User Story 6 (P2): Log a call

*Goal*: Log Call form with subject, duration, outcome, note; entry appears in feed with phone icon.
*Independent test*: Log call "Discussed pricing, positive" → appears in feed with phone icon and outcome highlighted.

- [ ] T022 [P] [US6] Implement `POST /api/people/:id/activities` in `backend/routes/people.ts` (create Activity with `personId`; update person `updatedAt`)
- [ ] T023 [US6] Add `useLogPersonActivity` mutation to `frontend/src/api/usePersonDetail.ts`
- [ ] T024 [US6] Create `LogCallForm` component in `frontend/src/components/person-detail/LogCallForm.tsx` (fields: subject, duration minutes, outcome text, note, linked deal selector, date/time; calls `useLogPersonActivity` with `type: "call"`)
- [ ] T025 [US6] Add "Log Call" tab button above the feed in `PersonDetailPage` that shows/hides `LogCallForm`

---

## Phase 9 — User Story 7 (P2): Create deal from contact page

*Goal*: "+ Add Deal" opens deal modal with person pre-filled; new deal appears in Active Deals.
*Independent test*: Click "+ Add Deal" on "Alex Marshall" → modal pre-fills Alex as contact.

- [ ] T026 [US7] Wire "+ Add Deal" button in `PersonHeader` to open `AddDealModal` (from `frontend/src/components/pipeline/AddDealModal.tsx`) with `personId` pre-populated; on success invalidate `['person', id]`

---

## Phase 10 — User Story 8 (P3): Manage labels

*Goal*: Add/remove labels via label picker; changes persist.
*Independent test*: Add "Hot Lead" label → appears on profile + in people list.

- [ ] T027 [P] [US8] Create `LabelPicker` component in `frontend/src/components/person-detail/LabelPicker.tsx` (shows current label chips with ×; "Add label" button opens dropdown of all labels from `backend/data/labels.json`; selecting/removing calls `useUpdatePerson` with updated `labelIds`)
- [ ] T028 [US8] Add `useLabels` query to `frontend/src/api/usePersonDetail.ts` (`GET /api/labels`)
- [ ] T029 [US8] Create `GET /api/labels` route in `backend/routes/people.ts` (or a new `backend/routes/labels.ts`); register in `backend/index.ts`
- [ ] T030 [US8] Integrate `LabelPicker` into `PersonHeader` below the name/title

---

## Final Phase — Polish

- [ ] T031 Add loading skeleton to `PersonDetailPage` while `usePerson` is pending
- [ ] T032 Wrap `PersonDetailPage` route with `ErrorBoundary` in `frontend/src/App.tsx`
