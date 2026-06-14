# Pipedrive SpecKit — Spec-Driven Development Learning Project

## Context

This project is a hands-on learning exercise in **Spec-Driven Development (SDD)** using Claude Code's full feature set. We're building a Pipedrive-inspired CRM using React + Tailwind + Node.js (mock data). The workflow deliberately chains together several tools to demonstrate the SDD methodology end-to-end:

```
Playwright (research) → PRD #1 → Google Stitch (UX) → PRD #2 → Spec-Kit (specs) → Claude Code (build)
```

The secondary goal is to experience Claude Code's advanced features in context: MCP servers, hooks, skills, subagents, plan mode, TaskCreate, and the memory system.

---

## Phase 1: Environment Setup

### 1a. Configure Playwright
- ~~`@playwright/mcp` npm package~~ — switched to official Claude plugin
- Install: `claude plugin install playwright@claude-plugins-official` ✅ done (user scope)
- Uses accessibility tree rather than vision model — screenshots still available via tool call
- No separate `settings.json` MCP entry needed; activated at session start

### 1b. Initialize Project Structure
```
pipedrive-speckit/
├── .specify/               ← Spec-Kit templates
│   ├── constitution.md
│   ├── spec-template.md
│   ├── plan-template.md
│   └── tasks-template.md
├── specs/                  ← Generated specs per feature
│   └── 001-pipeline-view/
├── frontend/               ← React + Vite + Tailwind
├── backend/                ← Node.js + Express (mock data)
├── CLAUDE.md               ← Claude Code project context
├── PLAN.md                 ← This file
└── PRDs/
    ├── research-notes.md   ← Playwright Pipedrive research output
    ├── prd-01-ux.md        ← For Google Stitch
    └── prd-02-technical.md ← For Spec-Kit
```

---

## Phase 2: Pipedrive Research via Playwright ✅

Use the Playwright MCP to open `https://level-stamp.pipedrive.com`, pause for manual login, then systematically navigate and screenshot:

| Screen | What to document |
|--------|-----------------|
| Pipeline / Deals (Kanban) | Column layout, card design, drag UX, stage names |
| Deal detail | Sections, timeline, linked contacts/activities |
| People (Contacts) list | Table vs card view, filters, search |
| Person detail | Contact fields, linked deals/orgs/activities |
| Organizations list | Same pattern as people |
| Activities list | Calendar vs list view, types (call/task/meeting) |
| Dashboard / Reports | KPI cards, charts, layout |
| Global nav | Sidebar icons, labels, badges |
| Modals & forms | Add deal/contact form, field types |
| Filter/search UI | Filter panel, chips, search bar |

Output: `PRDs/research-notes.md` with screenshots referenced ✅ (10 screens, `PRDs/screenshots/`)

---

## Phase 3: PRD #1 — UX PRD (for Google Stitch) ✅

**File:** `PRDs/prd-01-ux.md`
**Target:** Google Stitch (stitch.withgoogle.com) — AI design tool that generates UI from text descriptions.

Structure:
1. **App identity** — name, brand colors, tone (professional, clean, data-dense)
2. **User personas** — Sales rep, Sales manager
3. **Information architecture** — sidebar navigation tree
4. **Screen inventory** — one section per screen with:
   - Purpose and layout description
   - Component list (table, kanban column, card, form, etc.)
   - Key interactions and states
5. **Design system** — color palette, typography scale, spacing, iconography
6. **Reusable components** — button variants, input fields, badges, tags, avatars
7. **Responsive behavior** — desktop-first, tablet breakpoint notes

---

## Phase 4: PRD #2 — Technical PRD (input for Spec-Kit)

**File:** `PRDs/prd-02-technical.md`
**Target:** GitHub Spec-Kit `.specify` workflow.

Structure:
1. **Features list** (prioritized backlog):
   - Pipeline / Kanban board
   - Deal CRUD + detail view
   - Contacts (People) CRUD + detail
   - Organizations CRUD
   - Activities (tasks, calls, meetings)
   - Dashboard / Stats
   - Global search
   - Filters per entity

2. **Data models** (for mock data + future DB):
   - `Deal` — id, title, value, stage, ownerId, contactId, orgId, activities[]
   - `Person` — id, name, email, phone, orgId, deals[]
   - `Organization` — id, name, address, contacts[]
   - `Activity` — id, type, subject, dueDate, dealId, personId, done
   - `Pipeline` + `Stage` — ordered stages with deal counts

3. **API endpoints** (Express mock API):
   - `GET/POST /api/deals`, `GET/PUT/DELETE /api/deals/:id`
   - Same pattern for people, organizations, activities
   - `GET /api/pipeline` (Kanban board data)
   - `GET /api/dashboard` (stats)

4. **Tech decisions** — React Query for data fetching, Zustand for UI state, React Router for navigation, Tailwind for styling, no auth (single user), JSON flat-file mock store

---

## Phase 5: Spec-Kit Spec Generation

Using the GitHub Spec-Kit methodology (https://github.com/github/spec-kit):

**5a. Bootstrap `.specify/` directory**
- Write `constitution.md` — foundational project principles and AI coding rules
- Populate spec-template, plan-template, tasks-template

**5b. For each feature, run the SDD cycle:**
```
/speckit.specify  → produces specs/00N-feature/spec.md
/speckit.plan     → produces specs/00N-feature/plan.md
/speckit.tasks    → produces specs/00N-feature/tasks.md
```

**5c. Review and validate** — clarify ambiguities, run `/speckit.analyze` for cross-spec consistency

Output: `specs/` directory with numbered feature specs, each containing: `spec.md`, `plan.md`, `tasks.md`, `api.md`, `data-model.md`

---

## Phase 6: App Implementation (Spec-Driven)

Each feature follows this cycle, showcasing a Claude Code capability:

| Feature | Claude Code Feature Demonstrated |
|---------|----------------------------------|
| Project bootstrap | CLAUDE.md, git init, hooks (pre-commit lint) |
| Backend mock API | Plan mode, TaskCreate for tracking |
| Pipeline / Kanban | Subagents (parallel component build) |
| Deal detail | Memory (persist component patterns) |
| Contacts & Orgs | Custom skill `/generate-mock-data` |
| Activities | Hooks (post-edit → run Playwright test) |
| Dashboard | Subagents (parallel chart + stats) |
| Search & filters | Plan mode + TaskCreate |
| E2E testing | Playwright MCP |

### Implementation order:
1. Backend Express server + mock JSON store + all API routes
2. Frontend shell: routing, sidebar nav, layout
3. Pipeline / Kanban board (most complex — drag-and-drop)
4. Deal detail view
5. Contacts + Organizations (shared patterns)
6. Activities
7. Dashboard
8. Search + filters

---

## Claude Code Learning Objectives (Explicit)

| Concept | When it's used |
|---------|---------------|
| **MCP configuration** | Phase 1: adding Playwright to settings.json |
| **MCP tool usage** | Phase 2: Playwright browsing Pipedrive |
| **Subagents** | Phase 3-4: parallel PRD section drafting; Phase 6: parallel component work |
| **Skills (slash commands)** | Phase 5: /speckit.specify, /speckit.plan; Phase 6: /generate-mock-data |
| **Plan mode** | Phase 6: every non-trivial feature starts here |
| **TaskCreate / TaskUpdate** | Phase 6: tracking spec tasks as work items |
| **Hooks** | Phase 6: pre-commit linting, post-edit test runner |
| **Memory system** | Cross-session persistence of design decisions |
| **CLAUDE.md** | Project-level context baked in from day one |
| **Parallel tool calls** | Throughout: research, file writes, API + frontend together |

---

## Verification Checkpoints

- **Phase 2:** Screenshot gallery in `PRDs/research-notes.md`; all key Pipedrive screens documented
- **Phase 3:** PRD #1 pasted into Google Stitch and generates recognizable CRM UI
- **Phase 4:** PRD #2 reviewed for completeness against data model and feature list
- **Phase 5:** `specs/` contains at least 4 feature specs; `/speckit.analyze` finds no conflicts
- **Phase 6:** `npm run dev` starts the app; Playwright E2E tests pass for each implemented feature

---

## Open Decisions (deferred to execution)

- Google Stitch's exact input format (will refine PRD #1 after first Stitch attempt)
- Playwright MCP package: `@playwright/mcp` vs `@modelcontextprotocol/server-playwright`
- Drag-and-drop library: `@dnd-kit/core` (recommended) vs `react-beautiful-dnd` (unmaintained)
- Chart library: Recharts vs Victory
