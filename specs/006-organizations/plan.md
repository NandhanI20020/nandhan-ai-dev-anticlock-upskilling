# Implementation Plan: Organizations

**Branch**: `006-organizations` | **Date**: 2026-06-15 | **Spec**: [spec.md](spec.md)

---

## Technical Context

**Tech stack**: React 18 + Vite + Tailwind CSS / Node.js + Express + mock JSON store

**Libraries**: `lucide-react`, `@tanstack/react-query`, `zustand`

**Key data types**:
```typescript
interface Organization {
  id: string; name: string; address: string | null;
  phone: string | null; website: string | null;
  ownerId: string; labelIds: string[];
  createdAt: string; updatedAt: string;
}
interface OrgListItem extends Organization {
  peopleCount: number;
  personAvatars: { id: string; name: string; initials: string; color: string }[];
  openDealCount: number; wonDealCount: number; lostDealCount: number;
  lastActivityDate: string | null; lastActivityRelative: string;
}
```

**Project structure**:
```
frontend/src/
  pages/OrganizationsPage.tsx         ← route /contacts/organizations
  pages/OrgDetailPage.tsx             ← route /contacts/organizations/:id
  components/organizations/
    OrgsTable.tsx                     ← sortable table
    OrgRow.tsx                        ← row with avatar stack, deal count badges
    AvatarStack.tsx                   ← reusable overlapping avatars (up to 3 + count)
    DealCountBadges.tsx               ← open/won/lost deal count chips
    AddOrgModal.tsx                   ← create org form
    OrgInfoPanel.tsx                  ← left panel: inline-editable fields + people + deals
    OrgActivityFeed.tsx               ← right panel: feed + QuickLogBar + NoteComposer
    OrgFilterBar.tsx                  ← quick + advanced filter chips
  api/useOrganizations.ts             ← list query + detail query + mutations
  store/orgsStore.ts                  ← sort, filters, page
backend/
  routes/organizations.ts             ← GET /api/organizations, POST, GET/:id, PATCH/:id
  data/organizations.json             ← 10 orgs seeded
shared/types/organization.ts          ← Organization, OrgListItem interfaces
```

**API summary**:
- `GET /api/organizations` — paginated; joins peopleCount, personAvatars, openDealCount, wonDealCount, lostDealCount, lastActivityDate; supports filter/sort
- `POST /api/organizations` — create; warn on duplicate name (non-blocking: `{ org, warning?: "..." }`)
- `GET /api/organizations/:id` — full org with joined people[], activeDeals[]
- `PATCH /api/organizations/:id` — update fields; set updatedAt
- `GET /api/organizations/:id/feed` — unified FeedItem[] (activities + notes + system events for orgId)
- `POST /api/organizations/:id/activities` — log activity
- `POST /api/organizations/:id/notes` — add note

**Key decisions**:
- `AvatarStack` is a new shared component (goes in `frontend/src/components/shared/`) — will be reused in org list and potentially contacts list
- Reuse `InlineEdit`, `ActivityFeedItem`, `NoteComposer`, `QuickLogBar`, `LabelPicker` from features 002/005 — import directly
- `OrgInfoPanel` mirrors `DealInfoPanel` layout from feature 002; left 45% / right 55% grid consistent across all detail pages
- `OrganizationsPage` lives under the same `/contacts` route as `ContactsPage` — add "Organizations" to the sub-nav tabs

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| Spec-First | ✓ | spec.md approved |
| Mock-Data Simplicity | ✓ | organizations.json flat array; feed aggregated in backend |
| Type Safety | ✓ | `OrgListItem` typed with all joined fields |
| Component Sovereignty | ✓ | Fetch only in `useOrganizations` |
| Tailwind Only | ✓ | Avatar circles via `rounded-full`; deal badges via `bg-green-100 text-green-700` |

---

## Complexity Notes

- **Reuse heavily**: `InlineEdit`, `NoteComposer`, `QuickLogBar`, `ActivityFeedItem`, `LabelPicker`, `PaginationControls` all built already — don't rebuild.
- **AvatarStack** is the only new shared component — render up to 3 overlapping initials circles; if `peopleCount > 3` show "+N" chip.
- **Dependencies**: Needs people.json and deals.json (features 004, 001) seeded first. Feed endpoint mirrors feature 002 pattern.
- **Estimated phases**: 7 phases for 8 user stories.
