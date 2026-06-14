# Implementation Tasks: [FEATURE NAME]

**Feature**: [specs/NNN-feature-name]
**Total tasks**: [N] | **MVP scope**: Phase 3 (User Story 1 only)

---

## Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundational) → Phase 3 (US1) → Phase 4 (US2) → ...
                                          ↗ Phase 3 and Phase 4 can run in parallel
```

---

## Phase 1 — Setup

*Project initialization, dependencies, configuration*

- [ ] T001 Install required packages: `cd frontend && npm install [packages]`
- [ ] T002 Create directory structure per plan.md

---

## Phase 2 — Foundational *(CRITICAL — completes before all story phases)*

*Shared infrastructure blocking all user story phases*

- [ ] T003 Create shared TypeScript types in `shared/types/[feature].ts`
- [ ] T004 [P] Create mock data file at `backend/data/[feature].json`
- [ ] T005 [P] Create Express router scaffold at `backend/routes/[feature].ts`
- [ ] T006 Register router in `backend/index.ts`

---

## Phase 3 — User Story 1 (P1): [Story title]

*Goal*: [What completing this story delivers]
*Independent test*: [How to verify this story in isolation]

- [ ] T007 [P] [US1] Define [Entity] interface in `shared/types/[feature].ts`
- [ ] T008 [P] [US1] Implement GET /api/[resource] in `backend/routes/[feature].ts`
- [ ] T009 [P] [US1] Implement POST /api/[resource] in `backend/routes/[feature].ts`
- [ ] T010 [US1] Create React Query hook `use[Resource]` in `frontend/src/api/use[Feature].ts`
- [ ] T011 [US1] Create `[Component]` in `frontend/src/components/[feature]/[Component].tsx`
- [ ] T012 [US1] Create `[FeatureName]Page` in `frontend/src/pages/[FeatureName]Page.tsx`
- [ ] T013 [US1] Add route to `frontend/src/App.tsx`
- [ ] T014 [US1] Add nav item to sidebar in `frontend/src/components/layout/Sidebar.tsx`

---

## Phase 4 — User Story 2 (P2): [Story title]

*Goal*: [What completing this story delivers]
*Independent test*: [How to verify this story in isolation]

- [ ] T015 [P] [US2] Implement GET /api/[resource]/:id in `backend/routes/[feature].ts`
- [ ] T016 [P] [US2] Implement PUT /api/[resource]/:id in `backend/routes/[feature].ts`
- [ ] T017 [US2] Create `[DetailComponent]` in `frontend/src/components/[feature]/[DetailComponent].tsx`
- [ ] T018 [US2] Add detail route to `frontend/src/App.tsx`

---

## Final Phase — Polish

*Cross-cutting concerns and improvements*

- [ ] T019 Add loading states to all async operations
- [ ] T020 Add empty states to all list views
- [ ] T021 Add error boundary around feature routes
- [ ] T022 [P] Write Playwright E2E test in `frontend/tests/[feature].spec.ts`

---

## Parallel Execution Examples

**Story 1 can be parallelized as**:
- Agent A: T008 + T009 (backend routes)
- Agent B: T010 (React Query hook)
- Agent C: T011 (component scaffold)

Then: T012 → T013 → T014 (sequential, depend on above)
