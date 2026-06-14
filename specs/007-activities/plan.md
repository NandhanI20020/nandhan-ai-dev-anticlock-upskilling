# Implementation Plan: Activities

**Branch**: `007-activities` | **Date**: 2026-06-15 | **Spec**: [spec.md](spec.md)

---

## Technical Context

**Tech stack**: React 18 + Vite + Tailwind CSS / Node.js + Express + mock JSON store

**Libraries**: `lucide-react` (type icons), `@tanstack/react-query`, `zustand`

**Key data types**:
```typescript
type ActivityTab = "todo" | "overdue" | "today" | "tomorrow" | "thisWeek" | "done";
type ActivityTypeFilter = "all" | "call" | "meeting" | "task" | "email" | "deadline";

interface ActivityListItem extends Activity {
  dealTitle: string | null;
  personName: string | null;
  orgName: string | null;
}
interface ActivityKPIs {
  completionRate: number;    // 0–100
  avgResponseTimeHours: number;
  urgentCount: number;       // overdue count
}
```

**Project structure**:
```
frontend/src/
  pages/ActivitiesPage.tsx          ← route /activities; owns tab + type-filter state
  components/activities/
    ActivityKPICards.tsx            ← 3 KPI metric cards
    ActivityTimeTabs.tsx            ← To-do | Overdue | Today | Tomorrow | This Week | Done
    ActivityTypeFilter.tsx          ← pill filter: All | Call | Meeting | Task | Email | Deadline
    ActivityList.tsx                ← list of ActivityRow items
    ActivityRow.tsx                 ← type icon, subject, linked record, date, Mark Done, "..." menu
    ActivityForm.tsx                ← create/edit form modal
    CalendarView.tsx                ← monthly grid with activity dots
    ActivitiesFilterBar.tsx         ← advanced filters drawer
  api/useActivities.ts              ← useQuery(['activities', tab, typeFilter, filters]) + mutations
  store/activitiesStore.ts          ← { activeTab, typeFilter, filters, view: 'list'|'calendar' }
backend/
  routes/activities.ts              ← GET /api/activities (tab + type + filter params), PATCH/:id, POST, DELETE/:id
  data/activities.json              ← 40+ activities (already exists; extend if needed)
shared/types/activity.ts            ← ActivityListItem, ActivityKPIs, ActivityTab types
```

**API summary**:
- `GET /api/activities` — filter by `tab` (overdue/today/tomorrow/thisWeek/todo/done), `type`, `dealId`, `personId`, `orgId`; join dealTitle, personName, orgName; return `{ activities: ActivityListItem[], kpis: ActivityKPIs }`
- `POST /api/activities` — create; type + subject required
- `PATCH /api/activities/:id` — update fields
- `PATCH /api/activities/:id/done` — set `done=true`, `doneAt=now`
- `DELETE /api/activities/:id` — delete

**Key decisions**:
- KPIs are computed server-side in the `GET /api/activities` response (avoids a second round-trip)
- Tab filtering done server-side: backend computes which tab each activity belongs to using dueDate + done + now
- Calendar view is a simple custom grid (`CalendarView`) — no third-party calendar library (not in approved stack)
- `ActivityTypeFilter` tab uses the same filter pill pattern as the kanban's filter bar

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| Spec-First | ✓ | spec.md approved |
| Mock-Data Simplicity | ✓ | activities.json flat array; tab logic in Express handler |
| Type Safety | ✓ | `ActivityTab` union type; `ActivityListItem` with joined fields |
| Component Sovereignty | ✓ | Fetch only in `useActivities` |
| Tailwind Only | ✓ | Calendar grid via CSS grid; no external calendar lib |

---

## Complexity Notes

- **Calendar view**: A minimal monthly grid built with CSS Grid (7 columns). Each cell is a day; activities render as small colored chips. No external dependency.
- **Tab counts**: `GET /api/activities` returns `tabCounts: Record<ActivityTab, number>` alongside the filtered list so all tab badges stay accurate.
- **Dependencies**: Activities data shared with features 001–006. This feature owns the canonical CRUD for activities; earlier features' POST endpoints delegate to the same in-memory store.
- **Estimated phases**: 7 phases for 8 user stories.
