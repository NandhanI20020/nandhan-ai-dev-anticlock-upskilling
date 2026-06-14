# Implementation Tasks: Deals List View

**Feature**: `specs/003-deals-list`
**Total tasks**: 40 | **MVP scope**: Phase 3 (User Story 1 — sortable deals table)

---

## Dependencies

```
Phase 1 (Setup)
  └── Phase 2 (Foundational — types, backend, store, hook)
        └── Phase 3 (US1: sortable table)       ← entry point
              ├── Phase 4 (US2: status badges)   ← [P] after Phase 3
              ├── Phase 5 (US3: quick-filter tabs)← [P] after Phase 3
              ├── Phase 6 (US4: advanced filters) ← after Phase 5
              ├── Phase 7 (US5: CSV export)       ← [P] after Phase 3
              ├── Phase 8 (US6: bulk actions)     ← [P] after Phase 3
              └── Phase 9 (US7: pagination)       ← [P] after Phase 3
                    └── Final Phase (Polish)
```

---

## Phase 1 — Setup

- [ ] T001 Create component directory `frontend/src/components/deals-list/`
- [ ] T002 Create `backend/data/savedViews.json` (3 example named saved-view objects)

---

## Phase 2 — Foundational *(CRITICAL)*

- [ ] T003 [P] Add `DealListItem`, `PaginatedDealsResponse`, `DealListFilters` interfaces to `shared/types/deal.ts`
- [ ] T004 [P] Add `SavedView`, `BulkActionRequest` interfaces to `shared/types/savedView.ts`
- [ ] T005 [P] Extend `GET /api/deals` in `backend/routes/deals.ts` to support filter/sort/paginate query params and return `PaginatedDealsResponse`; join `stageName`, `stageOrder`, `pipelineTotalStages`, `orgName`, `ownerName`, `rottingDays` into each row
- [ ] T006 [P] Create `backend/routes/savedViews.ts` (GET/POST/DELETE /api/saved-views)
- [ ] T007 Register savedViews router in `backend/index.ts` under `/api/saved-views`
- [ ] T008 [P] Create Zustand store `frontend/src/store/dealsListStore.ts` (`{ filters, sort, sortDir, selectedIds, page, perPage }` with actions)
- [ ] T009 Create React Query hook `frontend/src/api/useDealsTable.ts` (`useDealsTable(store)` → `useQuery(['deals-list', filters, sort, page])`)
- [ ] T010 Create React Query hook `frontend/src/api/useSavedViews.ts` (`useSavedViews` + `useCreateView` + `useDeleteView` mutations)

---

## Phase 3 — User Story 1 (P1): Browse all deals in a sortable table

*Goal*: Render table with 6 columns, sort on header click, navigate to deal on title click.
*Independent test*: Load `/deals` → 15 rows visible; click "Value" header twice → sort toggles asc/desc.

- [ ] T011 [P] [US1] Create `StageProgressCell` component in `frontend/src/components/deals-list/StageProgressCell.tsx` (renders N equal-width segments; fills up to `stageOrder` in purple, rest in gray)
- [ ] T012 [P] [US1] Create `DealsTable` component in `frontend/src/components/deals-list/DealsTable.tsx` (renders `<table>` with sortable headers; header click updates `dealsListStore.sort`/`sortDir`; renders `DealRow` per deal)
- [ ] T013 [US1] Create `DealRow` component in `frontend/src/components/deals-list/DealRow.tsx` (columns: Title+org as `<Link>`, Value, StageProgressCell+name, Owner avatar, Close Date; no status badge yet)
- [ ] T014 [US1] Create `DealsListPage` in `frontend/src/pages/DealsListPage.tsx` (calls `useDealsTable`; renders view-toggle tabs + `DealsTable`)
- [ ] T015 [US1] Add route `/deals` → `DealsListPage` in `frontend/src/App.tsx`
- [ ] T016 [US1] Add "Deals" nav item to `frontend/src/components/layout/Sidebar.tsx`

---

## Phase 4 — User Story 2 (P1): Deal status badges

*Goal*: Won (green), Lost (red + red row border), Rotten (orange text) treatments on rows.
*Independent test*: Seed 1 Won, 1 Lost, 1 Rotten deal → verify correct badge and row accent on each.

- [ ] T017 [P] [US2] Create `DealStatusBadge` component in `frontend/src/components/deals-list/DealStatusBadge.tsx` (props: `status`, `rottingDays`, `updatedAt`; renders WON/LOST/Rotten badge or null)
- [ ] T018 [US2] Integrate `DealStatusBadge` into `DealRow` below the title; add conditional `border-l-4 border-red-500` class to row when `status === 'lost'` in `frontend/src/components/deals-list/DealRow.tsx`

---

## Phase 5 — User Story 3 (P1): Quick-filter tabs

*Goal*: All | Open | Won | Lost | My Deals tabs filter the list with one click.
*Independent test*: Click "Won" → only won deals shown; count label updates.

- [ ] T019 [P] [US3] Create `QuickFilterTabs` component in `frontend/src/components/deals-list/QuickFilterTabs.tsx` (5 tabs; active tab highlighted; click updates `dealsListStore.filters.status` and `myDeals`)
- [ ] T020 [US3] Integrate `QuickFilterTabs` above `DealsTable` in `frontend/src/pages/DealsListPage.tsx`

---

## Phase 6 — User Story 4 (P2): Advanced filters

*Goal*: Filter builder panel with multi-condition filters; active filters as removable chips; save as named view.
*Independent test*: Filter "Stage = Qualified AND Value > 50000" → only matching deals shown.

- [ ] T021 [P] [US4] Create `AdvancedFiltersPanel` component in `frontend/src/components/deals-list/AdvancedFiltersPanel.tsx` (slide-in drawer; filter fields: stage, label, valueMin/Max, closeDateFrom/To, source; updates `dealsListStore.filters` on Apply)
- [ ] T022 [P] [US4] Create `FilterChipBar` component in `frontend/src/components/deals-list/FilterChipBar.tsx` (renders active filter conditions as removable chips; "Save as view" button calls `useCreateView`)
- [ ] T023 [US4] Create `SavedViewsDropdown` component in `frontend/src/components/deals-list/SavedViewsDropdown.tsx` (lists saved views; click applies filters; delete removes view)
- [ ] T024 [US4] Integrate `AdvancedFiltersPanel` + `FilterChipBar` + `SavedViewsDropdown` into `frontend/src/pages/DealsListPage.tsx` toolbar

---

## Phase 7 — User Story 5 (P2): Export to CSV

*Goal*: Export button downloads a CSV of current filtered deals (all pages).
*Independent test*: Filter to Won deals → Export → CSV has only Won deals with all required columns.

- [ ] T025 [P] [US5] Create `exportToCsv(deals: DealListItem[], filename: string): void` utility in `frontend/src/lib/csvExport.ts` (converts array to CSV string; triggers blob download)
- [ ] T026 [US5] Add Export button to `DealsListPage` toolbar; on click, fetch `GET /api/deals?...&all=true` with current filters (no pagination), then call `exportToCsv` in `frontend/src/pages/DealsListPage.tsx`

---

## Phase 8 — User Story 6 (P2): Bulk select and act

*Goal*: Row checkboxes + header checkbox; bulk action bar; Delete (with confirm) and Assign Owner.
*Independent test*: Select 3 deals → Assign Owner → all 3 show new owner after refresh.

- [ ] T027 [P] [US6] Implement `PATCH /api/deals/bulk` in `backend/routes/deals.ts` (support `delete` and `assignOwner` actions on array of IDs)
- [ ] T028 [US6] Add `useBulkAction` mutation to `frontend/src/api/useDealsTable.ts` (on success: invalidate `['deals-list']`; clear `dealsListStore.selectedIds`)
- [ ] T029 [US6] Add checkbox column to `DealRow` (updates `dealsListStore.selectedIds`); add indeterminate header checkbox to `DealsTable` (set via `useRef`) in `frontend/src/components/deals-list/DealsTable.tsx` and `DealRow.tsx`
- [ ] T030 [US6] Create `BulkActionBar` component in `frontend/src/components/deals-list/BulkActionBar.tsx` (sticky bar; shows selection count; Delete with `window.confirm`; Assign Owner with owner input; calls `useBulkAction`)
- [ ] T031 [US6] Conditionally render `BulkActionBar` in `DealsListPage` when `dealsListStore.selectedIds.size > 0` in `frontend/src/pages/DealsListPage.tsx`

---

## Phase 9 — User Story 7 (P3): Pagination

*Goal*: Page controls below table; "Showing X–Y of Z deals" label; prev/next/numbered pages.
*Independent test*: 25 deals, perPage=15 → page 1 shows 15 rows; page 2 shows 10 rows.

- [ ] T032 [P] [US7] Create `PaginationControls` reusable component in `frontend/src/components/shared/PaginationControls.tsx` (props: `total`, `page`, `perPage`, `onPageChange`; renders prev/next + page number buttons + count label)
- [ ] T033 [US7] Integrate `PaginationControls` below `DealsTable`; wire to `dealsListStore.page` in `frontend/src/pages/DealsListPage.tsx`

---

## Final Phase — Polish

- [ ] T034 Add skeleton rows (5 placeholder rows) to `DealsTable` while `useDealsTable` is loading in `frontend/src/components/deals-list/DealsTable.tsx`
- [ ] T035 Add empty state ("No deals match your filters") to `DealsTable` when `deals.length === 0` in `frontend/src/components/deals-list/DealsTable.tsx`
- [ ] T036 Wrap `DealsListPage` route with `ErrorBoundary` in `frontend/src/App.tsx`
- [ ] T037 [P] Write Playwright E2E test covering Scenarios 1, 3, 4 from quickstart.md in `frontend/tests/deals-list.spec.ts`
