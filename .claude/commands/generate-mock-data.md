---
description: Generate realistic JSON mock data for a given entity type and write it to backend/data/.
---

## User Input

```text
$ARGUMENTS
```

Generate realistic JSON seed data for the entity specified in `$ARGUMENTS`. If no entity is specified, generate data for all entities in order: users, pipelines, stages, deals, people, organizations, activities, notes, leads, products, labels.

## Instructions

1. **Identify the target entity** from `$ARGUMENTS` (e.g. "deals", "people", "organizations", or "all").

2. **Read the data model** from `PRDs/prd-02-technical.md` — Section 3 (Data Models) — to get the exact field names and types for the target entity.

3. **Read any existing seed files** in `backend/data/` to understand ID conventions and cross-references (e.g. which orgIds exist when generating people).

4. **Generate realistic data** following these rules:
   - Use plausible Indian/global business names — no `[Sample]` prefix
   - Deals: mix of stages, values ₹5,000–₹8,00,000, some rotten (old updatedAt), some with close dates in past/future
   - People: realistic full names, work emails matching org domains, Indian mobile numbers (+91 format)
   - Organizations: real-sounding company names, Indian cities for addresses, .com/.in websites
   - Activities: mix of all 5 types, 40% done, realistic subjects, spread across past 30 days and next 14 days
   - All IDs: UUID v4 format strings (use pattern "entity-NNN" for readability, e.g. "deal-001")
   - All timestamps: ISO 8601 format
   - Cross-references must be valid (personId must reference an existing person id)

5. **Write the file** to `backend/data/<entity>.json` as a valid JSON array.

6. **Report**: entity name, record count, file path, and any cross-reference assumptions made.

## Counts

| Entity | Count |
|--------|-------|
| users | 1 (Nandhan Venkadesh, user-1) |
| pipelines | 2 |
| stages | 11 (6 + 5) |
| deals | 25 |
| people | 20 |
| organizations | 10 |
| activities | 40 |
| notes | 15 |
| leads | 8 |
| products | 6 |
| labels | 8 |
