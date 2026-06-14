# Pipedrive UX Research Notes

*Populated in Phase 2 via Playwright MCP browsing of https://level-stamp.pipedrive.com*
*Session date: 2026-06-15*

---

## Screens Documented

| Screen | Status | Screenshot |
|--------|--------|------------|
| Pipeline / Deals (Kanban) | ✅ | `screenshots/01-deals-kanban.png` |
| Deal detail view | ✅ | `screenshots/02-deal-detail-clean.png` |
| People (Contacts) list | ✅ | `screenshots/03-contacts-list.png` |
| Person detail view | ✅ | `screenshots/04-person-detail.png` |
| Organizations list | ✅ | `screenshots/05-organizations-list.png` |
| Activities list | ✅ | `screenshots/06-activities-list.png` |
| Dashboard / Reports (Insights) | ✅ | `screenshots/07-insights-dashboard.png` |
| Global navigation | ✅ | (visible in all screenshots) |
| Add deal modal | ✅ | `screenshots/09-add-deal-modal.png` |
| Search UI | ✅ | `screenshots/10-search-ui.png` |

---

## Global Navigation

**Sidebar** (dark navy, ~60px wide, icon-only with labels below):
- Logo (Pipedrive "P" mark) at top — links to home
- Setup guide (checklist icon)
- Contacts (person icon) — contains People, Organizations, Timeline, Merge Duplicates sub-nav
- Activities (calendar icon) — badge with "1" unread
- Deals ($ dollar icon) — currently active state shows filled purple background
- Leads (funnel icon)
- Insights (bar chart icon)
- Sales Inbox (envelope icon)
- More (...) at bottom for additional items

**Top header bar** (white, full-width):
- Breadcrumb/page title (left-aligned, bold)
- Global search bar (centered, "Search Pipedrive" placeholder, magnifier icon, rounded pill shape)
- Quick actions: "+" button (add any entity), AI assistant (purple gradient circle), Marketplace icon, Help (?), Ideas (lightbulb)
- User avatar (initials "NV", top-right)

**Contacts sub-nav** (visible when Contacts is active, ~220px left panel):
- People (active)
- Organizations
- Contacts timeline
- Merge duplicates
- LinkedIn leads upsell widget at bottom

---

## Pipeline / Kanban View

**Screenshot:** `screenshots/01-deals-kanban.png`

**Toolbar (above columns):**
- View toggles (4 buttons in a group): Pipeline (kanban, active), List, Forecast, Archive
- "+ Deal" split button (green, primary) with dropdown arrow for more options
- Deal count ("1 deal") + info icon + Sync button
- Pipeline selector dropdown ("Sales pipeline") with edit pencil icon
- "Filter" button (with funnel icon) + "..." more options

**Filter bar (below toolbar):**
- "Add condition" button with + icon
- "Sort by: Next activity ▲" on right

**Kanban columns (horizontal scroll):**
- 6 stages: Qualified | Demo Scheduled | Demo Completed | Proposal Made | Negotiations | Contract Signed
- Each column header shows: stage name (bold) + total value (₹) + deal count
- Column background: light grey
- Deal card (in Qualified): white card, deal title text, org name, contact name, value

**Deal card anatomy** (inferred from single sample card):
- Deal title (truncated, links to detail)
- Organization name
- Contact person name
- Deal value
- Expected close date (when set)
- Activity indicator (next activity badge)

**Stage progression:** chevron-shaped segments in a horizontal progress bar on deal detail, not in kanban columns themselves.

---

## Deal Detail

**Screenshot:** `screenshots/02-deal-detail-clean.png`

**Layout:** Two-column split (left ~45% for summary fields, right ~55% for activity feed). Left panel scrolls independently.

**Header area (above both panels):**
- Owner avatar + name ("Nandhan Venkadesh") + "Owner" label + chevron (change owner)
- "1 follower" dropdown button
- "Won" (green) button + dropdown arrow
- "Lost" (red) button
- Grid/compact view toggle
- "..." more options

**Deal title:** Large H1 text, full width

**Stage progress bar:** Horizontal chevron-shaped segments showing pipeline stages, each labeled "0 days" (time in stage). Active stage filled green.

**Breadcrumb:** "Sales pipeline → Qualified" (clickable links)

**Left panel — Summary section:**
- Section header "Summary" with "..." options
- "Scores" badge (star icon, green background)
- Value: ₹30,000 (with "+ Products" link)
- Organization: linked org name (building icon)
- Contact: linked person name (person icon) + "+ Participants" link
- "Details" section (collapsible, with edit ✏ and "..." icons)

**Right panel — Activity tabs:**
- Tab bar: Activity | Notes | Meeting scheduler | Call | Email | Files | Documents | Invoice
- Empty state: "Click here to add an activity..."

---

## People (Contacts) List

**Screenshot:** `screenshots/03-contacts-list.png`

**Layout:** Left sub-nav (~220px) + main content area

**Toolbar:**
- "+ Person" split button (green) with dropdown arrow
- Person count: "2 people" + refresh icon
- "Filter" button + "..." more options

**Filter suggestion banner** (dismissable, blue-tinted):
- "Find the right contacts faster" headline
- Suggested filter chip: "Total activities > 0" with × to remove
- "+ Add condition" | "Clear" | "Save" actions
- "Apply filter" CTA button

**Active filter bar:**
- Filter chips shown inline above table
- Each chip: field name + operator + value + × to remove
- "+ Add condition" to add more
- "Clear" and "Save" buttons

**Data table:**
- Checkbox column (select all / individual)
- Columns: Name | Organization | Email | (gear icon for column customization)
- Row: avatar initial + name (linked) | org name (linked) | email (truncated) | "..." row actions
- 2 sample rows: Tony Turner / MoveEr Tech Group, Benjamin Leon / Leon Digital Systems
- Horizontal scrollbar at bottom (more columns off-screen)

---

## Person Detail

**Screenshot:** `screenshots/04-person-detail.png`

**Layout:** Same two-column split as Deal detail.

**Header area:**
- Owner avatar + "Owner" label + chevron
- "1 follower" dropdown
- "+ Deal" split button (green) — contextual to entity type
- Grid view toggle + "..."

**Person identity:**
- Large blue circle avatar (initials or photo placeholder)
- Name as H1: "[Sample] Tony Turner"

**Left panel — Summary section:**
- "Add labels" link (with tag icon)
- Email: tony.turner@moveer.com (Work) — clickable mailto
- Phone: 218-348-8528 — clickable tel
- Organization: [Sample] MoveEr Tech Group (linked)
- "Details" collapsible section (edit ✏ + "..." icons)

**Right panel — Activity tabs:**
- Tabs: Activity | Notes | Meeting scheduler | Call | Email | Files | Documents
- (Fewer tabs than Deal — no Invoice tab)

---

## Organizations List

**Screenshot:** `screenshots/05-organizations-list.png`

**Pattern:** Identical layout to People list, substituting "Organization" entity.

**Toolbar:**
- "+ Organization" split button
- "2 organizations" count
- Same Filter + "..." buttons

**Table columns:** Name | Address | People | (gear icon)
- Address column (empty for sample data)
- People column (count of linked people)
- 2 rows: Leon Digital Systems | MoveEr Tech Group

---

## Activities List

**Screenshot:** `screenshots/06-activities-list.png`

**Toolbar:**
- View toggles: List (active, lines icon) | Calendar (calendar icon)
- "+ Activity" split button (green) with dropdown
- "Meeting scheduler" dropdown button
- "2 activities" count + info icon
- "SYNC INACTIVE" pill badge (orange/red outline)
- "Filter" button + "..."

**Quick filter tabs (horizontal tab strip):**
- All | [phone/call icon] | [meeting icon] | [clock icon] | [flag icon] | [email icon] | [task icon]
- Time filters: To-do (active, blue underline) | Overdue | Today | Tomorrow | This week | Next week | Select period ▼

**Activity type icons** (in Subject column):
- Red phone icon = Call
- Blue person-group icon = Meeting/Contact

**Table columns:** Done (circle checkbox) | Subject | Deal | Priority | Contact person | (gear icon)
- "Done" column: empty circle = incomplete, filled = complete
- Row actions "..." on hover

**2 sample activities:**
1. [Sample] Collaboration Plat... — Call type (red phone) — no deal — Benjamin Leon
2. [Sample] Infrastructure Sec... — Meeting type (blue people) — Tony Turner IT Infr... — Tony Turner

---

## Dashboard / Reports (Insights)

**Screenshot:** `screenshots/07-insights-dashboard.png`

**Layout:** Left panel (create/search/nav) + main canvas area

**Left panel:**
- "+ Create" split button (with dropdown) + education icon
- "Search from Insights" search input
- DASHBOARDS section header + "..." + "My dashboards" (no dashboards yet)
- GOALS section header + "..." (no goals)
- REPORTS section header + "My reports"

**Main area (empty state with preview):**
- Preview thumbnails of chart types: bar chart (horizontal bars, purple), pie/donut chart, horizontal bar chart (green), grouped bar chart (green shades)
- Sparkle/AI icons on some charts
- Marketing copy: "Identify growth opportunities. Take action."
- Subtitle about personalized reporting dashboard

---

## Add Deal Modal

**Screenshot:** `screenshots/09-add-deal-modal.png`

**Modal structure:** Wide dialog (~70% viewport width), two-column layout inside.

**Left column — Deal fields:**
| Field | Input type | Notes |
|-------|-----------|-------|
| Contact person | Text + autocomplete | Person icon in field |
| Organization | Text + autocomplete | Building icon in field |
| Title | Text input | Free text |
| Value | Number + currency dropdown | "Indian Rupee ..." default |
| (Add products) | Link | Below value field |
| Pipeline | Dropdown | "Sales pipeline" default |
| Pipeline stage | Visual stage selector | Green chevron progress (partially visible) |

**Right column — Person fields (shown inline):**
| Field | Input type | Notes |
|-------|-----------|-------|
| Phone | Text + type dropdown | "Work" default, "+ Add phone" link |
| Email | Text + type dropdown | "Work" default, "+ Add email" link |

**Footer:**
- "Import" button (left, with import icon)
- Character count "1/15,000" + info icon
- "Cancel" button
- "Save" button (green, primary)

---

## Search UI

**Screenshot:** `screenshots/10-search-ui.png`

**Trigger:** Click the global search bar in the header.

**Dropdown panel:**
- "Recently viewed" section header
- Items: entity icon (colored initial avatar) + entity name (bold) + secondary line
  - Person: initials avatar, name, org name below
  - Deal: $ icon, deal title, value + contact + org below
- No search-as-you-type results visible (empty query state)

**Search bar state when active:**
- Input expands/focuses (border highlight)
- Dropdown appears immediately below
- Background dims slightly

---

## Design System Observations

**Colors:**
- Primary brand: Dark navy `#2C2D6F` (sidebar background)
- Active sidebar item: Purple `#6F6EE8` fill
- Primary action (CTA buttons): Green `#0A9E5F` (Win, + Deal, Save, + Person, etc.)
- Destructive action: Red `#E15A51` (Lost button)
- Warning/badge: Orange-ish (SYNC INACTIVE pill)
- Background (content area): White `#FFFFFF`
- Background (kanban columns): Light grey `#F5F5F5`
- Text primary: Dark grey ~`#1A1A1A`
- Text secondary: Medium grey ~`#6B6B6B`
- Links: Blue `#226FCA`
- Border/divider: Light grey `#E5E5E5`
- Banner/promo: Light lavender `#F0EFFF`

**Typography (estimated):**
- Page title (H1): ~22-24px, bold
- Section headers: ~14px, semibold, uppercase for some
- Table column headers: ~13px, medium weight
- Body / table row text: ~14px, regular
- Metadata / secondary: ~12px, grey
- Labels/badges: ~11-12px

**Spacing & Layout:**
- Sidebar width: ~60px (icon-only, label below icon)
- Contacts sub-nav: ~220px
- Top header height: ~56px
- Table row height: ~44px
- Card padding: ~12-16px
- Kanban column min-width: ~200px

**Components observed:**
- [x] Kanban column + card
- [x] Data table with sortable headers + checkbox select
- [x] Filter bar (chips inline, add condition)
- [x] Split button (primary action + dropdown arrow)
- [x] Badge / pill (count badge, SYNC INACTIVE status)
- [x] Avatar (initials-based, colored circle)
- [x] Activity type icons (phone, meeting, task)
- [x] Two-panel detail layout (summary left, activity feed right)
- [x] Tabbed section (Activity / Notes / Email / Files etc.)
- [x] Stage progress bar (chevron segments with time-in-stage)
- [x] Modal / dialog (add deal form, two-column)
- [x] Dropdown (pipeline selector, currency, field type)
- [x] Search bar with recent results dropdown
- [x] Collapsible sections (Summary, Details with ^ chevron)
- [x] Inline "Won / Lost" quick-action buttons
- [x] Dismissable promo/info banners
- [ ] Toast notifications (not triggered during session)
- [ ] Drag-and-drop (kanban — not tested, only 1 deal)
- [ ] Calendar view (Activities — not switched to)
- [ ] Pagination / infinite scroll (too few records to trigger)
