---
name: Task Planning
description: Break down approved designs into actionable implementation tasks. Use when the user wants to create development tasks, plan implementation steps, sequence work, or move from design to implementation in spec-driven development. Helps convert technical designs into sequential, testable coding tasks.
---

# Task Planning

Transform approved technical designs into actionable, sequential implementation tasks.

## When to Use This Skill

Use this skill when:
- Moving from design phase to implementation planning
- The user mentions "tasks", "implementation plan", "breakdown", or "sprint planning"
- Need to convert design into specific coding activities
- Planning development work and sequencing
- Preparing for actual implementation

## Prerequisites

**Required**:
- Completed and approved design document
- Approved requirements document

**Optional** (improves task planning):
- Team size and skill levels
- Timeline constraints
- Development priorities
- Technology stack familiarity

## Workflow

### Step 1: Analyze Design Document

**Review the design** and identify:

1. **Major Components**: What needs to be built?
2. **Dependencies**: What must be built before other things?
3. **Integration Points**: Where do components connect?
4. **Testing Needs**: What testing is required?
5. **Data Models**: What database/storage work is needed?

**Map to Implementation Work**:
- Each component → multiple tasks
- Each data model → implementation + tests
- Each API endpoint → implementation + tests
- Each integration → implementation + integration tests

### Step 2: Identify Task Categories

**Foundation Tasks**:
- Project setup and configuration
- Core interfaces and types
- Database schema and migrations
- Testing framework setup

**Data Layer Tasks**:
- Model implementations
- Repository/data access layer
- Validation logic
- Data layer tests

**Business Logic Tasks**:
- Service implementations
- Workflow logic
- Business rule validation
- Service layer tests

**API/Interface Tasks**:
- Endpoint implementations
- Request/response handling
- Input validation
- API tests

**Integration Tasks**:
- Component wiring
- External service integration
- End-to-end testing
- System integration tests

### Step 3: Create Task Hierarchy

**Use two-level structure**:
- **Level 1**: Major component or feature area (epic)
- **Level 2**: Specific implementation tasks (tasks)

**Task Structure**:
```markdown
- [ ] 1. [Epic/Major Component]
- [ ] 1.1 [Specific implementation task]
  - [Task details and requirements references]
  - [Files to create/modify]
  - [Testing expectations]
- [ ] 1.2 [Next specific task]
  - [Task details]
```

**Example**:
```markdown
- [ ] 1. Set up authentication foundation
- [ ] 1.1 Create project structure and core interfaces
  - Set up directory structure for auth, models, and API components
  - Define TypeScript interfaces for User, Session types
  - Create base configuration files
  - Requirements: REQ-1.1, REQ-2.1

- [ ] 1.2 Set up testing framework and database
  - Configure Jest for unit and integration testing
  - Set up test database with Docker configuration
  - Create database migration scripts for user tables
  - Requirements: REQ-1.1, REQ-2.1
```

### Step 4: Define Each Task

**For each task, specify**:

1. **Clear Objective**: What specific code needs to be written?
2. **Files/Components**: What files or components to create/modify?
3. **Key Functionality**: What functionality to implement?
4. **Requirements Traceability**: Which requirements does this address?
5. **Testing**: What tests should be written?
6. **Completion Criteria**: How to know the task is done?

**Task Template**:
```markdown
- [ ] X.Y [Task Title - Action Verb + Component/Feature]
  - [Primary objective in one clear sentence]
  - Create/Modify: [Specific files or components]
  - Implement: [Key functionality points]
  - Test: [What tests to write]
  - Requirements: [REQ-X.Y, REQ-Z.W]
```

### Step 5: Sequence Tasks

**Sequencing Principles**:

1. **Foundation First**: Core setup before dependent work
2. **Bottom-Up**: Lower-level utilities before higher-level features
3. **Dependencies Clear**: Each task builds on completed work
4. **Testable Increments**: Each task produces testable code
5. **Early Validation**: High-risk items early when possible

**Common Sequences**:
```
Setup → Data Models → Data Access → Business Logic → API → Integration
Setup → Core Features → Extended Features → Polish
Setup → High-Risk Items → Standard Items → Polish
```

**Parallel Work Opportunities**:
- Independent components can be developed simultaneously
- Mark which tasks can be done in parallel
- Consider team size and coordination needs

### Step 6: Add Dependency Information

**Make dependencies explicit**:
```markdown
- [ ] 3. Create authentication services (depends on 1.2, 2.1)
- [ ] 3.1 Implement login service
  - Requires: User model (2.1), Session model (2.2), Auth middleware (1.2)
  - ...
```

**Dependency Types**:
- **Technical**: Code must exist before use
- **Logical**: Concepts build on each other
- **Data**: Requires specific data or state
- **Testing**: Requires test infrastructure

### Step 7: Estimate and Validate

**For each task assess**:
- **Size**: Can be completed in 2-6 hours?
- **Clarity**: Can a developer start immediately?
- **Testability**: Results in testable code?
- **Independence**: Minimal dependencies or clearly stated?

**Too Large**:
```markdown
❌ - [ ] 1.1 Implement complete user management system
```

**Too Small**:
```markdown
❌ - [ ] 1.1 Add semicolon to line 42
```

**Just Right**:
```markdown
✅ - [ ] 1.1 Create User model with validation methods
  - Implement User class with fields and validation
  - Add email format and password strength validation
  - Write unit tests for validation scenarios
  - Requirements: REQ-1.2, REQ-2.1
```

### Step 8: Include Testing Tasks

**Every implementation task should include testing**:
- Unit tests for business logic
- Integration tests for component interactions
- End-to-end tests for complete workflows

**Testing Pattern**:
```markdown
- [ ] 2.1 Create User model with validation
  - Implement User class with email, password fields
  - Add validation methods for email and password
  - Write unit tests for validation logic
  - Test cases: valid data, invalid email, weak password
  - Requirements: REQ-1.2
```

### Step 9: Consider Optional Worktree

**If implementing in isolated environment**:
```markdown
## Implementation Note

Consider creating a worktree for isolated feature development:
- Use `/create_worktree [feature-name]` for parallel environment
- Benefits: Independent ports, isolated database, parallel testing
- Optional: Only needed for complex features or parallel development
- See: [Worktree Integration Guide](../../docs/worktree-integration.md)
```

### Step 10: Document and Save

**Structure the tasks document**:
```markdown
# Implementation Tasks: [Feature Name]

## Overview
[Brief summary of what will be implemented]

## Implementation Strategy
[Chosen approach: foundation-first, feature-slice, risk-first, etc.]

## Task List

- [ ] 1. [Epic/Major Component]
- [ ] 1.1 [Task]
- [ ] 1.2 [Task]

- [ ] 2. [Epic/Major Component]
- [ ] 2.1 [Task]
- [ ] 2.2 [Task]

## Dependencies
[Clarify any external dependencies or prerequisites]

## Notes
[Implementation guidance, worktree suggestions, etc.]
```

**Save location**: `specs/tasks-[feature-name].md`

### Step 11: Request Approval

Before implementation begins:
- Present complete task breakdown
- Show how tasks map to design components
- Highlight dependencies and sequence rationale
- Ask: "Does this task breakdown cover the entire design?"
- Only proceed to implementation after approval

## Reference Documentation

For detailed guidance, see:
- [Sequencing Strategies](SEQUENCING_STRATEGIES.md) - How to order tasks effectively
- [Validation Checklist](VALIDATION.md) - Ensure task quality
- [Examples](EXAMPLES.md) - Complete task breakdown examples
- [Kiro Tasks Phase](../../kiro/spec-process-guide/process/tasks-phase.md) - Full methodology

## Sequencing Strategies

### Foundation-First
Best for new projects, complex systems:
```
1. Setup and core interfaces
2. Data models and validation
3. Data access layer
4. Business logic
5. API endpoints
6. Integration
```

### Feature-Slice
Best for MVPs, user-facing apps:
```
1. Core feature (end-to-end)
2. Secondary feature (end-to-end)
3. Additional features
4. Polish and optimization
```

### Risk-First
Best for technical uncertainty:
```
1. High-risk/complex items
2. External integrations
3. Core business logic
4. Standard implementations
5. Polish
```

## Best Practices

**Do**:
- ✅ Make tasks specific and actionable
- ✅ Include requirements references
- ✅ Specify files/components to create
- ✅ Include testing expectations
- ✅ Sequence with clear dependencies
- ✅ Size appropriately (2-6 hours)

**Don't**:
- ❌ Create vague or abstract tasks
- ❌ Skip testing tasks
- ❌ Ignore dependencies
- ❌ Make monolithic tasks
- ❌ Include non-coding tasks (deployment, user research)
- ❌ Forget requirements traceability

## Next Steps

After tasks are complete and approved:
1. **Begin Implementation**: Execute tasks in sequence
2. **Track Progress**: Mark tasks complete as work finishes
3. **Maintain Flexibility**: Adjust if implementation reveals issues
4. **Validate Regularly**: Ensure work satisfies requirements
5. **Update as Needed**: Refine tasks based on learnings

Tasks provide the implementation roadmap. Follow them systematically for successful delivery.


