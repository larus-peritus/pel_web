---
description: Execute complete spec-driven development workflow (Requirements → Design → Tasks) for a feature. Creates all three specification documents systematically.
argument-hint: [feature-name]
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Spec Workflow Command

Execute the complete spec-driven development workflow: Requirements → Design → Tasks.

## Variables

```
FEATURE_NAME: $1 (required)
SPECS_DIR: specs/
REQUIREMENTS_FILE: specs/requirements-${FEATURE_NAME}.md
DESIGN_FILE: specs/design-${FEATURE_NAME}.md
TASKS_FILE: specs/tasks-${FEATURE_NAME}.md
```

## Instructions

This command orchestrates the complete three-phase spec-driven development process. It systematically guides through Requirements → Design → Tasks, validating at each phase gate.

### Prerequisites

- Feature idea or problem to solve
- Basic understanding of feature purpose
- Willingness to answer clarifying questions

### Workflow

**Phase 1: Requirements (using requirements-skill)**

1. Gather context about feature, users, constraints, scope
2. Create user stories with clear value propositions
3. Write EARS-format acceptance criteria (WHEN/IF/WHILE/WHERE...SHALL)
4. Define non-functional requirements (performance, security, usability)
5. Validate requirements for completeness and quality
6. Save to `${REQUIREMENTS_FILE}`
7. Present to user and get explicit approval
8. **GATE**: Do NOT proceed to Design without approval

**Phase 2: Design (using design-skill)**

1. Load and analyze approved requirements
2. Conduct research if needed (can use docs-scraper)
3. Design system architecture (components, data flow, technology stack)
4. Define component interfaces and responsibilities
5. Design data models with validation rules
6. Plan error handling and testing strategies
7. Document key design decisions with rationale
8. Validate design against requirements
9. Save to `${DESIGN_FILE}`
10. Present to user and get explicit approval
11. **GATE**: Do NOT proceed to Tasks without approval

**Phase 3: Tasks (using tasks-skill)**

1. Load approved design and requirements
2. Choose sequencing strategy (foundation-first, feature-slice, risk-first, hybrid)
3. Create two-level task hierarchy (epics + tasks)
4. Define each task with clear objectives, files, testing, requirements
5. Sequence tasks with dependencies
6. Validate task breakdown (completeness, clarity, sizing)
7. Consider worktree suggestion if appropriate
8. Save to `${TASKS_FILE}`
9. Present to user
10. **COMPLETE**: Specification ready for implementation

### Phase Gates

**Critical**: Validate and get approval at each phase:
- After Requirements: "Are these requirements complete and accurate?"
- After Design: "Does this design satisfy all requirements?"
- After Tasks: "Does this task breakdown cover the entire design?"

Do NOT skip phase gates without explicit user approval.

### File Outputs

- `${REQUIREMENTS_FILE}`: Complete requirements with EARS acceptance criteria
- `${DESIGN_FILE}`: Technical design with architecture and components
- `${TASKS_FILE}`: Implementation task breakdown with dependencies

### Skills Activated

This command leverages:
- `requirements-skill` for Requirements phase
- `design-skill` for Design phase
- `tasks-skill` for Tasks phase
- `spec-orchestrator-skill` for overall coordination

### Error Handling

- If feature name missing: Prompt user for feature name
- If specs directory doesn't exist: Create it
- If file already exists: Ask if should overwrite or use different name
- If user rejects phase: Stop workflow, save current progress
- If requirements/design missing for later phases: Error and guide to create them first

## Report

After complete workflow:

```
✅ Complete Specification Created for: ${FEATURE_NAME}

📋 Requirements: ${REQUIREMENTS_FILE}
   - User stories with EARS acceptance criteria
   - Non-functional requirements
   - Constraints and success criteria

🏗️ Design: ${DESIGN_FILE}
   - System architecture and components
   - Data models and interfaces
   - Error handling and testing strategy

✅ Tasks: ${TASKS_FILE}
   - [X] implementation tasks
   - Sequenced with dependencies
   - Requirements traced

🎯 Next Steps:
   1. Review all three documents
   2. Optional: Create worktree - /create_worktree ${FEATURE_NAME}
   3. Begin implementation following tasks

📚 Documentation:
   - Workflow patterns: docs/workflow-patterns.md
   - Worktree guide: docs/worktree-integration.md
```

## Usage Examples

```bash
# Create complete spec for user authentication
/spec-workflow user-authentication

# Create spec for file upload feature
/spec-workflow file-upload

# Create spec for notification system
/spec-workflow notification-system
```

## Notes

- This is the recommended way to create complete specifications
- Takes 30-60 minutes depending on feature complexity
- Validates quality at each phase
- Ensures traceability from requirements through tasks
- Alternative: Use `spec-orchestrator` agent for more interactive guidance


