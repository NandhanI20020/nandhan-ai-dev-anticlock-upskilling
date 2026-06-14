---
description: Create or update the feature specification from a natural language feature description.
handoffs: 
  - label: Build Technical Plan
    agent: speckit.plan
    prompt: Create a plan for the spec. I am building with React, Tailwind, Node.js/Express.
  - label: Clarify Spec Requirements
    agent: speckit.clarify
    prompt: Clarify specification requirements
    send: true
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Pre-Execution Checks

Check if `.specify/extensions.yml` exists. If so, read and apply any `hooks.before_specify` entries per the standard hook rules. Skip silently if the file doesn't exist.

## Outline

Given the feature description in `$ARGUMENTS`:

1. **Generate a concise short name** (2-4 words) using action-noun format (e.g., `pipeline-kanban`, `deal-detail`, `contact-list`).

2. **Determine the feature directory**:
   - Check `.specify/init-options.json` for `feature_numbering` (default: `"sequential"`)
   - Scan existing `specs/` directories to find the next available 3-digit number
   - Create: `specs/NNN-short-name/`
   - Persist to `.specify/feature.json`: `{ "feature_directory": "specs/NNN-short-name" }`

3. **Load context**:
   - Read `.specify/templates/spec-template.md`
   - Read `.specify/constitution.md` for project principles

4. **Write the spec** to `specs/NNN-short-name/spec.md` following the template:
   - Parse the user description → extract actors, actions, data, constraints
   - Fill User Scenarios & Testing with P1/P2/P3 prioritized user stories (each independently testable)
   - Write Functional Requirements (each testable, no implementation details)
   - Write Success Criteria (measurable, technology-agnostic, user-focused)
   - Identify Key Entities if data is involved
   - Max 3 `[NEEDS CLARIFICATION]` markers; make informed guesses for everything else
   - Document assumptions in an Assumptions section

5. **Quality validation**: After writing, check the spec against:
   - No implementation details (no tech stack, APIs, code)
   - All mandatory sections complete
   - Requirements are testable and unambiguous
   - Success criteria are measurable and technology-agnostic
   - Fix any issues and re-validate (max 3 iterations)

6. **Handle clarifications**: If `[NEEDS CLARIFICATION]` markers remain, present them as structured Q&A (max 3), wait for user responses, update the spec.

## Completion Report

Report:
- Feature directory path
- Spec file path
- Checklist validation summary
- Readiness for `/speckit.plan`

## Quick Guidelines

- Focus on **WHAT** and **WHY** — never **HOW**
- Written for business stakeholders, not developers
- Every requirement must be independently testable
- Each user story should deliver standalone value (MVP slice)
