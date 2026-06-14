# Implementation Tasks: Organizations

**Feature**: `specs/006-organizations`
**Total tasks**: 34 | **MVP scope**: Phase 3 (User Story 1 — browse orgs table)

---

## Dependencies

```
Phase 1 (Setup)
  └── Phase 2 (Foundational)
        ├── Phase 3 (US1: orgs list table)        ← entry point
        │     ├── Phase 4 (US2: add org)           ← [P]
        │     └── Phase 5 (US3: org detail page)   ← [P]
        │           ├── Phase 6 (US4: inline edit) ← [P] after Phase 5
        │           ├── Phase 7 (US5: log activity)← [P] after Phase 5
        │           ├── Phase 8 (US6: notes)       ← [P] after Phase 5
        │           └── Phase 9 (US7: labels)      ← [P] after Phase 5
        └── Phase 10 (US8: filters)                ← [P] after Phase 3
              └── Final Phase (Polish)
```

---

## Phase 1 — Setup

- [ ] T001 Create component directory `frontend/src/components/organizations/`
- [ ] T002 [P] Create `backend/data/organizations.json` (10 orgs with name, address, phone, website, ownerId, labelIds)
- [ ] T003 [P] Create `shared/types/organization.ts` (`Organization`, `OrgListItem` interfaces)

---

## Phase 2 — Foundational *(CRITICAL)*

- [ ] T004 [P] Create Express router `backend/routes/organizations.ts` (stubs for all endpoints)
- [ ] T005 Register orgs router in `backend/index.ts` under `/api/organizations`
- [ ] T006 [P] Implement `GET /api/organizations` in `backend/routes/organizations.ts` (join peopleCount, personAvatars[0..2], openDealCount, wonDealCount, lostDealCount, lastActivityDate; support sort + paginate)
- [ ] T007 [P] Create Zustand store `frontend/src/store/orgsStore.ts` (`{ sort, sortDir, filters, page }`)
- [ ] T008 Create React Query hook `frontend/src/api/useOrganizations.ts` (`useOrganizations(store)` + `useOrg(id)` + mutation stubs)

---

## Phase 3 — User Story 1 (P1): Browse organizations table

*Goal*: Sortable table with avatar stacks, deal count badges; click name → org detail.
*Independent test*: Load `/contacts/organizations` with 10 seeded orgs — all rows visible with correct people/deal counts.

- [ ] T009 [P] [US1] Create `AvatarStack` shared component in `frontend/src/components/shared/AvatarStack.tsx` (renders up to 3 overlapping initials avatars + "+N more" chip; props: `avatars[]`, `total`)
- [ ] T010 [P] [US1] Create `DealCountBadges` component in `frontend/src/components/organizations/DealCountBadges.tsx` (open count neutral chip, won count green chip, lost count red chip)
- [ ] T011 [P] [US1] Create `OrgRow` component in `frontend/src/components/organizations/OrgRow.tsx` (name as `<Link>`, AvatarStack, DealCountBadges, owner, relative last activity)
- [ ] T012 [US1] Create `OrgsTable` component in `frontend/src/components/organizations/OrgsTable.tsx` (sortable headers; renders OrgRow list)
- [ ] T013 [US1] Create `OrganizationsPage` in `frontend/src/pages/OrganizationsPage.tsx` (toolbar with "+ Org" button stub + Export; renders OrgsTable)
- [ ] T014 [US1] Add route `/contacts/organizations` → `OrganizationsPage` in `frontend/src/App.tsx`
- [ ] T015 [US1] Add "Organizations" tab to the sub-nav in `frontend/src/pages/ContactsPage.tsx`

---

## Phase 4 — User Story 2 (P1): Add a new organization

*Goal*: "+ Organization" modal creates org and it appears in list.
*Independent test*: Add "Apex Technologies" → appears in orgs table.

- [ ] T016 [P] [US2] Implement `POST /api/organizations` in `backend/routes/organizations.ts` (validate name required; check for same-name org and include `warning` in response if found; push to store)
- [ ] T017 [US2] Add `useCreateOrg` mutation to `frontend/src/api/useOrganizations.ts`
- [ ] T018 [US2] Create `AddOrgModal` in `frontend/src/components/organizations/AddOrgModal.tsx` (fields: name*, address, phone, website, owner; shows warning if duplicate name)
- [ ] T019 [US2] Wire "+ Organization" button in `OrganizationsPage` to open `AddOrgModal`

---

## Phase 5 — User Story 3 (P1): View org detail page

*Goal*: Two-panel detail page with org info, linked people, active deals, and activity feed.
*Independent test*: Navigate to `/contacts/organizations/org-001` — all sections visible.

- [ ] T020 [P] [US3] Implement `GET /api/organizations/:id` in `backend/routes/organizations.ts` (full org + joined people[], activeDeals[])
- [ ] T021 [P] [US3] Implement `GET /api/organizations/:id/feed` in `backend/routes/organizations.ts` (aggregate activities + notes for orgId; return FeedItem[])
- [ ] T022 [US3] Create `OrgInfoPanel` in `frontend/src/components/organizations/OrgInfoPanel.tsx` (left 45%: org fields; people list with avatar+name+title as `<Link>`; active deals list as `<Link>`)
- [ ] T023 [US3] Create `OrgActivityFeed` in `frontend/src/components/organizations/OrgActivityFeed.tsx` (right 55%: renders `ActivityFeedItem` list + date dividers; import `ActivityFeedItem` from `frontend/src/components/deal-detail/`)
- [ ] T024 [US3] Create `OrgDetailPage` in `frontend/src/pages/OrgDetailPage.tsx` (two-column layout; calls `useOrg` + org feed query)
- [ ] T025 [US3] Add route `/contacts/organizations/:id` → `OrgDetailPage` in `frontend/src/App.tsx`

---

## Phase 6 — User Story 4 (P2): Inline edit org fields

*Goal*: Click any field to edit; Enter saves; Esc cancels.
*Independent test*: Click phone field → update → Enter → persists on refresh.

- [ ] T026 [P] [US4] Implement `PATCH /api/organizations/:id` in `backend/routes/organizations.ts` (partial update; set updatedAt)
- [ ] T027 [US4] Add `useUpdateOrg` mutation to `frontend/src/api/useOrganizations.ts`
- [ ] T028 [US4] Wrap name, address, phone, website fields in `OrgInfoPanel` with `InlineEdit` (import from `frontend/src/components/deal-detail/InlineEdit.tsx`); wire to `useUpdateOrg`

---

## Phase 7 — User Story 5 (P2): Log activity on org

*Goal*: Quick-log buttons above feed → inline form → activity in feed.
*Independent test*: Log "Quarterly business review" meeting → calendar icon in feed.

- [ ] T029 [P] [US5] Implement `POST /api/organizations/:id/activities` in `backend/routes/organizations.ts`
- [ ] T030 [US5] Import and render `QuickLogBar` + `QuickLogForm` (from `frontend/src/components/deal-detail/`) in `OrgActivityFeed`; wire to new `useLogOrgActivity` mutation in `useOrganizations.ts`

---

## Phase 8 — User Story 6 (P2): Notes on org

*Goal*: Compose note → appears in feed; edit and delete work.
*Independent test*: Write "Expanding to 3 cities in Q3" → in feed with date.

- [ ] T031 [P] [US6] Implement `POST /api/organizations/:id/notes` in `backend/routes/organizations.ts`
- [ ] T032 [US6] Import `NoteComposer` (from `frontend/src/components/deal-detail/`) into `OrgActivityFeed`; wire to `useCreateOrgNote` mutation

---

## Phase 9 — User Story 7 (P3): Labels on org

- [ ] T033 [US7] Import `LabelPicker` (from `frontend/src/components/person-detail/LabelPicker.tsx`) into `OrgInfoPanel`; wire `PATCH /api/organizations/:id` with updated `labelIds`

---

## Phase 10 — User Story 8 (P3): Filter organizations

- [ ] T034 [US8] Create `OrgFilterBar` in `frontend/src/components/organizations/OrgFilterBar.tsx` (quick chips: "Assigned To: Me", "No Activity: Last 30 Days"; advanced filters: owner, label, deal count, last activity date; active filter chips; wires to `orgsStore.filters`)

---

## Final Phase — Polish

- [ ] T035 Add skeleton rows to `OrgsTable` while loading
- [ ] T036 Add empty state to `OrgsTable` ("No organizations found")
- [ ] T037 Integrate `PaginationControls` below `OrgsTable`
- [ ] T038 Wrap both org routes with `ErrorBoundary` in `frontend/src/App.tsx`
