# Pipedrive SpecKit CRM — Constitution

## Core Principles

### I. Spec-First
Every feature starts with a spec in `specs/NNN-feature/spec.md`. No code is written without an approved spec, plan, and task list. The spec is the source of truth — not the code.

### II. Mock-Data Simplicity
The backend uses an in-memory JSON mock store (no database). All mock data lives in `backend/data/*.json`. Write data is in-memory only; server restart resets state. Do not introduce a database, ORM, or migration system.

### III. Type Safety Everywhere
TypeScript is mandatory in both `frontend/` and `backend/`. No `any` types. Shared types live in `shared/types/`. Import types explicitly — never infer across layers.

### IV. Component Sovereignty
Each UI component owns its own file. Components do not contain data-fetching logic — that belongs in React Query hooks under `frontend/src/api/`. Components receive data via props or hooks; they do not call `fetch()` directly.

### V. Tailwind Only
All styling is done with Tailwind CSS utility classes. No inline styles, no CSS modules, no styled-components. If a visual pattern repeats more than 3 times, extract it as a Tailwind component class in `frontend/src/styles/components.css`.

---

## Additional Constraints

- **No auth**: Single-user app, no login, no sessions, no JWT.
- **No database**: Mock JSON store only. Flag any dependency that requires a DB and propose a mock alternative.
- **No comments explaining what**: Only comment non-obvious WHY (hidden constraint, workaround, invariant).
- **No backwards-compat shims**: Delete unused code; don't rename to `_old` or leave `// removed` comments.
- **React Query for all data**: Use `useQuery` / `useMutation` hooks from `@tanstack/react-query`. No raw `fetch` in components.
- **Port conventions**: Backend runs on `3001`, frontend dev server on `5173`.

---

## Development Workflow

1. Read the feature spec: `specs/NNN-feature/spec.md`
2. Enter Claude Code plan mode; design implementation approach
3. Create TaskCreate items mirroring `specs/NNN-feature/tasks.md`
4. Implement phase by phase; mark tasks `[X]` as completed
5. Run `npm run dev` in both `frontend/` and `backend/` to verify
6. Run Playwright E2E tests: `cd frontend && npx playwright test`
7. Commit with descriptive message referencing the spec

## Governance

- Deviations from this constitution require explicit user approval with a written rationale
- If a library not in the approved stack is needed, flag it and propose it before adding it
- Approved frontend libraries: React 18, React Router v6, Tailwind CSS, `@tanstack/react-query`, Zustand, `@dnd-kit/core`, Recharts, `lucide-react`
- Approved backend libraries: Express, `cors`, `uuid`
- Do not add ESLint plugins, Prettier configs, or test frameworks without user approval
