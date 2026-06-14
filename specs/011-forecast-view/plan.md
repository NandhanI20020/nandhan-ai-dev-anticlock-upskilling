# Implementation Plan: Forecast View

**Branch**: `011-forecast-view` | **Date**: 2026-06-15 | **Spec**: [spec.md](spec.md)

---

## Technical Context

**Tech stack**: React 18 + Vite + Tailwind CSS / Node.js + Express + mock JSON store

**Libraries**: `lucide-react`, `@tanstack/react-query`, `zustand`

**Key data types**:
```typescript
type ForecastRange = "thisQuarter" | "nextQuarter" | "thisYear";
interface ForecastDeal { id: string; title: string; value: number; probability: number; expectedCloseDate: string; orgName: string; ownerName: string; }
interface ForecastMonth { month: string; year: number; label: string; deals: ForecastDeal[]; weightedValue: number; quotaTarget: number; quotaPercent: number; }
interface ForecastResponse { months: ForecastMonth[]; totalWeightedValue: number; }
```

**Project structure**:
```
frontend/src/
  pages/ForecastPage.tsx              ← route /deals/forecast (or /forecast)
  components/forecast/
    ForecastGrid.tsx                  ← horizontal scroll container; maps months to ForecastColumn
    ForecastColumn.tsx                ← month column: header with weighted value + quota %; deal blocks list
    DealBlock.tsx                     ← colored card: title, value, probability %; hover tooltip; click nav
    DealBlockTooltip.tsx              ← tooltip overlay (Tailwind absolute positioning)
    ForecastRangeToggle.tsx           ← This Quarter | Next Quarter | This Year toggle
  api/useForecast.ts                  ← useQuery(['forecast', range])
  store/forecastStore.ts              ← { range: ForecastRange }
backend/
  routes/forecast.ts                  ← GET /api/forecast?range= (group open deals by close month; compute weighted values + quota %)
  data/forecastConfig.json            ← { monthlyQuota: 500000 }
shared/types/forecast.ts              ← ForecastDeal, ForecastMonth, ForecastResponse, ForecastRange
```

**API summary**:
- `GET /api/forecast?range=thisQuarter|nextQuarter|thisYear` — filter open deals with `expectedCloseDate != null`; group by close month; compute `weightedValue` per deal + month total; load `forecastConfig.json` for quotaTarget; return `ForecastResponse`

**Key decisions**:
- No third-party grid or chart library — the forecast grid is a plain CSS flex/grid layout with horizontal overflow scroll
- Tooltip is positioned absolutely relative to the deal block using Tailwind `absolute` — no portal or Floating UI library (not in approved stack)
- Quota is a static monthly value from `forecastConfig.json` — no UI to configure it in MVP
- Color coding: `probability >= 70` → `bg-green-100 border-green-500`; `40–69` → `bg-amber-100 border-amber-500`; `< 40` → `bg-red-100 border-red-400`

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| Spec-First | ✓ | spec.md approved |
| Mock-Data Simplicity | ✓ | Aggregates from deals.json in-memory |
| Type Safety | ✓ | `ForecastMonth`, `ForecastDeal` fully typed |
| Component Sovereignty | ✓ | Fetch only in `useForecast` |
| Tailwind Only | ✓ | Color coding via Tailwind conditional classes |

---

## Complexity Notes

- **Tooltip positioning**: Use `group-hover` + `absolute` on the DealBlock wrapper — simple and no extra deps. Watch for overflow clipping on the last column.
- **Horizontal scroll**: `ForecastGrid` uses `overflow-x-auto flex gap-4`; each `ForecastColumn` is `min-w-[200px] flex-shrink-0`.
- **Dependencies**: Requires deals.json with `expectedCloseDate` and `probability` values seeded. Feature 001 deals need these fields populated.
- **Estimated phases**: 4 phases for 5 user stories.
