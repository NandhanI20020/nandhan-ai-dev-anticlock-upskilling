# Implementation Tasks: Global Search

**Feature**: `specs/009-global-search`
**Total tasks**: 20 | **MVP scope**: Phase 3 (US1+US2 — open overlay + show results)

---

## Dependencies

```
Phase 1 (Setup)
  └── Phase 2 (Foundational)
        └── Phase 3 (US1+US2: overlay + results)   ← entry point
              ├── Phase 4 (US3: recently viewed)    ← [P]
              ├── Phase 5 (US4: entity tabs)         ← [P]
              └── Phase 6 (US5: keyboard nav)        ← [P] after Phase 3
                    └── Final Phase (Polish)
```

---

## Phase 1 — Setup

- [ ] T001 Create component directory `frontend/src/components/search/`
- [ ] T002 [P] Create `shared/types/search.ts` (`SearchResult`, `SearchResponse`, `RecentlyViewedItem`, `SearchEntityType` types)

---

## Phase 2 — Foundational *(CRITICAL)*

- [ ] T003 [P] Create Express router `backend/routes/search.ts` (stub for `GET /api/search`)
- [ ] T004 Register search router in `backend/index.ts` under `/api/search`
- [ ] T005 [P] Implement `GET /api/search?q=` in `backend/routes/search.ts` (case-insensitive substring match on deal.title, person.name, org.name; max 5 results per type; return `SearchResponse` with subtitle fields: deal→orgName, person→jobTitle, org→address)
- [ ] T006 [P] Create Zustand store `frontend/src/store/searchStore.ts` (`{ isOpen, setOpen, recentlyViewed: RecentlyViewedItem[], addRecent }`)
- [ ] T007 Create React Query hook `frontend/src/api/useSearch.ts` (`useSearch(q)` → `useQuery(['search', q], { enabled: q.length >= 2 })`; debounce q with 200ms `useEffect`)

---

## Phase 3 — User Stories 1 + 2 (P1): Open overlay and show results

*Goal*: Ctrl+K opens overlay; typing shows grouped results; clicking navigates and closes.
*Independent test*: Press Ctrl+K → type "acme" → see Acme Corp Holdings in Organizations group → click → navigates to org detail.

- [ ] T008 [P] [US1] Create `GlobalSearchOverlay` component in `frontend/src/components/search/GlobalSearchOverlay.tsx` (fixed backdrop + centered panel; auto-focused `<input>`; `useSearch(q)` inside; renders results or recently viewed; closes on Escape or backdrop click)
- [ ] T009 [P] [US1] Add `useEffect` in `frontend/src/App.tsx` listening for `keydown` on `window`; on Ctrl+K / Cmd+K: call `searchStore.setOpen(true)` and `event.preventDefault()`
- [ ] T010 [P] [US2] Create `SearchResultItem` component in `frontend/src/components/search/SearchResultItem.tsx` (entity-type icon, title bold, subtitle muted; hover highlight; onClick: navigate to record, call `addRecent(item)`, close overlay)
- [ ] T011 [US2] Create `SearchResultGroup` component in `frontend/src/components/search/SearchResultGroup.tsx` (section header with entity label; maps `SearchResult[]` to `SearchResultItem`)
- [ ] T012 [US2] Render `SearchResultGroup` instances (Deals / People / Orgs) inside `GlobalSearchOverlay`; show "No results for '...'" empty state when all groups empty
- [ ] T013 [US1] Add search icon button to `frontend/src/components/layout/Sidebar.tsx` that calls `searchStore.setOpen(true)`
- [ ] T014 Conditionally render `GlobalSearchOverlay` in `frontend/src/App.tsx` when `searchStore.isOpen`

---

## Phase 4 — User Story 3 (P1): Recently viewed records

*Goal*: Empty input shows up to 5 recent records from session.
*Independent test*: Visit deal-001 → open search → deal-001 in recently viewed list.

- [ ] T015 [P] [US3] Show `recentlyViewed` list (mapped to `SearchResultItem`) in `GlobalSearchOverlay` when `q.length < 2`; section header "Recently Viewed"

---

## Phase 5 — User Story 4 (P2): Entity type tabs

*Goal*: All / Deals / People / Organizations tabs filter results with counts.
*Independent test*: Type "enterprise" → switch to Deals tab → only deal results shown.

- [ ] T016 [P] [US4] Create `SearchTabs` component in `frontend/src/components/search/SearchTabs.tsx` (4 tabs with count badges; active tab state local to overlay; click filters which `SearchResultGroup` is rendered)
- [ ] T017 [US4] Integrate `SearchTabs` into `GlobalSearchOverlay` above results; hide tabs when `q.length < 2`

---

## Phase 6 — User Story 5 (P2): Keyboard navigation

*Goal*: Arrow Up/Down moves highlight through results; Enter opens highlighted result.
*Independent test*: Type "sarah", press Arrow Down twice, Enter → navigates to second result.

- [ ] T018 [US5] Add `highlightedIndex` state to `GlobalSearchOverlay`; handle `keydown` (ArrowUp/ArrowDown increments index; Enter fires `onClick` on highlighted item; index resets to -1 on query change)
- [ ] T019 [US5] Pass `isHighlighted` prop to `SearchResultItem`; apply `bg-purple-50` highlight class when true

---

## Final Phase — Polish

- [ ] T020 Add loading spinner inside `GlobalSearchOverlay` input row while `useSearch` is fetching
