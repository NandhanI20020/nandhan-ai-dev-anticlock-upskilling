# Feature Specification: Deal Detail View

**Feature Branch**: `002-deal-detail`
**Created**: 2026-06-15
**Status**: Draft

---

## User Scenarios & Testing

### User Story 1 (P1): View all information about a deal on one page
**As a** sales representative,
**I want to** open a deal and see its value, contacts, organization, stage, and activity history in one place,
**So that** I have everything I need to prepare for a sales interaction without switching screens.

**Acceptance criteria**:
- [ ] The deal title is displayed prominently at the top of the page
- [ ] The current pipeline stage is shown in a visual stage progress bar
- [ ] Deal value, expected close date, probability, and lead source are displayed
- [ ] The linked contact person (name, email, phone) is visible
- [ ] The linked organization (name, address) is visible
- [ ] The complete activity history is displayed in chronological order (newest first)
- [ ] The page shows both upcoming and past activities in the same feed

**Independent test**: Navigate to `/deals/deal-001` — verify title, stage, value, contact, org, and at least one seeded activity all appear correctly.

---

### User Story 2 (P1): Update deal fields without leaving the page
**As a** sales representative,
**I want to** edit the deal's title, value, close date, and other fields inline on the detail page,
**So that** I can keep deal data current as conversations evolve without opening a separate edit form.

**Acceptance criteria**:
- [ ] Clicking the deal title activates an inline text editor; pressing Enter or clicking away saves the change
- [ ] Clicking the deal value activates an inline number editor
- [ ] Clicking the close date activates an inline date picker
- [ ] Clicking the probability activates an inline number editor (0–100)
- [ ] Pressing Escape on any inline editor cancels the edit and restores the previous value
- [ ] Changes persist after page refresh

**Independent test**: Click the deal title, change it, press Enter — verify the new title appears on the page and persists after a hard refresh.

---

### User Story 3 (P1): Mark a deal as Won or Lost
**As a** sales representative,
**I want to** mark a deal as Won or Lost directly from the detail page,
**So that** I can close out a deal and record the outcome without navigating away.

**Acceptance criteria**:
- [ ] "Won" and "Lost" action buttons are clearly visible in the deal header
- [ ] Clicking "Won" opens a confirmation dialog where the user can optionally add a note; confirming marks the deal won
- [ ] Clicking "Lost" opens a dialog where the user must select a loss reason; confirming marks the deal lost
- [ ] After marking won/lost, the deal's status changes and the stage progress bar reflects the closed state
- [ ] A system event ("Deal marked as Won" or "Deal marked as Lost") appears in the activity feed with a timestamp

**Independent test**: Click "Won" → confirm → verify deal status changes to "won" and the event appears in the feed.

---

### User Story 4 (P1): Advance a deal through pipeline stages from the detail view
**As a** sales representative,
**I want to** click on a stage in the visual progress bar to move the deal to that stage,
**So that** I can change the deal's stage without going back to the kanban board.

**Acceptance criteria**:
- [ ] The stage progress bar displays all pipeline stages as clickable chevron segments
- [ ] The currently active stage is visually highlighted
- [ ] Completed (past) stages are displayed in a distinct "done" style
- [ ] Clicking a future stage moves the deal to that stage
- [ ] Clicking a past stage triggers a confirmation prompt before moving backward
- [ ] Each stage segment displays the number of days the deal spent (or has spent) in that stage
- [ ] A stage-change system event appears in the activity feed

**Independent test**: Click the "Negotiation" stage on a deal currently in "Proposal Made" — verify the stage bar updates and a stage-change event appears in the feed.

---

### User Story 5 (P2): Log an activity (call, meeting, task, email, deadline) from the detail page
**As a** sales representative,
**I want to** log a new activity directly from the deal detail page,
**So that** I can record what happened or schedule a follow-up without switching to the Activities screen.

**Acceptance criteria**:
- [ ] Quick-log buttons for each activity type (Call, Meeting, Task, Email, Deadline) are visible above the activity feed
- [ ] Clicking an activity type shows an inline form with: subject, due date/time, note, and contact fields
- [ ] Saving the form adds the activity to the feed immediately (no page reload required)
- [ ] The new activity appears at the top of the upcoming section with the correct type icon
- [ ] The deal's "last activity date" updates to the current date/time

**Independent test**: Click "Call", enter subject "Follow-up call", set due date to tomorrow, save — verify the activity appears in the feed with a phone icon and tomorrow's date.

---

### User Story 6 (P2): Add and view notes on a deal
**As a** sales representative,
**I want to** write and read notes attached to a deal,
**So that** I can record context, meeting outcomes, and important details that don't fit into structured fields.

**Acceptance criteria**:
- [ ] A note composer is available in the Notes tab
- [ ] Notes can be written as plain text and saved with a "Save Note" button
- [ ] Saved notes appear in the activity feed in chronological order with author and timestamp
- [ ] Notes are distinguishable from activity log entries (different visual treatment)
- [ ] Notes can be edited and deleted after creation

**Independent test**: Write "Met client at HQ, very interested" and save — verify the note appears in the feed with the current timestamp.

---

### User Story 7 (P2): View linked people and organization on the deal
**As a** sales representative,
**I want to** see the contact person and organization linked to the deal, with their key contact details,
**So that** I can reach out directly from the deal page without searching for their contact info separately.

**Acceptance criteria**:
- [ ] The linked person's name, email, and phone number are displayed in the left panel
- [ ] The linked organization's name and address are displayed below the person
- [ ] Clicking the person's name navigates to their Person Detail page
- [ ] Clicking the organization's name navigates to the Org Detail page
- [ ] An "Add person" link allows linking an additional participant

**Independent test**: On a seeded deal linked to "Sarah Jenkins" at "Acme Corp Holdings" — verify both appear in the left panel with correct details and navigation links.

---

### User Story 8 (P3): See a mixed activity and history feed
**As a** sales representative,
**I want to** see all interactions with a deal — activities, notes, emails, and stage changes — in a single chronological feed,
**So that** I have the full story of a deal without switching tabs.

**Acceptance criteria**:
- [ ] The feed displays all of: logged activities, saved notes, stage-change events, and Won/Lost events
- [ ] Each feed item has a type icon (phone, note, building, trophy, etc.) and relative timestamp
- [ ] Date dividers ("Today", "Yesterday", "June 10") separate feed items by day
- [ ] Completed activities display a "Done" visual treatment (strikethrough or checkmark)
- [ ] Overdue activities are visually highlighted in a warning color

**Independent test**: Seed a deal with 1 activity (done), 1 note, and 1 stage change — verify all three appear in the feed in the correct order with correct icons.

---

## Functional Requirements

- **FR-01**: The deal detail page must display: title, pipeline, current stage, value, currency, expected close date, probability, lead source, owner, and creation date.
- **FR-02**: The stage progress bar must show all stages in the deal's pipeline as ordered, labeled chevron segments.
- **FR-03**: The currently active stage must be visually distinguished. Past stages must appear "completed." Future stages must appear inactive.
- **FR-04**: Each stage segment must display the number of days the deal has spent (or spent) in that stage.
- **FR-05**: Clicking a stage segment must move the deal to that stage; clicking a past stage must require confirmation.
- **FR-06**: Every stage change must append a system event to the activity feed with the stage names and timestamp.
- **FR-07**: The deal title, value, close date, and probability must be editable inline (click to edit, Enter/blur to save, Esc to cancel).
- **FR-08**: The linked person (name, email, phone) and linked organization (name, address) must be displayed and linkable to their detail pages.
- **FR-09**: "Won" and "Lost" buttons must be visible and functional; "Won" prompts for an optional note; "Lost" requires a loss reason.
- **FR-10**: Marking won or lost must append a system event to the activity feed.
- **FR-11**: Quick-log buttons for all 5 activity types must be visible above the feed; clicking one opens an inline form.
- **FR-12**: Saved activities must appear in the feed immediately without requiring a page reload.
- **FR-13**: A Notes tab must allow writing and saving plain-text notes; notes must appear in the feed with author and timestamp.
- **FR-14**: The activity feed must render all of: logged activities, notes, stage-change events, Won/Lost events — in reverse chronological order with date dividers.
- **FR-15**: Overdue activities in the feed must be visually distinguished (warning color on subject text and due date).

---

## Success Criteria

- A sales rep can load a deal and identify the next action (next activity, stage, key contact) in under 5 seconds.
- Inline edits (title, value, close date) save and confirm in under 1 second.
- Marking a deal Won or Lost requires no more than 2 clicks after landing on the detail page.
- The activity feed correctly interleaves all event types in chronological order for 100% of tested deals.

---

## Key Entities

| Entity | Key Fields | Relationships |
|--------|-----------|---------------|
| Deal | id, title, value, currency, stageId, pipelineId, ownerId, personId, orgId, status, expectedCloseDate, probability, lostReason, wonTime, lostTime, source | belongs to Stage, Pipeline, Person, Org |
| StageTimeEntry | dealId, stageId, enteredAt, exitedAt | belongs to Deal and Stage |
| Activity | id, type, subject, dueDate, dueTime, dealId, personId, done, doneAt, note, outcome | belongs to Deal |
| Note | id, content, dealId, ownerId, createdAt | belongs to Deal |
| Person | id, name, emails[], phones[], orgId | linked to Deal |
| Organization | id, name, address | linked to Deal |

---

## Out of Scope

- Email thread viewing (Sales Inbox feature)
- File/document attachments (Files feature)
- Products added to deals (Products feature)
- Custom fields (Settings / Custom Fields feature)
- Multiple linked people / participants beyond the primary contact

---

## Assumptions

- The activity feed is the primary collaboration surface; the page does not need a separate "History" tab.
- Stage time tracking begins the moment a deal is created (initial stage entry is logged automatically).
- The "Lost reason" field is a free-text input; a predefined list of reasons is a future enhancement.
- Probability (0–100) is manually entered; no automatic probability calculation in v1.

---

## Dependencies

- 001-pipeline-kanban: Pipeline and Stage data structures
- Deal, Activity, Note seed data required
- Person and Organization seed data required for linked-entity display
