# Implementation Plan: Global Search

**Branch**: `009-global-search` | **Date**: 2026-06-15 | **Spec**: [spec.md](spec.md)

---

## Technical Context

**Tech stack**: React 18 + Vite + Tailwind CSS / Node.js + Express + mock JSON store

**Libraries**: `lucide-react` (Search icon, entity-type icons), `@tanstack/react-query` (debounced query), `zustand` (overlay state + recently viewed)

**Key data types**:
```typescript
type SearchEntityType = "deal" | "person" | "org";
interface SearchResult { entity: SearchEntityType; id: string; title: string; subtitle: string; }
interface SearchResponse { deals: SearchResult[]; people: SearchResult[]; orgs: SearchResult[]; }
interface RecentlyViewedItem { entity: SearchEntityType; id: string; title: string; subtitle: string; viewedAt: number; }
```

**Project structure**:
```
frontend/src/
  components/search/
    GlobalSearchOverlay.tsx         ← modal overlay: input + results + recently viewed
    SearchResultItem.tsx            ← single result row (icon, title, subtitle)
    SearchResultGroup.tsx           ← labeled group of SearchResultItem
    SearchTabs.tsx                  ← All | Deals | People | Organizations tabs with counts
  api/useSearch.ts                  ← useQuery(['search', q]) with 200ms debounce + enabled: q.length >= 2
  store/searchStore.ts              ← { isOpen, recentlyViewed: RecentlyViewedItem[], addRecent(item) }
backend/
  routes/search.ts                  ← GET /api/search?q= (search deals + people + orgs; max 5 per type)
shared/types/search.ts              ← SearchResult, SearchResponse, RecentlyViewedItem
```

**API summary**:
- `GET /api/search?q=<query>` — case-insensitive substring match on deal.title, person.name, org.name; returns `SearchResponse` with max 5 per entity type

**Key decisions**:
- Keyboard shortcut via `useEffect` listening for `keydown` on `window` — no library needed
- Debounce: `useEffect` with `setTimeout(200ms)` inside `useSearch` hook (or use React Query's `enabled` + `useDebounce` helper) — no debounce library
- Overlay is a fixed-position div with backdrop (Tailwind `fixed inset-0 bg-black/50 z-50`) — no portal/dialog library
- Keyboard navigation tracked via `useState` `highlightedIndex` in `GlobalSearchOverlay`
- Recently Viewed stored in `searchStore.recentlyViewed[]`; updated whenever a search result is clicked via `addRecent(item)` action
- The search route is registered before other routes so `/api/search` doesn't conflict with resource routes

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| Spec-First | ✓ | spec.md approved |
| Mock-Data Simplicity | ✓ | Simple substring scan of in-memory arrays |
| Type Safety | ✓ | `SearchResult` typed discriminated entity field |
| Component Sovereignty | ✓ | Fetch only in `useSearch`; overlay receives data via hook |
| Tailwind Only | ✓ | Overlay backdrop via `bg-black/50`; highlight via `bg-purple-50` |

---

## Complexity Notes

- **Keyboard shortcut**: Must `preventDefault()` on Ctrl/Cmd+K to prevent browser address bar focus.
- **Keyboard nav + focus**: `highlightedIndex` state must reset to -1 when query changes; arrow keys wrap around (from last item → back to -1/input).
- **Dependencies**: None — search reads from existing in-memory stores built by features 001–006.
- **Estimated phases**: 4 phases for 5 user stories.
