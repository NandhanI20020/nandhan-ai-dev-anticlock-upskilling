# Implementation Tasks: Contacts — People List

**Feature**: `specs/004-contacts-people`
**Total tasks**: 38 | **MVP scope**: Phase 3 (User Story 1 — browse contacts table)

---

## Dependencies

```
Phase 1 (Setup)
  └── Phase 2 (Foundational)
        └── Phase 3 (US1: contacts table)      ← entry point
              ├── Phase 4 (US2: add person)     ← [P]
              ├── Phase 5 (US3: quick filters)  ← [P]
              │     └── Phase 6 (US4: advanced filters) ← after Phase 5
              ├── Phase 7 (US5: CSV export)     ← [P]
              ├── Phase 8 (US6: bulk actions)   ← [P]
              ├── Phase 9 (US7: last action)    ← [P] (needs badge component)
              └── Phase 10 (US8: merge dupes)   ← after Phase 3
                    └── Final Phase (Polish)
```

---

## Phase 1 — Setup

- [ ] T001 Create component directory `frontend/src/components/contacts/`
- [ ] T002 [P] Create `backend/data/people.json` (20 people with emails, phones, orgId, labelIds, createdAt)
- [ ] T003 [P] Create `backend/data/labels.json` (6 labels: Hot Lead, VIP, At Risk, New, Cold, Partner)

---

## Phase 2 — Foundational *(CRITICAL)*

- [ ] T004 [P] Create `shared/types/person.ts` (`Person`, `PersonListItem`, `PaginatedPeopleResponse` interfaces)
- [ ] T005 [P] Create Express router `backend/routes/people.ts` (stubs for all endpoints)
- [ ] T006 Register people router in `backend/index.ts` under `/api/people`
- [ ] T007 [P] Implement `GET /api/people` in `backend/routes/people.ts` (filter by owner/label/org; sort; paginate; join orgName, dealCount, lastActionStatus from activities)
- [ ] T008 [P] Create Zustand store `frontend/src/store/contactsStore.ts` (`{ filters, sort, sortDir, selectedIds, page, perPage }`)
- [ ] T009 Create React Query hook `frontend/src/api/usePeople.ts` (`usePeople(store)` → `useQuery(['people', filters, sort, page])`)

---

## Phase 3 — User Story 1 (P1): Browse all contacts in a sortable table

*Goal*: Table with Name/Org/Email/Phone/Deals/Last Action columns; click name → Person Detail.
*Independent test*: Load `/contacts/people` with 20 seeded contacts — all rows visible; click name → navigates.

- [ ] T010 [P] [US1] Create `LastActionBadge` component in `frontend/src/components/contacts/LastActionBadge.tsx` (Active=green, Overdue=orange, New contact=grey; shows relative time string)
- [ ] T011 [P] [US1] Create `PersonRow` component in `frontend/src/components/contacts/PersonRow.tsx` (avatar initials circle, name as `<Link to="/contacts/people/:id">`, org, email, phone, deal count, `LastActionBadge`)
- [ ] T012 [US1] Create `PeopleTable` component in `frontend/src/components/contacts/PeopleTable.tsx` (sortable headers; maps `PersonListItem[]` to `PersonRow`; header checkbox)
- [ ] T013 [US1] Create `ContactsPage` in `frontend/src/pages/ContactsPage.tsx` (sub-nav: People | Orgs | Timeline | Tools; renders `PeopleTable` on People tab)
- [ ] T014 [US1] Add route `/contacts/people` → `ContactsPage` in `frontend/src/App.tsx`
- [ ] T015 [US1] Add "Contacts" nav link to `frontend/src/components/layout/Sidebar.tsx`

---

## Phase 4 — User Story 2 (P1): Add a new contact

*Goal*: "+ Person" button opens form; save creates person; duplicate email shows error.
*Independent test*: Add "Priya Mehta" + email "p.mehta@apex.com" → appears in list.

- [ ] T016 [P] [US2] Implement `POST /api/people` in `backend/routes/people.ts` (validate required fields; check for duplicate email → 409; generate id; push to store)
- [ ] T017 [US2] Add `useCreatePerson` mutation to `frontend/src/api/usePeople.ts` (on success invalidate `['people']`)
- [ ] T018 [US2] Create `AddPersonModal` in `frontend/src/components/contacts/AddPersonModal.tsx` (fields: first/last name, emails+type, phones+type, org, jobTitle, labels; dynamic add/remove email/phone rows; shows duplicate-email error on 409)
- [ ] T019 [US2] Add "+ Person" button to `ContactsPage` toolbar that opens `AddPersonModal`

---

## Phase 5 — User Story 3 (P1): Quick filters

*Goal*: "Assigned To: Me" and "Added: Last 30 Days" chips filter list immediately.
*Independent test*: Click "Assigned To: Me" → only user-1 contacts shown.

- [ ] T020 [P] [US3] Create `PeopleFilterBar` component in `frontend/src/components/contacts/PeopleFilterBar.tsx` (two quick-filter chips with × remove; "Advanced Filters" button; active chip updates `contactsStore.filters`)
- [ ] T021 [US3] Integrate `PeopleFilterBar` above `PeopleTable` in `frontend/src/pages/ContactsPage.tsx`

---

## Phase 6 — User Story 4 (P2): Advanced filters

*Goal*: Filter by label, org, deal count range, last activity date, owner, created date.
*Independent test*: Filter "Label = Hot Lead" → only Hot Lead contacts shown.

- [ ] T022 [P] [US4] Extend `GET /api/people` in `backend/routes/people.ts` to support advanced filter params: `label`, `orgId`, `dealCountMin/Max`, `lastActivityFrom/To`, `ownerId`, `createdFrom/To`
- [ ] T023 [US4] Add advanced filters drawer to `PeopleFilterBar` (reuse pattern from `AdvancedFiltersPanel` in feature 003) in `frontend/src/components/contacts/PeopleFilterBar.tsx`

---

## Phase 7 — User Story 5 (P2): Export contacts to CSV

*Goal*: Export button downloads CSV of current filtered contacts.
*Independent test*: Filter to 5 contacts → Export → CSV has exactly 5 data rows.

- [ ] T024 [US5] Add Export button to `ContactsPage` toolbar; on click fetch `GET /api/people?...&all=true` then call `exportToCsv` from `frontend/src/lib/csvExport.ts` (built in feature 003) in `frontend/src/pages/ContactsPage.tsx`

---

## Phase 8 — User Story 6 (P2): Bulk actions

*Goal*: Select contacts → bulk action bar → Delete / Assign Owner / Add Label / Export.
*Independent test*: Select 5 contacts → Add Label "VIP" → all 5 show VIP label.

- [ ] T025 [P] [US6] Implement `PATCH /api/people/bulk` in `backend/routes/people.ts` (actions: delete, assignOwner, addLabel)
- [ ] T026 [US6] Add `useBulkPeopleAction` mutation to `frontend/src/api/usePeople.ts`
- [ ] T027 [US6] Add checkbox to `PersonRow` and indeterminate header checkbox to `PeopleTable`; wire to `contactsStore.selectedIds`
- [ ] T028 [US6] Render `BulkActionBar` (from `frontend/src/components/shared/BulkActionBar.tsx`) when `selectedIds.size > 0`; wire Delete/AssignOwner/AddLabel to `useBulkPeopleAction`

---

## Phase 9 — User Story 7 (P3): Last Action status column

*Goal*: Colored badge (Active/Overdue/New contact) + relative time on each row.
*Independent test*: Contact with overdue activity → "Overdue" orange badge on their row.

- [ ] T029 [US7] Verify `GET /api/people` returns `lastActionStatus` and `lastActionRelativeTime` for each person (extend backend computation in `backend/routes/people.ts` if not already done in T007)
- [ ] T030 [US7] Confirm `LastActionBadge` (T010) renders all three states correctly with correct Tailwind colors

---

## Phase 10 — User Story 8 (P3): Merge duplicate contacts

*Goal*: Select two contacts → side-by-side compare → choose values → merge → one record with all linked data.
*Independent test*: Merge two contacts → surviving record has both contacts' deals + activities.

- [ ] T031 [P] [US8] Implement `POST /api/people/merge` in `backend/routes/people.ts` (body: `{ keepId, mergeId }`; reassign all deals/activities/notes FKs from mergeId to keepId; delete mergeId)
- [ ] T032 [US8] Add `useMergePeople` mutation to `frontend/src/api/usePeople.ts`
- [ ] T033 [US8] Create `MergeDuplicatesView` in `frontend/src/components/contacts/MergeDuplicatesView.tsx` (search + select two people; side-by-side field comparison; field-by-field value selection; Merge button calls `useMergePeople`)
- [ ] T034 [US8] Add "Merge Duplicates" link in Contacts sub-nav that renders `MergeDuplicatesView` in `frontend/src/pages/ContactsPage.tsx`

---

## Final Phase — Polish

- [ ] T035 Add skeleton rows to `PeopleTable` while loading in `frontend/src/components/contacts/PeopleTable.tsx`
- [ ] T036 Add empty state ("No contacts match your filters") to `PeopleTable`
- [ ] T037 Integrate `PaginationControls` (from `frontend/src/components/shared/PaginationControls.tsx`) below `PeopleTable`
- [ ] T038 Wrap `ContactsPage` route with `ErrorBoundary` in `frontend/src/App.tsx`
