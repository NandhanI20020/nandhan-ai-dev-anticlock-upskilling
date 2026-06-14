# PRD #2 — Technical Product Requirements Document

**App**: SalesKit CRM
**Target**: GitHub Spec-Kit `.specify` workflow → feeds `/speckit.specify` per feature
**Date**: 2026-06-15

All technical contracts are defined here. Spec-Kit spec generation and implementation proceed from this document without revisiting architecture decisions.

---

## 1. Product Overview

**SalesKit CRM** — a Pipedrive-inspired, full-featured sales CRM. Single-user (no auth). React 18 frontend, Express backend, in-memory JSON store.

| Concern | Value |
|---------|-------|
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:3001/api` |
| Auth | None — single hardcoded user `"user-1"` |
| Persistence | In-memory; JSON seed files loaded on server start; restart resets data |
| Language | TypeScript throughout (frontend + backend) |

---

## 2. Feature Backlog (Prioritized)

| # | Feature | Priority | Spec Status |
|---|---------|----------|-------------|
| 001 | Pipeline / Kanban board | P1 | [ ] |
| 002 | Deal CRUD + detail view | P1 | [ ] |
| 003 | Contacts (People) list + detail | P1 | [ ] |
| 004 | Organizations list + detail | P1 | [ ] |
| 005 | Activities list + management | P1 | [ ] |
| 006 | Notes (on deals / people / orgs) | P1 | [ ] |
| 007 | Dashboard / Insights | P2 | [ ] |
| 008 | Global search | P2 | [ ] |
| 009 | Per-entity saveable filters | P2 | [ ] |
| 010 | Leads inbox | P2 | [ ] |
| 011 | Products catalog + deal products | P2 | [ ] |
| 012 | Labels / Tags system | P2 | [ ] |
| 013 | Files / Attachments | P3 | [ ] |
| 014 | Deal rotting indicators | P2 | [ ] |
| 015 | Won / Lost flow with reasons | P1 | [ ] |
| 016 | Forecast (timeline) view | P3 | [ ] |
| 017 | Deal archive view | P2 | [ ] |
| 018 | Contacts timeline (cross-entity feed) | P3 | [ ] |
| 019 | Merge duplicates (people / orgs) | P3 | [ ] |
| 020 | Import / Export (CSV) | P3 | [ ] |
| 021 | Settings (pipelines, stages, custom fields, labels, products) | P2 | [ ] |
| 022 | Multiple pipelines support | P3 | [ ] |
| 023 | Bulk actions on lists | P2 | [ ] |
| 024 | Followers + Participants on deals | P3 | [ ] |
| 025 | Goals tracking (Insights) | P3 | [ ] |

---

## 3. Data Models

All IDs: `string` (UUID v4 via `crypto.randomUUID()`).
All timestamps: ISO 8601 strings (`"2026-06-15T10:30:00.000Z"`).
Dates (no time): `"YYYY-MM-DD"`.
Defined in `frontend/src/types/` and `backend/types/` (shared contract).

---

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  initials: string;         // "NV"
  avatarColor: string;      // "#6F6EE8" — bg for initials avatar
  timezone: string;         // "Asia/Kolkata"
  currency: string;         // "INR"
  createdAt: string;
}
```
Single user: `{ id: "user-1", name: "Nandhan Venkadesh", initials: "NV", avatarColor: "#6F6EE8", currency: "INR", timezone: "Asia/Kolkata" }`

---

### Pipeline + Stage
```typescript
interface Pipeline {
  id: string;
  name: string;
  stageIds: string[];   // ordered array of stage IDs
  createdAt: string;
}

interface Stage {
  id: string;
  name: string;
  order: number;            // 0-indexed
  pipelineId: string;
  rottingDays: number | null; // null = no rotting threshold
}
```

**Default pipeline** (id: `"pipeline-1"`, name: `"Sales pipeline"`):

| order | id | name |
|-------|----|------|
| 0 | `"stage-1"` | Qualified |
| 1 | `"stage-2"` | Demo Scheduled |
| 2 | `"stage-3"` | Demo Completed |
| 3 | `"stage-4"` | Proposal Made |
| 4 | `"stage-5"` | Negotiations |
| 5 | `"stage-6"` | Contract Signed |

---

### Deal
```typescript
interface Deal {
  id: string;
  title: string;
  value: number;
  currency: string;                 // "INR"
  stageId: string;
  pipelineId: string;
  ownerId: string;
  personId: string | null;
  orgId: string | null;
  participantIds: string[];         // additional person IDs on this deal
  followerIds: string[];            // user IDs following this deal
  status: 'open' | 'won' | 'lost';
  expectedCloseDate: string | null; // "YYYY-MM-DD"
  wonTime: string | null;
  lostTime: string | null;
  lostReason: string | null;
  source: DealSource | null;
  labelIds: string[];
  productIds: string[];             // IDs of DealProduct entries (not Product)
  lastActivityDate: string | null;  // ISO date of most recent activity
  nextActivityDate: string | null;
  nextActivityType: ActivityType | null;
  createdAt: string;
  updatedAt: string;
}

type DealSource = 'website' | 'referral' | 'cold-call' | 'email' | 'trade-show' | 'social' | 'other';

// Stage time log entry — stored in activities-adjacent table
interface StageTimeEntry {
  id: string;
  dealId: string;
  stageId: string;
  enteredAt: string;
  exitedAt: string | null;
}

// Computed field (not stored) — added to detail responses
interface DealDetail extends Deal {
  person: Person | null;
  org: Organization | null;
  participants: Person[];
  activities: Activity[];
  notes: Note[];
  products: DealProduct[];
  stageTimeLogs: (StageTimeEntry & { daysInStage: number })[];
  isRotten: boolean;         // computed: lastActivityDate > stage.rottingDays
  ageInDays: number;         // computed: today - createdAt
}
```

---

### Person (Contact)
```typescript
interface EmailEntry {
  value: string;
  type: 'work' | 'home' | 'other';
  primary: boolean;
}

interface PhoneEntry {
  value: string;
  type: 'work' | 'home' | 'mobile' | 'other';
  primary: boolean;
}

interface Person {
  id: string;
  name: string;
  emails: EmailEntry[];
  phones: PhoneEntry[];
  orgId: string | null;
  ownerId: string;
  labelIds: string[];
  linkedinUrl: string | null;
  jobTitle: string | null;
  source: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PersonDetail extends Person {
  org: Organization | null;
  deals: Deal[];
  activities: Activity[];
  notes: Note[];
  openDealsCount: number;
  wonDealsCount: number;
}
```

---

### Organization
```typescript
interface Organization {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  linkedinUrl: string | null;
  ownerId: string;
  labelIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface OrgDetail extends Organization {
  people: Person[];
  deals: Deal[];
  activities: Activity[];
  notes: Note[];
  openDealsCount: number;
  wonDealsValue: number;
}
```

---

### Activity
```typescript
type ActivityType = 'call' | 'meeting' | 'task' | 'email' | 'deadline';
type ActivityPriority = 'low' | 'normal' | 'high';

interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  dueDate: string;           // "YYYY-MM-DD"
  dueTime: string | null;    // "HH:MM" 24h
  dealId: string | null;
  personId: string | null;
  orgId: string | null;
  ownerId: string;
  done: boolean;
  doneAt: string | null;
  priority: ActivityPriority;
  note: string | null;
  duration: number | null;   // minutes, for calls/meetings
  outcome: string | null;    // call/meeting outcome text
  createdAt: string;
  updatedAt: string;
}

// Computed (added in list/detail responses)
interface ActivityWithMeta extends Activity {
  isOverdue: boolean;        // !done && dueDate < today
  deal: Pick<Deal, 'id' | 'title'> | null;
  person: Pick<Person, 'id' | 'name'> | null;
  org: Pick<Organization, 'id' | 'name'> | null;
}
```

---

### Note
```typescript
interface Note {
  id: string;
  content: string;           // plain text, max 15000 chars
  dealId: string | null;
  personId: string | null;
  orgId: string | null;
  ownerId: string;
  pinnedAt: string | null;   // ISO datetime if pinned
  createdAt: string;
  updatedAt: string;
}
```

---

### Lead
```typescript
interface Lead {
  id: string;
  title: string;
  personId: string | null;
  orgId: string | null;
  ownerId: string;
  value: number | null;
  currency: string;
  labelIds: string[];
  source: DealSource | null;
  archived: boolean;
  convertedToDealId: string | null;
  createdAt: string;
  updatedAt: string;
}
```

---

### Product
```typescript
interface Product {
  id: string;
  name: string;
  code: string | null;
  unitPrice: number;
  description: string | null;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

interface DealProduct {
  id: string;
  dealId: string;
  productId: string;
  productName: string;       // snapshot at time of adding
  quantity: number;
  unitPrice: number;         // can differ from catalog price
  discount: number;          // percentage 0–100
  total: number;             // computed: quantity * unitPrice * (1 - discount/100)
  currency: string;
  addedAt: string;
}
```

---

### Label
```typescript
interface Label {
  id: string;
  name: string;
  color: string;             // hex color e.g. "#16A34A"
  entityTypes: ('deal' | 'person' | 'org' | 'lead')[]; // which entities can use this label
  createdAt: string;
}
```

---

### File / Attachment
```typescript
interface FileAttachment {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  url: string;               // for mock: just a path string
  dealId: string | null;
  personId: string | null;
  orgId: string | null;
  uploadedBy: string;        // userId
  createdAt: string;
}
```

---

### Custom Field Definition
```typescript
type CustomFieldType = 'text' | 'number' | 'date' | 'dropdown' | 'multi-select' | 'checkbox' | 'url' | 'phone' | 'email';

interface CustomFieldDef {
  id: string;
  name: string;
  type: CustomFieldType;
  entityType: 'deal' | 'person' | 'org' | 'activity';
  options: string[] | null;  // for dropdown/multi-select
  required: boolean;
  order: number;
  createdAt: string;
}

// Values stored per entity
interface CustomFieldValue {
  id: string;
  fieldDefId: string;
  entityId: string;
  entityType: 'deal' | 'person' | 'org' | 'activity';
  value: string | null;      // all serialized as string; frontend parses per type
}
```

---

### Filter View (Saved Filter)
```typescript
interface SavedFilterView {
  id: string;
  name: string;
  entityType: 'deal' | 'person' | 'org' | 'activity' | 'lead';
  conditions: FilterCondition[];
  ownerId: string;
  createdAt: string;
}

interface FilterCondition {
  field: string;             // e.g. "status", "ownerId", "labelIds", "value"
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in' | 'not_in' | 'is_null' | 'is_not_null';
  value: string | string[] | number | null;
}
```

---

### Dashboard + Stats
```typescript
interface DashboardStats {
  openDealsCount: number;
  openDealsValue: number;
  wonDealsThisMonthCount: number;
  wonDealsThisMonthValue: number;
  lostDealsThisMonthCount: number;
  winRate: number;                    // percentage
  activitiesDueToday: number;
  activitiesOverdueCount: number;
  avgDealAgeDays: number;
  avgDaysToClose: number;             // for won deals
  dealsByStage: {
    stageId: string;
    stageName: string;
    count: number;
    value: number;
    rottenCount: number;
  }[];
  activityCompletionByDay: {         // last 7 days
    date: string;
    done: number;
    total: number;
  }[];
  wonVsLostByMonth: {                // last 6 months
    month: string;                   // "2026-01"
    won: number;
    lost: number;
    wonValue: number;
  }[];
  topOpenDeals: Pick<Deal, 'id' | 'title' | 'value' | 'stageId' | 'expectedCloseDate'>[];
}
```

---

### Search Result
```typescript
interface SearchResult {
  query: string;
  deals: Pick<Deal, 'id' | 'title' | 'value' | 'status' | 'stageId'>[];
  people: Pick<Person, 'id' | 'name' | 'emails' | 'orgId'>[];
  organizations: Pick<Organization, 'id' | 'name' | 'address'>[];
  activities: Pick<Activity, 'id' | 'type' | 'subject' | 'dueDate' | 'done'>[];
  notes: Pick<Note, 'id' | 'content' | 'dealId' | 'personId' | 'orgId'>[];
  totalCount: number;
}
```

---

## 4. API Endpoints

All responses: JSON. All errors: `{ error: string, code?: string }` + HTTP status. Partial updates via PUT (PATCH semantics — omitted fields are unchanged).

### Users
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/me` | Current user (always user-1) |
| PUT | `/api/users/me` | Update profile (name, timezone, currency, avatarColor) |

### Pipelines & Stages
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/pipelines` | List all pipelines with stages |
| GET | `/api/pipelines/:id` | Single pipeline + stages |
| POST | `/api/pipelines` | Create pipeline |
| PUT | `/api/pipelines/:id` | Rename pipeline |
| DELETE | `/api/pipelines/:id` | Delete (reject if has deals) |
| GET | `/api/pipelines/:id/board` | Kanban board: pipeline + stages + deals per stage (with count + totalValue per stage) |
| POST | `/api/pipelines/:id/stages` | Add stage to pipeline |
| PUT | `/api/stages/:id` | Update stage (name, order, rottingDays) |
| DELETE | `/api/stages/:id` | Delete stage (reject if has deals) |
| PUT | `/api/pipelines/:id/stages/reorder` | Reorder stages: `{ stageIds: string[] }` |

### Deals
| Method | Path | Query params | Description |
|--------|------|-------------|-------------|
| GET | `/api/deals` | `stageId`, `pipelineId`, `status`, `ownerId`, `personId`, `orgId`, `labelId`, `search`, `rotten`, `sort`, `order`, `page`, `limit` | Paginated deal list. `rotten=true` returns only rotten deals. |
| GET | `/api/deals/:id` | — | DealDetail with joined person, org, participants, activities, notes, products, stageTimeLogs, isRotten, ageInDays |
| POST | `/api/deals` | — | Create deal. Generates id, createdAt, updatedAt. Creates initial StageTimeEntry. |
| PUT | `/api/deals/:id` | — | Update deal fields. If `stageId` changes: closes current StageTimeEntry, creates new one, updates lastActivityDate. |
| DELETE | `/api/deals/:id` | — | Delete deal + all linked stageTimeLogs |
| PUT | `/api/deals/:id/won` | — | Body: `{ wonTime?, note? }`. Sets status=won, wonTime, creates activity log entry. |
| PUT | `/api/deals/:id/lost` | — | Body: `{ lostReason, lostTime?, note? }`. Sets status=lost, lostReason, lostTime. |
| PUT | `/api/deals/:id/reopen` | — | Re-opens a won/lost deal. Sets status=open, clears wonTime/lostTime/lostReason. |
| POST | `/api/deals/:id/participants` | — | Add participant: `{ personId }` |
| DELETE | `/api/deals/:id/participants/:personId` | — | Remove participant |
| POST | `/api/deals/:id/followers` | — | Add follower: `{ userId }` |
| DELETE | `/api/deals/:id/followers/:userId` | — | Remove follower |
| GET | `/api/deals/:id/stage-log` | — | Full stageTimeLog for a deal |
| POST | `/api/deals/bulk` | — | Bulk update: `{ ids: string[], update: Partial<Deal> }`. Supported fields: stageId, ownerId, status. |
| DELETE | `/api/deals/bulk` | — | Bulk delete: `{ ids: string[] }` |

### People
| Method | Path | Query params | Description |
|--------|------|-------------|-------------|
| GET | `/api/people` | `orgId`, `ownerId`, `labelId`, `search`, `sort`, `order`, `page`, `limit` | Paginated people list |
| GET | `/api/people/:id` | — | PersonDetail with org, deals, activities, notes, openDealsCount, wonDealsCount |
| POST | `/api/people` | — | Create person |
| PUT | `/api/people/:id` | — | Update person (partial) |
| DELETE | `/api/people/:id` | — | Delete person |
| POST | `/api/people/bulk` | — | Bulk update: `{ ids, update: { ownerId?, labelIds? } }` |
| DELETE | `/api/people/bulk` | — | Bulk delete: `{ ids }` |
| POST | `/api/people/merge` | — | Merge: `{ keepId, mergeId, fieldOverrides }`. Moves linked deals/activities/notes to keepId, deletes mergeId. |

### Organizations
| Method | Path | Query params | Description |
|--------|------|-------------|-------------|
| GET | `/api/organizations` | `search`, `ownerId`, `labelId`, `sort`, `order`, `page`, `limit` | Paginated org list |
| GET | `/api/organizations/:id` | — | OrgDetail with people, deals, activities, notes |
| POST | `/api/organizations` | — | Create org |
| PUT | `/api/organizations/:id` | — | Update org (partial) |
| DELETE | `/api/organizations/:id` | — | Delete org |
| POST | `/api/organizations/bulk` | — | Bulk update |
| DELETE | `/api/organizations/bulk` | — | Bulk delete |
| POST | `/api/organizations/merge` | — | Merge orgs (same as people merge) |

### Activities
| Method | Path | Query params | Description |
|--------|------|-------------|-------------|
| GET | `/api/activities` | `done`, `type`, `ownerId`, `dealId`, `personId`, `orgId`, `period` (`today`/`overdue`/`this-week`/`next-week`), `startDate`, `endDate`, `sort`, `page`, `limit` | Paginated activity list with joined deal/person/org names |
| GET | `/api/activities/:id` | — | Single ActivityWithMeta |
| POST | `/api/activities` | — | Create activity. Updates `nextActivityDate`/`nextActivityType` on linked deal. |
| PUT | `/api/activities/:id` | — | Update activity. `done=true` requires `doneAt`. Updates linked deal's `lastActivityDate`. |
| DELETE | `/api/activities/:id` | — | Delete activity. Recomputes linked deal's nextActivityDate. |
| PUT | `/api/activities/bulk/done` | — | Bulk mark done: `{ ids: string[] }` |

### Notes
| Method | Path | Query params | Description |
|--------|------|-------------|-------------|
| GET | `/api/notes` | `dealId`, `personId`, `orgId`, `page`, `limit` | List notes for an entity |
| POST | `/api/notes` | — | Create note. Updates linked deal's lastActivityDate. |
| PUT | `/api/notes/:id` | — | Update content or pin status |
| DELETE | `/api/notes/:id` | — | Delete note |

### Leads
| Method | Path | Query params | Description |
|--------|------|-------------|-------------|
| GET | `/api/leads` | `archived`, `ownerId`, `labelId`, `search`, `page`, `limit` | List leads |
| GET | `/api/leads/:id` | — | Single lead with joined person, org |
| POST | `/api/leads` | — | Create lead |
| PUT | `/api/leads/:id` | — | Update lead |
| DELETE | `/api/leads/:id` | — | Delete lead |
| POST | `/api/leads/:id/convert` | — | Convert to deal: `{ pipelineId, stageId, title?, value? }`. Creates Deal, sets `convertedToDealId`, archives lead. |

### Products
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products` | List product catalog |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/deals/:id/products` | List products on a deal |
| POST | `/api/deals/:id/products` | Add product to deal: `{ productId, quantity, unitPrice, discount }`. Creates DealProduct. |
| PUT | `/api/deals/:id/products/:dealProductId` | Update deal product (qty, price, discount) |
| DELETE | `/api/deals/:id/products/:dealProductId` | Remove product from deal |

### Labels
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/labels` | List all labels (optionally `?entityType=deal`) |
| POST | `/api/labels` | Create label: `{ name, color, entityTypes }` |
| PUT | `/api/labels/:id` | Update label |
| DELETE | `/api/labels/:id` | Delete label (removes from all entities) |

### Files / Attachments
| Method | Path | Query params | Description |
|--------|------|-------------|-------------|
| GET | `/api/files` | `dealId`, `personId`, `orgId` | List file attachments for an entity |
| POST | `/api/files` | — | Upload file (multipart). Body: `{ dealId?, personId?, orgId?, filename, sizeBytes, mimeType }`. Mock: stores metadata only, no actual binary storage. |
| DELETE | `/api/files/:id` | — | Delete file record |

### Custom Fields
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/custom-fields` | List all field definitions (optionally `?entityType=deal`) |
| POST | `/api/custom-fields` | Create field definition |
| PUT | `/api/custom-fields/:id` | Update field definition (name, options, order) |
| DELETE | `/api/custom-fields/:id` | Delete field definition + all values |
| GET | `/api/custom-fields/values` | Get values: `?entityType=deal&entityId=xxx` |
| PUT | `/api/custom-fields/values` | Upsert values: `{ entityType, entityId, values: { fieldDefId, value }[] }` |

### Saved Filter Views
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/filter-views` | List saved views: `?entityType=deal` |
| POST | `/api/filter-views` | Save filter view: `{ name, entityType, conditions }` |
| PUT | `/api/filter-views/:id` | Update saved view |
| DELETE | `/api/filter-views/:id` | Delete saved view |

### Dashboard
| Method | Path | Query params | Description |
|--------|------|-------------|-------------|
| GET | `/api/dashboard` | `pipelineId`, `ownerId` | Returns DashboardStats (computed at request time) |

### Search
| Method | Path | Query params | Description |
|--------|------|-------------|-------------|
| GET | `/api/search` | `q` (min 2 chars), `entityTypes` (comma-separated, default all), `limit` (per group, default 5) | Returns SearchResult grouped by entity type |

### Import / Export
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/import/preview` | Preview CSV import: `{ entityType, csvData }`. Returns `{ columns, rows: first5, suggestedMapping }` |
| POST | `/api/import/confirm` | Confirm import: `{ entityType, csvData, columnMapping, duplicateHandling }`. Returns `{ created, updated, skipped, errors }` |
| GET | `/api/export/:entityType` | Export entity list as JSON (frontend converts to CSV). Supports same query params as list endpoints. |

---

## 5. Frontend Architecture

### Route Map
```
/                              → redirect → /pipeline

/pipeline                      → PipelinePage
/deals                         → DealsListPage  (list view)
/deals/forecast                → ForecastPage
/deals/archive                 → ArchivePage
/deals/:id                     → DealDetailPage
/leads                         → LeadsPage
/leads/:id                     → LeadDetailPage

/contacts/people               → PeoplePage
/contacts/people/:id           → PersonDetailPage
/contacts/organizations        → OrganizationsPage
/contacts/organizations/:id    → OrgDetailPage
/contacts/timeline             → ContactsTimelinePage
/contacts/merge                → MergeDuplicatesPage

/activities                    → ActivitiesPage

/insights                      → InsightsDashboardPage
/insights/reports              → ReportsPage
/insights/goals                → GoalsPage

/inbox                         → SalesInboxPage
/search                        → SearchResultsPage

/settings                      → redirect → /settings/pipeline
/settings/pipeline             → SettingsPipelinePage
/settings/custom-fields        → SettingsCustomFieldsPage
/settings/labels               → SettingsLabelsPage
/settings/products             → SettingsProductsPage
/settings/import               → SettingsImportPage
/settings/export               → SettingsExportPage
/settings/profile              → SettingsProfilePage
```

### Directory Layout
```
frontend/src/
├── types/
│   ├── deal.ts
│   ├── person.ts
│   ├── organization.ts
│   ├── activity.ts
│   ├── note.ts
│   ├── lead.ts
│   ├── product.ts
│   ├── label.ts
│   ├── pipeline.ts
│   ├── file.ts
│   ├── customField.ts
│   ├── filterView.ts
│   ├── dashboard.ts
│   └── search.ts
│
├── api/                      ← React Query hooks
│   ├── deals.ts
│   ├── people.ts
│   ├── organizations.ts
│   ├── activities.ts
│   ├── notes.ts
│   ├── leads.ts
│   ├── products.ts
│   ├── labels.ts
│   ├── pipeline.ts
│   ├── files.ts
│   ├── customFields.ts
│   ├── filterViews.ts
│   ├── dashboard.ts
│   ├── search.ts
│   └── users.ts
│
├── store/                    ← Zustand (UI state only)
│   ├── kanbanStore.ts        ← dragging state, optimistic column data
│   ├── uiStore.ts            ← modal open/close, search open, sidebar state
│   └── filterStore.ts        ← active filter conditions per entity
│
├── hooks/
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   ├── useSearchParams.ts
│   └── useEntityFilter.ts    ← builds filter params from filterStore
│
├── lib/
│   ├── utils.ts              ← cn(), formatCurrency(), formatDate(), getInitials()
│   ├── constants.ts          ← ACTIVITY_TYPES, DEAL_SOURCES, STAGE_COLORS
│   └── queryClient.ts        ← React Query client config
│
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   ├── ContactsSubNav.tsx
│   │   ├── SettingsSideNav.tsx
│   │   └── TwoColumnLayout.tsx
│   │
│   ├── kanban/
│   │   ├── KanbanBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   └── DealCard.tsx
│   │
│   ├── table/
│   │   ├── DataTable.tsx
│   │   ├── TableColumnCustomizer.tsx
│   │   ├── FilterBar.tsx
│   │   ├── QuickFilterTabs.tsx
│   │   └── BulkActionBar.tsx
│   │
│   ├── detail/
│   │   ├── SummaryPanel.tsx
│   │   ├── CollapsibleSection.tsx
│   │   ├── StageProgressBar.tsx
│   │   ├── ActivityFeed.tsx
│   │   ├── ActivityItem.tsx
│   │   ├── QuickLogBar.tsx
│   │   ├── NoteComposer.tsx
│   │   ├── NoteItem.tsx
│   │   └── FileGrid.tsx
│   │
│   ├── modals/
│   │   ├── AddDealModal.tsx
│   │   ├── AddPersonModal.tsx
│   │   ├── AddActivityModal.tsx
│   │   ├── AddNoteModal.tsx
│   │   ├── WonLostDialog.tsx
│   │   └── ConfirmDialog.tsx
│   │
│   ├── search/
│   │   ├── GlobalSearchBar.tsx
│   │   └── SearchResultsDropdown.tsx
│   │
│   ├── insights/
│   │   ├── StatCard.tsx
│   │   ├── DealsByStageChart.tsx
│   │   ├── WinLossDonut.tsx
│   │   ├── ActivityCompletionChart.tsx
│   │   └── DealVelocityChart.tsx
│   │
│   └── ui/                   ← primitive components
│       ├── Avatar.tsx
│       ├── Badge.tsx
│       ├── LabelTag.tsx
│       ├── StatusBadge.tsx
│       ├── StageBadge.tsx
│       ├── SplitButton.tsx
│       ├── EntityBadge.tsx
│       ├── EntityAutocomplete.tsx
│       ├── TagInput.tsx
│       ├── DatePicker.tsx
│       ├── CurrencyInput.tsx
│       ├── StageSelector.tsx
│       ├── RottenIndicator.tsx
│       ├── DealAgeBadge.tsx
│       └── ViewToggle.tsx
│
└── pages/
    ├── PipelinePage.tsx
    ├── DealsListPage.tsx
    ├── ForecastPage.tsx
    ├── ArchivePage.tsx
    ├── DealDetailPage.tsx
    ├── LeadsPage.tsx
    ├── LeadDetailPage.tsx
    ├── PeoplePage.tsx
    ├── PersonDetailPage.tsx
    ├── OrganizationsPage.tsx
    ├── OrgDetailPage.tsx
    ├── ContactsTimelinePage.tsx
    ├── MergeDuplicatesPage.tsx
    ├── ActivitiesPage.tsx
    ├── InsightsDashboardPage.tsx
    ├── ReportsPage.tsx
    ├── GoalsPage.tsx
    ├── SalesInboxPage.tsx
    ├── SearchResultsPage.tsx
    └── settings/
        ├── SettingsPipelinePage.tsx
        ├── SettingsCustomFieldsPage.tsx
        ├── SettingsLabelsPage.tsx
        ├── SettingsProductsPage.tsx
        ├── SettingsImportPage.tsx
        ├── SettingsExportPage.tsx
        └── SettingsProfilePage.tsx
```

### State Architecture

**React Query** (all server/API data):
- Query key convention: `[entityType]`, `[entityType, id]`, `[entityType, 'list', filters]`
- Stale time: lists 30s, detail views 60s, dashboard 120s
- On create/update/delete: `queryClient.invalidateQueries({ queryKey: [entityType] })`
- Kanban drag: optimistic update via `queryClient.setQueryData` before PUT; rollback on error with `onError`
- `select` transformer used to derive computed fields client-side (isRotten, ageInDays) where not computed server-side

**Zustand** (UI-only state — never server data):
- `kanbanStore`: `{ draggingDealId: string|null, targetStageId: string|null }` — active during drag only
- `uiStore`: `{ addDealModalOpen, addPersonModalOpen, addActivityModalOpen, searchOpen, sidebarExpanded }`
- `filterStore`: `{ [entityType]: FilterCondition[] }` — current active filter conditions per page

---

## 6. Backend Architecture

### Directory Layout
```
backend/
├── index.ts                    ← Express app, CORS, routes mount, error handler
├── types/                      ← same interfaces as frontend (or import from shared)
├── data/                       ← JSON seed files
│   ├── users.json
│   ├── pipelines.json
│   ├── stages.json
│   ├── deals.json
│   ├── stageTimeLogs.json
│   ├── people.json
│   ├── organizations.json
│   ├── activities.json
│   ├── notes.json
│   ├── leads.json
│   ├── products.json
│   ├── dealProducts.json
│   ├── labels.json
│   ├── files.json
│   ├── customFieldDefs.json
│   ├── customFieldValues.json
│   └── filterViews.json
│
├── store/
│   └── db.ts                   ← loads JSON files into typed arrays; exports `db` object + CRUD helpers
│
├── routes/
│   ├── users.ts
│   ├── pipelines.ts
│   ├── stages.ts
│   ├── deals.ts
│   ├── people.ts
│   ├── organizations.ts
│   ├── activities.ts
│   ├── notes.ts
│   ├── leads.ts
│   ├── products.ts
│   ├── labels.ts
│   ├── files.ts
│   ├── customFields.ts
│   ├── filterViews.ts
│   ├── dashboard.ts
│   ├── search.ts
│   └── importExport.ts
│
└── middleware/
    ├── errorHandler.ts         ← catches thrown errors, returns { error } JSON
    ├── cors.ts                 ← allows localhost:5173
    └── validate.ts             ← zod schema validation middleware factory
```

### In-Memory Store (`db.ts`)
```typescript
export const db = {
  users: User[],
  pipelines: Pipeline[],
  stages: Stage[],
  deals: Deal[],
  stageTimeLogs: StageTimeEntry[],
  people: Person[],
  organizations: Organization[],
  activities: Activity[],
  notes: Note[],
  leads: Lead[],
  products: Product[],
  dealProducts: DealProduct[],
  labels: Label[],
  files: FileAttachment[],
  customFieldDefs: CustomFieldDef[],
  customFieldValues: CustomFieldValue[],
  filterViews: SavedFilterView[],
}
```
All route handlers mutate `db.*` arrays in place. Helper functions: `findById`, `findAll`, `create`, `update`, `remove` per entity type.

---

## 7. Mock Data Plan

Seed files in `backend/data/`. No `[Sample]` prefix — use plausible business names.

| File | Count | Content notes |
|------|-------|---------------|
| `users.json` | 1 | Nandhan Venkadesh, user-1 |
| `pipelines.json` | 2 | "Sales pipeline" (primary), "Enterprise pipeline" |
| `stages.json` | 11 | 6 stages for Sales pipeline, 5 for Enterprise pipeline |
| `deals.json` | 25 | 18 open (spread across stages), 5 won, 2 lost. Mix of values ₹5k–₹800k. Some with rotting indicators (old updatedAt). |
| `stageTimeLogs.json` | ~50 | Time logs for each deal transition |
| `people.json` | 20 | Realistic names, mix of work + personal emails/phones. Most linked to orgs. |
| `organizations.json` | 10 | Company names (e.g. "Apex Logistics", "Meridian Financial", "CloudNine Tech"), addresses, websites |
| `activities.json` | 40 | 15 done, 25 pending. Mix of types, overdue + today + upcoming. Linked to deals + people. |
| `notes.json` | 15 | 1–2 per deal, plain text, realistic sales notes |
| `leads.json` | 8 | Mix of archived and active leads |
| `products.json` | 6 | SaaS-style products (e.g. "Starter Plan", "Pro Plan", "Enterprise License") |
| `dealProducts.json` | 12 | Products added to various deals |
| `labels.json` | 8 | e.g. "Hot lead" (red), "Upsell" (green), "At risk" (orange), "Renewal" (blue), "VIP" (purple) |
| `files.json` | 10 | Metadata-only, plausible filenames (proposal.pdf, contract.docx, etc.) |
| `customFieldDefs.json` | 4 | e.g. "Competitor" (text/deal), "LinkedIn" (url/person), "Industry" (dropdown/org) |
| `customFieldValues.json` | ~20 | Values for custom fields across entities |
| `filterViews.json` | 3 | Pre-saved views: "My open deals", "Overdue activities", "Hot leads" |

---

## 8. Tech Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend build | Vite | Fast HMR, native ESM, minimal config |
| CSS | Tailwind CSS v3 | Utility-first, consistent with design tokens, no context switch |
| Routing | React Router v6 (`createBrowserRouter`) | Data loaders, nested routes, type-safe params |
| Server state | @tanstack/react-query v5 | Caching, background refetch, optimistic updates, devtools |
| UI state | Zustand v4 | Minimal boilerplate, no Provider needed |
| Drag-and-drop | @dnd-kit/core + @dnd-kit/sortable | Accessible (ARIA), actively maintained, works with React 18 strict mode |
| Charts | Recharts | React-native, composable, responsive containers, TypeScript types |
| Icons | lucide-react | Clean, consistent, tree-shakeable, ~1000 icons |
| Backend | Express v4 + tsx | Simple, zero-config, TypeScript via tsx (no compile step in dev) |
| Validation | zod | Schema-first, TypeScript-native inference, clean error messages |
| IDs | `crypto.randomUUID()` | Node 18+ built-in, no extra dep |
| CORS | `cors` npm package | Permissive in dev for `localhost:5173` |
| No auth | — | Single-user learning project; hardcode `ownerId: "user-1"` |
| Shared types | Duplicate in `frontend/src/types` + `backend/types` | Simpler than a monorepo shared package for this project |
| No database | In-memory arrays | Restart resets data; acceptable for learning project |
| Rich text (notes) | Plain text only (v1) | Avoid Slate/TipTap complexity; notes are textarea |

---

## 9. Claude Code Features Demonstration Map

| Feature | Claude Code Concept |
|---------|---------------------|
| Project bootstrap + CLAUDE.md | CLAUDE.md project context, git init, hooks wiring |
| Spec generation (Phase 5) | `/speckit.specify`, `/speckit.plan`, `/speckit.tasks` skills |
| Backend scaffold (all routes) | **Plan mode** + TaskCreate for tracking 25+ tasks |
| Pipeline / Kanban board | **Subagents** — KanbanBoard + KanbanColumn + DealCard built in parallel |
| Deal detail view | **Memory** — persists TwoColumnLayout + ActivityFeed patterns cross-session |
| Activities + Notes | **Hooks** — post-edit hook triggers Playwright test for affected routes |
| Contacts + Orgs | **Custom skill** `/generate-mock-data` — produces 20 people + 10 orgs JSON |
| Labels + Products | **TaskCreate** — decomposed into atomic, dependency-ordered tasks |
| Dashboard + Charts | **Subagents** — parallel: StatCard row + DealsByStage chart + WinLoss donut |
| Search | **Plan mode** — cross-entity search needs architecture review before coding |
| Import / Export | **Subagents** — CSV parser (backend) + mapping UI (frontend) built in parallel |
| E2E test suite | **Playwright MCP** — browser-driven tests for each major user flow |
| Settings (stages, labels) | CLAUDE.md conventions ensure consistent pattern implementation |
