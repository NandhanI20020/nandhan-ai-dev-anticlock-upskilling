---
description: Run the full SpecKit chain for a feature — specify → plan → tasks — in one command.
handoffs:
  - label: Implement this feature
    agent: speckit.implement
    prompt: Implement the feature using the tasks in the spec directory.
---

## User Input

```text
$ARGUMENTS
```

Run the complete SpecKit spec-generation pipeline for the feature described in `$ARGUMENTS`.

## Steps

Execute these three skills in sequence, passing context forward:

### Step 1 — Specify
Run `/speckit.specify $ARGUMENTS`
- Generates `specs/NNN-feature/spec.md`
- Wait for completion and note the feature directory path

### Step 2 — Plan  
Run `/speckit.plan` (uses the feature directory from Step 1)
- Generates `specs/NNN-feature/plan.md`, `research.md`, `data-model.md`, `contracts/api.md`

### Step 3 — Tasks
Run `/speckit.tasks` (uses the feature directory from Step 1)
- Generates `specs/NNN-feature/tasks.md`

## Completion Report

After all three steps complete, report:
- Feature directory: `specs/NNN-feature/`
- Files generated: spec.md, plan.md, research.md, data-model.md, contracts/api.md, tasks.md
- P1 story count, FR count, task count
- Ready to implement: Yes/No
- Next step: `/speckit.implement` or clarify blockers

## Usage example

```
/speckit.all Pipeline Kanban board with drag-and-drop deal cards
```
