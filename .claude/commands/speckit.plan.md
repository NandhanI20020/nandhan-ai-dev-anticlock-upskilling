---
description: Execute the implementation planning workflow — generate research, data model, API contracts, and quickstart guide.
handoffs: 
  - label: Create Tasks
    agent: speckit.tasks
    prompt: Break the plan into tasks
    send: true
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Pre-Execution Checks

Check if `.specify/extensions.yml` exists. If so, read and apply any `hooks.before_plan` entries. Skip silently if the file doesn't exist.

## Outline

1. **Load context**:
   - Read `.specify/feature.json` to find the current `feature_directory`
   - Read `{feature_directory}/spec.md` (required)
   - Read `.specify/constitution.md` for governance constraints
   - Copy `.specify/templates/plan-template.md` to `{feature_directory}/plan.md`

2. **Phase 0 — Research** (`{feature_directory}/research.md`):
   - Extract unknowns from the spec (any `[NEEDS CLARIFICATION]` or ambiguous tech choices)
   - Research best practices for each unknown using project context
   - For each decision, document: Decision → Rationale → Alternatives considered
   - Resolve all unknowns before proceeding to Phase 1

3. **Phase 1 — Design artifacts**:
   - **`{feature_directory}/data-model.md`**: Extract entities from spec → define fields, relationships, validation rules, state transitions
   - **`{feature_directory}/contracts/api.md`**: Define REST API endpoints that serve this feature's user stories (method, path, request/response shape)
   - **`{feature_directory}/quickstart.md`**: Runnable end-to-end validation scenarios — prerequisites, commands, expected outcomes (no implementation code; that goes in tasks.md)

4. **Fill `plan.md`** using the template:
   - Tech stack: React 18 + Vite + Tailwind / Node.js + Express + mock JSON store
   - Architecture decisions from research.md
   - File/directory structure for this feature
   - Dependencies and library choices
   - Complexity notes

## Completion Report

Report:
- Branch / feature directory
- Plan file path
- Generated artifacts (research.md, data-model.md, contracts/, quickstart.md)
- Readiness for `/speckit.tasks`

## Key Rules

- Use absolute paths for filesystem operations; relative paths in documentation
- ERROR on unresolved clarifications — don't proceed to Phase 1 with unknowns
