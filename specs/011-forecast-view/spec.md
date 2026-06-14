# Feature Specification: Forecast View

**Feature Branch**: `011-forecast-view`
**Created**: 2026-06-15
**Status**: Draft

---

## User Scenarios & Testing

### User Story 1 (P1): View deals distributed by probability in a forecast grid
**As a** sales manager,
**I want to** see open deals laid out in a grid by month and colored by their closing probability,
**So that** I can understand what revenue is likely, possible, or unlikely to close in each month.

**Acceptance criteria**:
- [ ] Deals are displayed in a grid where columns = months and deals are grouped by expected close month
- [ ] Each deal block shows: deal title, value, and probability %
- [ ] Deal blocks are color-coded by probability range: ≥70% = green, 40–69% = amber, <40% = red/grey
- [ ] Each column shows the total weighted value (value × probability) at the header
- [ ] The grid is scrollable horizontally for months beyond the visible viewport

**Independent test**: With 3 deals closing in July (probabilities 80%, 50%, 20%) — verify 3 blocks in the July column with correct colors and column weighted total = (value×0.8 + value×0.5 + value×0.2).

---

### User Story 2 (P1): View quota achievement per month
**As a** sales manager,
**I want to** see the % of quota achieved for each month next to the weighted pipeline value,
**So that** I know at a glance where I'm on track versus behind.

**Acceptance criteria**:
- [ ] Each month column header shows: month name, weighted deal value, quota % achieved
- [ ] Quota % = weighted pipeline value / monthly quota target × 100
- [ ] Months where quota % ≥ 100% are visually highlighted (green header)
- [ ] Months where quota % < 50% are visually highlighted (red/amber header)

**Independent test**: With monthly quota of ₹5L and weighted value of ₹3L in August — verify August header shows "60%" quota achievement with amber styling.

---

### User Story 3 (P2): Change the forecast date range
**As a** sales manager,
**I want to** switch the forecast between current quarter, next quarter, and current year,
**So that** I can plan across different time horizons.

**Acceptance criteria**:
- [ ] A date range toggle is visible in the toolbar: This Quarter | Next Quarter | This Year
- [ ] Changing the range updates the columns shown in the grid
- [ ] "This Quarter" shows 3 months; "This Year" shows 12 months

**Independent test**: Switch to "Next Quarter" — verify the grid shows only the 3 months of next quarter.

---

### User Story 4 (P2): View deal details on hover
**As a** sales manager,
**I want to** hover over a deal block to see more details,
**So that** I can get quick context without opening the deal.

**Acceptance criteria**:
- [ ] Hovering a deal block shows a tooltip with: deal title, org name, owner, probability, expected close date
- [ ] The tooltip appears near the hovered block without obscuring adjacent blocks

**Independent test**: Hover over any deal block — verify tooltip shows all 5 fields.

---

### User Story 5 (P3): Navigate to deal from forecast
**As a** sales manager,
**I want to** click a deal block to open that deal's detail page,
**So that** I can drill into a specific deal from the forecast without searching for it.

**Acceptance criteria**:
- [ ] Clicking a deal block navigates to `/deals/:id`
- [ ] Navigation works from any month column

**Independent test**: Click any deal block — verify navigation to the correct Deal Detail page.

---

## Functional Requirements

- **FR-01**: The forecast grid must organize open deals into columns by expected close month.
- **FR-02**: Each deal block must show: title, value, probability %; color-coded by probability range (≥70% green, 40–69% amber, <40% red/grey).
- **FR-03**: Each month column header must display: month name, total weighted value, quota % achievement.
- **FR-04**: A date range control must let the user switch between This Quarter, Next Quarter, and This Year.
- **FR-05**: Hovering a deal block must display a tooltip with deal details (title, org, owner, probability, close date).
- **FR-06**: Clicking a deal block must navigate to that deal's detail page.
- **FR-07**: Columns where quota ≥ 100% must have a visually distinct (green) header; columns < 50% quota must show an amber/red header.

---

## Success Criteria

- A manager can see the full quarter's pipeline forecast in under 3 seconds of page load.
- All deal blocks render in the correct month column for 100% of seeded test deals.
- Quota achievement % is accurate given seeded quota and weighted values.

---

## Key Entities

| Entity | Key Fields | Relationships |
|--------|-----------|---------------|
| Deal | id, title, value, probability, expectedCloseDate, orgId, ownerId, status | open deals only |
| Organization | id, name | subtitle in deal block tooltip |
| ForecastConfig | monthlyQuota | static config (no UI to edit in MVP) |

---

## Out of Scope

- Per-rep quota tracking (single-user app)
- Editing deal probability directly from the forecast grid
- Scenario modelling (best case / worst case)

---

## Assumptions

- Only open deals with a non-null `expectedCloseDate` appear in the forecast grid.
- Monthly quota is a static value in the mock config (e.g. ₹5,00,000 per month).
- Deals with no expected close date are excluded from the forecast (not shown).
- Weighted value = deal.value × (deal.probability / 100).
