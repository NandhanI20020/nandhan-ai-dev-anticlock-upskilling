# Implementation Plan: Person Detail View

**Branch**: `005-person-detail` | **Date**: 2026-06-15 | **Spec**: [spec.md](spec.md)

---

## Technical Context

**Tech stack**: React 18 + Vite + Tailwind CSS / Node.js + Express + mock JSON store

**Libraries**: `lucide-react` (icons), `@tanstack/react-query`, `zustand` (personDetailStore)

**Key data types**:
```typescript
interface PersonDetail {
  id: string; name: string; jobTitle: string | null;
  emails: { value: string; label: string }[];
  phones: { value: string; label: string }[];
  linkedinUrl: string | null; address: string | null;
  orgId: string | null; orgName: string | null;
  ownerId: string; labelIds: string[];
  createdAt: string; updatedAt: string;
}
interface ActiveDeal {
  id: string; title: string; value: string; currency: string;
  stageName: string; nextActivityDate: string | null;
  nextActivityStatus: "on-track" | "overdue" | "stalled";
}
// Feed reuses FeedItem from feature 002 — same discriminated union
```

**Project structure**:
```
frontend/src/
  pages/PersonDetailPage.tsx          ← route /contacts/people/:id
  components/person-detail/
    PersonHeader.tsx                  ← avatar, name, org/title, labels, Edit + Add Deal buttons
    PersonContactPanel.tsx            ← left 45%: emails, phones, LinkedIn, address
    ActiveDealsSection.tsx            ← left panel below contacts: linked open deals
    PersonActivityFeed.tsx            ← right 55%: feed + QuickLogBar + NoteComposer
    PersonEditModal.tsx               ← full edit form (all contact fields)
    LogCallForm.tsx                   ← call-specific log form (subject, duration, outcome, note)
    LabelPicker.tsx                   ← add/remove label tags
  api/usePersonDetail.ts              ← useQuery(['person', id]) + ['person-feed', id] + mutations
  store/personDetailStore.ts          ← { activeLogType, isEditing }
backend/
  routes/people.ts                    ← extend: GET /api/people/:id, PATCH, POST notes/activities
  routes/notes.ts                     ← reuse from feature 002
```

**API summary**:
- `GET /api/people/:id` — full person with joined orgName; includes `activeDeals[]` (joined from deals)
- `PATCH /api/people/:id` — update any contact field
- `GET /api/people/:id/feed` — unified feed: activities + notes + system events for this person
- `POST /api/people/:id/notes` — create note on person
- `POST /api/people/:id/activities` — log activity on person
- Labels: `PATCH /api/people/:id` with updated `labelIds` array

**Key decisions**:
- Two-panel layout mirrors feature 002 (Deal Detail) — reuse the same CSS grid pattern; left 45%, right 55%
- Activity feed reuses `FeedItem` discriminated union and `ActivityFeedItem` component from feature 002 — import directly, don't duplicate
- `InlineEdit` from feature 002 is reused for quick field updates within the edit flow
- "Add Deal" button opens `AddDealModal` from feature 001 with person pre-filled — import component directly
- Call log is a specialised activity form (`type: "call"`) with duration and outcome fields added

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| Spec-First | ✓ | spec.md approved |
| Mock-Data Simplicity | ✓ | Feed built server-side same as feature 002 |
| Type Safety | ✓ | `PersonDetail`, `ActiveDeal` typed; FeedItem reused |
| Component Sovereignty | ✓ | Fetch only in `usePersonDetail` |
| Tailwind Only | ✓ | Overdue deals in `border-l-2 border-orange-400` |

---

## Complexity Notes

- **Reuse opportunities**: `ActivityFeedItem`, `NoteComposer`, `QuickLogForm`, `InlineEdit`, `AddDealModal` all built in earlier features — import, don't rebuild.
- **Dependencies**: Requires 004-contacts (person data), 002-deal-detail (deal data for Active Deals section), 001-pipeline-kanban (AddDealModal).
- **Estimated phases**: 7 phases for 8 user stories.
