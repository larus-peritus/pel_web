---
description: Create requirements document using EARS format. Focus on Requirements phase only.
argument-hint: [feature-description]
allowed-tools: Read, Write, Edit, Grep
---

# Requirements Command

Create a requirements document using EARS format for a feature.

## Variables

```
FEATURE_DESCRIPTION: $ARGUMENTS (all arguments treated as description)
SPECS_DIR: specs/
```

## Instructions

Create comprehensive requirements document with user stories and EARS-format acceptance criteria.

### Workflow

1. **Parse Feature Description**: Extract feature name and purpose from arguments
2. **Activate requirements-skill**: Use for detailed guidance
3. **Gather Context**: Ask about users, constraints, success criteria, scope
4. **Create User Stories**: Format: "As a [role], I want [feature], so that [benefit]"
5. **Write Acceptance Criteria**: Use EARS format (WHEN/IF/WHILE/WHERE...SHALL)
6. **Define Non-Functional Requirements**: Performance, security, usability, reliability
7. **Validate**: Check completeness, quality, EARS compliance
8. **Generate Filename**: Create kebab-case name from feature description
9. **Save**: Write to `specs/requirements-[feature-name].md`
10. **Present**: Show requirements and ask for approval

### Requirements Document Structure

```markdown
# Requirements: [Feature Name]

## Introduction
[Overview, business value, scope]

## Requirements

### Requirement 1: [Title]
**User Story**: As a [role], I want [feature], so that [benefit]

#### Acceptance Criteria
1. WHEN [event] THEN system SHALL [response]
2. IF [condition] THEN system SHALL [response]
...

## Non-Functional Requirements
[Performance, Security, Usability, Reliability]

## Constraints and Assumptions
[Technical and business constraints]

## Success Criteria
[Measurable outcomes]
```

### Validation

Before saving, verify:
- [ ] All user stories have clear roles, features, and benefits
- [ ] Acceptance criteria use proper EARS format
- [ ] Non-functional requirements included
- [ ] Requirements are testable and unambiguous
- [ ] Edge cases and error scenarios covered

## Report

```
✅ Requirements Document Created

File: specs/requirements-[feature-name].md

Summary:
- [X] user stories with clear value
- [X] EARS-format acceptance criteria
- [X] non-functional requirements
- Constraints and assumptions documented

Next Steps:
- Review requirements for completeness
- Get stakeholder approval
- Proceed to Design phase: /design requirements-[feature-name].md
```

## Usage Examples

```bash
# Create requirements for user authentication
/requirements user authentication with email and password

# Create requirements for file upload
/requirements file upload with virus scanning

# Create requirements for search feature
/requirements search functionality with filters
```

## Notes

- This command focuses only on Requirements phase
- For complete workflow, use `/spec-workflow` instead
- Alternative: Use `requirements-agent` for more interactive experience
- Uses `requirements-skill` for detailed guidance


