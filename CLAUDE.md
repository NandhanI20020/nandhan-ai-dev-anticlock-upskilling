# Pipedrive SpecKit — Claude Code Project Context

## What this project is

A Pipedrive-inspired CRM app built as a **Spec-Driven Development (SDD) learning project**. Every feature starts from a spec in `specs/`, not from ad-hoc conversation. Read `PLAN.md` for the full phased plan.

## Tech stack

- **Frontend:** React 18 + Vite + Tailwind CSS + React Router v6 (`frontend/`)
- **Backend:** Node.js + Express — mock JSON flat-file store, no database (`backend/`)
- **State:** React Query for server state, Zustand for UI state
- **Testing:** Playwright E2E (`frontend/tests/`)
- **Specs:** GitHub Spec-Kit format (`.specify/` templates, `specs/` feature artifacts)

## Directory layout

```
.specify/           ← Spec-Kit governance templates (read before writing specs)
specs/00N-name/     ← Per-feature: spec.md, plan.md, tasks.md, api.md, data-model.md
PRDs/               ← Research notes + PRD #1 (UX) + PRD #2 (Technical)
frontend/src/
  components/       ← Shared UI components
  pages/            ← Route-level page components
  hooks/            ← Custom React hooks
  store/            ← Zustand stores
  api/              ← React Query hooks wrapping fetch calls
backend/
  routes/           ← Express route handlers
  data/             ← JSON mock data files
  middleware/       ← Express middleware
```

## Coding conventions

- TypeScript throughout (frontend and backend)
- Tailwind only — no inline styles, no CSS modules
- One component per file; filename matches component name
- React Query for all data fetching — no raw fetch() in components
- No `any` types; prefer explicit interfaces in `types/` shared folder
- No comments explaining what code does; only comment non-obvious WHY

## How to work on a feature

1. Read the spec: `specs/00N-feature/spec.md`
2. Enter plan mode and design the implementation
3. Create tasks via TaskCreate mirroring `specs/00N-feature/tasks.md`
4. Implement; mark tasks complete as you go
5. Run Playwright test: `cd frontend && npx playwright test`

## Mock data location

`backend/data/*.json` — flat JSON arrays, treated as the in-memory store. The Express server reads these on startup and holds them in memory; writes are in-memory only (restart resets data).

## Running the project

```bash
# Backend (port 3001)
cd backend && npm run dev

# Frontend (port 5173)
cd frontend && npm run dev
```

## Claude Code features in use

- **Playwright** — browser automation for Pipedrive research + E2E tests
- **Hooks** — `.claude/settings.json` pre-commit runs ESLint; post-edit runs affected tests
- **Skills** — `/generate-mock-data` creates realistic JSON fixtures; `/speckit.specify` generates spec files
- **Memory** — design decisions and component patterns persisted across sessions
- **Subagents** — parallel component development for complex features
