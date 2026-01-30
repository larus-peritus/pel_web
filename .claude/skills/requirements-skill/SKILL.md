---
name: Requirements Engineering
description: Guide users through creating comprehensive requirements using EARS format (Easy Approach to Requirements Syntax). Use when the user wants to define requirements, create user stories, write acceptance criteria, or start a spec-driven development process. Helps capture clear, testable requirements for any feature.
---

# Requirements Engineering

Transform feature ideas into clear, testable requirements using the EARS (Easy Approach to Requirements Syntax) format.

## When to Use This Skill

Use this skill when:
- Starting a new feature specification
- The user mentions "requirements", "user stories", or "acceptance criteria"
- Beginning spec-driven development workflow
- Clarifying what needs to be built before design or implementation
- Creating testable specifications for any feature

## Prerequisites

**Optional Context** (improves requirements quality):
- Project technology stack and constraints
- Target users and their roles
- Business objectives and success metrics
- Existing system architecture (if extending)

## Workflow

### Step 1: Gather Context

**Ask clarifying questions** to understand the feature:

1. **Feature Purpose**: What problem does this solve? Who benefits?
2. **User Roles**: Who will interact with this feature?
3. **Constraints**: Any technical, business, or compliance constraints?
4. **Success Criteria**: How will we know this feature is successful?
5. **Scope Boundaries**: What's included and excluded?

### Step 2: Create User Stories

**Format**: As a [role], I want [feature], so that [benefit]

**Guidelines**:
- Focus on user value, not implementation
- Keep stories independent when possible
- Ensure each story delivers measurable value
- Consider all user types and personas

**Example**:
```
As a registered user, I want to reset my password via email, 
so that I can regain access to my account if I forget my credentials.
```

### Step 3: Write Acceptance Criteria (EARS Format)

Use EARS syntax for precise, testable requirements:

**WHEN**: Describes triggering events or conditions
```
WHEN user clicks submit button THEN system SHALL validate form data
```

**IF**: Describes preconditions that must be met
```
IF user is authenticated THEN system SHALL display user dashboard
```

**WHILE**: Describes continuous behaviors
```
WHILE file is uploading THEN system SHALL display progress indicator
```

**WHERE**: Describes contextual or location-specific behaviors
```
WHERE user is on mobile device THEN system SHALL use responsive layout
```

**Key Rules**:
- Use "SHALL" for mandatory system behavior (consistent)
- Make criteria testable and measurable
- Include both positive and negative scenarios
- Cover edge cases and error conditions
- Avoid implementation details

### Step 4: Define Non-Functional Requirements

Address critical quality attributes:

**Performance**:
```
WHEN user requests data THEN system SHALL respond within 2 seconds
```

**Security**:
```
IF user session expires THEN system SHALL redirect to login page
```

**Usability**:
```
WHEN validation fails THEN system SHALL display specific error messages
```

**Reliability**:
```
WHEN service fails THEN system SHALL retry 3 times with exponential backoff
```

### Step 5: Validate Requirements

**Completeness Check**:
- [ ] All user roles addressed
- [ ] Normal, edge, and error cases covered
- [ ] Non-functional requirements included
- [ ] Dependencies and constraints documented

**Quality Check**:
- [ ] Each requirement is testable
- [ ] Requirements use clear, unambiguous language
- [ ] No implementation details in requirements
- [ ] No conflicting requirements
- [ ] Success criteria are measurable

**EARS Format Check**:
- [ ] WHEN/IF/WHILE/WHERE used correctly
- [ ] "SHALL" used consistently for system responses
- [ ] Specific events, conditions, and responses defined
- [ ] Avoid vague terms like "fast", "user-friendly"

### Step 6: Document and Save

**Structure the requirements document**:
```markdown
# Requirements: [Feature Name]

## Introduction
[Feature overview, business value, scope]

## Requirements

### Requirement 1: [Title]
**User Story**: As a [role], I want [feature], so that [benefit]

#### Acceptance Criteria
1. WHEN [event] THEN system SHALL [response]
2. IF [condition] THEN system SHALL [response]
3. WHEN [event] AND [condition] THEN system SHALL [response]

### Requirement 2: [Title]
...

## Non-Functional Requirements
[Performance, Security, Usability, Reliability]

## Constraints and Assumptions
[Technical and business constraints, key assumptions]

## Success Criteria
[Measurable outcomes that define success]
```

**Save location**: `specs/requirements-[feature-name].md`

### Step 7: Request Approval

Before proceeding to design phase:
- Present complete requirements document
- Highlight key requirements and acceptance criteria
- Ask for explicit approval: "Are these requirements complete and accurate?"
- Note any questions or clarifications needed
- Only proceed to design after requirements are approved

## Reference Documentation

For detailed guidance, see:
- [EARS Format Reference](EARS_REFERENCE.md) - Complete EARS syntax guide
- [Validation Checklist](VALIDATION.md) - Comprehensive quality checks
- [Examples](EXAMPLES.md) - Real-world requirements examples
- [Kiro Requirements Phase](../../kiro/spec-process-guide/process/requirements-phase.md) - Full methodology

## Common Patterns

**User Authentication**:
```
WHEN user provides valid credentials THEN system SHALL authenticate user
WHEN user provides invalid credentials THEN system SHALL display error message
IF user fails authentication 3 times THEN system SHALL lock account for 15 minutes
```

**Data Validation**:
```
WHEN user enters data in required field THEN system SHALL remove error highlighting
WHEN user submits form with empty required fields THEN system SHALL highlight missing fields
IF validation passes THEN system SHALL enable submit button
```

**File Upload**:
```
WHEN user selects file under 10MB THEN system SHALL accept file for upload
WHEN user selects file over 10MB THEN system SHALL display "file too large" error
WHILE upload is in progress THEN system SHALL display progress indicator
```

## Best Practices

**Do**:
- ✅ Use specific, measurable criteria
- ✅ Include both positive and negative scenarios
- ✅ Focus on what the system should do, not how
- ✅ Consider all user roles and interactions
- ✅ Cover edge cases and error conditions

**Don't**:
- ❌ Use vague terms like "fast", "user-friendly", "responsive"
- ❌ Specify implementation details (databases, frameworks)
- ❌ Combine multiple requirements in one statement
- ❌ Forget non-functional requirements
- ❌ Skip validation and edge cases

## Next Steps

After requirements are complete and approved:
1. **Proceed to Design Phase**: Use design-skill or design-agent
2. **Create Technical Design**: Architecture, components, data models
3. **Maintain Traceability**: Link design decisions back to requirements
4. **Update as Needed**: Requirements may need refinement during design

Requirements are the foundation for everything that follows. Take time to get them right.


