# Implementation Tasks: Leads Inbox

**Feature**: `specs/010-leads-inbox`
**Total tasks**: 26 | **MVP scope**: Phase 3 (US1 — leads table with intent badges)

---

## Dependencies

```
Phase 1 (Setup)
  └── Phase 2 (Foundational)
        └── Phase 3 (US1: leads table)           ← entry point
              ├── Phase 4 (US2: KPI tiles)        ← [P]
              ├── Phase 5 (US3: convert to deal)  ← [P]
              ├── Phase 6 (US4: source chart)     ← [P]
              ├── Phase 7 (US5: filter tabs)      ← [P]
              └── Phase 8 (US6: priority panel)   ← [P]
                    └── Final Phase (Polish)
```

---

## Phase 1 — Setup

- [ ] T001 Create component directory `frontend/src/components/leads/`
- [ ] T002 [P] Create `backend/data/leads.json` (15 leads: varied intentScore, source, status, estimatedValue)
- [ ] T003 [P] Create `shared/types/lead.ts` (`Lead`, `LeadKPIs`, `LeadConvertRequest`, `IntentScore`, `LeadStatus` types)

---

## Phase 2 — Foundational *(CRITICAL)*

- [ ] T004 [P] Create Express router `backend/routes/leads.ts` (stubs for all endpoints)
- [ ] T005 Register leads router in `backend/index.ts` under `/api/leads`
- [ ] T006 [P] Implement `GET /api/leads` in `backend/routes/leads.ts` (filter by status + source; sort by intentScore desc by default; compute `kpis` + `sourceDistribution` in response)
- [ ] T007 [P] Create Zustand store `frontend/src/store/leadsStore.ts` (`{ activeTab, sortField, sortDir, filters }`)
- [ ] T008 Create React Query hook `frontend/src/api/useLeads.ts` (`useLeads(store)` + `useConvertLead` mutation stub)

---

## Phase 3 — User Story 1 (P1): Prioritized leads table

*Goal*: Table with Intent Score badge, sorted by score desc; "Convert to Deal" button per row.
*Independent test*: Load `/leads` with 10 seeded leads — intent badge colors correct; Convert button on each row.

- [ ] T009 [P] [US1] Create `IntentScoreBadge` component in `frontend/src/components/leads/IntentScoreBadge.tsx` (High=green, Medium=amber, Low=grey Tailwind classes)
- [ ] T010 [P] [US1] Create `LeadRow` component in `frontend/src/components/leads/LeadRow.tsx` (name, source, IntentScoreBadge, estimatedValue, status chip, createdAt, "Convert to Deal" button stub)
- [ ] T011 [US1] Create `LeadsTable` component in `frontend/src/components/leads/LeadsTable.tsx` (sortable headers; maps leads to LeadRow)
- [ ] T012 [US1] Create `LeadsPage` in `frontend/src/pages/LeadsPage.tsx` (renders KPI row + tabs + table + source chart + priority panel layout)
- [ ] T013 [US1] Add route `/leads` → `LeadsPage` in `frontend/src/App.tsx`
- [ ] T014 [US1] Add "Leads" nav link to `frontend/src/components/layout/Sidebar.tsx`

---

## Phase 4 — User Story 2 (P1): Lead KPI cards

*Goal*: 4 tiles — Incoming count, Estimated Value, Response Rate %, AI Optimized.
*Independent test*: 10 leads, 3 with activities → Response Rate = 30%.

- [ ] T015 [P] [US2] Create `LeadKPICards` component in `frontend/src/components/leads/LeadKPICards.tsx` (imports `KPITile` from `frontend/src/components/insights/KPITile.tsx`; renders 4 tiles from `useLeads` kpis response)
- [ ] T016 [US2] Integrate `LeadKPICards` at top of `LeadsPage`

---

## Phase 5 — User Story 3 (P1): Convert lead to deal

*Goal*: Convert button → pre-filled form → creates deal + updates lead status.
*Independent test*: Convert lead → deal in GET /api/deals; lead.status = "converted".

- [ ] T017 [P] [US3] Implement `POST /api/leads/:id/convert` in `backend/routes/leads.ts` (create Deal in deals in-memory store; set lead.status = "converted"; return `{ lead, deal }`)
- [ ] T018 [US3] Add `useConvertLead` mutation to `frontend/src/api/useLeads.ts` (on success: invalidate `['leads']`, `['deals-list']`)
- [ ] T019 [US3] Create `ConvertLeadModal` in `frontend/src/components/leads/ConvertLeadModal.tsx` (pre-fills deal title from lead name, value from estimatedValue; pipeline + stage selector; Confirm calls `useConvertLead`; success shows link to new deal)
- [ ] T020 [US3] Wire "Convert to Deal" button in `LeadRow` to open `ConvertLeadModal` with that lead's data

---

## Phase 6 — User Story 4 (P2): Lead source distribution chart

- [ ] T021 [P] [US4] Create `LeadSourceChart` component in `frontend/src/components/leads/LeadSourceChart.tsx` (recharts horizontal `BarChart`; x-axis = count; y-axis = source name; data from `useLeads` sourceDistribution)
- [ ] T022 [US4] Integrate `LeadSourceChart` in `LeadsPage` alongside or below the table

---

## Phase 7 — User Story 5 (P2): Filter tabs

- [ ] T023 [P] [US5] Create `LeadStatusTabs` component in `frontend/src/components/leads/LeadStatusTabs.tsx` (All / Incoming / Contacted / Converted / Disqualified tabs with count badges; updates `leadsStore.activeTab`)
- [ ] T024 [US5] Integrate `LeadStatusTabs` above `LeadsTable` in `LeadsPage`

---

## Phase 8 — User Story 6 (P3): Priority focus panel

- [ ] T025 [P] [US6] Create `PriorityFocusPanel` component in `frontend/src/components/leads/PriorityFocusPanel.tsx` (shows top 5 "incoming" leads sorted by intentScore desc; each shows name, source, IntentScoreBadge, estimatedValue; clicking scrolls/highlights row in table)

---

## Final Phase — Polish

- [ ] T026 Add skeleton rows to `LeadsTable` while loading; empty state per tab; `ErrorBoundary` wrap in `frontend/src/App.tsx`
