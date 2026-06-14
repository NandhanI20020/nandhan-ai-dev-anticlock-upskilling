# Feature Specification: Deals List View

**Feature Branch**: `003-deals-list`
**Created**: 2026-06-15
**Status**: Draft

---

## User Scenarios & Testing

### User Story 1 (P1): Browse all deals in a sortable table
**As a** sales representative,
**I want to** see all deals displayed in a sortable table with key fields visible at a glance,
**So that** I can quickly scan, compare, and find specific deals without opening each one individually.

**Acceptance criteria**:
- [ ] All deals are displayed as rows in a table
- [ ] Visible columns include: Title, Value, Stage, Organization, Owner, Expected Close Date
- [ ] Clicking a column header sorts the table by that column (ascending); clicking again sorts descending
- [ ] An arrow indicator shows which column is currently sorted and in which direction
- [ ] Clicking a deal's title navigates to the Deal Detail page

**Independent test**: Load the deals list with 25 seeded deals — verify all appear, click "Value" header twice, and confirm deals sort highest-to-lowest then lowest-to-highest.

---

### User Story 2 (P1): Identify deal status at a glance (Won, Lost, Rotten, Open)
**As a** sales representative,
**I want to** see each deal's status clearly indicated in the table row,
**So that** I can distinguish between open, won, lost, and stale deals without opening them.

**Acceptance criteria**:
- [ ] Won deals display a "WON" green badge below the title
- [ ] Lost deals display a "LOST" red badge below the title and a red left-border accent on the row
- [ ] Rotten deals display an orange warning text ("Rotten (14 days)") below the title and an orange left-border accent
- [ ] Open deals with no special status display no extra badge
- [ ] The Stage column shows a visual progress indicator (segmented bar) reflecting the deal's position in the pipeline

**Independent test**: Seed one Won deal, one Lost deal, one Rotten deal, one clean Open deal — verify each row displays the correct status treatment.

---

### User Story 3 (P1): Filter deals by status with quick-filter tabs
**As a** sales representative,
**I want to** switch between "All", "Open", "Won", "Lost", and "My Deals" with one click,
**So that** I can focus the list on the deals I care about right now.

**Acceptance criteria**:
- [ ] Quick-filter tabs are visible above the table: All | Open | Won | Lost | My Deals
- [ ] Clicking "Open" shows only deals with status = open
- [ ] Clicking "Won" shows only won deals
- [ ] Clicking "Lost" shows only lost deals
- [ ] Clicking "My Deals" shows only deals owned by the current user
- [ ] The active tab is visually highlighted
- [ ] The deal count updates to reflect the filtered subset

**Independent test**: Click "Won" — verify only won deals appear and the count matches the seeded won deal count.

---

### User Story 4 (P2): Apply advanced filters to narrow the deal list
**As a** sales manager,
**I want to** apply advanced filters (by stage, owner, label, value range, close date range),
**So that** I can segment the pipeline for reporting or focused action.

**Acceptance criteria**:
- [ ] A "Filters" button opens a filter builder
- [ ] Users can add multiple filter conditions (AND logic)
- [ ] Supported filter fields: Stage, Owner, Label, Value (range: min/max), Expected Close Date (range), Deal Source
- [ ] Active filters are shown as removable chips in a filter bar above the table
- [ ] The filter can be cleared with a single "Clear all" action
- [ ] Filters can be saved as named views ("Save as view")

**Independent test**: Apply filter "Stage = Qualified AND Value > 50000" — verify only Qualified deals with value above 50,000 appear.

---

### User Story 5 (P2): Export the deal list to CSV
**As a** sales manager,
**I want to** export the current view of deals to a CSV file,
**So that** I can share pipeline data in spreadsheets for reporting or management review.

**Acceptance criteria**:
- [ ] An "Export" button is visible in the toolbar
- [ ] Clicking Export downloads a CSV file containing all deals in the current view (respecting active filters and sort)
- [ ] The CSV includes columns: Title, Value, Stage, Organization, Owner, Expected Close Date, Status, Created Date
- [ ] The filename follows the pattern `deals-export-YYYY-MM-DD.csv`

**Independent test**: Apply filter "Status = Won", click Export — verify the downloaded CSV contains only won deals with all required columns.

---

### User Story 6 (P2): Select multiple deals for bulk action
**As a** sales manager,
**I want to** select multiple deals and perform a bulk action (delete, reassign owner),
**So that** I can manage large numbers of deals efficiently without acting on each one individually.

**Acceptance criteria**:
- [ ] Each table row has a checkbox for selection
- [ ] A checkbox in the table header selects / deselects all visible rows
- [ ] When one or more rows are selected, a bulk action bar appears showing the selection count
- [ ] Bulk actions available: Delete, Assign Owner
- [ ] Bulk delete asks for confirmation before proceeding
- [ ] After a bulk action completes, the table refreshes and the selection is cleared

**Independent test**: Select 3 deals, click "Assign Owner" → assign to user-1 — verify all 3 deals now show user-1 as owner after refresh.

---

### User Story 7 (P3): Paginate through a large deal list
**As a** sales representative,
**I want to** navigate through paginated results when there are more deals than fit on one page,
**So that** the page loads quickly and I can browse all deals efficiently.

**Acceptance criteria**:
- [ ] The table shows a configurable number of rows per page (default 15)
- [ ] Pagination controls are displayed below the table showing current page, total pages, and total deal count
- [ ] "Previous" and "Next" buttons navigate between pages
- [ ] Numbered page buttons allow jumping directly to a specific page
- [ ] The record count label shows "Showing X-Y of Z deals"

**Independent test**: Seed 30 deals, set page size to 15 — verify page 1 shows 15 deals, page 2 shows 15 deals, and the label reads "Showing 16-30 of 30 deals" on page 2.

---

## Functional Requirements

- **FR-01**: The deals list must display all deals in a tabular format with sortable columns: Title, Value, Stage, Organization, Owner, Expected Close Date.
- **FR-02**: The Stage column must render a visual segmented progress bar indicating the deal's position in its pipeline.
- **FR-03**: Won deals must display a "WON" green badge; Lost deals must display a "LOST" red badge and red row accent; Rotten deals must display an orange warning label and orange row accent.
- **FR-04**: Quick-filter tabs (All / Open / Won / Lost / My Deals) must filter the list to the corresponding deal subset with a single click.
- **FR-05**: The system must support advanced multi-condition filters on: stage, owner, label, value range, expected close date range, and deal source.
- **FR-06**: Active filters must render as removable chips in a filter bar above the table.
- **FR-07**: The user must be able to save active filter combinations as named saved views and reload them.
- **FR-08**: An "Export" button must download a CSV of the current (filtered, sorted) deal list.
- **FR-09**: Each table row must include a checkbox enabling multi-row selection.
- **FR-10**: When rows are selected, a bulk action bar must appear offering at minimum: Delete and Assign Owner.
- **FR-11**: Bulk Delete must require a confirmation dialog before proceeding.
- **FR-12**: The table must be paginated with a configurable page size (default 15) and controls for navigation.
- **FR-13**: Clicking a deal's title must navigate to the Deal Detail page for that deal.
- **FR-14**: The list view and pipeline kanban view must be accessible via view toggle tabs (Pipeline | List | Forecast).

---

## Success Criteria

- Sales reps can find a specific deal in the list by sorting or filtering in under 15 seconds.
- The list renders 15 rows in under 500ms.
- Exported CSV opens correctly in a spreadsheet application with all deals and columns present.
- Bulk actions complete for up to 25 selected deals in under 2 seconds.

---

## Key Entities

| Entity | Key Fields | Relationships |
|--------|-----------|---------------|
| Deal | id, title, value, currency, stageId, pipelineId, ownerId, orgId, status, expectedCloseDate, updatedAt | belongs to Stage, Pipeline, Org, User |
| Stage | id, name, order, pipelineId, rottingDays | belongs to Pipeline |
| Organization | id, name | linked to Deal |
| User | id, name, avatarColor, initials | owner of Deal |

---

## Out of Scope

- Inline cell editing within the table (done in Deal Detail)
- Forecast / timeline view (011-forecast-view)
- Archive view of won/lost deals (012-deal-archive)
- Custom column definitions (Settings feature)

---

## Assumptions

- Default sort is by created date, descending (newest first).
- "My Deals" filter shows deals where ownerId = the current single user (user-1).
- Rotten status is computed client-side by comparing `updatedAt` against the stage's `rottingDays` threshold.
- Export includes all deals matching current filters, not just the current page.

---

## Dependencies

- 001-pipeline-kanban: Pipeline and Stage data, deal status definitions
- Deal, Organization, Stage seed data required
