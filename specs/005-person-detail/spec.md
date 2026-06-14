# Feature Specification: Person Detail View

**Feature Branch**: `005-person-detail`
**Created**: 2026-06-15
**Status**: Draft

---

## User Scenarios & Testing

### User Story 1 (P1): View a contact's complete profile and contact details
**As a** sales representative,
**I want to** open a contact and see all their details (email, phone, LinkedIn, address, organization, job title) in one place,
**So that** I can reach out to them or prepare for a call without searching across multiple records.

**Acceptance criteria**:
- [ ] Person name is displayed as the page title with a large avatar (initials-based)
- [ ] Organization name and job title are displayed below the name
- [ ] Email addresses are displayed with their type label (Work, Home) and are clickable as mailto links
- [ ] Phone numbers are displayed with their type label and are clickable as tel links
- [ ] LinkedIn URL is displayed as a clickable external link (if set)
- [ ] Physical address is displayed (if set)

**Independent test**: Navigate to `/contacts/people/person-001` — verify name, org, job title, email, phone, and LinkedIn all display correctly.

---

### User Story 2 (P1): See all active deals linked to this contact
**As a** sales representative,
**I want to** see all deals linked to this contact person on their detail page,
**So that** I know the full commercial context of the relationship before reaching out.

**Acceptance criteria**:
- [ ] An "Active Deals" section lists all open deals linked to this person
- [ ] Each deal shows: title, value, stage name, next activity status (e.g. "Proposal Sent · Expected Oct 22" or "Needs Follow-up · Stalled 4 days")
- [ ] Deals with overdue activities are visually distinguished (orange accent)
- [ ] Clicking a deal navigates to the Deal Detail page
- [ ] A deal count badge shows the total number of active deals ("2 ACTIVE")

**Independent test**: Navigate to a person linked to 2 seeded deals — verify both appear with correct titles, values, and stage descriptions.

---

### User Story 3 (P1): Log a note about this contact
**As a** sales representative,
**I want to** write and save a note on the contact's detail page,
**So that** I can record context from a conversation or meeting directly on their record.

**Acceptance criteria**:
- [ ] A note composer is visible in the Activity Notes tab
- [ ] Users can write plain text notes and save with a "Save Note" button
- [ ] Saved notes appear in the activity history feed immediately with timestamp and author
- [ ] Notes are distinguished visually from other feed events (activities, system events)

**Independent test**: Write "Interested in enterprise plan, follow up next week" and save — verify it appears in the feed with the current date.

---

### User Story 4 (P1): View the full activity history for a contact
**As a** sales representative,
**I want to** see a chronological feed of all interactions with this contact (calls logged, emails, notes, tasks completed),
**So that** I have full context on the relationship history before my next interaction.

**Acceptance criteria**:
- [ ] Activity history displays all logged activities, notes, and system events for this person in reverse chronological order
- [ ] Each feed item shows: event type icon, description, timestamp, and any associated deal name
- [ ] Call outcomes are displayed alongside call log entries (e.g. "CALL OUTCOME: POSITIVE")
- [ ] Email engagement data is shown on email entries (e.g. "OPENED 3 TIMES")
- [ ] Completed tasks display with strikethrough on the subject
- [ ] System events (e.g. "Added to CRM from LinkedIn Import") appear as timeline entries

**Independent test**: Seed a person with 1 call log (positive outcome), 1 email (opened twice), 1 completed task — verify all three appear in the feed with correct icons and metadata.

---

### User Story 5 (P2): Edit contact information inline
**As a** sales representative,
**I want to** update a contact's email, phone, job title, or linked organization directly on their detail page,
**So that** I can keep contact data accurate as I learn new information.

**Acceptance criteria**:
- [ ] An "Edit" button in the page header opens the contact's fields for editing
- [ ] Fields editable: name, email(s) + type, phone(s) + type, LinkedIn URL, address, job title, organization
- [ ] Additional emails/phones can be added and removed
- [ ] Changes are saved with a "Save" button and reflected immediately on the page
- [ ] Cancel discards all changes

**Independent test**: Click Edit, change email to "new@email.com", save — verify the new email appears on the page.

---

### User Story 6 (P2): Log a call from the contact page
**As a** sales representative,
**I want to** log a completed call directly from the contact's detail page,
**So that** I can record the outcome and notes immediately after hanging up.

**Acceptance criteria**:
- [ ] A "Log Call" tab or button is visible in the right panel
- [ ] The call log form includes: subject, duration (minutes), outcome (free text), note, linked deal (optional), date/time
- [ ] After saving, a call log entry appears in the activity history feed with the outcome highlighted
- [ ] The contact's "Last Action" status updates to reflect the logged call

**Independent test**: Log a call with outcome "Discussed pricing, positive" — verify it appears in the feed with a phone icon and the outcome text highlighted.

---

### User Story 7 (P2): Create a new deal from the contact's page
**As a** sales representative,
**I want to** create a deal directly from a contact's detail page with the contact pre-linked,
**So that** I can capture a new opportunity without re-entering contact details manually.

**Acceptance criteria**:
- [ ] An "+ Add Deal" button is visible in the page header
- [ ] Clicking it opens the Add Deal modal with the contact person pre-filled
- [ ] After saving, the new deal appears in the "Active Deals" section on the contact page
- [ ] The deal also appears in the Pipeline Kanban board

**Independent test**: Click "+ Add Deal" from person "Alex Marshall" — verify the modal pre-fills Alex Marshall as the contact person.

---

### User Story 8 (P3): Manage labels on a contact
**As a** sales manager,
**I want to** add and remove labels (e.g. "Hot Lead", "VIP", "At Risk") on a contact record,
**So that** I can categorize contacts for targeted filtering and list views.

**Acceptance criteria**:
- [ ] Labels are shown on the contact's profile
- [ ] Clicking an "Add label" control opens a label picker showing all available labels
- [ ] Selecting a label adds it to the contact immediately
- [ ] Labels can be removed by clicking × on the label tag
- [ ] Label changes persist after page refresh

**Independent test**: Add the label "Hot Lead" to a contact — verify it appears on their profile and in the people list.

---

## Functional Requirements

- **FR-01**: The person detail page must display: name (with large avatar), organization name + job title (linked below name), all emails with type labels, all phones with type labels, LinkedIn URL, and address.
- **FR-02**: All email and phone values must be interactive (mailto and tel links respectively).
- **FR-03**: An "Active Deals" section must list all open deals linked to the person with title, value, stage, and next activity status.
- **FR-04**: Deals with overdue follow-up must be visually distinguished from deals on track.
- **FR-05**: Clicking a linked deal must navigate to the Deal Detail page.
- **FR-06**: An "+ Add Deal" button must open the Add Deal modal with the person pre-linked.
- **FR-07**: A note composer must be available to write and save plain-text notes; saved notes must appear in the activity feed.
- **FR-08**: The activity history feed must display all logged activities, notes, and system events for the person in reverse chronological order.
- **FR-09**: Call log entries must display the call outcome. Email entries must display open/engagement counts.
- **FR-10**: Completed tasks in the feed must show strikethrough formatting.
- **FR-11**: An "Edit" action must allow updating all contact fields (name, emails, phones, LinkedIn, address, job title, org).
- **FR-12**: A "Log Call" form must capture: subject, outcome, duration, note, and optional linked deal; the entry must appear in the feed.
- **FR-13**: Labels must be addable and removable via a label picker; changes must persist immediately.
- **FR-14**: The page must use a two-column layout: left panel (contact fields + active deals), right panel (activity feed tabs).

---

## Success Criteria

- A rep can find a contact's phone number, email, and most recent activity in under 5 seconds of landing on the page.
- Logging a call (form fill + save) takes under 30 seconds.
- Creating a new deal from the contact page takes under 60 seconds.
- Activity feed correctly orders all event types chronologically for 100% of tested contacts.

---

## Key Entities

| Entity | Key Fields | Relationships |
|--------|-----------|---------------|
| Person | id, name, emails[], phones[], orgId, jobTitle, linkedinUrl, address, labelIds | belongs to Org |
| Organization | id, name | linked to Person |
| Deal | id, title, value, stageId, personId, nextActivityDate, status | linked to Person |
| Activity | id, type, subject, dueDate, done, doneAt, outcome, personId | belongs to Person |
| Note | id, content, personId, createdAt | belongs to Person |
| Label | id, name, color | applied to Person |

---

## Out of Scope

- Email inbox / thread viewing (Sales Inbox feature)
- File attachments on person records
- Custom fields on person records (Settings feature)

---

## Assumptions

- The activity feed combines activities, notes, and system events into a single unified timeline (no separate tabs for each type).
- Call duration is optional; entering it is a best practice but not required.
- Organization link is editable — a person can be moved to a different organization.

---

## Dependencies

- 004-contacts-people: Person data structures and list view
- 006-organizations: Organization data for linked org display
- 002-deal-detail: Deal data for Active Deals section
- 007-activities: Activity data for feed
