# PRD #1 — UX Product Requirements Document

**App**: SalesKit CRM
**Target tool**: Google Stitch — AI design generation
**Source**: Phase 2 Playwright research of Pipedrive + CRM best-practices synthesis
**Date**: 2026-06-15

This document is written as descriptive prose optimized for AI UI generation. Every section describes visual layout, component anatomy, and interaction behavior with enough fidelity to generate a recognizable, production-quality CRM UI.

---

## 1. App Identity

**App name**: SalesKit CRM
**Tagline**: Pipeline management for modern sales teams.
**Tone**: Professional, clean, data-dense. Efficient without being clinical. Information is always visible — no clicks to reveal what a rep needs at a glance. Confident use of color to communicate status (green = progress/success, red = risk/loss, orange = urgency).

**Brand colors**:
- Sidebar / chrome: dark navy `#2C2D6F`
- Active sidebar item: medium purple `#6F6EE8`
- Primary CTA: emerald green `#0A9E5F`
- Hover on primary: darker green `#088A52`
- Destructive / lost: warm red `#E15A51`
- Warning / overdue: amber `#F59E0B`
- Rotten deal indicator: orange `#FB923C`
- Won badge: green `#16A34A`
- Lost badge: red `#DC2626`
- Page background: white `#FFFFFF`
- Kanban column / table row hover: `#F5F5F5`
- Card / panel surface: `#FFFFFF`
- Borders and dividers: `#E5E5E5`
- Primary text: `#1A1A1A`
- Secondary / metadata: `#6B6B6B`
- Hyperlinks / interactive text: `#226FCA`
- Info / promo banner: light lavender `#F0EFFF`
- Focus ring: `#6F6EE8` (2px outline)

**Typography** (font: Inter):
- Page title (H1): 22–24px / 700
- Section header (H2): 16px / 600
- Subsection (H3): 14px / 600
- Table column headers: 13px / 500
- Body / table rows: 14px / 400
- Secondary metadata: 12px / 400 / `#6B6B6B`
- Badge / pill: 11–12px / 500
- Input label: 13px / 500

---

## 2. User Personas

### Sales Representative
Manages their own deals day-to-day. Needs frictionless access to their pipeline, fast deal creation, and one-tap activity logging. Spends ~60% of time in the Pipeline (Kanban) view. Values speed above all: open a deal, log a call, schedule a follow-up, close. The UI must support this loop in under 10 seconds.

### Sales Manager
Monitors team performance. Reviews pipeline health, deal velocity, win rate, and rep activity. Needs the Dashboard for aggregate stats, the Forecast view for revenue projection, and list views with owner filters to inspect any rep's book.

---

## 3. Information Architecture

```
SalesKit CRM
├── Pipeline (Kanban)          ← default landing
│   ├── [Deal card → Deal Detail]
│   └── [Stage column]
├── Deals
│   ├── List view
│   ├── Forecast view          ← timeline by expected close date
│   └── Archive                ← won + lost deals
├── Leads                      ← unqualified inbound leads inbox
│   └── [Lead detail]
├── Contacts
│   ├── People                 ← contacts list + detail
│   ├── Organizations          ← orgs list + detail
│   ├── Timeline               ← contacts activity timeline (cross-entity)
│   └── Merge Duplicates
├── Activities                 ← list + calendar views
├── Insights                   ← dashboards + reports + goals
│   ├── Dashboards
│   ├── Reports
│   └── Goals
├── Sales Inbox                ← email/inbox integration
└── Settings
    ├── Pipeline & Stages
    ├── Custom Fields
    ├── Users & Permissions
    ├── Import / Export
    └── Profile
```

**Sidebar** (always visible, 60px icon-only):
- P logo mark at top → home/pipeline
- Each nav item: icon (24px) + label (10px below), stacked
- Active item: filled purple `#6F6EE8` rounded rectangle behind icon+label
- Badge overlay: count pill on icon (e.g. Activities "3", Inbox "5")
- "More" at bottom (ellipsis) expands to show secondary items
- Clicking Contacts reveals a 220px sub-nav panel (People / Organizations / Timeline / Merge Duplicates)

---

## 4. Screen Inventory

### 4.1 Pipeline View (Kanban Board)

**Purpose**: Primary rep workspace. Deals move left→right through stages as they progress.

**Full layout**: Sidebar (60px) + full-width content area. No sub-nav.

**Toolbar**:
- View toggle group (4 buttons): Pipeline (active) | List | Forecast | Archive
- "+ Deal" split button (green, primary). Dropdown offers: "Add deal", "Import deals"
- Deal count pill ("24 deals") + total value ("₹4.2M") with info tooltip
- Sync button (icon)
- Pipeline selector dropdown (for multiple pipelines): "Sales pipeline ▼" + edit pencil icon
- "Filter" button (funnel icon) → opens filter panel
- "Sort by" dropdown (Next activity / Created date / Value / Expected close)
- "..." overflow menu

**Filter bar** (below toolbar, always visible when filters active):
- Row of filter chips, each: label + value + × to remove
- "Add condition" button
- "Clear all" link | "Save as view" link

**Stage columns** (horizontally scrollable):
- Each column: 220–260px wide, full viewport height, scrollable vertically
- **Column header**: Stage name (14px/600) + total value (12px grey) + deal count badge
- **Column body**: light grey `#F5F5F5` background, 8px padding, 8px gap between cards
- **Column footer**: subtle "⊕ Add deal" text link
- **Deal rotting indicator**: columns can have a "rotting after X days" threshold; rotten cards get an orange left-border accent

**Deal card**:
- White card, 12px padding, 4px border-radius, 1px border `#E5E5E5`, subtle box-shadow
- **Title**: 14px/600, 2-line clamp, links to Deal Detail
- **Organization + Person**: 12px grey, building icon + org name, person icon + contact name (stacked)
- **Value**: 13px/500, currency-formatted
- **Close date**: 12px — normal if future, red if past due
- **Activity badge** (bottom): next activity type icon + relative date ("Tomorrow", "In 3 days") — red if overdue
- **Deal age** (top-right corner): subtle grey pill "12d" showing days since created
- **Rotten indicator**: orange left border + orange dot when deal exceeds rotting threshold
- **Hover state**: card elevates (shadow deepens). Quick-action icons appear: ✏ edit, ☎ log call, ✓ mark won, × mark lost, ••• more
- **Drag state**: card rotates ~2°, deepens shadow, becomes semi-transparent (opacity 0.8)

**Key interactions**:
- Drag card between columns → optimistic move, column totals update instantly, server PUT fires
- Click card title → navigate to Deal Detail
- Click "+" in column footer → Add Deal modal pre-filled with that stage
- Hover on deal age pill → tooltip "Created 12 days ago, last updated 3 days ago"
- Click pipeline selector → switch between pipelines (e.g. "Sales pipeline", "Enterprise pipeline")

---

### 4.2 Deals List View

**Purpose**: Table-format alternative to Kanban. Useful for bulk operations and sorting by any field.

**Toolbar**: Same as Pipeline view but "List" tab is active.

**Quick filter tabs** (below toolbar): All | Open | Won | Lost | My deals | Rotten

**Data table**:
- Checkbox column (bulk select)
- Columns (configurable): Title | Value | Stage | Organization | Contact person | Owner | Expected close date | Created | Last activity | Activity count
- Sortable headers (click to sort asc/desc, arrow indicator)
- Row: avatar + deal title (linked) | value | stage pill (color-coded by stage order) | org link | person link | owner avatar + name | date | relative date
- **Rotten deals**: row has orange left border accent
- **Won deals**: title has strikethrough (in Archive view); value shown in green
- **Lost deals**: title greyed, red indicator
- Row hover: checkbox + "..." row action button (Edit, Duplicate, Delete, Mark won, Mark lost, Convert)
- Bulk action bar appears when rows selected: "X selected" + Delete | Assign owner | Export | Mark won | Mark lost

---

### 4.3 Forecast View (Timeline / Close Date)

**Purpose**: Revenue forecasting — shows deals on a horizontal timeline organized by expected close date. Helps managers see projected revenue by month/quarter.

**Layout**: Month columns (like a Gantt/calendar) with deal cards positioned under their expected close month.

**Toolbar**:
- Time range selector: This month | Next month | This quarter | Next quarter | Custom
- Grouping: By owner | By stage
- "Filter" + "Sort" same as other views

**Timeline columns**: Each column = one month. Header shows month name + projected total value for that month.

**Deal rows**: Each deal is a horizontal bar spanning its open period (created → expected close). Hovering shows deal details tooltip.

---

### 4.4 Deal Archive

**Purpose**: Won and lost deals. Read-only browsing of historical outcomes.

**Toolbar**: View toggle active on "Archive". Quick filter: Won | Lost | All archived. Date range filter.

**Table**: Same columns as Deals List, plus "Won/Lost date" and "Lost reason" columns. Won deals: green "Won" badge. Lost deals: red "Lost" badge + reason text.

---

### 4.5 Deal Detail

**Purpose**: Full record for one deal. All linked data accessible without leaving the page.

**Layout**: Two-column split. Left ~45% (deal fields / summary). Right ~55% (activity feed / timeline). Independent scroll per column.

**Deal header** (above both columns, full width):
- Owner avatar (32px) + name + "Owner" label + dropdown chevron (change owner)
- Followers: "X followers" button → popover to add/view followers
- Quick-action buttons: "**Won**" (green, split → log win reason) | "**Lost**" (red, split → log reason + competitor) | grid toggle | "..." overflow (Duplicate, Archive, Delete, Share)

**Deal title**: H1, full-width, editable on click (inline edit, Enter to save, Esc to cancel)

**Stage progress bar**: Horizontal chevron segments, full width.
- Each chevron = one pipeline stage. Filled green = active stage. Past stages = lighter green. Future = light grey.
- Inside each chevron: stage name (truncated). Below the bar: "X days" time-in-stage per stage.
- Clicking a stage moves the deal there. Going backward shows a confirmation dialog.
- Breadcrumb below: "Sales pipeline → Proposal Made"

**Left column — Summary panel** (collapsible sections):

*Section: Deal info* (always visible)
- Value: `₹30,000` (inline editable) + "+ Add products" link
- Expected close date: date picker inline
- Pipeline: dropdown
- Stage: dropdown (redundant with stage bar, but useful for quick change)
- Owner: avatar + name + change button
- Followers list (avatars, click to manage)
- Labels: colored tag chips + "Add label" link
- Deal source: dropdown (Website, Referral, Cold call, etc.)

*Section: People* (collapsible, "^")
- List of linked contacts: avatar + name (linked) + org name + phone + email (with mailto)
- "+ Add person" button
- "+ Add participant" link (for additional contacts on same deal)

*Section: Organization* (collapsible)
- Org name (linked) + address + phone + website
- "+ Add organization" link if none linked

*Section: Products* (collapsible)
- List of added products: name + quantity + unit price + total
- Total line at bottom
- "+ Add product" button

*Section: Custom Fields* (collapsible)
- Grid of label-value pairs for any custom fields defined in Settings
- Edit ✏ icon to enter edit mode for all custom fields at once

*Section: Details* (collapsible)
- Created date, created by, last modified, deal ID, source
- Won date / Lost date + reason (if applicable)
- Deal age: "47 days in pipeline"

**Right column — Activity / Timeline panel**:

Tab bar: **Activity** | **Notes** | **Email** | **Files** | **Documents** | **Call** | **Meeting** | **Invoice**

*Activity tab (default)*:
- **Add activity bar** at top: quick-log buttons — ☎ Call | 👥 Meeting | ✅ Task | ✉ Email | ⏰ Deadline
- Each quick-log opens an inline form (not a full modal) with: subject, due date/time, note, contact, and Save/Cancel.
- Chronological feed below: future activities first (in blue-tinted cards), then past activities (lighter), then notes/emails interspersed.
- **Activity feed item**: type icon (colored circle) + subject + linked contact + due date/time + Done checkbox. Overdue items: red subject text + "Overdue" badge.
- **Done activity**: checkmark, strikethrough, dimmed.
- Date dividers: "Today", "Yesterday", "June 10", etc.

*Notes tab*:
- Rich text composer (bold, italic, links, bullet lists) at top. "Add note" button.
- List of saved notes: author avatar + name + relative timestamp + note body. Edit ✏ / Delete 🗑 on hover.

*Email tab*: Linked email threads (read-only display in this version).

*Files tab*: Grid of uploaded file thumbnails (PDF, image previews). "Upload file" button. Each file: icon + filename + size + uploader + date.

*Call / Meeting tabs*: Log a call/meeting record — outcome, duration, notes, linked contact.

---

### 4.6 Leads Inbox

**Purpose**: Inbound unqualified leads before they become deals. Reps review leads and either convert to a Deal or discard.

**Layout**: Full-width table.

**Toolbar**: "Leads" page title. "+ Lead" split button. Lead count. Filter. "..."

**Lead card/row**: Title | Organization | Contact | Value (estimated) | Source | Owner | Created | Labels

**Lead detail panel** (right side slide-in, not a full page):
- Same two-column layout as Deal Detail but simpler.
- Key action: "**Convert to Deal**" button (green, prominent) — creates a Deal from this Lead record.

---

### 4.7 People (Contacts) List

**Purpose**: Directory of all contact persons.

**Layout**: Left sub-nav (220px) + main content (table).

**Sub-nav**: People (active) | Organizations | Contacts Timeline | Merge Duplicates.

**Toolbar**: "+ Person" split button | person count | Filter | "..."

**Quick filter tabs**: All | My people | Recently active | Added this week

**Active filter bar**: Same chip pattern as Deals.

**Table columns** (configurable): Name | Organization | Email | Phone | Deals count | Owner | Labels | Created | Last activity
- Name cell: avatar (initials circle, colored) + full name (linked)
- Deals count: linked pill showing number of open deals
- Labels: colored tag chips (max 2 shown, "+N more" if more)
- Row hover: "..." action button (Edit, Delete, Merge, Add deal, Add activity, Send email)

**Bulk actions** (when rows selected): Delete | Assign owner | Add label | Export | Merge

---

### 4.8 Person Detail

**Purpose**: Full contact profile with all linked entities.

**Layout**: Two-column split (same pattern as Deal Detail).

**Header**:
- Large avatar (60px, photo or initials circle)
- Person name H1 (inline editable)
- Organization chip (linked)
- Owner + Followers controls
- "+ Deal" split button | "..." overflow (Delete, Merge, Export)

**Left column — Profile panel**:

*Section: Contact info*
- Emails: list of email entries (value + type badge "Work"/"Home"), each with copy icon, mailto link. "+ Add email"
- Phones: same pattern. "+ Add phone"
- Labels: colored tag chips. "+ Add label"
- LinkedIn URL (if set)

*Section: Organization*
- Linked org card: org name + address + phone. "Change org" / "Remove" links.

*Section: Linked Deals*
- List of deals: status badge (Open/Won/Lost) + deal title (linked) + value + stage. "+ Add deal" link.

*Section: Custom Fields* (collapsible)

*Section: Details*
- Created, last modified, person ID, source

**Right column — Activity tabs**: Activity | Notes | Email | Files | Documents | Call | Meeting
(Same structure as Deal Detail, minus Invoice tab)

---

### 4.9 Organizations List & Detail

**Purpose**: Company/account directory.

**List view**: Same pattern as People. Columns: Name | Address | People count | Deals count | Owner | Phone | Created.

**Org Detail**: Two-column layout.

**Left panel sections**:
- *Contact info*: Address (with map link), Phone, Email, Website (clickable), LinkedIn
- *People*: List of linked contacts — avatar + name (linked) + job title + email. "+ Add person" link.
- *Deals*: List of linked deals — status + title + value. "+ Add deal" link.
- *Custom Fields*, *Details*

**Right panel**: Activity | Notes | Email | Files | Documents
(Same activity feed pattern)

---

### 4.10 Activities

**Purpose**: Cross-entity task manager and call log. Every scheduled interaction lives here.

**Layout**: Full-width content area.

**View toggle**: List (active) | Calendar

**Toolbar**:
- "+ Activity" split button (dropdown: Call | Meeting | Task | Email | Deadline)
- "Meeting Scheduler" button (opens availability link generator)
- Activity count + calendar sync status badge
- Filter | Sort | "..."

**Activity type filter pills** (icon row):
All | ☎ Call | 👥 Meeting | ✅ Task | ✉ Email | ⏰ Deadline

**Time scope tabs**:
To-do | Overdue (red badge with count) | Today | Tomorrow | This week | Next week | Select period ▼

**Table columns**: Done | Type icon | Subject | Deal | Organization | Contact | Due date/time | Owner | Note (truncated) | Priority flag
- **Done column**: empty circle = pending, click to complete (animates to filled green checkmark with a brief "pop" animation)
- **Overdue rows**: red "OVERDUE" badge + red due date text
- **Priority rows**: orange flag icon for high-priority activities

**Calendar view**:
- Standard month/week grid. Activities shown as colored blocks by type. Clicking a block shows activity popover with full details + Done button.
- Week view shows time slots. Drag activity to reschedule.

**Add Activity modal** (opened from "+ Activity" button):
- Type selector: icon buttons for Call / Meeting / Task / Email / Deadline (radio toggle)
- Subject text input
- Due date + time pickers (optional time)
- Deal autocomplete
- Person autocomplete
- Organization autocomplete (auto-fills from deal/person)
- Note textarea
- Owner dropdown
- Priority flag toggle
- Cancel | Save

---

### 4.11 Contacts Timeline

**Purpose**: Chronological view of all interactions across all contacts and deals. Like an activity stream / social feed for the CRM.

**Layout**: Full-width, single-column feed.

**Filter bar**: By owner | By type (Call/Meeting/Note/Email) | By entity (Deals/People/Orgs) | Date range

**Feed items**: Each item is a card with:
- Left: type icon in colored circle
- Center: "[Person/Deal] — [Activity type] — [Subject]". Linked entity names.
- Right: relative timestamp

---

### 4.12 Insights (Dashboard + Reports + Goals)

**Purpose**: Analytics, KPI monitoring, goal tracking.

**Layout**: Left panel (nav/create) + main canvas.

**Left panel**:
- "+ Create" split button (New dashboard | New report | New goal)
- "Search from Insights" input
- **DASHBOARDS**: list of saved dashboards. Default: "My dashboard"
- **GOALS**: list of goals with progress bars
- **REPORTS**: list of saved report widgets

**Default dashboard — "My Dashboard"** contains:
- **KPI tile row** (4 tiles across): Open deals value | Won this month | Activities today | Avg deal age
- **Deals by stage** bar chart (horizontal bars, one per stage, showing deal count + value)
- **Win/Loss ratio** donut chart (green = won, red = lost, grey = open)
- **Activities completed this week** bar chart (daily breakdown, by type color)
- **Deal velocity** line chart (avg days to close, trended over 6 months)
- **Top deals by value** table (top 5 open deals with stage and owner)

**KPI tile anatomy**:
- Icon (top-left, colored)
- Large metric value (center, 28–32px bold)
- Label below value (14px grey)
- Trend indicator (arrow up/down + % vs last period, green/red)

**Reports**: Each report is a chart tile that can be added to dashboards. Filter by date range, owner, pipeline, stage.

**Goals**: Set a target (e.g. "Win ₹500,000 by Dec 31"). Shows progress bar + % completion + projected outcome.

---

### 4.13 Sales Inbox (Email)

**Purpose**: Connect a mailbox and manage deal-related emails without leaving the CRM.

**Layout**: Standard email client layout: folder list (left) + email list (center) + email preview (right).

**Folders**: Inbox | Sent | Drafts | Archived | Tracked

**Email list item**: Sender avatar + name + subject (truncated) + preview snippet + relative time + linked deal chip (if associated)

**Email preview panel**: Full email body. Action bar: Reply | Forward | Archive | Link to deal | Log as activity

---

### 4.14 Global Search

**Trigger**: Click search bar in header, or Cmd+K / Ctrl+K.

**Search bar**: Pill-shaped, centered in header. "Search SalesKit..." placeholder. Magnifier icon.

**Results dropdown** (appears on focus, updates as user types):
- "Recently viewed" section (empty query state)
- On typing: grouped sections — **Deals**, **People**, **Organizations**, **Activities**, **Notes**
- Each item: entity icon/avatar + **name** (bold) + secondary info line (value, org, stage, etc.)
- Keyboard navigation (↑↓ + Enter)
- "View all results for '[query]'" footer link → dedicated search results page

**Search results page** (full-page, after pressing Enter or "view all"):
- Left filter panel: filter by entity type, date range, owner
- Main area: full result list with pagination

---

### 4.15 Add Deal Modal

**Trigger**: "+ Deal" button from any view.

**Two-column form layout**:

**Left — Deal fields**:
- Contact person (autocomplete, person icon prefix, "Create new" option)
- Organization (autocomplete, building icon, auto-fills from person)
- Title (text input)
- Value (number input) + Currency dropdown (INR / USD / EUR / GBP)
- "+ Add products" expandable section
- Pipeline (dropdown)
- Pipeline stage (visual chevron stage picker)
- Expected close date (date picker)
- Owner (avatar + name, defaults to current user)
- Labels (tag input with autocomplete)
- Source (dropdown: Website / Referral / Cold call / Email / Trade show / Other)

**Right — New person fields** (labeled "CONTACT"):
- First name + Last name (split)
- Phone (text + type dropdown "Work") + "+ Add phone"
- Email (text + type dropdown "Work") + "+ Add email"

**Footer**: Import link | character count | Cancel | Save

---

### 4.16 Import / Export

**Import** (accessed from toolbar dropdown or Settings):
- Upload CSV file → column mapping screen → preview first 5 rows → confirm import
- Entity type selector: Deals | People | Organizations | Activities
- Duplicate handling: Skip / Update / Create new

**Export** (from "..." overflow in any list view):
- Export current view (respects active filters) as CSV
- "Export all" option

---

### 4.17 Merge Duplicates

**Purpose**: Identify and merge duplicate contact/org records.

**Layout**: Two-column comparison — "Keep" record (left) vs "Merge into" record (right). Field-by-field comparison with radio buttons to choose which value to keep per field. "Merge" button at bottom.

---

### 4.18 Settings

**Sidebar sub-nav**: Pipeline & Stages | Custom Fields | Labels | Products | Users | Import | Export | Profile | Notifications | Integrations

**Pipeline & Stages**:
- List of pipelines with drag-to-reorder stages.
- Add/rename/delete stages.
- Set "deal rotting" days per stage (after X days without update, deal turns orange).

**Custom Fields**:
- Define custom fields per entity type (Deal / Person / Org / Activity).
- Field types: Text | Number | Date | Dropdown (single) | Multi-select | Checkbox | URL | Phone | Email.
- Drag to reorder.

**Labels**:
- Manage label library: name + color. Used on Deals, People, Orgs.

**Products**:
- Product catalog: name + code + unit price + description. Added to deals.

**Profile**:
- Name, email, password change, avatar upload, timezone, currency preference.

**Notifications**:
- Toggle: deal assigned to me | activity due | deal won/lost | new lead | mention in note.

---

## 5. Design System

### Color Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-sidebar` | `#2C2D6F` | Sidebar background |
| `--color-sidebar-active` | `#6F6EE8` | Active nav item |
| `--color-primary` | `#0A9E5F` | Primary buttons, "Won", positive actions |
| `--color-primary-hover` | `#088A52` | Hover on primary |
| `--color-danger` | `#E15A51` | "Lost", delete, error |
| `--color-warning` | `#F59E0B` | Overdue, attention needed |
| `--color-rotten` | `#FB923C` | Deal rotting indicator |
| `--color-won` | `#16A34A` | Won badge/text |
| `--color-lost` | `#DC2626` | Lost badge/text |
| `--color-bg` | `#FFFFFF` | Page background |
| `--color-surface` | `#FFFFFF` | Cards, panels |
| `--color-surface-subtle` | `#F5F5F5` | Kanban column bg, row hover |
| `--color-border` | `#E5E5E5` | Borders, dividers |
| `--color-text` | `#1A1A1A` | Primary text |
| `--color-text-muted` | `#6B6B6B` | Secondary text, labels |
| `--color-link` | `#226FCA` | Hyperlinks |
| `--color-banner` | `#F0EFFF` | Info / promo banners |

### Typography Tokens

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `--text-h1` | 22–24px | 700 | Deal title, person name |
| `--text-h2` | 16px | 600 | Section headers |
| `--text-h3` | 14px | 600 | Subsections, column headers |
| `--text-body` | 14px | 400 | All body content |
| `--text-label` | 13px | 500 | Form labels, table headers |
| `--text-meta` | 12px | 400 | Timestamps, secondary info |
| `--text-badge` | 11–12px | 500 | Badges, pills, status chips |

### Spacing (4px base unit)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Icon gap |
| `--space-2` | 8px | Between cards, tight rows |
| `--space-3` | 12px | Card padding, input padding |
| `--space-4` | 16px | Section padding |
| `--space-6` | 24px | Between sections |
| `--space-8` | 32px | Page-level gaps |

### Iconography
`lucide-react` throughout. Key mapping:
- Pipeline: `LayoutGrid` | List: `List` | Forecast: `TrendingUp` | Archive: `Archive`
- Contacts: `Users` | Person: `User` | Org: `Building2` | Activity: `CalendarCheck`
- Deal: `DollarSign` | Lead: `Inbox` | Insights: `BarChart2` | Email: `Mail`
- Call: `Phone` | Meeting: `Users` | Task: `CheckSquare` | Deadline: `Clock` | Email-activity: `Mail`
- Won: `Trophy` | Lost: `XCircle` | Rotten: `AlertTriangle`
- Add: `Plus` | Edit: `Pencil` | Delete: `Trash2` | Search: `Search` | Filter: `SlidersHorizontal`
- Label: `Tag` | File: `Paperclip` | Note: `FileText` | Product: `Package`
- Arrow up: `ArrowUpRight` | Arrow down: `ArrowDownRight`
- Flag (priority): `Flag` | Star (score): `Star` | Follower: `UserPlus`

---

## 6. Reusable Components

### Layout
- **AppLayout**: Sidebar + main content area. Sidebar always rendered.
- **TwoColumnLayout**: Left (fields) + right (activity feed) with independent scroll.
- **ContactsSubNav**: 220px secondary panel inside Contacts section.
- **PageHeader**: Page title + breadcrumb + primary action button(s).

### Navigation
- **Sidebar**: Icon-only nav, active state, badge overlay, expandable sub-nav.
- **ViewToggle**: Button group for switching between views (Pipeline/List/Forecast/Archive).

### Kanban
- **KanbanBoard**: Horizontal-scroll container of KanbanColumns. Manages DnD context.
- **KanbanColumn**: Column with sticky header (name, value, count) and scrollable card list.
- **DealCard**: Draggable card with all deal fields, hover actions, rotting indicator, age badge.
- **StageProgressBar**: Chevron segment row showing pipeline stages with time-in-stage.

### Tables
- **DataTable**: Sortable, filterable table. Checkbox select, sticky header, customizable columns, bulk action bar.
- **FilterBar**: Row of filter chips with add/clear/save.
- **QuickFilterTabs**: Horizontal tab strip for named filter presets (To-do, Overdue, Today, etc.).
- **ColumnCustomizer**: Popover for show/hide/reorder table columns.

### Detail Panels
- **SummaryPanel**: Left column of detail pages. Renders collapsible sections.
- **CollapsibleSection**: Section with ^ toggle, title, "..." options, edit mode.
- **ActivityFeed**: Right column, chronological feed with activity items, date dividers.
- **ActivityItem**: Single activity in the feed. Type icon, subject, contact, due date, done checkbox.
- **QuickLogBar**: Row of icon buttons (Call, Meeting, Task, Email, Deadline) that expand an inline form.
- **NoteComposer**: Rich-text input for adding notes.
- **FileGrid**: Grid of uploaded files with previews and actions.

### Forms & Modals
- **Modal**: Overlay dialog. Header + scrollable body + footer (cancel + save).
- **AddDealModal**: Two-column form for creating deals.
- **AddPersonModal**: Form for creating contacts.
- **AddActivityModal**: Form for creating activities with type selector.
- **ConfirmDialog**: Simple confirm/cancel dialog for destructive actions.
- **WonLostDialog**: Modal for logging win/loss reason + competitor.

### Inputs
- **SplitButton**: Primary button + dropdown chevron for secondary options.
- **EntityAutocomplete**: Autocomplete input searching a specific entity type (people/orgs/deals).
- **TagInput**: Multi-value input for labels/tags with autocomplete.
- **DatePicker**: Calendar popover for date selection.
- **CurrencyInput**: Number input with currency selector dropdown.
- **StageSelector**: Visual chevron stage picker (in Add Deal form).

### Display
- **Avatar**: Initials circle, deterministic color from name hash. Sizes: sm(24) / md(32) / lg(48) / xl(64).
- **EntityBadge**: Linked chip showing entity type icon + name. Variants: deal / person / org / activity.
- **StatusBadge**: "Won" (green) | "Lost" (red) | "Open" (blue) | "Overdue" (amber) | "Rotten" (orange).
- **StageBadge**: Colored pill with stage name.
- **LabelTag**: Colored rounded tag with label text. Click to filter by label.
- **ActivityTypeBadge**: Colored icon-only or icon+text badge for activity type.
- **StatCard**: KPI tile: icon + large value + label + trend arrow.
- **SearchBar**: Global search input with results dropdown.
- **DealAgeBadge**: Subtle grey pill "Xd" showing deal age in days.
- **RottenIndicator**: Orange left-border accent + orange dot on deal cards/rows.

---

## 7. Key Interactions

- **Kanban drag-and-drop**: Drag deal card, column highlights as drop target, optimistic move, totals update instantly. Keyboard alternative: deal detail stage bar click-to-move.
- **Inline editing**: Click any field value in detail pages to enter edit mode. Tab to next field. Enter or blur saves. Esc cancels.
- **Won/Lost flow**: Click "Won" or "Lost" → modal asks for reason and (for lost) competitor name → confirm → deal moves to won/lost state, activity feed logs it, deal disappears from pipeline into Archive.
- **Deal rotting**: Server/client computes "days since last update" per deal per stage. Past threshold → card gets orange accent + tooltip "Rotten for 3 days".
- **Filter persistence**: All applied filters serialize to URL query params. Copying the URL recreates the exact view. "Save as view" stores named filter sets.
- **Cmd+K global search**: Opens search from anywhere, keyboard navigable, results grouped by entity type.
- **Activity completion**: Click circle checkbox → green checkmark animation → activity moved to "Done" section of feed.
- **Stage time tracking**: Each time a deal enters a new stage, a `stageTimeLog` entry is created on the server. Stage progress bar displays accumulated days per stage.
- **Bulk actions**: Checkbox in table header selects all. Selection mode reveals bulk action bar. Actions applied async with progress indicator.
- **Label tagging**: Clicking "+ Add label" opens a popover with all defined labels. Click to toggle, type to create new. Changes save immediately.
- **Import flow**: Upload CSV → map columns (field matcher with dropdown per column) → preview 5 rows → import with duplicate resolution selection.
- **Merge duplicates**: Side-by-side field comparison. User picks winner per field. Merged record inherits all linked deals/activities/notes from both. Source record deleted.

---

## 8. Responsive Behavior

- **Desktop (1280px+)**: Full 60px icon sidebar. Multi-column layouts. Kanban columns scroll horizontally.
- **Tablet (768–1279px)**: Sidebar stays 60px icon-only. Deal detail collapses to tabs (Summary | Activity). Kanban scrolls horizontally with narrower columns (~180px).
- **Mobile**: Out of scope for v1.
