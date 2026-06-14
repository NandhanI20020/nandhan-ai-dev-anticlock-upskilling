# Feature Specification: Global Search

**Feature Branch**: `009-global-search`
**Created**: 2026-06-15
**Status**: Draft

---

## User Scenarios & Testing

### User Story 1 (P1): Open global search with keyboard shortcut
**As a** sales representative,
**I want to** open a search overlay instantly with a keyboard shortcut,
**So that** I can find any deal, contact, or organization without interrupting my current workflow.

**Acceptance criteria**:
- [ ] Pressing Cmd+K (Mac) or Ctrl+K (Windows) opens the search overlay from anywhere in the app
- [ ] Clicking the search icon in the sidebar/header also opens the overlay
- [ ] The overlay appears as a centered modal with a text input focused automatically
- [ ] Pressing Escape closes the overlay

**Independent test**: Press Ctrl+K from the Pipeline page — verify the search overlay opens with focus in the input.

---

### User Story 2 (P1): Search across deals, people, and organizations
**As a** sales representative,
**I want to** type a query and see matching results for deals, people, and organizations,
**So that** I can navigate to any record in the CRM with a single search.

**Acceptance criteria**:
- [ ] Results appear as the user types (debounced — after 200ms of no input)
- [ ] Results are grouped by entity type: Deals, People, Organizations
- [ ] Each result shows an entity-type icon, the record name/title, and a subtitle (e.g. org name for deals; job title for people)
- [ ] Clicking a result navigates to that record's detail page and closes the overlay
- [ ] A minimum of 2 characters is required before results appear

**Independent test**: Type "acme" — verify results include the org "Acme Corp Holdings" and any deals linked to it.

---

### User Story 3 (P1): View recently accessed records
**As a** sales representative,
**I want to** see recently viewed records when the search overlay opens before I start typing,
**So that** I can quickly return to a record I was working on without searching.

**Acceptance criteria**:
- [ ] When the search overlay opens with an empty input, up to 5 "Recently Viewed" records are shown
- [ ] Recent records include deals, people, and organizations (mixed)
- [ ] Each recent record shows type icon, name, and entity type label
- [ ] Clicking a recent record navigates to it and closes the overlay

**Independent test**: Visit deal-001 detail page, then open global search — verify deal-001 appears in Recently Viewed.

---

### User Story 4 (P2): Filter results by entity type using tabs
**As a** sales representative,
**I want to** filter search results to show only Deals, only People, or only Organizations,
**So that** I can narrow results when I know what type of record I'm looking for.

**Acceptance criteria**:
- [ ] Tabs are shown above the results: All Results | Deals | People | Organizations
- [ ] Clicking a tab filters the displayed results to that entity type
- [ ] The result count per tab is shown in the tab label (e.g. "Deals (3)")
- [ ] Tab is reset to "All Results" when the query changes

**Independent test**: Type "enterprise" — switch to "Deals" tab — verify only deals matching "enterprise" appear.

---

### User Story 5 (P2): Navigate results with keyboard
**As a** sales representative,
**I want to** navigate search results using the arrow keys and open a record with Enter,
**So that** I can find and open records without switching from keyboard to mouse.

**Acceptance criteria**:
- [ ] Arrow Up / Arrow Down moves a visible highlight through the result list
- [ ] Pressing Enter on a highlighted result navigates to it and closes the overlay
- [ ] The first result is highlighted by default when results appear

**Independent test**: Type "sarah", press Arrow Down twice, press Enter — verify navigation to the second result's detail page.

---

## Functional Requirements

- **FR-01**: A keyboard shortcut (Cmd+K / Ctrl+K) must open the global search overlay from any page.
- **FR-02**: The search input must be auto-focused when the overlay opens.
- **FR-03**: Search results must appear after a debounce of 200ms with at least 2 characters entered.
- **FR-04**: Results must be grouped by entity type (Deals, People, Organizations) under labeled section headers.
- **FR-05**: Each result must display: entity-type icon, primary label (deal title / person name / org name), subtitle.
- **FR-06**: Clicking a result must navigate to the record's detail page and close the overlay.
- **FR-07**: When the input is empty, up to 5 recently viewed records must be displayed.
- **FR-08**: Recently Viewed records must persist across page navigations within the session.
- **FR-09**: Tabs (All / Deals / People / Organizations) must filter results with counts per tab.
- **FR-10**: Keyboard navigation (Arrow Up/Down to highlight, Enter to open, Escape to close) must work.

---

## Success Criteria

- A rep can open search, type a partial name, and navigate to the correct record in under 5 seconds.
- Results appear within 300ms of the debounce threshold.
- Keyboard navigation works for 100% of listed results.

---

## Key Entities

| Entity | Key Fields | Relationships |
|--------|-----------|---------------|
| SearchResult | entity ("deal"\|"person"\|"org"), id, title, subtitle, type | virtual — not stored |
| RecentlyViewed | entityType, entityId, title, viewedAt | session-only store |

---

## Out of Scope

- Full-text search within notes or activity descriptions
- Saved searches
- Search result ranking / relevance scoring beyond simple string matching

---

## Assumptions

- Search matches against: deal title, person name, org name (case-insensitive substring match).
- Recently Viewed is stored in-memory in the Zustand store (not persisted to backend) and resets on full page reload.
- A maximum of 5 results per entity type are returned (15 total max in "All" tab).
