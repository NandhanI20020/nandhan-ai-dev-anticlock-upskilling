# Implementation Tasks: Forecast View

**Feature**: `specs/011-forecast-view`
**Total tasks**: 18 | **MVP scope**: Phase 3 (US1 — forecast grid with color-coded deal blocks)

---

## Dependencies

```
Phase 1 (Setup)
  └── Phase 2 (Foundational)
        └── Phase 3 (US1+US2: grid + quota headers)  ← entry point
              ├── Phase 4 (US3: range toggle)          ← [P]
              ├── Phase 5 (US4: hover tooltip)         ← [P]
              └── Phase 6 (US5: click to navigate)     ← [P] (trivial after Phase 3)
                    └── Final Phase (Polish)
```

---

## Phase 1 — Setup

- [ ] T001 Create component directory `frontend/src/components/forecast/`
- [ ] T002 [P] Create `backend/data/forecastConfig.json` (`{ "monthlyQuota": 500000 }`)
- [ ] T003 [P] Create `shared/types/forecast.ts` (`ForecastDeal`, `ForecastMonth`, `ForecastResponse`, `ForecastRange` types)

---

## Phase 2 — Foundational *(CRITICAL)*

- [ ] T004 [P] Create Express router `backend/routes/forecast.ts` (stub for `GET /api/forecast`)
- [ ] T005 Register forecast router in `backend/index.ts` under `/api/forecast`
- [ ] T006 [P] Implement `GET /api/forecast?range=` in `backend/routes/forecast.ts` (filter open deals with non-null expectedCloseDate; determine months from range; group deals by close month; compute weightedValue per deal and per month; load forecastConfig.json for quotaTarget; compute quotaPercent; join orgName)
- [ ] T007 [P] Create Zustand store `frontend/src/store/forecastStore.ts` (`{ range: ForecastRange }`)
- [ ] T008 Create React Query hook `frontend/src/api/useForecast.ts` (`useForecast(range)` → `useQuery(['forecast', range])`)

---

## Phase 3 — User Stories 1 + 2 (P1): Forecast grid with quota headers

*Goal*: Horizontal grid of month columns; deal blocks color-coded by probability; quota % in headers.
*Independent test*: 3 deals in July (80%/50%/20%) → 3 blocks with green/amber/red colors; correct weighted total and quota %.

- [ ] T009 [P] [US1] Create `DealBlock` component in `frontend/src/components/forecast/DealBlock.tsx` (colored card: title, formatted value, probability %; `bg-green/amber/red` class based on probability range; `<Link to="/deals/:id">` wrapper)
- [ ] T010 [P] [US2] Create `ForecastColumn` component in `frontend/src/components/forecast/ForecastColumn.tsx` (month header: month label, formatted weighted value, quota % badge with green/amber/red header color; list of `DealBlock` items below)
- [ ] T011 [US1] Create `ForecastGrid` component in `frontend/src/components/forecast/ForecastGrid.tsx` (`overflow-x-auto flex gap-4`; maps `months` array to `ForecastColumn`; each column `min-w-[200px] flex-shrink-0`)
- [ ] T012 [US1] Create `ForecastPage` in `frontend/src/pages/ForecastPage.tsx` (toolbar with `ForecastRangeToggle` stub; renders `ForecastGrid`)
- [ ] T013 [US1] Add route `/deals/forecast` → `ForecastPage` in `frontend/src/App.tsx`
- [ ] T014 [US1] Add "Forecast" tab link to the view-toggle row in `frontend/src/pages/DealsListPage.tsx`

---

## Phase 4 — User Story 3 (P2): Date range toggle

*Goal*: This Quarter / Next Quarter / This Year toggle changes visible columns.
*Independent test*: Switch to "Next Quarter" → grid shows exactly 3 next-quarter months.

- [ ] T015 [P] [US3] Create `ForecastRangeToggle` component in `frontend/src/components/forecast/ForecastRangeToggle.tsx` (3-option toggle: This Quarter | Next Quarter | This Year; updates `forecastStore.range`; active option highlighted)
- [ ] T016 [US3] Integrate `ForecastRangeToggle` into `ForecastPage` toolbar; wire to `useForecast(range)`

---

## Phase 5 — User Story 4 (P2): Hover tooltip

*Goal*: Hovering a deal block shows tooltip with deal+org+owner+probability+close date.
*Independent test*: Hover any block → tooltip with 5 fields appears.

- [ ] T017 [P] [US4] Create `DealBlockTooltip` component in `frontend/src/components/forecast/DealBlockTooltip.tsx` (absolute positioned; shows title, orgName, ownerName, probability %, expectedCloseDate); integrate into `DealBlock` using `group` + `group-hover:visible` Tailwind pattern

---

## Final Phase — Polish

- [ ] T018 Add loading skeleton columns to `ForecastGrid`; add empty state ("No deals with close dates in this period") when `months` have no deals; `ErrorBoundary` wrap in `frontend/src/App.tsx`
