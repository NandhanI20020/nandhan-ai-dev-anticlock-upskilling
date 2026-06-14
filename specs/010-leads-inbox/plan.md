# Implementation Plan: Leads Inbox

**Branch**: `010-leads-inbox` | **Date**: 2026-06-15 | **Spec**: [spec.md](spec.md)

---

## Technical Context

**Tech stack**: React 18 + Vite + Tailwind CSS / Node.js + Express + mock JSON store

**Libraries**: `recharts` (source distribution chart), `lucide-react`, `@tanstack/react-query`, `zustand`

**Key data types**:
```typescript
type IntentScore = "high" | "medium" | "low";
type LeadStatus = "incoming" | "contacted" | "converted" | "disqualified";
interface Lead {
  id: string; name: string; source: string; intentScore: IntentScore;
  estimatedValue: number; status: LeadStatus;
  personId: string | null; orgId: string | null; ownerId: string; createdAt: string;
}
interface LeadKPIs { incomingCount: number; estimatedValueSum: number; responseRate: number; }
interface LeadConvertRequest { leadId: string; dealTitle: string; value: number; pipelineId: string; stageId: string; personId?: string; orgId?: string; }
```

**Project structure**:
```
frontend/src/
  pages/LeadsPage.tsx               ← route /leads
  components/leads/
    LeadKPICards.tsx                ← 4 KPI tiles (reuses KPITile from feature 008)
    LeadStatusTabs.tsx              ← All | Incoming | Contacted | Converted | Disqualified
    LeadsTable.tsx                  ← sortable table
    LeadRow.tsx                     ← row with intent badge, Convert button
    IntentScoreBadge.tsx            ← High/Medium/Low colored badge
    ConvertLeadModal.tsx            ← pre-filled deal creation form
    LeadSourceChart.tsx             ← recharts BarChart or PieChart by source
    PriorityFocusPanel.tsx          ← top 5 uncontacted leads sidebar
    LeadsFilterBar.tsx              ← source filter chip + active filters
  api/useLeads.ts                   ← useQuery + useConvertLead mutation
  store/leadsStore.ts               ← { activeTab, sortField, sortDir, filters }
backend/
  routes/leads.ts                   ← GET /api/leads, PATCH /api/leads/:id, POST /api/leads/:id/convert
  data/leads.json                   ← 15 seeded leads with varied intentScore, source, status
shared/types/lead.ts                ← Lead, LeadKPIs, LeadConvertRequest
```

**API summary**:
- `GET /api/leads?status=&sort=&sortDir=&source=` — returns `{ leads: Lead[], kpis: LeadKPIs, sourceDistribution: { source, count }[] }`
- `PATCH /api/leads/:id` — update status or fields
- `POST /api/leads/:id/convert` — body: `LeadConvertRequest`; creates Deal; sets `lead.status = "converted"`; returns `{ lead, deal }`

**Key decisions**:
- Reuse `KPITile` from feature 008 for the 4 lead KPI tiles
- Reuse `PaginationControls` from feature 003
- `ConvertLeadModal` uses `AddDealModal` as a base but pre-fills title + value from the lead — refactor `AddDealModal` to accept optional `initialValues` prop
- Source distribution chart is a simple recharts `BarChart` (horizontal) or `PieChart` — choose bar for readability with many source names

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| Spec-First | ✓ | spec.md approved |
| Mock-Data Simplicity | ✓ | leads.json flat array; conversion creates deal in deals.json in-memory |
| Type Safety | ✓ | `IntentScore` and `LeadStatus` are union types |
| Component Sovereignty | ✓ | Fetch only in `useLeads` |
| Tailwind Only | ✓ | Intent badges: `bg-green-100 text-green-700` / `bg-amber-100 text-amber-700` / `bg-gray-100 text-gray-600` |

---

## Complexity Notes

- **Conversion side effect**: `POST /api/leads/:id/convert` must write a new deal to the in-memory deals array (same store as features 001-003) so it appears in the pipeline immediately.
- **Reuse `KPITile`**: import from `frontend/src/components/insights/KPITile.tsx` — don't rebuild.
- **Dependencies**: Requires deals in-memory store from feature 001. Pipeline + stage data needed for conversion form selector.
- **Estimated phases**: 5 phases for 6 user stories.
