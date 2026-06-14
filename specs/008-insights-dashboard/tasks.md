# Implementation Tasks: Insights Dashboard

**Feature**: `specs/008-insights-dashboard`
**Total tasks**: 24 | **MVP scope**: Phase 3 (US1 — KPI tiles)

---

## Dependencies

```
Phase 1 (Setup)
  └── Phase 2 (Foundational — single insights API + store + hook)
        └── Phase 3 (US1: KPI tiles)              ← entry point
              ├── Phase 4 (US2+US3+US4: charts)   ← [P] after Phase 3
              ├── Phase 5 (US5: date range filter) ← [P] after Phase 3
              └── Phase 6 (US6: recent deals)      ← [P] after Phase 3
                    └── Final Phase (Polish)
```

---

## Phase 1 — Setup

- [ ] T001 Create component directory `frontend/src/components/insights/`
- [ ] T002 [P] Create `shared/types/insights.ts` (`DashboardStats`, `StageDistribution`, `WinLossRatio`, `ActivityByDay`, `RecentDeal`, `DatePreset` types)

---

## Phase 2 — Foundational *(CRITICAL)*

- [ ] T003 [P] Create Express router `backend/routes/insights.ts` (stub for `GET /api/insights`)
- [ ] T004 Register insights router in `backend/index.ts` under `/api/insights`
- [ ] T005 [P] Implement `GET /api/insights?from=&to=` in `backend/routes/insights.ts` (aggregate from deals, activities, stages in-memory: compute stats, stageDistribution, winLoss, activityTimeline, recentDeals, and trend % vs prior equal-length period)
- [ ] T006 [P] Create Zustand store `frontend/src/store/insightsStore.ts` (`{ datePreset: DatePreset, customFrom: string | null, customTo: string | null }` + computed `from`/`to` ISO dates)
- [ ] T007 Create React Query hook `frontend/src/api/useInsights.ts` (`useInsights(from, to)` → `useQuery(['insights', from, to])`)

---

## Phase 3 — User Story 1 (P1): KPI tiles

*Goal*: 4 metric tiles with currency formatting and trend percentage.
*Independent test*: Open Pipeline Value tile matches sum of open deals from API.

- [ ] T008 [P] [US1] Create `KPITile` reusable component in `frontend/src/components/insights/KPITile.tsx` (props: label, value, formattedValue, trendPercent, icon; renders tile with large value, trend badge with ↑↓ direction)
- [ ] T009 [US1] Create `KPITileRow` in `frontend/src/components/insights/KPITileRow.tsx` (4-column grid; renders Open Pipeline, Won Revenue, Activities Today, Avg Deal Age tiles using `KPITile`)
- [ ] T010 [US1] Create `InsightsPage` in `frontend/src/pages/InsightsPage.tsx` (renders toolbar + `KPITileRow` + chart placeholders)
- [ ] T011 [US1] Add route `/insights` → `InsightsPage` in `frontend/src/App.tsx`
- [ ] T012 [US1] Add "Insights" nav link to `frontend/src/components/layout/Sidebar.tsx`
- [ ] T013 [US1] Create `formatCurrencyCompact(value: number): string` utility in `frontend/src/lib/formatCurrency.ts` (uses `Intl.NumberFormat` with `en-IN` locale + compact notation)

---

## Phase 4 — User Stories 2, 3, 4 (P1): Charts

*Goal*: Deals by Stage bar chart, Win/Loss donut, Activities Completed bar chart.
*Independent test*: Proposal Made bar height proportional to its deal value total; donut shows correct win rate.

- [ ] T014 [P] [US2] Create `DealsByStageChart` component in `frontend/src/components/insights/DealsByStageChart.tsx` (recharts `BarChart`; x-axis = stageName; y-axis = totalValue; tooltip shows count + value)
- [ ] T015 [P] [US3] Create `WinLossDonut` component in `frontend/src/components/insights/WinLossDonut.tsx` (recharts `PieChart` with `innerRadius`; won=green/lost=red segments; custom center label showing win rate %)
- [ ] T016 [P] [US4] Create `ActivitiesCompletedChart` component in `frontend/src/components/insights/ActivitiesCompletedChart.tsx` (recharts stacked `BarChart`; x-axis = date; stacks by type with distinct colors per type)
- [ ] T017 [US2-4] Integrate all three charts into `InsightsPage` below `KPITileRow`

---

## Phase 5 — User Story 5 (P2): Date range filter

*Goal*: Preset dropdown refreshes all tiles and charts; custom date inputs work.
*Independent test*: Switch to "Last Quarter" → all KPIs and charts update with last-quarter data.

- [ ] T018 [P] [US5] Create `DateRangeSelector` component in `frontend/src/components/insights/DateRangeSelector.tsx` (dropdown: This Month / Last Month / This Quarter / Last Quarter / This Year / Custom; Custom shows two `<input type="date">` fields; updates `insightsStore`)
- [ ] T019 [US5] Integrate `DateRangeSelector` into `InsightsPage` toolbar; `InsightsPage` derives `from`/`to` from store and passes to `useInsights`

---

## Phase 6 — User Story 6 (P3): Recent deals panel

*Goal*: 5 most recently updated open deals with navigation links.
*Independent test*: Update deal-001 → appears first in Recent Deals panel.

- [ ] T020 [P] [US6] Create `RecentDealsPanel` component in `frontend/src/components/insights/RecentDealsPanel.tsx` (list of up to 5 `RecentDeal` items: title as `<Link>`, orgName, value, stageName, "X days ago" label)
- [ ] T021 [US6] Integrate `RecentDealsPanel` into `InsightsPage` as a side panel or bottom row

---

## Final Phase — Polish

- [ ] T022 Add skeleton loading state to `InsightsPage` while `useInsights` is pending (skeleton tiles + chart placeholder boxes)
- [ ] T023 Add empty state to each chart when no data exists for the selected period
- [ ] T024 Wrap `InsightsPage` route with `ErrorBoundary` in `frontend/src/App.tsx`
