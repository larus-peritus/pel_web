---
description: Create design document from requirements file. Focus on Design phase only.
argument-hint: [requirements-file]
allowed-tools: Read, Write, Edit, Glob, Grep, WebFetch
---

# Design Command

Create technical design document from approved requirements.

## Variables

```
REQUIREMENTS_FILE: $1 (required - path to requirements file)
SPECS_DIR: specs/
```

## Instructions

Create comprehensive technical design from approved requirements document.

### Prerequisites

- Approved requirements document must exist
- Requirements file path provided as argument

### Workflow

1. **Load Requirements**: Read requirements from `${REQUIREMENTS_FILE}`
2. **Validate Prerequisites**: Ensure requirements exist and are complete
3. **Activate design-skill**: Use for detailed guidance
4. **Analyze Requirements**: Extract design drivers, constraints, integration needs
5. **Research if Needed**: Can use WebFetch for documentation if necessary
6. **Design Architecture**: System overview, components, data flow, technology stack
7. **Define Components**: Responsibilities, interfaces, dependencies
8. **Design Data Models**: Entities, relationships, validation, storage
9. **Plan Error Handling**: Categories, responses, logging, recovery
10. **Define Testing Strategy**: Unit, integration, end-to-end approaches
11. **Document Decisions**: Key choices with rationale and trade-offs
12. **Validate Design**: Trace to requirements, check feasibility
13. **Extract Feature Name**: Derive from requirements file name
14. **Save**: Write to `specs/design-[feature-name].md`
15. **Present**: Show design and ask for approval

### Design Document Structure

```markdown
# Design Document: [Feature Name]

## Overview
[High-level summary and approach]

## Architecture
[System architecture, components, data flow]

## Components and Interfaces
[Detailed component descriptions]

## Data Models
[Entity definitions and relationships]

## Error Handling
[Error strategy and responses]

## Testing Strategy
[Testing approach and tools]

## Design Decisions
[Key decisions with rationale]

## Requirements Traceability
[Map design to requirements]
```

### Validation

Before saving, verify:
- [ ] All requirements addressed in design
- [ ] Components have clear responsibilities
- [ ] Interfaces are well-defined
- [ ] Data models support all required operations
- [ ] Error handling is comprehensive
- [ ] Design is technically feasible

## Report

```
✅ Design Document Created

File: specs/design-[feature-name].md

Summary:
- Architecture: [Brief description]
- Components: [X] major components defined
- Data Models: [X] entities specified
- Error handling strategy defined
- Testing strategy planned

Key Decisions:
1. [Decision]: [Rationale]
2. [Decision]: [Rationale]

Requirements Traceability:
- All requirements addressed in design
- Non-functional requirements satisfied

Next Steps:
- Review design for completeness
- Get technical approval
- Proceed to Tasks phase: /tasks design-[feature-name].md
```

## Usage Examples

```bash
# Create design from requirements file
/design specs/requirements-user-authentication.md

# Create design for file upload
/design specs/requirements-file-upload.md

# Using relative path
/design requirements-notification-system.md
```

## Notes

- This command focuses only on Design phase
- Requires existing requirements document
- For complete workflow, use `/spec-workflow` instead
- Alternative: Use `design-agent` for more interactive experience
- Uses `design-skill` for detailed guidance
- Can research documentation via WebFetch if needed


