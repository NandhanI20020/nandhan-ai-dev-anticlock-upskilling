# PRD #2 — Technical Product Requirements Document

**Target**: GitHub Spec-Kit `.specify` workflow → feeds `/speckit.specify` for each feature

*Populated in Phase 4. This document provides the input for spec generation.*

---

## 1. Product Overview

SalesKit CRM — a Pipedrive-inspired sales pipeline management tool. Single-user (no auth). React frontend, Express backend with mock JSON data.

**URL**: `http://localhost:5173` (frontend dev server)
**API**: `http://localhost:3001` (backend)

---

## 2. Feature Backlog (Prioritized)

| # | Feature | Priority | Spec Status |
|---|---------|----------|-------------|
| 001 | Pipeline / Kanban board | P1 | [ ] |
| 002 | Deal CRUD + detail view | P1 | [ ] |
| 003 | Contacts (People) list + detail | P2 | [ ] |
| 004 | Organizations list + detail | P2 | [ ] |
| 005 | Activities list + management | P2 | [ ] |
| 006 | Dashboard / Stats | P3 | [ ] |
| 007 | Global search | P3 | [ ] |
| 008 | Per-entity filters | P3 | [ ] |

---

## 3. Data Models

### Deal
```typescript
interface Deal {
  id: string;
  title: string;
  value: number;
  currency: string;       // 'USD'
  stageId: string;
  pipelineId: string;
  ownerId: string;
  personId: string | null;
  orgId: string | null;
  status: 'open' | 'won' | 'lost';
  expectedCloseDate: string | null;  // ISO date
  createdAt: string;
  updatedAt: string;
}
```

### Person (Contact)
```typescript
interface Person {
  id: string;
  name: string;
  email: string[];
  phone: string[];
  orgId: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
```

### Organization
```typescript
interface Organization {
  id: string;
  name: string;
  address: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
```

### Activity
```typescript
interface Activity {
  id: string;
  type: 'call' | 'meeting' | 'task' | 'email' | 'deadline';
  subject: string;
  dueDate: string;        // ISO date
  dueTime: string | null; // 'HH:MM'
  dealId: string | null;
  personId: string | null;
  orgId: string | null;
  ownerId: string;
  done: boolean;
  note: string | null;
  createdAt: string;
}
```

### Pipeline + Stage
```typescript
interface Pipeline {
  id: string;
  name: string;
  stages: Stage[];
}

interface Stage {
  id: string;
  name: string;
  order: number;
  pipelineId: string;
}
```

### User (owner reference)
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatarColor: string;   // hex color for initials avatar
}
```

---

## 4. API Endpoints

### Deals
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/deals | List all deals (supports ?stageId, ?status, ?ownerId query params) |
| GET | /api/deals/:id | Get single deal with linked person, org, activities |
| POST | /api/deals | Create deal |
| PUT | /api/deals/:id | Update deal (including stageId for kanban drag) |
| DELETE | /api/deals/:id | Delete deal |

### People
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/people | List people (supports ?orgId, ?search) |
| GET | /api/people/:id | Get person with linked deals, org, activities |
| POST | /api/people | Create person |
| PUT | /api/people/:id | Update person |
| DELETE | /api/people/:id | Delete person |

### Organizations
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/organizations | List orgs (supports ?search) |
| GET | /api/organizations/:id | Get org with linked people, deals |
| POST | /api/organizations | Create org |
| PUT | /api/organizations/:id | Update org |
| DELETE | /api/organizations/:id | Delete org |

### Activities
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/activities | List activities (supports ?done, ?dealId, ?personId, ?dueDate) |
| GET | /api/activities/:id | Get single activity |
| POST | /api/activities | Create activity |
| PUT | /api/activities/:id | Update activity (including marking done) |
| DELETE | /api/activities/:id | Delete activity |

### Pipeline / Kanban
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/pipeline | Get pipeline with stages and deals grouped by stage |
| GET | /api/pipelines | List all pipelines |

### Dashboard
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/dashboard | Aggregated stats: open deals count/value, won/lost this month, activities due today |

### Search
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/search?q=... | Search across deals, people, orgs; returns grouped results |

### Users
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/users | List users (for owner dropdowns) |

---

## 5. Tech Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Frontend build | Vite | Fast HMR, minimal config |
| CSS | Tailwind CSS | Utility-first, no context switching |
| Routing | React Router v6 | Industry standard, data loaders |
| Server state | @tanstack/react-query | Caching, loading/error states, mutations |
| UI state | Zustand | Lightweight, no boilerplate |
| Drag-and-drop | @dnd-kit/core | Actively maintained, accessible |
| Charts | Recharts | React-native, composable |
| Icons | lucide-react | Clean, consistent, tree-shakeable |
| Backend | Express | Simple, no config, mock-friendly |
| Data persistence | In-memory JSON | No DB needed for learning project |
| Validation | zod (backend) | Schema-first, TypeScript-native |

---

## 6. Mock Data Plan

Seed data in `backend/data/`:
- `users.json` — 3 users (owner references)
- `pipelines.json` — 1 pipeline with 5 stages: Lead, Qualified, Proposal, Negotiation, Closed Won
- `deals.json` — 20 deals spread across stages
- `people.json` — 15 contacts
- `organizations.json` — 8 organizations
- `activities.json` — 30 activities (mix of done/pending, all types)

---

## 7. Claude Code Features Demonstration Map

| Feature Module | Claude Code Concept |
|----------------|---------------------|
| Project bootstrap | CLAUDE.md, git hooks |
| Spec generation | `/speckit.specify` skill |
| Backend scaffold | Plan mode + TaskCreate |
| Pipeline/Kanban | Subagents (parallel component build) |
| Deal detail | Memory (component pattern persistence) |
| Contacts + Orgs | Custom skill `/generate-mock-data` |
| Activities | Hooks (post-edit Playwright test) |
| Dashboard | Subagents (parallel chart + stats work) |
| E2E tests | Playwright MCP |
