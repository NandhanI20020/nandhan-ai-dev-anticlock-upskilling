---
description: Generate an actionable, dependency-ordered tasks.md for the feature based on available design artifacts.
handoffs: 
  - label: Implement Feature
    agent: speckit.implement
    prompt: Start the implementation in phases
    send: true
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Pre-Execution Checks

Check if `.specify/extensions.yml` exists. If so, read and apply any `hooks.before_tasks` entries. Skip silently if the file doesn't exist.

## Outline

1. **Load context** from the current feature directory (from `.specify/feature.json`):
   - **Required**: `plan.md` (tech stack, libraries, file structure), `spec.md` (user stories + priorities)
   - **Optional**: `data-model.md`, `contracts/`, `research.md`, `quickstart.md`
   - **If exists**: `.specify/constitution.md`

2. **Generate `tasks.md`** using `.specify/templates/tasks-template.md` as structure:

   - **Phase 1 — Setup**: Project initialization, directory creation, config files, package installs
   - **Phase 2 — Foundational** (CRITICAL — blocks all story phases): Shared infrastructure (routing, layout shell, API client, mock data store, shared types)
   - **Phase 3+ — One phase per User Story** (in P1→P2→P3 priority order from spec.md):
     - Story goal and independent test criteria
     - Tasks: Models → Services/Hooks → Components → Integration
     - Each story phase must be independently testable and deployable
   - **Final Phase — Polish**: Cross-cutting concerns, E2E tests, accessibility, performance

3. **Task format** — EVERY task MUST follow this exact format:
   ```
   - [ ] T001 Description with exact file path
   - [ ] T005 [P] Parallelizable task with file path
   - [ ] T012 [P] [US1] User-story task with file path
   ```
   - `[P]` = safe to run in parallel (different files, no incomplete dependencies)
   - `[US1]` / `[US2]` etc. = maps to user story from spec.md
   - Setup/Foundational phases: no story label
   - Every task must include an exact file path

4. **Generate dependency graph**: Show which user story phases depend on Phase 2 foundational tasks; most stories should be parallelizable with each other.

## Completion Report

Report:
- tasks.md path
- Total task count
- Task count per user story
- Parallel opportunities
- Suggested MVP scope (typically Phase 3, User Story 1 only)

## Task Generation Rules

- Organize by user story, not by layer (not "all models first, then all services")
- Each story phase = independently completable, testable, demonstrable
- Tests are optional unless explicitly requested in the spec
- File paths must be exact and match the structure in plan.md
