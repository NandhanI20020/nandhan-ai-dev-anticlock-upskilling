# Implementation Plan: Pipeline Kanban Board

**Branch**: `001-pipeline-kanban` | **Date**: 2026-06-15 | **Spec**: [spec.md](spec.md)

---

## Technical Context

**Tech stack**: React 18 + Vite + Tailwind CSS (frontend) / Node.js + Express + mock JSON store (backend)

**Libraries used in this feature**:
- `@dnd-kit/core` — DndContext, draggable sensors, droppable containers
- `@dnd-kit/utilities` — CSS.Transform.toString() for drag overlay positioning
- `lucide-react` — activity type icons (Phone, Calendar, CheckSquare, Mail, Clock), MoreHorizontal menu
- `@tanstack/react-query` — `useQuery` for pipelines + deals, `useMutation` for stage change / create / won/lost
- `zustand` — `kanbanStore` for drag state (activeCardId, overColumnId) and filter state

**Project structure changes**:
```
frontend/src/
  pages/
    PipelinePage.tsx              ← route component, owns pipeline selector state
  components/pipeline/
    KanbanBoard.tsx               ← DndContext wrapper, renders KanbanColumn list
    KanbanColumn.tsx              ← useDroppable column; header with count + value
    DealCard.tsx                  ← useDraggable card; rotten badge, activity badge
    DealCardMenu.tsx              ← MoreHorizontal dropdown (Edit / Won / Lost / Delete)
    PipelineSelector.tsx          ← pipeline switcher dropdown
    AddDealModal.tsx              ← controlled modal form + useMutation
    FilterBar.tsx                 ← filter chip row; owner / label / date / value filters
    DragOverlayCard.tsx           ← DragOverlay clone rendered during drag
  api/
    usePipelines.ts               ← useQuery(['pipelines']) + useQuery(['pipeline', id])
    useDeals.ts                   ← useQuery(['deals', filters]) + useMutation for CRUD
  store/
    kanbanStore.ts                ← Zustand: { activeCardId, overColumnId, filters }
backend/
  routes/
    pipelines.ts                  ← GET /api/pipelines, GET /api/pipelines/:id
    deals.ts                      ← GET/POST/PATCH/DELETE /api/deals, /api/deals/:id/won|lost
  data/
    pipelines.json                ← 2 pipelines
    stages.json                   ← 10 stages (5 per pipeline)
    deals.json                    ← 25 open deals with varied stages and updatedAt dates
shared/
  types/
    pipeline.ts                   ← Pipeline, Stage interfaces
    deal.ts                       ← Deal interface (status union, activity types)
```

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| Spec-First | ✓ | spec.md written and approved before this plan |
| Mock-Data Simplicity | ✓ | Flat JSON in `backend/data/`; PATCH updates in-memory only |
| Type Safety | ✓ | Pipeline, Stage, Deal interfaces in `shared/types/`; no `any` |
| Component Sovereignty | ✓ | DealCard, KanbanColumn receive data via props; fetch only in hooks |
| Tailwind Only | ✓ | Rotten orange = `text-orange-400 border-orange-400`; no inline styles |

---

## Research Findings

*(See research.md for full rationale)*

| Decision | Chosen | Rationale |
|----------|--------|-----------|
| Drag-and-drop | `@dnd-kit/core` | Approved stack; accessibility-first; pointer + keyboard sensors |
| Drag UI state | Zustand `kanbanStore` | Shared between Board/Column/Card without prop-drilling |
| Rotten detection | Client-side in DealCard | O(1) math; avoids backend computation for a display concern |
| Pipeline URL state | `?pipeline=<id>` search param | Shareable URL; browser-back works; no state loss on refresh |
| Column virtualization | None (MVP) | ≤50 deals per column; not warranted at this scale |
| Optimistic updates | Yes, for stage change | `useMutation` with `onMutate` cache update + `onError` rollback |

---

## Architecture Decisions

- `KanbanBoard` owns the single `DndContext` instance so all columns and cards share the same drag session.
- Drag overlay (`DragOverlayCard`) is a portal rendered outside the column DOM to avoid clipping by `overflow: hidden` on columns.
- `useDeals` hook accepts a `filters` param object; React Query key includes the filters so changing pipeline/filters triggers a fresh fetch automatically.
- Stage change is an optimistic `PATCH /api/deals/:id` — the local React Query cache is updated immediately in `onMutate` and rolled back in `onError`.
- `PipelinePage` derives the active pipeline ID from `useSearchParams`; default is the first pipeline's ID from `GET /api/pipelines`.
- Deal totals per column are computed in the React render from the filtered deal array (no separate API call).

---

## Complexity Notes

- **Risk areas**: @dnd-kit drag overlay positioning requires `DragOverlay` to render a cloned `DealCard`; card width must be fixed or measured to avoid layout jump during drag.
- **Risk areas**: Optimistic PATCH on stage change requires correct React Query cache key structure so rollback targets the right query.
- **Dependencies on other features**: Deals reference `orgName` and `personName` — the deals API must join these from `organizations.json` and `people.json` in the mock store (even before 004-contacts and 006-organizations are built).
- **Estimated phases**: 6 phases covering 8 user stories (US1–US4 are P1, US5–US6 are P2, US7–US8 are P3).
