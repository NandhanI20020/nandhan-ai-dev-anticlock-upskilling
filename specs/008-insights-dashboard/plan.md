# Implementation Plan: Insights Dashboard

**Branch**: `008-insights-dashboard` | **Date**: 2026-06-15 | **Spec**: [spec.md](spec.md)

---

## Technical Context

**Tech stack**: React 18 + Vite + Tailwind CSS / Node.js + Express + mock JSON store

**Libraries**:
- `recharts` — BarChart, PieChart (donut), LineChart (already in approved stack)
- `lucide-react` — KPI tile icons
- `@tanstack/react-query`, `zustand`

**Key data types**:
```typescript
type DatePreset = "thisMonth" | "lastMonth" | "thisQuarter" | "lastQuarter" | "thisYear" | "custom";
interface DashboardStats {
  openPipelineValue: number; openDealCount: number;
  wonRevenue: number; wonDealCount: number;
  activitiesToday: number;
  avgDealAgeDays: number;
  trends: { openPipelineValueChange: number; wonRevenueChange: number; }
}
interface StageDistribution { stageId: string; stageName: string; dealCount: number; totalValue: number; }
interface WinLossRatio { wonCount: number; lostCount: number; winRate: number; }
interface ActivityByDay { date: string; call: number; meeting: number; task: number; email: number; deadline: number; }
interface RecentDeal { id: string; title: string; orgName: string; value: number; stageName: string; daysSinceUpdate: number; }
```

**Project structure**:
```
frontend/src/
  pages/InsightsPage.tsx              ← route /insights
  components/insights/
    KPITile.tsx                       ← reusable metric tile (label, value, trend %)
    KPITileRow.tsx                    ← 4-column grid of KPITile
    DealsByStageChart.tsx             ← recharts BarChart (stageId → totalValue)
    WinLossDonut.tsx                  ← recharts PieChart in donut mode (won/lost + % center label)
    ActivitiesCompletedChart.tsx      ← recharts BarChart (date → counts by type, stacked)
    RecentDealsPanel.tsx              ← list of 5 recent deals with links
    DateRangeSelector.tsx             ← dropdown with presets + custom date inputs
  api/useInsights.ts                  ← useQuery(['insights', dateRange]) for all dashboard data
  store/insightsStore.ts              ← { datePreset, customFrom, customTo }
backend/
  routes/insights.ts                  ← GET /api/insights?from=&to= (returns all dashboard data)
  data/                               ← no new files; aggregates from deals + activities + stages
shared/types/insights.ts              ← all dashboard type interfaces
```

**API summary**:
- `GET /api/insights?from=YYYY-MM-DD&to=YYYY-MM-DD` — single endpoint returns: `{ stats: DashboardStats, stageDistribution: StageDistribution[], winLoss: WinLossRatio, activityTimeline: ActivityByDay[], recentDeals: RecentDeal[] }`

**Key decisions**:
- **Single API endpoint** for all dashboard data — avoids 5 separate queries with separate loading states; all data is computed from the same date range so one request is coherent
- **recharts** is in the approved stack — no new packages needed
- Custom date range inputs are simple `<input type="date">` fields — no date-picker library
- Trend % is computed by comparing current period to the previous period of the same length (e.g. "This Month" compares to last month)
- Currency formatting: `new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', notation: 'compact' })` — no library needed

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| Spec-First | ✓ | spec.md approved |
| Mock-Data Simplicity | ✓ | Aggregates in-memory from existing JSON arrays |
| Type Safety | ✓ | All chart data types defined in `shared/types/insights.ts` |
| Component Sovereignty | ✓ | Chart components receive typed data props; fetch only in `useInsights` |
| Tailwind Only | ✓ | KPI tile styling in Tailwind; recharts handles chart internals |

---

## Complexity Notes

- **recharts**: `PieChart` for donut requires `innerRadius` prop + a custom center label via `<Label>` inside `<Pie>`. Not complex but requires reading recharts docs.
- **Trend calculation**: backend must compute both current and prior period aggregates. Keep both calculations in the same route handler; don't DRY too early.
- **Dependencies**: Requires all seeded data from features 001–007 to show meaningful charts.
- **Estimated phases**: 5 phases for 6 user stories.
