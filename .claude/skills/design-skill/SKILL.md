---
name: Technical Design
description: Guide users through creating comprehensive technical designs from requirements. Use when the user wants to design architecture, create component diagrams, define data models, plan technical implementation, or move from requirements to design phase in spec-driven development. Helps translate requirements into actionable technical plans.
---

# Technical Design

Transform approved requirements into comprehensive technical designs that guide implementation.

## When to Use This Skill

Use this skill when:
- Moving from requirements phase to design phase
- The user mentions "design", "architecture", "technical approach", or "components"
- Need to translate requirements into technical specifications
- Planning system architecture, data models, or APIs
- Making technology and framework decisions

## Prerequisites

**Required**:
- Completed and approved requirements document
- Clear understanding of what needs to be built

**Optional** (improves design quality):
- Existing system architecture (if extending)
- Technology stack constraints
- Performance and scale requirements
- Team skill levels and preferences

## Workflow

### Step 1: Review and Analyze Requirements

**Load the requirements document** and analyze:

1. **Functional Requirements**: What features must be built?
2. **Non-Functional Requirements**: Performance, security, scalability needs?
3. **User Interactions**: What are the user workflows?
4. **Integration Points**: What external systems are involved?
5. **Constraints**: Technical, business, or compliance limitations?

**Extract key design drivers**:
- Critical features that drive architecture decisions
- Performance requirements that affect technology choices
- Security needs that shape component design
- Scale requirements that influence infrastructure choices

### Step 2: Research and Build Context

**Identify research needs**:
- Are there unfamiliar technologies or patterns to learn?
- Do we need to understand third-party APIs?
- Should we review best practices for this type of system?
- Are there compliance or security standards to research?

**Conduct targeted research**:
- Use docs-scraper agent for official documentation
- Research architectural patterns relevant to requirements
- Investigate technology options and their trade-offs
- Review security and performance best practices

**Document key findings**:
- Summarize insights that inform design decisions
- Note pros/cons of different approaches
- Include relevant links and sources
- Keep research focused on actionable insights

### Step 3: Design System Architecture

**Create high-level architecture**:

1. **System Overview**: Describe how the system works at the highest level
2. **Component Architecture**: Identify major components and their responsibilities
3. **Data Flow**: Show how information moves through the system
4. **Integration Points**: Define how system connects to external services
5. **Technology Stack**: Choose technologies with rationale

**Architecture Pattern**:
```markdown
## Architecture

### System Overview
[Describe the overall approach and key architectural decisions]

### Component Architecture
**[Component Name]**
- Purpose: [What this component does]
- Responsibilities: [Key functions]
- Technology: [Chosen tech and why]

### Data Flow
1. [Step 1 of data flow]
2. [Step 2 of data flow]
3. [Step 3 of data flow]

### Technology Decisions
**[Technology/Framework]**: [Rationale for choosing]
```

### Step 4: Define Components and Interfaces

**For each major component**:

1. **Purpose**: What problem does this component solve?
2. **Responsibilities**: What are its specific duties?
3. **Interfaces**: How do other components interact with it?
4. **Dependencies**: What does this component need?
5. **Implementation Notes**: Key technical considerations

**Component Pattern**:
```markdown
### [Component Name]

**Purpose**: [Single sentence description]

**Responsibilities**:
- [Responsibility 1]
- [Responsibility 2]
- [Responsibility 3]

**Public Interface**:
- `functionName(params): returnType` - [What it does]
- `anotherFunction(params): returnType` - [What it does]

**Dependencies**:
- [Dependency 1]: [Why needed]
- [Dependency 2]: [Why needed]

**Implementation Notes**:
- [Key technical consideration]
- [Important pattern or approach]
```

### Step 5: Design Data Models

**Define all data structures**:

1. **Entity Definitions**: Core data structures and their properties
2. **Relationships**: How entities relate to each other
3. **Validation Rules**: Data integrity and business rules
4. **Storage Strategy**: How data will be persisted and accessed

**Data Model Pattern**:
```markdown
### [Entity Name]

**Properties**:
- `propertyName`: `Type` - [Description, constraints]
- `anotherProperty`: `Type` - [Description, constraints]

**Validation Rules**:
- [Rule 1]: [Validation logic]
- [Rule 2]: [Validation logic]

**Relationships**:
- [Relationship to other entity]

**Storage**:
- [How this will be persisted]
- [Indexing strategy if relevant]
```

### Step 6: Plan Error Handling Strategy

**Define error handling approach**:

1. **Error Categories**: Types of errors the system might encounter
2. **Error Responses**: How system responds to each error type
3. **User Communication**: How errors are presented to users
4. **Logging Strategy**: What gets logged and where
5. **Recovery Mechanisms**: How system recovers from errors

**Error Handling Pattern**:
```markdown
## Error Handling

### Error Categories
**Validation Errors**: User input doesn't meet requirements
- Response: 400 Bad Request with specific field errors
- User Message: "Please correct the following fields..."

**Authentication Errors**: User not authenticated or authorized
- Response: 401 Unauthorized or 403 Forbidden
- User Message: "Please log in to continue"

**System Errors**: Database, network, or service failures
- Response: 500 Internal Server Error
- User Message: "Something went wrong. Please try again"
- Logging: Full error details, stack trace, context
```

### Step 7: Define Testing Strategy

**Plan testing approach**:

1. **Unit Testing**: What components need unit tests?
2. **Integration Testing**: What integrations need testing?
3. **End-to-End Testing**: What user flows need validation?
4. **Testing Tools**: What frameworks and tools to use?
5. **Coverage Goals**: What level of coverage is needed?

**Testing Strategy Pattern**:
```markdown
## Testing Strategy

### Unit Testing
- Test all business logic in service layer
- Test data validation in model layer
- Framework: Jest with 80% coverage goal

### Integration Testing
- Test API endpoints with real database
- Test external service integrations with mocks
- Framework: Supertest with test database

### End-to-End Testing
- Test complete user workflows
- Test critical paths: [list critical paths]
- Framework: Playwright for browser testing
```

### Step 8: Document Design Decisions

**For significant decisions**:

**Decision Record Pattern**:
```markdown
### Decision: [Brief title]

**Context**: [What situation requires a decision?]

**Options Considered**:
1. **[Option 1]**
   - Pros: [Benefits]
   - Cons: [Drawbacks]
   - Risk: [Implementation risks]

2. **[Option 2]**
   - Pros: [Benefits]
   - Cons: [Drawbacks]
   - Risk: [Implementation risks]

**Decision**: [Chosen option]

**Rationale**: [Why this option was selected based on requirements and constraints]

**Implications**: [What this means for implementation, performance, maintenance]

**Requirements Addressed**: [Reference specific requirements]
```

### Step 9: Validate Design Against Requirements

**Traceability check**:
- [ ] Every requirement has corresponding design element
- [ ] All user workflows are addressed in components
- [ ] Non-functional requirements are satisfied by design
- [ ] Error cases from requirements are handled in design
- [ ] Integration points match requirement specifications

**Quality check**:
- [ ] Components have clear, single responsibilities
- [ ] Interfaces are well-defined
- [ ] Data models support all required operations
- [ ] Error handling is comprehensive
- [ ] Testing strategy covers all critical functionality

**Feasibility check**:
- [ ] Design is technically achievable
- [ ] Performance requirements can be met
- [ ] Security requirements are addressed
- [ ] Design fits within constraints
- [ ] Team can implement with available skills

### Step 10: Document and Save

**Structure the design document**:
```markdown
# Design Document: [Feature Name]

## Overview
[High-level summary and approach]

## Architecture
[System architecture and components]

## Components and Interfaces
[Detailed component descriptions]

## Data Models
[Data structures and relationships]

## Error Handling
[Error strategy and responses]

## Testing Strategy
[Testing approach and tools]

## Design Decisions
[Key decisions with rationale]

## Implementation Considerations
[Notes for developers]

## Requirements Traceability
[Map design elements to requirements]
```

**Save location**: `specs/design-[feature-name].md`

### Step 11: Request Approval

Before proceeding to tasks phase:
- Present complete design document
- Highlight key architectural decisions
- Show traceability to requirements
- Ask for explicit approval: "Does this design satisfy the requirements?"
- Address any questions or concerns
- Only proceed to tasks after design is approved

## Reference Documentation

For detailed guidance, see:
- [Architecture Patterns](ARCHITECTURE_PATTERNS.md) - Common patterns and when to use them
- [Decision Templates](DECISION_TEMPLATES.md) - Frameworks for making design decisions
- [Examples](EXAMPLES.md) - Complete design document examples
- [Kiro Design Phase](../../kiro/spec-process-guide/process/design-phase.md) - Full methodology

## Common Design Patterns

### RESTful API Design
- Resource-based endpoints
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Proper status codes
- JSON request/response format

### Service Layer Pattern
- Controller handles HTTP concerns
- Service layer contains business logic
- Repository layer handles data access
- Clear separation of concerns

### Event-Driven Architecture
- Components communicate via events
- Loose coupling between services
- Async processing for non-critical operations
- Event store for audit trail

## Best Practices

**Do**:
- ✅ Design for the requirements you have, not imagined future needs
- ✅ Keep components focused with single responsibilities
- ✅ Define clear interfaces between components
- ✅ Document rationale for major decisions
- ✅ Consider error cases and edge conditions
- ✅ Plan for testing from the start

**Don't**:
- ❌ Over-engineer or add unnecessary complexity
- ❌ Skip error handling planning
- ❌ Ignore non-functional requirements
- ❌ Choose technologies without rationale
- ❌ Create components with unclear boundaries
- ❌ Forget to trace design back to requirements

## Next Steps

After design is complete and approved:
1. **Proceed to Tasks Phase**: Use tasks-skill or tasks-agent
2. **Break Down Implementation**: Create actionable development tasks
3. **Maintain Design-Task Alignment**: Ensure tasks implement design
4. **Keep Design Updated**: Revise if tasks reveal issues
5. **Consider Worktree** (Optional): Create isolated worktree for implementation

Design provides the technical roadmap. The tasks phase will break it into actionable steps.


