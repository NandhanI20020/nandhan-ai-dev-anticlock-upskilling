# Feature Specification: Leads Inbox

**Feature Branch**: `010-leads-inbox`
**Created**: 2026-06-15
**Status**: Draft

---

## User Scenarios & Testing

### User Story 1 (P1): View all incoming leads in a prioritized table
**As a** sales representative,
**I want to** see all unqualified leads in a table with their name, source, intent score, estimated value, status, and creation date,
**So that** I can quickly identify which leads to act on first.

**Acceptance criteria**:
- [ ] All leads are displayed as rows with columns: Name, Source, Intent Score, Estimated Value, Status, Created Date
- [ ] Intent Score is shown as a colored badge: High (green), Medium (amber), Low (grey)
- [ ] Leads are sorted by Intent Score descending by default (highest priority first)
- [ ] Table is sortable by clicking column headers
- [ ] A "Convert to Deal" button is visible on each row

**Independent test**: Load `/leads` with 10 seeded leads — verify all rows appear with correct intent score badge colors; "Convert to Deal" button visible on each row.

---

### User Story 2 (P1): View lead KPI summary cards
**As a** sales manager,
**I want to** see summary metrics at the top of the leads inbox — total incoming, total estimated value, response rate, and an AI-scored indicator,
**So that** I can assess the health of the lead funnel at a glance.

**Acceptance criteria**:
- [ ] Four KPI tiles: Incoming Leads (count), Estimated Value (sum), Response Rate (%), AI Optimized (label)
- [ ] Response Rate = leads with at least one logged activity / total leads
- [ ] AI Optimized tile shows "Active" when intent scoring is enabled (static label for MVP)

**Independent test**: With 10 seeded leads where 3 have activities — verify Response Rate tile shows 30%.

---

### User Story 3 (P1): Convert a lead to a deal
**As a** sales representative,
**I want to** convert a lead into a deal with one click,
**So that** I can move a qualified lead into my pipeline without re-entering their information.

**Acceptance criteria**:
- [ ] Clicking "Convert to Deal" on a lead row opens a confirmation/conversion form
- [ ] The form pre-fills: deal title (from lead name), estimated value, linked person (if lead has one), linked org (if lead has one), pipeline and stage selector
- [ ] After confirming, a new Deal is created and the lead's status changes to "Converted"
- [ ] Converted leads are moved out of the default "Incoming" view
- [ ] The newly created deal is navigable from the success confirmation

**Independent test**: Click "Convert to Deal" on a lead → confirm → verify a deal is created in `GET /api/deals` and the lead status = "converted".

---

### User Story 4 (P2): View lead source distribution chart
**As a** sales manager,
**I want to** see a chart showing how many leads came from each source (website, referral, cold outreach, etc.),
**So that** I can identify which channels are generating the most leads.

**Acceptance criteria**:
- [ ] A bar or donut chart shows leads grouped by source
- [ ] Each source segment shows lead count and percentage
- [ ] Chart updates when the leads list is filtered

**Independent test**: With 5 Website leads and 3 Referral leads — verify chart shows Website as the largest segment.

---

### User Story 5 (P2): Filter leads by status and source
**As a** sales representative,
**I want to** filter the leads list by status (Incoming, Contacted, Converted, Disqualified) or source,
**So that** I can focus on a specific subset of leads.

**Acceptance criteria**:
- [ ] Quick filter tabs: All | Incoming | Contacted | Converted | Disqualified
- [ ] Source filter chip allows filtering by a specific source
- [ ] Active filters show as removable chips
- [ ] Counts update per tab to reflect filtered results

**Independent test**: Click "Converted" tab — verify only converted leads appear.

---

### User Story 6 (P3): View priority focus panel
**As a** sales manager,
**I want to** see a "Priority Focus" panel highlighting the top leads by intent score that haven't been contacted yet,
**So that** I can direct my team's attention to the highest-value unworked leads.

**Acceptance criteria**:
- [ ] A sidebar panel shows the top 3–5 leads by intent score with status "Incoming"
- [ ] Each lead shows name, source, intent score badge, and estimated value
- [ ] Clicking a lead scrolls to or highlights it in the main table

**Independent test**: With 10 incoming leads — verify the Priority Focus panel shows the 5 with the highest intent scores.

---

## Functional Requirements

- **FR-01**: The leads inbox must display all leads in a table with columns: Name, Source, Intent Score (color-coded badge), Estimated Value, Status, Created Date.
- **FR-02**: Intent Score badge must be color-coded: High=green, Medium=amber, Low=grey.
- **FR-03**: Default sort must be Intent Score descending; table must be sortable by any column.
- **FR-04**: A "Convert to Deal" button must be visible on each lead row and must open a pre-filled conversion form.
- **FR-05**: Confirming lead conversion must create a Deal and update the lead status to "converted".
- **FR-06**: Four KPI tiles must be displayed: Incoming Leads count, Estimated Value sum, Response Rate %, AI Optimized status.
- **FR-07**: A Lead Source Distribution chart must visualize lead counts by source.
- **FR-08**: Quick filter tabs (All / Incoming / Contacted / Converted / Disqualified) must filter the list.
- **FR-09**: A Priority Focus panel must surface the top uncontacted leads by intent score.

---

## Success Criteria

- A rep can identify the highest-priority lead and click "Convert to Deal" in under 30 seconds.
- Lead conversion creates a deal and updates the lead status in a single action.
- KPI tiles and chart reflect accurate counts matching seeded data.

---

## Key Entities

| Entity | Key Fields | Relationships |
|--------|-----------|---------------|
| Lead | id, name, source, intentScore ("high"\|"medium"\|"low"), estimatedValue, status ("incoming"\|"contacted"\|"converted"\|"disqualified"), personId, orgId, ownerId, createdAt | optionally linked to Person, Org |
| Deal | id, title, value | created on conversion |

---

## Out of Scope

- Automated lead scoring (AI/ML)
- Email capture or web form integration
- Lead routing rules or round-robin assignment

---

## Assumptions

- Intent Score is a manually set field in the mock data (not AI-computed in MVP).
- Converting a lead creates a deal but does NOT automatically create a Person or Organization (they must already exist or be skipped).
- "AI Optimized" tile is a static label ("Active") in MVP — it does not perform actual AI scoring.
