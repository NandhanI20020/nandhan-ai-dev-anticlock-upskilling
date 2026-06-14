# Feature Specification: Organizations

**Feature Branch**: `006-organizations`
**Created**: 2026-06-15
**Status**: Draft

---

## User Scenarios & Testing

### User Story 1 (P1): Browse all organizations in a sortable table
**As a** sales representative,
**I want to** see all companies in a table with their name, people count, deal counts by status, owner, and last activity,
**So that** I can quickly assess which accounts are active and which need attention.

**Acceptance criteria**:
- [ ] All organizations are displayed as rows with columns: Name, People, Open Deals, Won Deals, Owner, Last Activity
- [ ] People column shows a stack of contact avatars (up to 3 visible, "+N more" if more)
- [ ] Open/Won deal counts are shown as colored badges (open = neutral, won = green)
- [ ] Clicking an organization name navigates to the Org Detail page
- [ ] Columns are sortable by clicking the header (Name, Open Deals, Last Activity)

**Independent test**: Load org list with 10 seeded orgs — verify all rows appear with correct people counts, deal badges, and name-click navigation.

---

### User Story 2 (P1): Add a new organization
**As a** sales representative,
**I want to** create a new organization from the organizations list,
**So that** I can add a prospective company to the CRM immediately.

**Acceptance criteria**:
- [ ] A "+ Organization" button is visible in the toolbar
- [ ] Clicking it opens a creation form with fields: name, address, phone, website, owner
- [ ] Name is required; all other fields are optional
- [ ] After saving, the new organization appears in the list immediately
- [ ] Duplicate name warning: if an org with the same name exists, the user is notified (not blocked)

**Independent test**: Click "+ Organization", enter name "Apex Technologies", save — verify it appears in the list.

---

### User Story 3 (P1): View all information about an organization
**As a** sales representative,
**I want to** open an organization and see its company info, linked contacts, and active deals in one place,
**So that** I have the full account picture before a call or meeting.

**Acceptance criteria**:
- [ ] The organization name is displayed as the page title
- [ ] Left panel shows: name (inline-editable), address, phone, website (clickable link), owner, labels
- [ ] Left panel shows a "People" section listing all contacts linked to this org (name, job title, avatar)
- [ ] Left panel shows an "Active Deals" section listing all open deals linked to this org
- [ ] Right panel shows the unified activity feed (activities, notes, system events) in reverse chronological order
- [ ] Clicking a linked person navigates to their Person Detail page
- [ ] Clicking a linked deal navigates to the Deal Detail page

**Independent test**: Navigate to `/contacts/organizations/org-001` — verify name, address, linked people, active deals, and at least one feed item all display correctly.

---

### User Story 4 (P2): Edit organization fields inline
**As a** sales representative,
**I want to** update an organization's name, address, phone, or website directly on the detail page,
**So that** I can keep company data current without opening a separate form.

**Acceptance criteria**:
- [ ] Clicking any editable field (name, address, phone, website) activates an inline editor
- [ ] Pressing Enter or clicking away saves the change
- [ ] Pressing Escape cancels and restores the previous value
- [ ] Changes persist after page refresh

**Independent test**: Click the organization's phone field, update it, press Enter — verify the new value appears and persists on refresh.

---

### User Story 5 (P2): Log an activity from the org detail page
**As a** sales representative,
**I want to** log a new activity (call, meeting, task, email, deadline) directly on the org detail page,
**So that** I can record account-level interactions without navigating to the Activities screen.

**Acceptance criteria**:
- [ ] Quick-log buttons for each activity type are visible above the activity feed
- [ ] Clicking a type shows an inline form: subject, due date/time, note, linked deal (optional), linked person (optional)
- [ ] Saving adds the activity to the feed immediately
- [ ] The org's "Last Activity" date updates to reflect the logged activity

**Independent test**: Click "Meeting", enter "Quarterly business review", save — verify the activity appears in the feed with a calendar icon.

---

### User Story 6 (P2): Add a note on the organization
**As a** sales representative,
**I want to** write and save a note on an organization's detail page,
**So that** I can record strategic context or meeting outcomes at the account level.

**Acceptance criteria**:
- [ ] A note composer is visible in the right panel
- [ ] Notes are saved with a "Save Note" button and appear in the feed immediately
- [ ] Notes display with author name and timestamp
- [ ] Notes can be edited and deleted after creation

**Independent test**: Write "Expanding to 3 new cities in Q3" and save — verify it appears in the feed with the current date.

---

### User Story 7 (P3): Manage labels on an organization
**As a** sales manager,
**I want to** add and remove labels on an organization,
**So that** I can categorize accounts for targeted filtering and list segmentation.

**Acceptance criteria**:
- [ ] Labels are shown on the org detail page
- [ ] An "Add label" control opens a label picker showing all available labels
- [ ] Selecting a label adds it to the org immediately
- [ ] Labels can be removed by clicking × on the label tag
- [ ] Label changes are reflected in the organizations list

**Independent test**: Add label "Key Account" to an org — verify it appears on the detail page and in the list row.

---

### User Story 8 (P3): Filter organizations by owner and activity
**As a** sales manager,
**I want to** filter the organizations list by owner or last activity date,
**So that** I can focus on a specific rep's accounts or identify stale accounts.

**Acceptance criteria**:
- [ ] Quick filter chips: "Assigned To: Me", "No Activity: Last 30 Days"
- [ ] Advanced filters support: Owner, Label, Deal count (range), Last Activity date (range), Created date
- [ ] Active filters show as removable chips above the table
- [ ] Filter results and counts update immediately

**Independent test**: Apply "Assigned To: Me" — verify only orgs owned by the current user appear.

---

## Functional Requirements

- **FR-01**: The organizations list must display all orgs in a table with columns: Name, People (avatar stack), Open Deals (count badge), Won Deals (count badge), Owner, Last Activity (relative time).
- **FR-02**: The table must be sortable by clicking column headers.
- **FR-03**: Clicking an organization name must navigate to the Org Detail page.
- **FR-04**: A "+ Organization" action must open a creation form requiring at minimum the organization name.
- **FR-05**: Duplicate name detection must warn the user (non-blocking) when a matching name already exists.
- **FR-06**: The org detail page must use a two-panel layout: left panel (org info + people + active deals), right panel (activity feed).
- **FR-07**: All org info fields (name, address, phone, website) must be inline-editable on the detail page.
- **FR-08**: The left panel must list linked contacts with name, job title, and avatar; each must link to their Person Detail page.
- **FR-09**: The left panel must list open deals linked to the org; each must link to the Deal Detail page.
- **FR-10**: Quick-log buttons for all 5 activity types must be available above the feed; clicking one opens an inline log form.
- **FR-11**: A note composer must allow writing and saving plain-text notes; notes must appear in the feed.
- **FR-12**: Labels must be manageable via a label picker (add) and × button (remove); changes must persist.
- **FR-13**: Quick filter chips ("Assigned To: Me", "No Activity: Last 30 Days") and advanced filters must narrow the organizations list.
- **FR-14**: The organizations list must be paginated with a count label.

---

## Success Criteria

- A sales rep can find an org's phone number and see all linked contacts in under 5 seconds of landing on the detail page.
- The orgs list renders 10 rows in under 500ms.
- Adding a new organization takes under 60 seconds including form fill and save.
- Activity feed correctly orders all event types chronologically for 100% of tested orgs.

---

## Key Entities

| Entity | Key Fields | Relationships |
|--------|-----------|---------------|
| Organization | id, name, address, phone, website, ownerId, labelIds[], createdAt, updatedAt | has many People, has many Deals |
| Person | id, name, jobTitle, orgId | belongs to Organization |
| Deal | id, title, value, stageId, status, orgId | belongs to Organization |
| Activity | id, type, subject, dueDate, done, orgId | belongs to Organization |
| Note | id, content, orgId, ownerId, createdAt | belongs to Organization |
| Label | id, name, color | applied to Organization |

---

## Out of Scope

- Organization hierarchy / parent-child company relationships
- Organization merge duplicates (covered if extended from 004)
- Custom fields on organization records

---

## Assumptions

- An organization can have zero linked contacts and still be a valid record.
- The activity feed combines org-level activities, notes, and system events (e.g. "Deal added", "Contact linked") into a single chronological timeline.
- "Last Activity" is the most recent activity or note date across all records linked to the org.

---

## Dependencies

- 004-contacts-people: Person data structures
- 005-person-detail: Navigation target for linked contacts
- 002-deal-detail: Navigation target for linked deals
- 007-activities: Activity data for the feed
