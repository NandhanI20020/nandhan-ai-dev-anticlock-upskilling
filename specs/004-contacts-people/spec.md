# Feature Specification: Contacts — People List

**Feature Branch**: `004-contacts-people`
**Created**: 2026-06-15
**Status**: Draft

---

## User Scenarios & Testing

### User Story 1 (P1): Browse all contacts in a searchable, sortable table
**As a** sales representative,
**I want to** see all contacts in a table with their name, organization, email, phone, deal count, and last activity status,
**So that** I can quickly find and assess any contact without opening individual records.

**Acceptance criteria**:
- [ ] All contacts are displayed as rows with columns: Name, Organization, Email, Phone, Deals, Last Action
- [ ] Name cell shows the contact's avatar (initials-based colored circle), full name, and job title
- [ ] Deals column shows the number of open deals linked to the contact
- [ ] Last Action column shows a relative time and an activity status badge (Active / Overdue / New contact)
- [ ] Clicking a contact's name navigates to their Person Detail page
- [ ] Columns are sortable by clicking the header

**Independent test**: Load the people list with 20 seeded contacts — verify all appear with correct name/org/email/deal-count, and clicking a name navigates to the correct detail page.

---

### User Story 2 (P1): Add a new contact
**As a** sales representative,
**I want to** create a new contact person from the people list,
**So that** I can add a prospect or new stakeholder to the CRM immediately.

**Acceptance criteria**:
- [ ] A "+ Person" button is visible in the toolbar
- [ ] Clicking the button opens a contact creation form
- [ ] Form fields include: first name, last name, email(s), phone(s), organization, job title, label(s)
- [ ] Multiple emails and phone numbers can be added with type labels (Work, Home, Mobile)
- [ ] After saving, the new contact appears in the list immediately
- [ ] Duplicate email validation: if an email already exists, the user is notified

**Independent test**: Click "+ Person", enter name "Priya Mehta", email "p.mehta@apex.com", save — verify Priya appears in the list.

---

### User Story 3 (P1): Filter contacts by assignment and recency
**As a** sales manager,
**I want to** quickly filter contacts to show "Assigned to Me" or "Added in the Last 30 Days",
**So that** I can focus on my own contacts or recently added prospects.

**Acceptance criteria**:
- [ ] Quick filter chips are available for: "Assigned To: Me", "Added: Last 30 Days"
- [ ] Clicking a chip applies that filter and shows only matching contacts
- [ ] Active filter chips have a visible remove (×) button
- [ ] Multiple quick filters can be applied simultaneously (AND logic)
- [ ] An "Advanced Filters" option opens a full filter builder

**Independent test**: Click "Assigned To: Me" — verify only contacts owned by user-1 appear.

---

### User Story 4 (P2): Apply advanced filters to narrow the contact list
**As a** sales manager,
**I want to** filter contacts by label, organization, deal status, last activity date, and other fields,
**So that** I can build targeted lists for outreach campaigns or pipeline reviews.

**Acceptance criteria**:
- [ ] Advanced Filters opens a filter builder supporting fields: Label, Organization, Deal count (range), Last activity date (range), Owner, Created date (range)
- [ ] Active conditions render as chips above the table
- [ ] Filters can be cleared individually or all at once
- [ ] Active filter sets can be saved as named views

**Independent test**: Filter "Label = Hot Lead" — verify only contacts with that label appear.

---

### User Story 5 (P2): Export contacts to CSV
**As a** sales manager,
**I want to** export the current view of contacts as a CSV file,
**So that** I can use contact data in external tools or share it with the team.

**Acceptance criteria**:
- [ ] An "Export" button is visible in the toolbar
- [ ] Export downloads a CSV of all contacts matching current filters
- [ ] CSV includes: Name, Organization, Email, Phone, Deals, Owner, Created Date, Labels
- [ ] Export works correctly when filters are active (exports only filtered results)

**Independent test**: Filter to 5 contacts, export — verify CSV contains exactly 5 rows plus header.

---

### User Story 6 (P2): Bulk select and act on multiple contacts
**As a** sales manager,
**I want to** select multiple contacts and perform bulk operations,
**So that** I can manage large contact sets efficiently.

**Acceptance criteria**:
- [ ] Each row has a checkbox; header checkbox selects/deselects all
- [ ] Selecting contacts shows a bulk action bar with: Delete, Assign Owner, Add Label, Export
- [ ] Bulk Delete requires confirmation
- [ ] After bulk action, table refreshes and selection clears

**Independent test**: Select 5 contacts, add label "VIP" — verify all 5 now show the VIP label.

---

### User Story 7 (P3): Identify contacts needing follow-up via activity status
**As a** sales representative,
**I want to** see at a glance which contacts have overdue activities or are newly added,
**So that** I can prioritize who to reach out to without running a separate report.

**Acceptance criteria**:
- [ ] "Last Action" column shows a colored status badge: "Active" (green), "Overdue" (orange), "New contact" (grey)
- [ ] "Overdue" badge appears when the contact has an activity that is past its due date and not marked done
- [ ] "New contact" appears for contacts created within the last 7 days with no logged activities
- [ ] The relative time of the last action ("Called Today", "Emailed 2 days ago") is shown alongside the badge

**Independent test**: Seed a contact with an overdue activity — verify "Overdue" orange badge appears on their row.

---

### User Story 8 (P3): Merge duplicate contacts
**As a** sales manager,
**I want to** merge two duplicate contact records into one,
**So that** the CRM stays clean and all linked deals and activities consolidate under a single record.

**Acceptance criteria**:
- [ ] A "Merge Duplicates" option is accessible from the Contacts sub-navigation
- [ ] Users can search for and select two contacts to merge
- [ ] A side-by-side comparison shows both contacts' fields; user chooses which values to keep
- [ ] After merging, all linked deals, activities, and notes from both records are associated with the surviving record
- [ ] The duplicate record is deleted

**Independent test**: Merge two seeded contacts — verify the surviving record has both contacts' deals and activities combined.

---

## Functional Requirements

- **FR-01**: The people list must display all contacts in a table with columns: Name (avatar + full name + job title), Organization, Email, Phone, Deals count, Last Action (status badge + relative time).
- **FR-02**: The table must be sortable by clicking any column header.
- **FR-03**: Clicking a contact name must navigate to the Person Detail page.
- **FR-04**: A "+ Person" action must open a contact creation form supporting multiple emails and phones with type labels.
- **FR-05**: Quick filter chips for "Assigned To: Me" and "Added: Last 30 Days" must filter the list immediately on click.
- **FR-06**: An Advanced Filters builder must support filtering by: label, organization, deal count, last activity date, owner, and created date.
- **FR-07**: Active filter conditions must render as removable chips; filter sets must be saveable as named views.
- **FR-08**: An Export button must download a CSV of the current (filtered) contact list.
- **FR-09**: Row checkboxes and a header checkbox must enable multi-select with a bulk action bar (Delete, Assign Owner, Add Label, Export).
- **FR-10**: The Last Action column must display a colored status badge (Active / Overdue / New contact) and relative time of last interaction.
- **FR-11**: A "Merge Duplicates" workflow must allow selecting two contacts, comparing fields side-by-side, and merging into one record.
- **FR-12**: Merging contacts must consolidate all linked deals, activities, and notes onto the surviving record and delete the duplicate.
- **FR-13**: An "Import Contacts" option must be accessible (detailed in the Import/Export feature).
- **FR-14**: The list must be paginated with a count label ("Showing X to Y of Z contacts").

---

## Success Criteria

- Sales reps can find any contact by name or organization in under 10 seconds.
- The people list renders 25 rows in under 500ms.
- Creating a new contact takes under 60 seconds including form fill and save.
- Bulk actions complete for up to 50 selected contacts in under 3 seconds.

---

## Key Entities

| Entity | Key Fields | Relationships |
|--------|-----------|---------------|
| Person | id, name, emails[], phones[], orgId, jobTitle, labelIds, ownerId, createdAt, updatedAt | belongs to Organization |
| Organization | id, name | linked to Person |
| Activity | id, done, dueDate, personId | used to compute Last Action status |
| Label | id, name, color | applied to Person |

---

## Out of Scope

- Contact timeline (cross-entity feed — separate feature)
- Person detail view (005-person-detail)
- Organization list and detail (006-organizations)

---

## Assumptions

- "Last Action" status is computed from the contact's most recent activity: if any open activity is past due → Overdue; if created within 7 days and no activities → New contact; otherwise → Active.
- The contact list defaults to showing all contacts sorted by last updated date (most recent first).
- Labels are shared across People, Organizations, and Deals (managed in Settings).

---

## Dependencies

- Person and Organization seed data required
- Activity seed data required for Last Action status computation
- Label seed data required
