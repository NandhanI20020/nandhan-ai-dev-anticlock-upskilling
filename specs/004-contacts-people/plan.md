# Implementation Plan: Contacts — People List

**Branch**: `004-contacts-people` | **Date**: 2026-06-15 | **Spec**: [spec.md](spec.md)

---

## Technical Context

**Tech stack**: React 18 + Vite + Tailwind CSS / Node.js + Express + mock JSON store

**Libraries**: `lucide-react` (icons), `@tanstack/react-query` (data), `zustand` (list UI state)

**Key data types**:
```typescript
interface Person {
  id: string; name: string; jobTitle: string | null;
  emails: { value: string; label: string }[];
  phones: { value: string; label: string }[];
  orgId: string | null; orgName: string | null;
  ownerId: string; labelIds: string[];
  createdAt: string; updatedAt: string;
}
// Last Action status — computed client-side from activities:
// "Overdue" if any open activity past dueDate; "New contact" if createdAt < 7d ago + 0 activities; else "Active"
interface PersonListItem extends Person {
  dealCount: number;           // joined from deals
  lastActivityDate: string | null;
  lastActionStatus: "Active" | "Overdue" | "New contact";  // backend-computed
  lastActionRelativeTime: string;
}
interface PaginatedPeopleResponse { people: PersonListItem[]; total: number; page: number; perPage: number; }
```

**Project structure**:
```
frontend/src/
  pages/ContactsPage.tsx              ← route /contacts/people; sub-nav: People | Orgs | Timeline | Tools
  components/contacts/
    PeopleTable.tsx                   ← sortable table
    PersonRow.tsx                     ← row with avatar, name, org, email, deals, last action badge
    LastActionBadge.tsx               ← Active (green) | Overdue (orange) | New contact (grey)
    AddPersonModal.tsx                ← create person form
    PeopleFilterBar.tsx               ← quick filters + advanced filter chips
    MergeDuplicatesView.tsx           ← side-by-side compare and merge UI
  api/usePeople.ts                    ← useQuery + mutations
  store/contactsStore.ts              ← sort, filters, selectedIds, page
backend/
  routes/people.ts                    ← GET/POST/PATCH/DELETE /api/people; GET /api/people/merge
  data/people.json                    ← 20 people seeded
  data/labels.json                    ← shared label definitions
shared/types/person.ts                ← Person, PersonListItem, PaginatedPeopleResponse
```

**API summary**:
- `GET /api/people` — paginated, filterable (owner, label, org, dealCount, lastActivityDate), sortable; joins orgName, dealCount, lastActionStatus
- `POST /api/people` — create; validate duplicate email
- `PATCH /api/people/:id` — update fields
- `DELETE /api/people/:id` — delete single
- `PATCH /api/people/bulk` — bulk delete / assign owner / add label
- `POST /api/people/merge` — body `{ keepId, mergeId }` → consolidates deals, activities, notes onto keepId; deletes mergeId

**Key decisions**:
- Last Action status computed server-side (backend joins activities to compute status per person) — avoids sending all activity records to client
- Duplicate email validation on POST: if email already exists, return `409 { error: "Email already exists", conflictId: "person-xxx" }`
- Merge: backend consolidates all FK references (deals.personId, activities.personId, notes.personId) then deletes the duplicate
- CSV export: same pattern as feature 003 — `?all=true` param + client-side blob download
- `PaginationControls` and `BulkActionBar` reused from `shared/` (built in feature 003)

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| Spec-First | ✓ | spec.md approved |
| Mock-Data Simplicity | ✓ | Flat JSON; merge is in-memory FK reassignment |
| Type Safety | ✓ | `PersonListItem` typed; no `any` |
| Component Sovereignty | ✓ | Fetch only in `usePeople`; components receive props |
| Tailwind Only | ✓ | Status badge colors via Tailwind; no inline styles |

---

## Complexity Notes

- **Risk**: Merge requires updating FK references across multiple JSON arrays (deals, activities, notes) atomically in memory — do in a single route handler with careful ordering.
- **Dependencies**: `PaginationControls` (003), `BulkActionBar` (003), `Label` seed data. Links from PersonRow navigate to `005-person-detail` (`/contacts/people/:id`).
- **Estimated phases**: 7 phases for 8 user stories.
