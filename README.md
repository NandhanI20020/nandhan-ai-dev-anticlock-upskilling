# Pipedrive SpecKit — CRM with Spec-Driven Development

A hands-on learning project demonstrating **Spec-Driven Development (SDD)** using Claude Code's full feature set. We build a Pipedrive-inspired CRM from scratch, going from live UX research all the way to a working app — every step driven by specs and Claude Code tools.

## Learning Objectives

This project deliberately showcases the following Claude Code concepts:

| Concept | Where used |
|---------|-----------|
| MCP servers (Playwright) | Live Pipedrive research |
| Subagents | Parallel PRD drafting + component builds |
| Skills / slash commands | Spec-Kit commands, mock-data generator |
| Plan mode | Every non-trivial feature |
| TaskCreate / TaskUpdate | Spec task tracking |
| Hooks | Pre-commit lint, post-edit tests |
| Memory system | Cross-session design decisions |
| CLAUDE.md | Project context baked in |

## Workflow

```
Playwright (research)
        ↓
  PRD #1 (UX PRD)  ──→  Google Stitch  ──→  UI mockups
        ↓
PRD #2 (Technical)  ──→  Spec-Kit  ──→  specs/
        ↓
   Claude Code  ──→  Working CRM app
```

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS + React Router
- **Backend:** Node.js + Express (mock JSON store — no database)
- **State:** React Query (server state) + Zustand (UI state)
- **Testing:** Playwright (E2E)
- **Specs:** GitHub Spec-Kit (`.specify/` + `specs/`)

## Project Structure

```
pipedrive-speckit/
├── .specify/           ← Spec-Kit governance templates
├── specs/              ← Feature specs (spec.md, plan.md, tasks.md per feature)
├── PRDs/               ← Research notes + both PRDs
├── frontend/           ← React app
├── backend/            ← Express API + mock data
├── CLAUDE.md           ← Claude Code project instructions
└── PLAN.md             ← Full phased project plan
```

## Phases

| Phase | What happens |
|-------|-------------|
| 1 | Environment setup: Playwright MCP, project scaffold |
| 2 | Playwright research: browse live Pipedrive, document UX |
| 3 | PRD #1: UX PRD → Google Stitch for UI mockups |
| 4 | PRD #2: Technical PRD → Spec-Kit input |
| 5 | Spec generation: `.specify` → `specs/` per feature |
| 6 | App build: spec-driven, one Claude Code feature per module |

## Getting Started

### Prerequisites
- Node.js 20+
- Claude Code CLI

### Install Playwright MCP (Phase 1)
```bash
npm install -g @playwright/mcp
```

Then add to your `~/.claude/settings.json`:
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp", "--headful"],
      "type": "stdio"
    }
  }
}
```

### Run the app (Phase 6 onwards)
```bash
# Backend
cd backend && npm install && npm start

# Frontend (separate terminal)
cd frontend && npm install && npm run dev
```

## References

- [GitHub Spec-Kit](https://github.com/github/spec-kit) — SDD methodology and templates
- [Google Stitch](https://stitch.withgoogle.com) — AI UI design from text descriptions
- [Playwright MCP](https://github.com/microsoft/playwright-mcp) — Browser automation for Claude Code
- [Pipedrive](https://pipedrive.com) — CRM we're using as the design reference
