# Feature Specification: Pipeline Kanban Board

**Feature Branch**: `001-pipeline-kanban`
**Created**: 2026-06-15
**Status**: Draft

---

## User Scenarios & Testing

### User Story 1 (P1): View all open deals organized by stage
**As a** sales representative,
**I want to** see all my open deals arranged in columns by pipeline stage,
**So that** I can immediately understand where every deal stands and what needs attention.

**Acceptance criteria**:
- [ ] Each pipeline stage appears as a distinct column with the stage name as the column header
- [ ] Each column header displays the total count of deals in that stage
- [ ] Each column header displays the total monetary value of all deals in that stage
- [ ] Deals are displayed as cards within their respective stage column
- [ ] A pipeline-level total value is shown (sum across all stages)
- [ ] Columns are horizontally scrollable when stages exceed the viewport width

**Independent test**: Load the pipeline page with 25 seeded deals spread across 5 stages — verify each column shows the correct count, correct sum value, and contains only deals belonging to that stage.

---

### User Story 2 (P1): Move a deal to a different stage by dragging
**As a** sales representative,
**I want to** drag a deal card from one stage column and drop it into another,
**So that** I can advance or revert a deal's stage without opening it.

**Acceptance criteria**:
- [ ] Deal cards are draggable and can be dropped into any stage column
- [ ] While dragging, the card visually indicates it is being moved (elevated, slightly rotated)
- [ ] The target column highlights to indicate a valid drop zone
- [ ] On successful drop, the card appears in the new column and disappears from the old column immediately
- [ ] Both columns' deal counts and total values update to reflect the change
- [ ] The deal's stage is persisted — refreshing the page shows the deal in the new stage

**Independent test**: Drag the first deal from "Qualified" to "Proposal Made" — verify the move is reflected in both columns' headers and survives a page refresh.

---

### User Story 3 (P1): Identify deals that have gone stale (rotten)
**As a** sales representative,
**I want to** see a clear visual indicator on deals that have not been updated in too long,
**So that** I can prioritize re-engaging those accounts before they go cold.

**Acceptance criteria**:
- [ ] Deals that have exceeded the stage's rotting threshold (days without activity) are visually marked as "ROTTEN"
- [ ] Rotten deal cards display a distinct "ROTTEN" label/badge
- [ ] Rotten cards show a visual accent (e.g. colored left border) to distinguish them from healthy deals
- [ ] The number of days the deal has been stale is displayed on the rotten card
- [ ] Non-rotten deals do not display any rotten indicator

**Independent test**: Seed a deal with `updatedAt` set to 30 days ago in a stage with `rottingDays: 14` — verify the ROTTEN badge and stale-day count appear on its card.

---

### User Story 4 (P1): See the next scheduled activity for each deal
**As a** sales representative,
**I want to** see each deal's next scheduled activity directly on the kanban card,
**So that** I know at a glance what action is required next for every deal.

**Acceptance criteria**:
- [ ] Each deal card displays the type icon (call, meeting, task, email, deadline) of the next upcoming activity
- [ ] Each deal card displays the relative time until the next activity (e.g. "4d", "Today", "Overdue")
- [ ] Activities that are overdue are displayed in a visually distinct color (red)
- [ ] Deal cards with no scheduled activity show no activity indicator

**Independent test**: Create a deal with a meeting activity due in 2 days — verify the meeting icon and "2d" label appear on the card.

---

### User Story 5 (P2): Switch between multiple pipelines
**As a** sales manager,
**I want to** switch the kanban board between different named pipelines,
**So that** I can view and manage deals across separate sales processes (e.g. Enterprise pipeline vs. SMB pipeline).

**Acceptance criteria**:
- [ ] A pipeline selector control is visible in the toolbar
- [ ] Clicking the pipeline selector shows a list of all available pipelines
- [ ] Selecting a pipeline updates the kanban board to show that pipeline's stages and deals
- [ ] The currently selected pipeline name is displayed in the selector

**Independent test**: With 2 seeded pipelines, switch from pipeline 1 to pipeline 2 — verify the columns update to show pipeline 2's stages and only pipeline 2's deals.

---

### User Story 6 (P2): Add a new deal from the pipeline view
**As a** sales representative,
**I want to** create a new deal without leaving the pipeline board,
**So that** I can capture a new opportunity immediately while staying in context.

**Acceptance criteria**:
- [ ] A clearly visible "Add Deal" button is present in the toolbar
- [ ] Clicking the button opens a deal creation form/modal
- [ ] The form allows entering: contact person, organization, deal title, value, pipeline, and stage
- [ ] After saving, the new deal appears in the correct stage column immediately
- [ ] The column's deal count and total value update to include the new deal

**Independent test**: Click "+ Add Deal", fill in title "Test Deal" with value ₹50,000 in stage "Qualified", save — verify the card appears in the Qualified column and the column total increases by ₹50,000.

---

### User Story 7 (P3): Filter deals shown on the board
**As a** sales representative,
**I want to** apply filters to show only specific deals on the kanban board,
**So that** I can focus on my own deals or a specific segment without distraction.

**Acceptance criteria**:
- [ ] A "Filters" control is available in the toolbar
- [ ] Users can filter by: owner, label, expected close date range, deal value range
- [ ] When filters are active, only matching deals are shown across all columns
- [ ] Column counts and values update to reflect the filtered subset
- [ ] A visual indicator shows that filters are active
- [ ] Filters can be cleared to restore the full board

**Independent test**: Apply filter "owner = current user" — verify only deals owned by the current user appear across all columns.

---

### User Story 8 (P3): Access deal quick-actions from the card
**As a** sales representative,
**I want to** access common actions for a deal directly from its kanban card,
**So that** I can take action quickly without opening the full deal detail view.

**Acceptance criteria**:
- [ ] Each deal card has an overflow menu ("...") button
- [ ] The overflow menu offers actions: Edit, Mark as Won, Mark as Lost, Delete
- [ ] Selecting "Mark as Won" or "Mark as Lost" moves the deal to the appropriate outcome state
- [ ] Clicking the deal title navigates to the full Deal Detail page

**Independent test**: Open the "..." menu on any deal card and verify all four actions are present and functional.

---

## Functional Requirements

- **FR-01**: The system must display all open deals grouped by their current pipeline stage in distinct columns.
- **FR-02**: Each stage column header must show the stage name, total deal count, and sum of deal values for that stage.
- **FR-03**: The system must display a pipeline-level total value aggregating all open deals across all stages.
- **FR-04**: Deal cards must display: deal title, organization name, deal value, next activity type and relative due time.
- **FR-05**: Deal cards must display the number of days since the deal was created or last updated ("deal age").
- **FR-06**: Deals exceeding a stage's rotting threshold must display a "ROTTEN" indicator and the number of stale days.
- **FR-07**: Users must be able to drag a deal card from one stage column and drop it onto another to change the deal's stage.
- **FR-08**: The source and destination columns must update their counts and totals immediately upon a successful drag-and-drop.
- **FR-09**: Stage changes made via drag-and-drop must persist across page refreshes.
- **FR-10**: The system must provide a pipeline selector to switch the board between all available pipelines.
- **FR-11**: An "Add Deal" action must be accessible from the board toolbar and must create a deal in the selected stage.
- **FR-12**: The board must support filtering by owner, label, date range, and value range; column totals must reflect active filters.
- **FR-13**: Each deal card must have an overflow menu providing access to: Edit, Mark as Won, Mark as Lost, and Delete.
- **FR-14**: Clicking a deal card's title must navigate to the full Deal Detail view for that deal.

---

## Success Criteria

- A sales rep can assess the state of their entire pipeline (all stages, counts, values, next activities) in under 10 seconds of page load.
- Dragging a deal card between stages completes the stage change (visual + persisted) in under 1 second.
- Rotten deals are correctly identified and badged for 100% of deals exceeding their stage's rotting threshold.
- Switching between pipelines updates the board in under 500ms.

---

## Key Entities

| Entity | Key Fields | Relationships |
|--------|-----------|---------------|
| Pipeline | id, name, stageIds[] | has many Stages |
| Stage | id, name, order, pipelineId, rottingDays | belongs to Pipeline, has many Deals |
| Deal | id, title, value, currency, stageId, pipelineId, orgId, personId, status, lastActivityDate, nextActivityDate, nextActivityType, createdAt, updatedAt | belongs to Stage, Pipeline, Person, Org |
| Organization | id, name | linked to Deal |
| Activity | id, type, subject, dueDate, dealId, done | belongs to Deal |

---

## Out of Scope

- Calendar or Forecast alternative views (separate features: 011-forecast-view)
- Deals with status "won" or "lost" (shown in Archive: 012-deal-archive)
- Stage management / editing pipeline structure (Settings feature)
- Email sync or external calendar integration
- Bulk deal operations (covered in 003-deals-list)

---

## Assumptions

- The default pipeline is pre-selected when the board loads; the user does not need to choose a pipeline on first visit.
- Deal rotting threshold is configured per stage in Settings; a `null` threshold means the stage has no rotting.
- The single user (`user-1`) is the owner of all deals in the mock data.
- Horizontal scrolling handles pipelines with more stages than fit in the viewport.
- Drag-and-drop is the primary interaction for stage changes; clicking a stage in the deal detail's progress bar is a secondary mechanism (covered in 002-deal-detail).

---

## Dependencies

- Pipeline and Stage data must be seeded (`backend/data/pipelines.json`, `backend/data/stages.json`)
- Deal data with varying stages must be seeded (`backend/data/deals.json`)
- Activity data linked to deals required for next-activity badges (`backend/data/activities.json`)
