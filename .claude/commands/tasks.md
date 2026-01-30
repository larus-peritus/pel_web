---
description: Create implementation tasks from design file. Focus on Tasks phase only.
argument-hint: [design-file]
allowed-tools: Read, Write, Edit, Grep
---

# Tasks Command

Create implementation task breakdown from approved design document.

## Variables

```
DESIGN_FILE: $1 (required - path to design file)
SPECS_DIR: specs/
```

## Instructions

Create detailed implementation task breakdown from approved design document.

### Prerequisites

- Approved design document must exist
- Design file path provided as argument
- Requirements document should exist for reference

### Workflow

1. **Load Design**: Read design from `${DESIGN_FILE}`
2. **Load Requirements**: Read corresponding requirements file
3. **Validate Prerequisites**: Ensure design and requirements exist
4. **Activate tasks-skill**: Use for detailed guidance
5. **Analyze Design**: Identify components, dependencies, testing needs
6. **Choose Strategy**: Select sequencing approach (foundation-first, feature-slice, risk-first, hybrid)
7. **Create Task Hierarchy**: Two levels (epics + tasks)
8. **Define Tasks**: Clear objectives, files, functionality, testing, requirements
9. **Sequence Tasks**: Respect dependencies, enable incremental progress
10. **Mark Parallel Work**: Identify tasks that can be done simultaneously
11. **Validate Tasks**: Check completeness, clarity, sizing, traceability
12. **Consider Worktree**: Suggest if appropriate for feature isolation
13. **Extract Feature Name**: Derive from design file name
14. **Save**: Write to `specs/tasks-[feature-name].md`
15. **Present**: Show task breakdown

### Tasks Document Structure

```markdown
# Implementation Tasks: [Feature Name]

## Overview
[Brief summary of implementation]

## Implementation Strategy
[Chosen approach and rationale]

## Task List

- [ ] 1. [Epic/Major Component]
- [ ] 1.1 [Specific task]
  - [Task details]
  - Requirements: [REQ-X.Y]

- [ ] 2. [Next Epic]
- [ ] 2.1 [Task]
  ...

## Dependencies
[External dependencies or prerequisites]

## Notes
[Implementation guidance, worktree suggestions]
```

### Task Definition Template

```markdown
- [ ] X.Y [Action Verb + Component/Feature]
  - [Primary objective]
  - Create/Modify: [Specific files]
  - Implement: [Key functionality]
  - Test: [What tests to write]
  - Requirements: [REQ-X.Y]
```

### Validation

Before saving, verify:
- [ ] All design components have corresponding tasks
- [ ] Tasks are specific and actionable (2-6 hours each)
- [ ] Dependencies are clear and respected
- [ ] Requirements are traced
- [ ] Testing is integrated
- [ ] Task breakdown is complete

## Report

```
✅ Implementation Tasks Created

File: specs/tasks-[feature-name].md

Summary:
- Strategy: [Foundation-first / Feature-slice / Risk-first / Hybrid]
- Total: [X] tasks across [Y] epics
- Parallel work: [X] tasks can be parallelized

Task Breakdown:
- Setup/Foundation: [X] tasks
- Data Layer: [X] tasks
- Business Logic: [X] tasks
- API/Interface: [X] tasks
- Integration/Testing: [X] tasks

Dependencies:
- Clear sequential dependencies defined
- Parallel opportunities identified

Worktree Suggestion:
[Yes/No with rationale]

Next Steps:
1. Review task breakdown
2. Get technical approval
3. Optional: /create_worktree [feature-name]
4. Begin implementation following sequence
```

## Usage Examples

```bash
# Create tasks from design file
/tasks specs/design-user-authentication.md

# Create tasks for file upload
/tasks specs/design-file-upload.md

# Using relative path
/tasks design-notification-system.md
```

## Notes

- This command focuses only on Tasks phase
- Requires existing design and requirements documents
- For complete workflow, use `/spec-workflow` instead
- Alternative: Use `tasks-agent` for more interactive experience
- Uses `tasks-skill` for detailed guidance
- Suggests worktree if appropriate for feature isolation


