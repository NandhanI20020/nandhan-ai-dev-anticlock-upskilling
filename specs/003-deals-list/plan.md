# Implementation Plan: Deals List View

**Branch**: `003-deals-list` | **Date**: 2026-06-15 | **Spec**: [spec.md](spec.md)

---

## Technical Context

**Tech stack**: React 18 + Vite + Tailwind CSS (frontend) / Node.js + Express + mock JSON store (backend)

**Libraries used in this feature**:
- `lucide-react` — sort arrows (ArrowUp/ArrowDown/ChevronsUpDown), filter icon, export icon, checkbox-like states
- `@tanstack/react-query` — `useQuery` for paginated deals + saved views; `useMutation` for bulk actions, save/delete views
- `zustand` — `dealsListStore`: sort, filters, selectedIds, page, perPage

**Project structure changes**:
```
frontend/src/
  pages/
    DealsListPage.tsx             ← route /deals (with view toggle: Pipeline | List | Forecast)
  components/deals-list/
    DealsTable.tsx                ← sortable <table> with header + rows
    DealRow.tsx                   ← single deal row; status treatments; checkbox
    DealStatusBadge.tsx           ← reusable Won/Lost/Rotten badge
    StageProgressCell.tsx         ← segmented progress bar in Stage column
    QuickFilterTabs.tsx           ← All | Open | Won | Lost | My Deals tabs
    FilterChipBar.tsx             ← active filter chips + "Save as view" button
    AdvancedFiltersPanel.tsx      ← drawer/popover with filter builder form
    SavedViewsDropdown.tsx        ← list of saved named views
    BulkActionBar.tsx             ← floats above table when selectedIds.size > 0
    PaginationControls.tsx        ← reusable prev/next/page numbers + count label
  api/
    useDealsTable.ts              ← useQuery(['deals-list', filters, sort, page]) + bulk mutation
    useSavedViews.ts              ← useQuery + create/delete mutations
  store/
    dealsListStore.ts             ← { filters, sort, sortDir, selectedIds, page, perPage }
backend/
  routes/
    deals.ts                      ← extend GET /api/deals with full filter/sort/pagination
    savedViews.ts                 ← GET/POST/DELETE /api/saved-views
  data/
    savedViews.json               ← 3 example saved views
shared/
  types/
    deal.ts                       ← add DealListItem, PaginatedDealsResponse, DealListFilters
    savedView.ts                  ← SavedView, BulkActionRequest
```

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| Spec-First | ✓ | spec.md approved before this plan |
| Mock-Data Simplicity | ✓ | Filter/sort/paginate done in memory in Express route handler |
| Type Safety | ✓ | `PaginatedDealsResponse`, `DealListItem`, `DealListFilters` all typed; no `any` |
| Component Sovereignty | ✓ | `DealRow` and `DealsTable` receive data via props; fetching only in `useDealsTable` |
| Tailwind Only | ✓ | Status badge colors via `bg-green-100 text-green-700`; red row border via `border-l-4 border-red-500` |

---

## Research Findings

*(See research.md for full rationale)*

| Decision | Chosen | Rationale |
|----------|--------|-----------|
| Filter/sort/paginate | Server-side (backend) | Realistic; handles data growth; `?all=true` param for export |
| CSV export | Client-side blob | No extra endpoint; uses cached data from `?all=true` fetch |
| Sort/filter state | Zustand `dealsListStore` | Coordinates sort, filters, selection, and page in one store |
| Rotten detection | Client-side in `DealRow` | Display concern; consistent with kanban |
| Stage progress bar | `StageProgressCell` with `stageOrder`/`pipelineTotalStages` | Included in API response; no extra query per row |
| Bulk actions | `PATCH /api/deals/bulk` | Single endpoint for multiple actions |
| Pagination | `PaginationControls` shared component | Reusable across contacts, activities, archive list views |

---

## Architecture Decisions

- `DealsListPage` renders a view-toggle row (Pipeline | **List** | Forecast) and hosts `QuickFilterTabs`, `FilterChipBar`, and `DealsTable`. It reads `dealsListStore` and passes state down.
- `DealsTable` owns the column header click handlers (updates `dealsListStore.sort` and `sortDir`). It renders a `DealRow` per deal and a header checkbox for select-all.
- `BulkActionBar` is conditionally rendered above the table in `DealsListPage` when `dealsListStore.selectedIds.size > 0`. It is sticky (Tailwind `sticky top-0`).
- `PaginationControls` is a dumb component receiving `total`, `page`, `perPage`, and an `onPageChange` callback — no store coupling, maximally reusable.
- CSV export is triggered from `DealsListPage` toolbar: first fetches `GET /api/deals?...&all=true`, then converts the array to CSV string and triggers a blob download. No backend involvement.
- `AdvancedFiltersPanel` is a slide-in drawer (Tailwind `translate-x` transition) — no third-party drawer library.

---

## Complexity Notes

- **Risk areas**: Header checkbox `indeterminate` state cannot be set as a React prop — must be set imperatively via `useRef` and `checkboxRef.current.indeterminate = true`.
- **Risk areas**: The `sort` parameter must map correctly to the joined field names (e.g. `"stageName"` sorts by the computed join, not a raw Deal field).
- **Dependencies on other features**: View toggle links to `001-pipeline-kanban` (Pipeline tab) and `011-forecast-view` (Forecast tab) — render stubs with `<Link>` even before those exist.
- **Estimated phases**: 6 phases covering 7 user stories (US1–US3 P1, US4–US6 P2, US7 P3).
