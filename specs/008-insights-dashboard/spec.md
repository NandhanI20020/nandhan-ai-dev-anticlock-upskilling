# Feature Specification: Insights Dashboard

**Feature Branch**: `008-insights-dashboard`
**Created**: 2026-06-15
**Status**: Draft

---

## User Scenarios & Testing

### User Story 1 (P1): View pipeline health KPIs at a glance
**As a** sales manager,
**I want to** see four key metrics at the top of the dashboard — total open pipeline value, won revenue this period, activities logged today, and average deal age,
**So that** I can assess pipeline health in under 10 seconds without running a report.

**Acceptance criteria**:
- [ ] Four KPI tiles are displayed: Open Pipeline Value, Won Revenue (current month), Activities Today, Avg Deal Age (days)
- [ ] Each tile shows the primary metric prominently and a secondary trend label (e.g. "+12% vs last month")
- [ ] Values are currency-formatted for monetary metrics (e.g. "₹24.5L")
- [ ] KPI values update when the date range filter changes

**Independent test**: Verify the Open Pipeline Value tile matches the sum of all open deal values from `GET /api/deals?status=open`.

---

### User Story 2 (P1): View deals distributed across pipeline stages (bar chart)
**As a** sales manager,
**I want to** see a bar chart showing how many deals and what total value is in each pipeline stage,
**So that** I can identify where deals are piling up or where the pipeline is thin.

**Acceptance criteria**:
- [ ] A bar chart displays one bar per pipeline stage
- [ ] Each bar represents the total value of deals in that stage
- [ ] Hovering a bar shows a tooltip with stage name, deal count, and total value
- [ ] The chart respects the date range filter

**Independent test**: With 3 deals in "Proposal Made" totaling ₹3L — verify the Proposal Made bar renders at the correct relative height.

---

### User Story 3 (P1): View win/loss ratio (donut chart)
**As a** sales manager,
**I want to** see a donut chart showing the split between won and lost deals,
**So that** I can track win rate and identify if the ratio is improving over time.

**Acceptance criteria**:
- [ ] A donut chart shows Won vs Lost segments
- [ ] The win rate percentage is displayed in the center of the donut
- [ ] Hovering a segment shows count and percentage
- [ ] The chart title shows the date period it covers

**Independent test**: With 8 won and 2 lost deals — verify the donut shows 80% win rate and the Won segment is 80% of the circle.

---

### User Story 4 (P1): View activities completed over time (bar/line chart)
**As a** sales manager,
**I want to** see a chart of activities completed per day or week over the selected period,
**So that** I can identify activity trends and coaching opportunities.

**Acceptance criteria**:
- [ ] A bar or line chart shows activities completed per time unit (day for ≤30 days; week for longer)
- [ ] Activity type breakdown is visible (Call, Meeting, Task shown in different colors)
- [ ] The chart respects the active date range filter

**Independent test**: Verify the chart shows activity counts matching the seeded `doneAt` timestamps in `activities.json`.

---

### User Story 5 (P2): Filter dashboard by date range
**As a** sales manager,
**I want to** change the date range for all dashboard charts and KPIs,
**So that** I can compare performance across different periods.

**Acceptance criteria**:
- [ ] A date range selector is visible in the dashboard toolbar
- [ ] Preset options: This Month, Last Month, This Quarter, Last Quarter, This Year, Custom
- [ ] Changing the date range refreshes all KPI tiles and charts simultaneously
- [ ] The selected period is displayed as a label near the date selector

**Independent test**: Switch from "This Month" to "Last Quarter" — verify all KPI values and chart data update.

---

### User Story 6 (P3): View recently updated deals panel
**As a** sales representative,
**I want to** see a list of recently updated deals on the dashboard,
**So that** I can quickly jump back to deals I've been working on without searching.

**Acceptance criteria**:
- [ ] A "Recent Deals" panel shows the 5 most recently updated open deals
- [ ] Each entry shows: deal title, organization, value, current stage, and days since last update
- [ ] Clicking a deal navigates to its Deal Detail page

**Independent test**: Update deal-001 — verify it appears first in the Recent Deals panel.

---

## Functional Requirements

- **FR-01**: The dashboard must display 4 KPI tiles: Open Pipeline Value, Won Revenue (period), Activities Today, Avg Deal Age.
- **FR-02**: KPI tiles must show a trend indicator (% change vs the same prior period).
- **FR-03**: A "Deals by Stage" bar chart must show total deal value per pipeline stage.
- **FR-04**: A Win/Loss donut chart must show the won-vs-lost split and display win rate % in the center.
- **FR-05**: An "Activities Completed" chart must show activity completions over time, broken down by type.
- **FR-06**: All charts and KPI tiles must respond to a global date range filter (presets + custom range).
- **FR-07**: A "Recent Deals" panel must list the 5 most recently updated open deals with navigation links.
- **FR-08**: All monetary values must be currency-formatted; all percentages must show one decimal place.

---

## Success Criteria

- A manager can assess pipeline health (KPIs + stage distribution + win rate) in under 10 seconds.
- All charts render in under 1 second after page load.
- Date range changes refresh all metrics without a full page reload.

---

## Key Entities

| Entity | Key Fields | Relationships |
|--------|-----------|---------------|
| Deal | id, value, status, stageId, updatedAt, wonTime, lostTime | aggregated for KPIs + charts |
| Activity | id, type, done, doneAt | aggregated for activity chart |
| Stage | id, name, order, pipelineId | labels for bar chart |

---

## Out of Scope

- Per-rep performance breakdown (single-user app)
- Dashboard customization (drag-to-rearrange widgets)
- Email open / click analytics

---

## Assumptions

- "This Month" is the default date range on load.
- All monetary values use INR as the display currency for the mock data.
- Win rate = wonDeals / (wonDeals + lostDeals) for the selected period; excludes open deals.

---

## Dependencies

- Deal, Activity, Stage, Pipeline seed data (features 001, 002, 007)
