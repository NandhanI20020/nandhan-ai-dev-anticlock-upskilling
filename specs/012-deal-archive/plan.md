# Implementation Plan: Deal Archive

**Branch**: `012-deal-archive` | **Date**: 2026-06-15 | **Spec**: [spec.md](spec.md)

---

## Technical Context

**Tech stack**: React 18 + Vite + Tailwind CSS / Node.js + Express + mock JSON store

**Libraries**: `recharts` (win reason bar chart), `lucide-react`, `@tanstack/react-query`, `zustand`

**Key data types**:
```typescript
interface ArchivedDeal {
  id: string; title: string; orgName: string | null;
  status: "won" | "lost"; value: number; currency: string;
  closeDate: string; dealCycleDays: number;
  lostReason: string | null; source: string | null;
  ownerName: string;
}
interface ArchiveKPIs {
  totalArchived: number; wonRevenue: number; wonCount: number; winRate: number;
  lostValue: number; lostCount: number; avgDealCycleDays: number;
}
interface WinReasonEntry { source: string; count: number; totalValue: number; }
interface LossReasonEntry { reason: string; count: number; percentage: number; }
```

**Project structure**:
```
frontend/src/
  pages/DealArchivePage.tsx           ← route /deals/archive
  components/archive/
    ArchiveKPICards.tsx               ← 4 KPI tiles (reuses KPITile from feature 008)
    ArchiveFilterBar.tsx              ← All|Won|Lost tabs + date range selector + search input
    ArchiveTable.tsx                  ← sortable table of ArchivedDeal rows
    ArchiveTableRow.tsx               ← row with Won/Lost badge, Reopen button (lost only)
    WinReasonChart.tsx                ← recharts horizontal BarChart (source → count + value)
    LossInsightsPanel.tsx             ← ranked list of loss reasons with count + %
  api/useArchive.ts                   ← useQuery(['archive', filters]) + useReopenDeal mutation
  store/archiveStore.ts               ← { statusFilter, datePreset, customFrom, customTo, searchQuery }
backend/
  routes/archive.ts                   ← GET /api/archive?status=&from=&to=&q= (returns deals + kpis + winReasons + lossReasons)
  (no new data files — reads from deals.json)
shared/types/archive.ts               ← ArchivedDeal, ArchiveKPIs, WinReasonEntry, LossReasonEntry
```

**API summary**:
- `GET /api/archive?status=won|lost|all&from=&to=&q=` — filter deals where status = won|lost; apply date range on wonTime/lostTime; filter by q on title/orgName; compute and return `{ deals: ArchivedDeal[], kpis: ArchiveKPIs, winReasons: WinReasonEntry[], lossReasons: LossReasonEntry[] }`
- `PATCH /api/deals/:id/reopen` — set `status = "open"`, `lostReason = null`, `lostTime = null`; move to pipeline's first stage; append `deal_reopened` system event

**Key decisions**:
- Reuse `KPITile` from feature 008; reuse `PaginationControls` from feature 003; reuse `DealStatusBadge` from feature 003
- Single backend endpoint returns all archive data (same rationale as insights: one coherent date-range computation)
- `dealCycleDays` computed server-side: `daysBetween(createdAt, wonTime || lostTime)`
- Reopen writes back to the same in-memory deals array used by feature 001/002 — consistent store

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| Spec-First | ✓ | spec.md approved |
| Mock-Data Simplicity | ✓ | Reads from existing deals.json; no new data files |
| Type Safety | ✓ | All archive types defined in `shared/types/archive.ts` |
| Component Sovereignty | ✓ | Fetch only in `useArchive` |
| Tailwind Only | ✓ | Won=green badge, Lost=red badge; reuse `DealStatusBadge` |

---

## Complexity Notes

- **Reopen side effect**: `PATCH /api/deals/:id/reopen` must find the deal's pipeline's first stage (by `order: 1`) and set `stageId` accordingly. Also appends a system event to the feed, so `stageTimeEntries` should get a new entry.
- **Loss Insights**: group lost deals by `lostReason`; null reasons grouped as "No reason given".
- **Dependencies**: Requires won/lost deals in deals.json (seeded in features 001–003). Feed endpoint from feature 002 used for Reopen system event.
- **Estimated phases**: 5 phases for 6 user stories.
