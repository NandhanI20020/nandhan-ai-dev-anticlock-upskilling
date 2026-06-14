# PRD #1 — UX Product Requirements Document

**Target**: Google Stitch (stitch.withgoogle.com) — AI design tool

*This document is written as descriptive prose optimized for AI UI generation. Populated in Phase 3 after Playwright research (Phase 2).*

---

## 1. App Identity

**App name**: SalesKit CRM
**Tone**: Professional, clean, data-dense. Inspired by Pipedrive.
**Primary use case**: Sales team pipeline management and contact tracking.

**Brand colors**:
*(filled from research-notes.md)*

**Typography**:
*(filled from research-notes.md)*

---

## 2. User Personas

### Sales Representative
Manages their own deals and contacts day-to-day. Needs fast access to their pipeline, quick deal status updates, and activity tracking. Spends 60% of time in the Pipeline view.

### Sales Manager
Monitors team performance via dashboard. Reviews pipeline health, deal velocity, and activity completion rates. Needs reporting and high-level views.

---

## 3. Information Architecture

```
SalesKit CRM
├── Pipeline         ← default landing view
├── Deals            ← list view with filters
├── Contacts         ← People list
│   └── [person]    ← detail
├── Organizations
│   └── [org]       ← detail
├── Activities
└── Dashboard
```

**Sidebar navigation**: Fixed left sidebar, 60px wide when collapsed / 220px when expanded. Icon + label per nav item. Active state highlighted with primary color. Unread/count badge on Activities.

---

## 4. Screen Inventory

### 4.1 Pipeline View (Kanban Board)
*(Populated from research-notes.md)*

### 4.2 Deal Detail
*(Populated from research-notes.md)*

### 4.3 People (Contacts) List
*(Populated from research-notes.md)*

### 4.4 Person Detail
*(Populated from research-notes.md)*

### 4.5 Organizations
*(Populated from research-notes.md)*

### 4.6 Activities
*(Populated from research-notes.md)*

### 4.7 Dashboard
*(Populated from research-notes.md)*

---

## 5. Design System

### Color Palette
*(Populated from research-notes.md)*

### Typography Scale
*(Populated from research-notes.md)*

### Spacing
- Base unit: 4px
- Component padding: 12px / 16px / 24px
- Card gap: 16px
- Section gap: 32px

### Iconography
Use `lucide-react` icon library throughout.

---

## 6. Reusable Components

| Component | Description | States |
|-----------|-------------|--------|
| KanbanColumn | Vertical column with header and scrollable card list | default, drag-over |
| DealCard | Card showing deal title, value, contact, and age | default, dragging, selected |
| DataTable | Sortable table with sticky header and row actions | default, loading, empty |
| FilterPanel | Collapsible left panel with filter groups | open, closed |
| EntityBadge | Inline tag showing entity type + name | deal, person, org, activity |
| Avatar | Circle with initials and color | small (24px), medium (32px), large (48px) |
| StatCard | KPI tile with icon, value, label, and trend | positive, negative, neutral |
| ActivityItem | Timeline entry with type icon, subject, due date | done, overdue, upcoming |
| SearchBar | Global search with dropdown results | idle, focused, loading, results |
| Modal | Dialog overlay with header, content, footer | default, loading, error |

---

## 7. Key Interactions

- **Kanban drag-and-drop**: Drag deal cards between stage columns; optimistic UI update; column headers show deal count + total value
- **Inline editing**: Click a field in deal/contact detail to edit in-place
- **Quick add**: Floating "+" button opens add-deal or add-contact modal from any view
- **Filter persistence**: Applied filters persist in URL query params
- **Global search**: Cmd+K opens search modal; results show deals, people, orgs grouped by type

---

## 8. Responsive Behavior

- **Desktop (1280px+)**: Full sidebar expanded, multi-column layouts
- **Tablet (768–1279px)**: Sidebar collapses to icon-only; single-column kanban scrolls horizontally
- **Mobile**: Out of scope for this version
