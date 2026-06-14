# Feature Specification: Deal Archive

**Feature Branch**: `012-deal-archive`
**Created**: 2026-06-15
**Status**: Draft

---

## User Scenarios & Testing

### User Story 1 (P1): View all closed deals in a searchable table
**As a** sales manager,
**I want to** see all won and lost deals in a table with their outcome, value, close date, and cycle length,
**So that** I can review historical performance and identify patterns.

**Acceptance criteria**:
- [ ] All deals with status "won" or "lost" are displayed in a table
- [ ] Columns: Title, Organization, Status (Won/Lost badge), Value, Close Date, Deal Cycle (days from created to closed), Owner
- [ ] Won deals show a green "WON" badge; Lost deals show a red "LOST" badge
- [ ] Table is sortable by any column; default sort is Close Date descending (most recent first)
- [ ] A search input filters the table by deal title or organization name

**Independent test**: With 5 won and 3 lost deals seeded — verify all 8 appear; sort by Value descending shows highest-value deal first.

---

### User Story 2 (P1): View archive KPI summary
**As a** sales manager,
**I want to** see summary stats at the top of the archive — total archived deals, won revenue and win rate, lost value, and average deal cycle,
**So that** I can assess historical sales performance at a glance.

**Acceptance criteria**:
- [ ] Four KPI tiles: Total Archived count, Won Revenue (sum + win rate %), Lost Value (sum), Avg Deal Cycle (days)
- [ ] Win rate % = won deals / (won + lost) × 100
- [ ] KPI values update when filters or date range change

**Independent test**: With 8 won deals (₹40L total) and 2 lost deals — verify Won tile shows ₹40L + "80% win rate".

---

### User Story 3 (P1): Filter archive by outcome and date
**As a** sales manager,
**I want to** filter the archive to show only Won or only Lost deals, and to narrow by close date range,
**So that** I can analyze wins and losses separately.

**Acceptance criteria**:
- [ ] Quick filter tabs: All | Won | Lost
- [ ] A date range selector filters by close date (wonTime or lostTime)
- [ ] Presets: This Month, Last Quarter, This Year, All Time
- [ ] Active filters update the KPI tiles and charts

**Independent test**: Click "Lost" tab — verify only lost deals appear; KPI tiles update to lost-only metrics.

---

### User Story 4 (P2): View win reason distribution (bar chart)
**As a** sales manager,
**I want to** see a chart of why deals were won (by source or tag),
**So that** I can identify the most effective sales channels and approaches.

**Acceptance criteria**:
- [ ] A bar chart shows won deals grouped by deal source (e.g. Referral, Cold Call, Inbound)
- [ ] Each bar shows deal count and total won revenue for that source
- [ ] Chart updates when the date filter changes

**Independent test**: With 3 Referral wins and 2 Cold Call wins — verify chart shows 2 bars with correct counts.

---

### User Story 5 (P2): View loss insights panel
**As a** sales manager,
**I want to** see a panel summarizing why deals were lost,
**So that** I can identify the most common loss reasons and address them in coaching.

**Acceptance criteria**:
- [ ] A panel lists the top loss reasons from `lostReason` field on lost deals
- [ ] Each reason shows: reason text, count, and % of total losses
- [ ] Reasons are sorted by count descending

**Independent test**: With 3 deals lost to "Chose competitor" and 1 to "Budget" — verify "Chose competitor" appears first with count 3 (75%).

---

### User Story 6 (P3): Reopen a lost deal
**As a** sales representative,
**I want to** reopen a lost deal and move it back to an active pipeline stage,
**So that** I can revive a deal when a previously lost prospect re-engages.

**Acceptance criteria**:
- [ ] Each lost deal row has a "Reopen" button
- [ ] Clicking Reopen moves the deal back to status "open" and the first stage of its pipeline
- [ ] The deal disappears from the archive and reappears in the kanban board
- [ ] A system event "Deal reopened" is appended to the deal's activity feed

**Independent test**: Click Reopen on a lost deal → verify it appears in the Pipeline Kanban in the first stage.

---

## Functional Requirements

- **FR-01**: The archive must display all won and lost deals in a sortable table with columns: Title, Organization, Status badge, Value, Close Date, Deal Cycle (days), Owner.
- **FR-02**: A search input must filter the table by deal title or organization name (case-insensitive).
- **FR-03**: Four KPI tiles must display: Total Archived count, Won Revenue + win rate %, Lost Value, Avg Deal Cycle days.
- **FR-04**: Quick filter tabs (All / Won / Lost) must filter the table and update KPI tiles.
- **FR-05**: A date range filter (presets + custom) must filter by deal close date.
- **FR-06**: A Win Reason Distribution bar chart must show won deal counts and revenue by deal source.
- **FR-07**: A Loss Insights panel must list top loss reasons with count and % of total losses.
- **FR-08**: Each lost deal row must have a Reopen button that sets status="open", moves to pipeline stage 1, and appends a system feed event.

---

## Success Criteria

- A manager can review all lost deals in the last quarter and see the top loss reason in under 60 seconds.
- The archive table renders 15 rows in under 500ms.
- Reopening a lost deal takes one click and the deal immediately appears in the pipeline.

---

## Key Entities

| Entity | Key Fields | Relationships |
|--------|-----------|---------------|
| Deal | id, title, value, status, wonTime, lostTime, lostReason, source, createdAt | belongs to Org, Stage |
| Organization | id, name | linked to Deal |

---

## Out of Scope

- Restoring won deals to open (only lost deals can be reopened)
- Archive export (use the Deals List export feature)
- Bulk reopen

---

## Assumptions

- "Deal Cycle" = number of days between `deal.createdAt` and `deal.wonTime` or `deal.lostTime`.
- Archive includes all time periods by default ("All Time") unless a date filter is applied.
- Win Reason Distribution uses `deal.source` as a proxy for win reason (no separate win-reason field in MVP).
