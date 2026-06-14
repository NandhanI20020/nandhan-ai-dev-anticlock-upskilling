# Implementation Tasks: Pipeline Kanban Board

**Feature**: `specs/001-pipeline-kanban`
**Total tasks**: 48 | **MVP scope**: Phase 3 (User Story 1 — view deals by stage)

---

## Dependencies

```
Phase 1 (Setup)
  └── Phase 2 (Foundational — types, mock data, backend routes)
        ├── Phase 3 (US1: view board)         ← entry point, required first
        │     ├── Phase 4 (US2: drag-drop)    ← [P] parallel after Phase 3
        │     ├── Phase 5 (US3: rotten)       ← [P] parallel after Phase 3
        │     ├── Phase 6 (US4: activity)     ← [P] parallel after Phase 3
        │     ├── Phase 7 (US5: pipeline sel) ← [P] parallel after Phase 3
        │     └── Phase 8 (US6: add deal)     ← [P] parallel after Phase 3
        │           ├── Phase 9 (US7: filter) ← after Phase 8 (reuses filter state)
        │           └── Phase 10 (US8: menu)  ← [P] parallel after Phase 8
        └── Final Phase (Polish)              ← after all story phases
```

---

## Phase 1 — Setup

*Install packages and scaffold directories*

- [ ] T001 Install dnd-kit packages: `cd frontend && npm install @dnd-kit/core @dnd-kit/utilities`
- [ ] T002 Create component directory: `frontend/src/components/pipeline/`
- [ ] T003 Create shared types directory (if not exists): `shared/types/`

---

## Phase 2 — Foundational *(CRITICAL — completes before all story phases)*

*Shared types, mock data, and backend route scaffolds that all story phases depend on*

- [ ] T004 [P] Define `Pipeline` and `Stage` TypeScript interfaces in `shared/types/pipeline.ts`
- [ ] T005 [P] Define `Deal` TypeScript interface (status union, activity type union) in `shared/types/deal.ts`
- [ ] T006 [P] Create mock data `backend/data/pipelines.json` (2 pipelines, each with 5 ordered stageIds)
- [ ] T007 [P] Create mock data `backend/data/stages.json` (10 stages total; include rottingDays on each)
- [ ] T008 [P] Create mock data `backend/data/deals.json` (25 open deals; vary stageId, set 2 deals with updatedAt 30+ days ago for rotten testing)
- [ ] T009 Create Express router scaffold `backend/routes/pipelines.ts` (stubs for GET /api/pipelines and GET /api/pipelines/:id)
- [ ] T010 Create Express router scaffold `backend/routes/deals.ts` (stubs for all deal endpoints)
- [ ] T011 Register both routers in `backend/index.ts` under `/api/pipelines` and `/api/deals`
- [ ] T012 Create Zustand store scaffold `frontend/src/store/kanbanStore.ts` (empty slices: drag state + filters)

---

## Phase 3 — User Story 1 (P1): View all open deals organized by stage

*Goal*: Render the full kanban board with stage columns, deal cards, column counts, and totals.
*Independent test*: Load board with 25 seeded deals — verify 5 columns, correct counts/totals, deal cards visible.

- [ ] T013 [P] [US1] Implement `GET /api/pipelines` in `backend/routes/pipelines.ts` (return all pipelines array)
- [ ] T014 [P] [US1] Implement `GET /api/pipelines/:id` in `backend/routes/pipelines.ts` (return pipeline with joined stages array)
- [ ] T015 [P] [US1] Implement `GET /api/deals` in `backend/routes/deals.ts` (filter by pipelineId + status; join orgName from organizations.json)
- [ ] T016 [US1] Create React Query hook `usePipelines` (list + single) in `frontend/src/api/usePipelines.ts`
- [ ] T017 [US1] Create React Query hook `useDeals` (accepts filters object, includes in query key) in `frontend/src/api/useDeals.ts`
- [ ] T018 [US1] Create `KanbanColumn` component in `frontend/src/components/pipeline/KanbanColumn.tsx` (column header with stage name, deal count, total value; deal cards list)
- [ ] T019 [US1] Create basic `DealCard` component (title, org name, value, currency) in `frontend/src/components/pipeline/DealCard.tsx`
- [ ] T020 [US1] Create `KanbanBoard` component in `frontend/src/components/pipeline/KanbanBoard.tsx` (maps stages to KanbanColumns; computes per-column totals from deals array)
- [ ] T021 [US1] Create `PipelinePage` in `frontend/src/pages/PipelinePage.tsx` (reads pipelineId from search params; passes to usePipelines + useDeals; renders KanbanBoard)
- [ ] T022 [US1] Add route `/pipeline` → `PipelinePage` in `frontend/src/App.tsx`
- [ ] T023 [US1] Add "Pipeline" nav link to `frontend/src/components/layout/Sidebar.tsx`

---

## Phase 4 — User Story 2 (P1): Drag deal cards between stages

*Goal*: Enable drag-and-drop stage change with instant visual feedback and persistence.
*Independent test*: Drag "deal-001" from Qualified to Proposal Made — counts update instantly, persists on refresh.

- [ ] T024 [P] [US2] Implement `PATCH /api/deals/:id` in `backend/routes/deals.ts` (accept partial body; always update `updatedAt`)
- [ ] T025 [US2] Add drag state slice to `frontend/src/store/kanbanStore.ts` (`activeCardId: string | null`, `overColumnId: string | null`)
- [ ] T026 [US2] Wrap `KanbanBoard` with `DndContext` from `@dnd-kit/core`; configure `PointerSensor` and `KeyboardSensor` in `frontend/src/components/pipeline/KanbanBoard.tsx`
- [ ] T027 [US2] Make `KanbanColumn` a droppable zone using `useDroppable` from `@dnd-kit/core` in `frontend/src/components/pipeline/KanbanColumn.tsx`
- [ ] T028 [US2] Make `DealCard` draggable using `useDraggable` from `@dnd-kit/core` in `frontend/src/components/pipeline/DealCard.tsx`
- [ ] T029 [US2] Create `DragOverlayCard` component (cloned card rendered during drag) in `frontend/src/components/pipeline/DragOverlayCard.tsx`
- [ ] T030 [US2] Add `DragOverlay` to `KanbanBoard`; render `DragOverlayCard` when `activeCardId` is set in `frontend/src/components/pipeline/KanbanBoard.tsx`
- [ ] T031 [US2] Add `useMoveDeal` mutation to `frontend/src/api/useDeals.ts` (PATCH /api/deals/:id with optimistic cache update in `onMutate` and rollback in `onError`)
- [ ] T032 [US2] Wire `onDragEnd` handler in `KanbanBoard` to call `useMoveDeal` when over a different column

---

## Phase 5 — User Story 3 (P1): Rotten deal indicator

*Goal*: Show ROTTEN badge and stale-day count on cards exceeding stage's `rottingDays` threshold.
*Independent test*: Seeded deal with updatedAt 30 days ago in Qualified (rottingDays: 14) shows ROTTEN badge.

- [ ] T033 [P] [US3] Create `daysSince(dateString: string): number` utility in `frontend/src/lib/dateUtils.ts`
- [ ] T034 [US3] Add rotten detection logic to `DealCard` in `frontend/src/components/pipeline/DealCard.tsx`: `isRotten = status === 'open' && rottingDays !== null && daysSince(updatedAt) > rottingDays`
- [ ] T035 [US3] Render ROTTEN badge (orange left border + "ROTTEN" label + stale-days count) on `DealCard` when `isRotten` is true; use Tailwind `border-l-4 border-orange-400 text-orange-400`

---

## Phase 6 — User Story 4 (P1): Next activity badge on cards

*Goal*: Show activity type icon and relative due time on each deal card.
*Independent test*: Deal with a meeting due in 2 days shows calendar icon and "2d"; overdue shows in red.

- [ ] T036 [P] [US4] Create `ACTIVITY_ICONS` map (call→Phone, meeting→Calendar, task→CheckSquare, email→Mail, deadline→Clock) using `lucide-react` in `frontend/src/lib/activityIcons.ts`
- [ ] T037 [US4] Create `relativeActivityTime(dueDate: string): string` helper returning "Overdue", "Today", "Tomorrow", "Nd" in `frontend/src/lib/dateUtils.ts`
- [ ] T038 [US4] Add activity badge section to `DealCard` in `frontend/src/components/pipeline/DealCard.tsx`: render icon + relative time using `deal.nextActivityType` and `deal.nextActivityDate`; apply `text-red-500` if overdue

---

## Phase 7 — User Story 5 (P2): Switch between pipelines

*Goal*: Pipeline selector in toolbar updates board to show selected pipeline's stages and deals.
*Independent test*: Switch from pipeline 1 to pipeline 2 — columns change to pipeline 2 stages.

- [ ] T039 [P] [US5] Create `PipelineSelector` dropdown component in `frontend/src/components/pipeline/PipelineSelector.tsx` (renders pipeline list from `usePipelines`; emits selected pipeline ID)
- [ ] T040 [US5] Integrate `PipelineSelector` into `PipelinePage` toolbar; store selected pipeline ID in URL via `setSearchParams` in `frontend/src/pages/PipelinePage.tsx`
- [ ] T041 [US5] On initial load, default to first pipeline where `isDefault: true` (or first in list) in `frontend/src/pages/PipelinePage.tsx`

---

## Phase 8 — User Story 6 (P2): Add a new deal from the board

*Goal*: "Add Deal" modal creates a deal that appears in the correct column immediately.
*Independent test*: Create "Test Deal 999" in Demo Scheduled — card appears in that column, count +1.

- [ ] T042 [P] [US6] Implement `POST /api/deals` in `backend/routes/deals.ts` (generate UUID, set createdAt/updatedAt, push to in-memory deals array, return 201)
- [ ] T043 [US6] Add `useCreateDeal` mutation to `frontend/src/api/useDeals.ts` (POST /api/deals; on success, `queryClient.invalidateQueries(['deals'])`)
- [ ] T044 [US6] Create `AddDealModal` component in `frontend/src/components/pipeline/AddDealModal.tsx` (fields: title, value, currency, pipeline, stage, org, person, expectedCloseDate, source; controlled form with local state)
- [ ] T045 [US6] Add "+ Add Deal" button to `PipelinePage` toolbar; manage modal open/close state in `frontend/src/pages/PipelinePage.tsx`

---

## Phase 9 — User Story 7 (P3): Filter deals on the board

*Goal*: Filter chips narrow visible deals by owner, label, date range, or value range; column totals update.
*Independent test*: Apply "owner = current user" filter — only user-1 deals shown across all columns.

- [ ] T046 [P] [US7] Add `filters` slice to `frontend/src/store/kanbanStore.ts` (`{ ownerId, label, valueMin, valueMax, closeDateFrom, closeDateTo }`)
- [ ] T047 [US7] Create `FilterBar` component in `frontend/src/components/pipeline/FilterBar.tsx` (filter button → popover with filter inputs; active filters render as removable chips)
- [ ] T048 [US7] Pass kanbanStore filter state to `useDeals` query params in `frontend/src/pages/PipelinePage.tsx` so React Query refetches on filter change

---

## Phase 10 — User Story 8 (P3): Deal card overflow menu

*Goal*: "..." menu on each card offers Edit, Mark as Won, Mark as Lost, Delete.
*Independent test*: Click "..." → "Mark as Lost" → enter reason → card disappears from board.

- [ ] T049 [P] [US8] Implement `PATCH /api/deals/:id/won` in `backend/routes/deals.ts` (set status="won", wonTime=now)
- [ ] T050 [P] [US8] Implement `PATCH /api/deals/:id/lost` in `backend/routes/deals.ts` (require lostReason, set status="lost", lostTime=now)
- [ ] T051 [P] [US8] Implement `DELETE /api/deals/:id` in `backend/routes/deals.ts`
- [ ] T052 [US8] Add `useWonDeal`, `useLostDeal`, `useDeleteDeal` mutations to `frontend/src/api/useDeals.ts`
- [ ] T053 [US8] Create `DealCardMenu` component in `frontend/src/components/pipeline/DealCardMenu.tsx` (MoreHorizontal icon; dropdown with Edit / Mark as Won / Mark as Lost / Delete; Lost triggers reason input dialog)
- [ ] T054 [US8] Integrate `DealCardMenu` into `DealCard` in `frontend/src/components/pipeline/DealCard.tsx`

---

## Final Phase — Polish

*Loading states, empty states, error boundaries, and E2E test*

- [ ] T055 Add skeleton loading state to `KanbanColumn` in `frontend/src/components/pipeline/KanbanColumn.tsx` (shown when `useDeals` is loading)
- [ ] T056 Add empty state to `KanbanColumn` in `frontend/src/components/pipeline/KanbanColumn.tsx` ("No deals in this stage" when column has 0 deals)
- [ ] T057 Wrap `PipelinePage` with an `ErrorBoundary` component in `frontend/src/App.tsx`
- [ ] T058 [P] Write Playwright E2E test covering Scenarios 1–3 from quickstart.md in `frontend/tests/pipeline-kanban.spec.ts`

---

## Parallel Execution Opportunities

**Phase 2** (all 9 tasks parallelizable — different files):
- Agent A: T004 + T005 (shared types)
- Agent B: T006 + T007 + T008 (mock data)
- Agent C: T009 + T010 + T011 (backend routes)

**Phase 3** (US1 — backend and frontend parallelizable after types exist):
- Agent A: T013 + T014 + T015 (backend implementations)
- Agent B: T016 + T017 (React Query hooks)
- Agent C: T018 + T019 (components)
Then sequential: T020 → T021 → T022 → T023

**Phases 4–10** (all story phases are parallelizable with each other after Phase 3):
- Phase 4 and Phase 5 and Phase 6 can all run concurrently
- Phase 7 is independent of Phases 5–6
- Phase 9 depends on Phase 8 (reuses filter state wired in AddDealModal phase)
