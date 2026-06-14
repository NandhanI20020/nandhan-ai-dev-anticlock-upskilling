# Implementation Tasks: Deal Archive

**Feature**: `specs/012-deal-archive`
**Total tasks**: 22 | **MVP scope**: Phase 3 (US1+US2 — archive table + KPI tiles)

---

## Dependencies

```
Phase 1 (Setup)
  └── Phase 2 (Foundational)
        └── Phase 3 (US1+US2: table + KPI tiles)    ← entry point
              ├── Phase 4 (US3: filter + date range) ← [P]
              ├── Phase 5 (US4+US5: charts + panel)  ← [P]
              └── Phase 6 (US6: reopen deal)         ← [P]
                    └── Final Phase (Polish)
```

---

## Phase 1 — Setup

- [ ] T001 Create component directory `frontend/src/components/archive/`
- [ ] T002 [P] Create `shared/types/archive.ts` (`ArchivedDeal`, `ArchiveKPIs`, `WinReasonEntry`, `LossReasonEntry` types)

---

## Phase 2 — Foundational *(CRITICAL)*

- [ ] T003 [P] Create Express router `backend/routes/archive.ts` (stub for `GET /api/archive`)
- [ ] T004 Register archive router in `backend/index.ts` under `/api/archive`
- [ ] T005 [P] Implement `GET /api/archive` in `backend/routes/archive.ts` (filter deals by status won|lost; apply date range on wonTime|lostTime; filter by q on title|orgName; compute kpis, winReasons grouped by source, lossReasons grouped by lostReason; compute dealCycleDays per deal; join orgName)
- [ ] T006 [P] Create Zustand store `frontend/src/store/archiveStore.ts` (`{ statusFilter, datePreset, customFrom, customTo, searchQuery }`)
- [ ] T007 Create React Query hook `frontend/src/api/useArchive.ts` (`useArchive(store)` + `useReopenDeal` mutation stub)

---

## Phase 3 — User Stories 1 + 2 (P1): Archive table + KPI tiles

*Goal*: Table of won/lost deals with badges + cycle days; 4 KPI tiles above.
*Independent test*: 5 won + 3 lost seeded → all 8 in table; Won tile shows sum + 62.5% win rate.

- [ ] T008 [P] [US1] Create `ArchiveTableRow` component in `frontend/src/components/archive/ArchiveTableRow.tsx` (Won/Lost badge via `DealStatusBadge` from feature 003; title as `<Link>`; value, closeDate, dealCycleDays, ownerName; "Reopen" button stub on lost rows)
- [ ] T009 [P] [US2] Create `ArchiveKPICards` component in `frontend/src/components/archive/ArchiveKPICards.tsx` (imports `KPITile` from `frontend/src/components/insights/KPITile.tsx`; 4 tiles: Total Archived, Won Revenue+"X% win rate", Lost Value, Avg Cycle Days)
- [ ] T010 [US1] Create `ArchiveTable` component in `frontend/src/components/archive/ArchiveTable.tsx` (sortable headers: Title, Org, Status, Value, Close Date, Cycle, Owner; maps `ArchivedDeal[]` to `ArchiveTableRow`)
- [ ] T011 [US1] Create `DealArchivePage` in `frontend/src/pages/DealArchivePage.tsx` (renders `ArchiveKPICards` + filter bar placeholder + `ArchiveTable`)
- [ ] T012 [US1] Add route `/deals/archive` → `DealArchivePage` in `frontend/src/App.tsx`
- [ ] T013 [US1] Add "Archive" tab link to the view-toggle row in `frontend/src/pages/DealsListPage.tsx`

---

## Phase 4 — User Story 3 (P1): Filter by outcome and date

*Goal*: All/Won/Lost tabs + date range preset filter; table and KPIs update.
*Independent test*: Click "Lost" → only lost deals; KPIs show lost-only metrics.

- [ ] T014 [P] [US3] Create `ArchiveFilterBar` component in `frontend/src/components/archive/ArchiveFilterBar.tsx` (All|Won|Lost tabs; date range preset dropdown with "All Time" default; search input for title/org; active filters update `archiveStore`)
- [ ] T015 [US3] Integrate `ArchiveFilterBar` between `ArchiveKPICards` and `ArchiveTable` in `DealArchivePage`

---

## Phase 5 — User Stories 4 + 5 (P2): Win reason chart + loss insights panel

*Goal*: Bar chart of wins by source; ranked loss reasons panel.
*Independent test*: 3 Referral wins + 2 Cold Call wins → chart shows 2 bars; Loss panel shows top reason.

- [ ] T016 [P] [US4] Create `WinReasonChart` component in `frontend/src/components/archive/WinReasonChart.tsx` (recharts horizontal `BarChart`; y-axis = source; x-axis = count; tooltip shows totalValue)
- [ ] T017 [P] [US5] Create `LossInsightsPanel` component in `frontend/src/components/archive/LossInsightsPanel.tsx` (sorted list of `LossReasonEntry`; each shows reason text, count badge, progress bar for % of total losses)
- [ ] T018 [US4-5] Integrate `WinReasonChart` and `LossInsightsPanel` into `DealArchivePage` as a two-column row below the table

---

## Phase 6 — User Story 6 (P3): Reopen a lost deal

*Goal*: Reopen button sets deal back to open; disappears from archive; appears in kanban.
*Independent test*: Click Reopen on lost deal → not in archive; appears in kanban first stage.

- [ ] T019 [P] [US6] Implement `PATCH /api/deals/:id/reopen` in `backend/routes/deals.ts` (set status="open", lostReason=null, lostTime=null; find pipeline's stage with order=1, set stageId; create new StageTimeEntry; append deal_reopened system event)
- [ ] T020 [US6] Add `useReopenDeal` mutation to `frontend/src/api/useArchive.ts` (on success: invalidate `['archive']`, `['deals']`, `['deal-feed', id]`)
- [ ] T021 [US6] Wire "Reopen" button in `ArchiveTableRow` to `useReopenDeal` with `window.confirm` prompt

---

## Final Phase — Polish

- [ ] T022 Add skeleton rows to `ArchiveTable` while loading; empty state ("No closed deals in this period"); `PaginationControls` below table; `ErrorBoundary` wrap in `frontend/src/App.tsx`
