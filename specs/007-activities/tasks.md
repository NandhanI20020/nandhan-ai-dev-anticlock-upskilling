# Implementation Tasks: Activities

**Feature**: `specs/007-activities`
**Total tasks**: 35 | **MVP scope**: Phase 3 (US1 — time-scoped activity list)

---

## Dependencies

```
Phase 1 (Setup)
  └── Phase 2 (Foundational)
        └── Phase 3 (US1: time-scoped list)      ← entry point
              ├── Phase 4 (US2: mark done)        ← [P]
              ├── Phase 5 (US3: type filter)      ← [P]
              ├── Phase 6 (US4: KPI cards)        ← [P]
              ├── Phase 7 (US5: create activity)  ← [P]
              ├── Phase 8 (US6: edit/delete)      ← [P] after Phase 7
              ├── Phase 9 (US7: calendar view)    ← [P]
              └── Phase 10 (US8: advanced filters)← [P]
                    └── Final Phase (Polish)
```

---

## Phase 1 — Setup

- [ ] T001 Create component directory `frontend/src/components/activities/`
- [ ] T002 [P] Add `ActivityTab`, `ActivityTypeFilter`, `ActivityListItem`, `ActivityKPIs` types to `shared/types/activity.ts`

---

## Phase 2 — Foundational *(CRITICAL)*

- [ ] T003 [P] Create Express router `backend/routes/activities.ts` (stubs for all endpoints)
- [ ] T004 Register activities router in `backend/index.ts` under `/api/activities`
- [ ] T005 [P] Implement `GET /api/activities` in `backend/routes/activities.ts` (filter by `tab`, `type`, `dealId`, `personId`, `orgId`; join dealTitle/personName/orgName; compute `tabCounts` + `kpis` and include in response)
- [ ] T006 [P] Create Zustand store `frontend/src/store/activitiesStore.ts` (`{ activeTab, typeFilter, filters, view: 'list'|'calendar' }`)
- [ ] T007 Create React Query hook `frontend/src/api/useActivities.ts` (`useActivities(store)` → query keyed on tab+typeFilter+filters; returns `{ activities, tabCounts, kpis }`)

---

## Phase 3 — User Story 1 (P1): Time-scoped activity list

*Goal*: Tabs with counts; each tab shows correct scoped activities; rows show icon, subject, linked record, date.
*Independent test*: Seed 3 overdue + 2 today → "Overdue (3)" and "Today (2)" tabs + correct rows.

- [ ] T008 [P] [US1] Create `ActivityTimeTabs` component in `frontend/src/components/activities/ActivityTimeTabs.tsx` (6 tabs with count badges; click updates `activitiesStore.activeTab`)
- [ ] T009 [P] [US1] Create `ActivityRow` component in `frontend/src/components/activities/ActivityRow.tsx` (type icon from `ACTIVITY_ICONS` map; subject; linked record name; due date/time; Mark Done button stub; "..." menu stub)
- [ ] T010 [US1] Create `ActivityList` component in `frontend/src/components/activities/ActivityList.tsx` (renders `ActivityRow` list; empty state per tab)
- [ ] T011 [US1] Create `ActivitiesPage` in `frontend/src/pages/ActivitiesPage.tsx` (toolbar with List/Calendar toggle + "+ Activity" button stub; renders `ActivityTimeTabs` + `ActivityList`)
- [ ] T012 [US1] Add route `/activities` → `ActivitiesPage` in `frontend/src/App.tsx`
- [ ] T013 [US1] Add "Activities" nav link to `frontend/src/components/layout/Sidebar.tsx`

---

## Phase 4 — User Story 2 (P1): Mark activity as done

*Goal*: Mark Done button sets done=true; activity leaves current tab; appears in Done tab.
*Independent test*: Mark overdue activity done → leaves Overdue tab → appears in Done tab.

- [ ] T014 [P] [US2] Implement `PATCH /api/activities/:id/done` in `backend/routes/activities.ts` (set `done=true`, `doneAt=now`)
- [ ] T015 [US2] Add `useMarkDone` mutation to `frontend/src/api/useActivities.ts` (on success invalidate `['activities']`)
- [ ] T016 [US2] Wire Mark Done button in `ActivityRow` to `useMarkDone`; add fade-out animation class before invalidation

---

## Phase 5 — User Story 3 (P1): Type filter pills

*Goal*: Filter pills (All/Call/Meeting/Task/Email/Deadline) narrow list within the active tab.
*Independent test*: On Today tab, click "Call" → only Call activities for today shown.

- [ ] T017 [P] [US3] Create `ActivityTypeFilter` component in `frontend/src/components/activities/ActivityTypeFilter.tsx` (pill buttons; active pill highlighted; click updates `activitiesStore.typeFilter`)
- [ ] T018 [US3] Integrate `ActivityTypeFilter` below `ActivityTimeTabs` in `ActivitiesPage`

---

## Phase 6 — User Story 4 (P1): KPI summary cards

*Goal*: 3 KPI cards (Completion Rate, Avg Response Time, Urgent Tasks) at the top.
*Independent test*: 8 done + 2 open in last 30 days → Completion Rate = 80%.

- [ ] T019 [P] [US4] Create `ActivityKPICards` component in `frontend/src/components/activities/ActivityKPICards.tsx` (3 cards: completionRate as %, avgResponseTimeHours formatted as "X.Xh", urgentCount; data from `useActivities` response)
- [ ] T020 [US4] Render `ActivityKPICards` above `ActivityTimeTabs` in `ActivitiesPage`

---

## Phase 7 — User Story 5 (P2): Create a new activity

*Goal*: "+ Activity" opens form; type + subject required; saved activity appears in correct tab.
*Independent test*: Create Call due tomorrow → appears in "Tomorrow" tab.

- [ ] T021 [P] [US5] Implement `POST /api/activities` in `backend/routes/activities.ts` (validate type + subject; generate id; push to store)
- [ ] T022 [US5] Add `useCreateActivity` mutation to `frontend/src/api/useActivities.ts`
- [ ] T023 [US5] Create `ActivityForm` modal in `frontend/src/components/activities/ActivityForm.tsx` (props: initial values, onSave, onCancel; fields: type select, subject, dueDate, dueTime, note, linked deal/person/org selectors)
- [ ] T024 [US5] Wire "+ Activity" button in `ActivitiesPage` to open `ActivityForm` in create mode

---

## Phase 8 — User Story 6 (P2): Edit and delete activity

*Goal*: "..." menu → Edit opens pre-filled form; Delete confirms then removes.
*Independent test*: Edit Call subject → "Rescheduled follow-up" → updated in list.

- [ ] T025 [P] [US6] Implement `PATCH /api/activities/:id` in `backend/routes/activities.ts` (partial update)
- [ ] T026 [P] [US6] Implement `DELETE /api/activities/:id` in `backend/routes/activities.ts`
- [ ] T027 [US6] Add `useUpdateActivity` and `useDeleteActivity` mutations to `frontend/src/api/useActivities.ts`
- [ ] T028 [US6] Wire "..." menu in `ActivityRow` to Edit (open `ActivityForm` pre-filled) and Delete (window.confirm → `useDeleteActivity`)

---

## Phase 9 — User Story 7 (P2): Calendar view

*Goal*: Toggle to calendar grid; activity dots on due dates; click date to see that day's activities.
*Independent test*: Switch to Calendar → dots on correct dates; click a date with 2 activities → both listed below.

- [ ] T029 [P] [US7] Create `CalendarView` component in `frontend/src/components/activities/CalendarView.tsx` (7-column CSS grid; renders current month days; places colored activity-type dots on cells matching dueDate; prev/next month navigation; click cell shows day's activities in a popover)
- [ ] T030 [US7] Wire List/Calendar toggle in `ActivitiesPage` to `activitiesStore.view`; conditionally render `ActivityList` or `CalendarView`

---

## Phase 10 — User Story 8 (P3): Advanced filters

*Goal*: Filter by linked deal/person/org, owner, date range.
*Independent test*: Filter by org "Acme Corp" → only Acme activities shown.

- [ ] T031 [P] [US8] Create `ActivitiesFilterBar` in `frontend/src/components/activities/ActivitiesFilterBar.tsx` (advanced filter drawer: linked deal search, person search, org search, date range; active filters as chips; wires to `activitiesStore.filters`)
- [ ] T032 [US8] Add "Filters" button to `ActivitiesPage` toolbar to open `ActivitiesFilterBar`

---

## Final Phase — Polish

- [ ] T033 Add empty state to `ActivityList` per tab ("No overdue activities 🎉", "Nothing due today", etc.)
- [ ] T034 Add loading skeleton to `ActivityList` while `useActivities` is pending
- [ ] T035 Wrap `ActivitiesPage` route with `ErrorBoundary` in `frontend/src/App.tsx`
