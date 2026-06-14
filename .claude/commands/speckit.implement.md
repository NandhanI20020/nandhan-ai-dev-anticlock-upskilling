---
description: Execute the implementation plan by processing tasks in tasks.md phase by phase.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Pre-Execution Checks

Check if `.specify/extensions.yml` exists. If so, apply any `hooks.before_implement` entries. Skip silently if the file doesn't exist.

## Outline

1. **Load context** from current feature directory (`.specify/feature.json`):
   - **Required**: `tasks.md`, `plan.md`
   - **Optional**: `data-model.md`, `contracts/`, `research.md`, `quickstart.md`
   - **If exists**: `.specify/constitution.md`

2. **Checklist gate**: If `{feature_directory}/checklists/` exists, check all checklists. If any item is incomplete, show a status table and ask: "Some checklists are incomplete — proceed anyway? (yes/no)". Stop if user says no.

3. **Project setup verification**: Verify `.gitignore`, ensure `node_modules/`, `dist/`, `.env*` are covered.

4. **Parse tasks.md**: Extract phases, tasks (with IDs and `[P]` markers), and dependencies.

5. **Execute phase by phase**:
   - Complete each phase before starting the next
   - Sequential tasks: run in ID order
   - Parallel tasks `[P]`: can run together (use subagents for truly independent ones)
   - After each task: mark it `[X]` in tasks.md
   - Halt on any non-parallel task failure; report error with context

6. **Validate on completion**:
   - All tasks marked `[X]`
   - Run `npm run dev` in both `frontend/` and `backend/` to verify startup
   - Verify implemented features match spec.md user stories
   - Run Playwright tests if they exist

## Completion Report

Summary of:
- Tasks completed vs. total
- Features implemented (mapped to user stories)
- Any skipped or failed tasks with reasons
- Next steps (remaining stories or `/speckit.implement` for next phase)

## Rules

- Follow TDD only if tasks.md explicitly includes test tasks
- Never modify tasks.md except to mark items `[X]`
- Prefer editing existing files to creating new ones
- No comments explaining what code does — only non-obvious WHY
