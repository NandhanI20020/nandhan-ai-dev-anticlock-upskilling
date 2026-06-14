# Feature Specification: Activities

**Feature Branch**: `007-activities`
**Created**: 2026-06-15
**Status**: Draft

---

## User Scenarios & Testing

### User Story 1 (P1): View all activities in a time-scoped list
**As a** sales representative,
**I want to** see all my activities organized by time scope (Overdue, Today, Tomorrow, This Week, To-do, Done),
**So that** I know exactly what I need to do today and what I've missed.

**Acceptance criteria**:
- [ ] Tab bar with time-scope options: To-do | Overdue | Today | Tomorrow | This Week | Done
- [ ] "Overdue" tab shows activities with dueDate before today and done=false, sorted oldest-first
- [ ] "Today" tab shows activities due today (done or not)
- [ ] "Tomorrow" and "This Week" show upcoming activities in their respective windows
- [ ] "Done" tab shows completed activities sorted by doneAt descending
- [ ] Each activity row shows: type icon, subject, linked deal/person/org name, due date/time, and a "Mark done" button
- [ ] Activity counts are shown on each tab (e.g. "Overdue (3)")

**Independent test**: Seed 3 overdue activities, 2 due today — verify "Overdue (3)" and "Today (2)" counts on tabs; correct activities appear under each tab.

---

### User Story 2 (P1): Mark an activity as done
**As a** sales representative,
**I want to** mark an activity as completed directly from the activities list,
**So that** I can track my progress and keep the list focused on what's still outstanding.

**Acceptance criteria**:
- [ ] Each activity row has a "Mark done" checkbox or button
- [ ] Clicking it marks the activity done and moves it out of the current time-scope tab
- [ ] A brief confirmation (e.g. activity row fades/moves) gives visual feedback
- [ ] The activity appears in the "Done" tab after being marked complete
- [ ] The tab counts update immediately

**Independent test**: Click "Mark done" on an overdue activity — verify it disappears from "Overdue" and appears in "Done".

---

### User Story 3 (P1): Filter activities by type
**As a** sales representative,
**I want to** filter the activities list to show only a specific type (Call, Meeting, Task, Email, Deadline),
**So that** I can focus on a single kind of activity without distraction.

**Acceptance criteria**:
- [ ] Activity type filter pills are visible: All | Call | Meeting | Task | Email | Deadline
- [ ] Clicking a pill filters the current tab's list to that activity type
- [ ] The active filter pill is visually highlighted
- [ ] Clicking "All" removes the type filter

**Independent test**: Click "Call" pill while on Today tab — verify only Call-type activities for today are shown.

---

### User Story 4 (P1): See activity KPI summary cards
**As a** sales manager,
**I want to** see key performance metrics at the top of the activities view (completion rate, response time, urgent count),
**So that** I can gauge team activity health at a glance without drilling into individual records.

**Acceptance criteria**:
- [ ] KPI cards are displayed at the top of the page: Completion Rate (%), Avg Response Time (hours), Urgent Tasks (count)
- [ ] Completion Rate = done activities / total activities in the last 30 days
- [ ] Urgent Tasks = overdue activities count
- [ ] Cards update when date scope or filters change

**Independent test**: With 8 done and 2 open activities in last 30 days — verify Completion Rate card shows 80%.

---

### User Story 5 (P2): Create a new activity
**As a** sales representative,
**I want to** create a new activity from the activities page,
**So that** I can schedule a call, meeting, or task without opening a specific deal or contact.

**Acceptance criteria**:
- [ ] A "+ Activity" button is visible in the toolbar
- [ ] Clicking it opens a creation form: type, subject, due date, due time, note, linked deal (optional), linked person (optional), linked org (optional)
- [ ] After saving, the new activity appears in the correct time-scope tab immediately
- [ ] Type and subject are required; all other fields are optional

**Independent test**: Click "+ Activity", create a Call due tomorrow — verify it appears in "Tomorrow" tab.

---

### User Story 6 (P2): Edit or delete an activity
**As a** sales representative,
**I want to** edit an activity's subject, date, or linked records, or delete it,
**So that** I can correct mistakes or remove cancelled activities.

**Acceptance criteria**:
- [ ] An overflow "..." menu on each activity row offers: Edit, Delete
- [ ] Edit opens the activity creation form pre-filled with current values
- [ ] Save updates the activity in place; Cancel discards changes
- [ ] Delete asks for confirmation, then removes the activity

**Independent test**: Edit a Call's subject to "Rescheduled follow-up" → Save → verify updated subject shows in list.

---

### User Story 7 (P2): Toggle to Calendar view
**As a** sales representative,
**I want to** view my activities on a calendar grid instead of a list,
**So that** I can see how my schedule is distributed across days and avoid double-booking.

**Acceptance criteria**:
- [ ] A List / Calendar toggle is visible in the toolbar
- [ ] Calendar view shows a monthly grid with activity dots/chips on their due dates
- [ ] Clicking a date shows the activities due on that day
- [ ] Clicking an activity chip navigates to its linked deal or opens an edit form

**Independent test**: Switch to Calendar view — verify activity dots appear on correct dates; click a date with 2 activities to see both listed.

---

### User Story 8 (P3): Filter activities by linked deal, person, or org
**As a** sales manager,
**I want to** filter activities by the deal, person, or organization they are linked to,
**So that** I can see all activities for a specific account without navigating to that record.

**Acceptance criteria**:
- [ ] Advanced filter supports: linked deal (search/select), linked person (search/select), linked org (search/select), owner, date range
- [ ] Active filters show as removable chips above the list
- [ ] Filtered results update immediately

**Independent test**: Filter by linked org "Acme Corp" — only activities linked to Acme Corp appear.

---

## Functional Requirements

- **FR-01**: The activities page must show time-scope tabs: To-do, Overdue, Today, Tomorrow, This Week, Done — each with an activity count badge.
- **FR-02**: Each tab must show only activities matching its time scope; Overdue = past due + not done; Done = done=true.
- **FR-03**: Activity type filter pills (All, Call, Meeting, Task, Email, Deadline) must filter within the active tab.
- **FR-04**: Each activity row must show: type icon, subject, linked record name (deal/person/org), due date/time, Mark Done control, and an overflow menu.
- **FR-05**: Marking an activity done must set done=true and doneAt=now; the activity must move to the Done tab immediately.
- **FR-06**: KPI summary cards must display: Completion Rate (%), Avg Response Time (hours), Urgent Tasks count — computed from the last 30 days of activity data.
- **FR-07**: A "+ Activity" action must open a form for creating activities; type and subject are required.
- **FR-08**: An overflow menu per activity row must offer Edit and Delete; Delete requires confirmation.
- **FR-09**: A List/Calendar toggle must switch between the list view and a monthly calendar grid view.
- **FR-10**: Advanced filters must support: linked deal, linked person, linked org, owner, due date range.

---

## Success Criteria

- A sales rep can see all overdue activities and mark the top one done in under 30 seconds of landing on the page.
- Tab switching updates the list in under 200ms.
- Activity counts on tabs are accurate for 100% of seeded test scenarios.
- Creating a new activity takes under 60 seconds.

---

## Key Entities

| Entity | Key Fields | Relationships |
|--------|-----------|---------------|
| Activity | id, type, subject, dueDate, dueTime, done, doneAt, outcome, note, dealId, personId, orgId, ownerId, createdAt | belongs to Deal, Person, Org |
| Deal | id, title | referenced for display |
| Person | id, name | referenced for display |
| Organization | id, name | referenced for display |

---

## Out of Scope

- Email sync or calendar integration (Google Calendar, Outlook)
- Recurring activities / recurring reminders
- Activity assignment to other team members (single-user app)
- Push notifications for due activities

---

## Assumptions

- All activities belong to user-1 (single-user app).
- "This Week" = Monday through Sunday of the current calendar week.
- Calendar view shows the current month by default with prev/next month navigation.
- Avg Response Time is the average time from activity creation to doneAt for completed activities.

---

## Dependencies

- Activity seed data (backend/data/activities.json) shared with features 001, 002, 005, 006
- Deal, Person, Organization data for linked-record display
