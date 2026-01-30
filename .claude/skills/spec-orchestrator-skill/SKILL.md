---
name: Spec-Driven Development Orchestrator
description: Orchestrate the complete spec-driven development workflow through all three phases (Requirements → Design → Tasks). Use when the user wants to create a complete specification, perform spec-driven development, or needs guidance through the full requirements-design-tasks process. Coordinates requirements-skill, design-skill, and tasks-skill.
---

# Spec-Driven Development Orchestrator

Guide users through the complete spec-driven development process from initial idea to implementation-ready tasks.

## When to Use This Skill

Use this skill when:
- User wants to create a complete specification
- User mentions "spec-driven development" or "create spec"
- User needs to go from feature idea to implementation plan
- User wants structured guidance through all three phases
- User is starting a new feature from scratch

## What This Skill Does

This skill **orchestrates** the three-phase spec-driven development process:

1. **Requirements Phase**: Capture clear, testable requirements using EARS format
2. **Design Phase**: Create technical architecture and component design
3. **Tasks Phase**: Break down design into actionable implementation tasks

This skill **coordinates** with:
- `requirements-skill` for Requirements phase
- `design-skill` for Design phase  
- `tasks-skill` for Tasks phase
- `docs-scraper` agent for research when needed
- `worktree-manager-skill` for optional feature isolation

## Prerequisites

**Minimal**:
- Feature idea or problem to solve

**Optional** (improves quality):
- Project context (technology stack, constraints)
- User roles and personas
- Business objectives
- Existing system architecture

## Complete Workflow

### Phase 1: Requirements

**Objective**: Transform feature idea into clear, testable requirements

**Process**:
1. **Gather Context**:
   - Ask about feature purpose and users
   - Identify constraints and success criteria
   - Understand scope boundaries

2. **Create User Stories**:
   - Format: "As a [role], I want [feature], so that [benefit]"
   - Focus on user value
   - Cover all user types

3. **Write Acceptance Criteria** (EARS format):
   - WHEN [event] THEN system SHALL [response]
   - IF [condition] THEN system SHALL [response]
   - Include error cases and edge conditions

4. **Define Non-Functional Requirements**:
   - Performance, security, usability, reliability

5. **Validate Requirements**:
   - Completeness check
   - Quality check (testable, unambiguous)
   - EARS format compliance

6. **Save and Get Approval**:
   - Save to `specs/requirements-[feature-name].md`
   - Present to user for approval
   - **CRITICAL**: Do NOT proceed until requirements are approved

**Activation**: Uses `requirements-skill` for detailed guidance

---

### Phase 2: Design

**Objective**: Transform approved requirements into technical design

**Process**:
1. **Review Requirements**:
   - Load approved requirements document
   - Identify key design drivers
   - Extract constraints and non-functional needs

2. **Research if Needed**:
   - Identify knowledge gaps
   - Use `docs-scraper` agent for official documentation
   - Research architectural patterns
   - Investigate technology options

3. **Design Architecture**:
   - System overview and approach
   - Component architecture
   - Data flow
   - Technology stack with rationale

4. **Define Components**:
   - Component responsibilities
   - Interfaces between components
   - Dependencies

5. **Design Data Models**:
   - Entity definitions
   - Relationships
   - Validation rules
   - Storage strategy

6. **Plan Error Handling**:
   - Error categories
   - Error responses
   - User communication
   - Logging strategy

7. **Define Testing Strategy**:
   - Unit, integration, end-to-end testing
   - Testing tools and frameworks
   - Coverage goals

8. **Document Design Decisions**:
   - For significant choices
   - Options considered
   - Rationale for selection
   - Trade-offs accepted

9. **Validate Design**:
   - Trace to requirements
   - Check technical feasibility
   - Verify completeness

10. **Save and Get Approval**:
    - Save to `specs/design-[feature-name].md`
    - Present to user for approval
    - **CRITICAL**: Do NOT proceed until design is approved

**Activation**: Uses `design-skill` for detailed guidance

---

### Phase 3: Tasks

**Objective**: Break down approved design into actionable implementation tasks

**Process**:
1. **Analyze Design**:
   - Identify all components to build
   - Map dependencies
   - Identify testing needs

2. **Choose Sequencing Strategy**:
   - **Foundation-First**: For complex new systems
   - **Feature-Slice**: For MVPs and user-facing apps
   - **Risk-First**: For high technical uncertainty
   - **Hybrid**: For most production projects (recommended)

3. **Create Task Hierarchy**:
   - Level 1: Major components (epics)
   - Level 2: Specific implementation tasks
   - Use two-level structure maximum

4. **Define Each Task**:
   - Clear objective
   - Files/components to create
   - Key functionality
   - Testing expectations
   - Requirements references

5. **Sequence Tasks**:
   - Respect dependencies
   - Enable incremental progress
   - Mark parallel work opportunities

6. **Validate Tasks**:
   - Completeness (cover all design elements)
   - Clarity (actionable and specific)
   - Sizing (2-6 hours each)
   - Traceability (link to requirements)

7. **Consider Worktree** (Optional):
   - For complex features or parallel development
   - Provides isolated environment
   - See: [Worktree Integration Guide](../../docs/worktree-integration.md)

8. **Save and Get Approval**:
   - Save to `specs/tasks-[feature-name].md`
   - Present to user for approval
   - Ready for implementation

**Activation**: Uses `tasks-skill` for detailed guidance

---

## Phase Transitions and Validation

### Critical Phase Gates

**After Requirements Phase**:
- Present complete requirements document
- Highlight key requirements
- Ask: "Are these requirements complete and accurate?"
- Only proceed to Design if explicitly approved

**After Design Phase**:
- Present complete design document
- Show traceability to requirements
- Ask: "Does this design satisfy all requirements?"
- Only proceed to Tasks if explicitly approved

**After Tasks Phase**:
- Present complete task breakdown
- Show how tasks implement design
- Ask: "Does this task breakdown cover the entire design?"
- Ready for implementation after approval

### What If User Wants to Skip Phases?

**User wants to skip Requirements**:
- Explain: "Requirements are the foundation. Without them, design may not address actual needs."
- Offer: "We can create lightweight requirements quickly - it won't take long."
- If insisted: Document assumptions and risks

**User wants to skip Design**:
- Explain: "Design identifies technical challenges before coding. Skipping increases implementation risk."
- Offer: "We can create a lightweight design focusing on key decisions."
- If insisted: Create minimal architectural notes

**User wants to skip Tasks**:
- Explain: "Tasks make implementation systematic. Without them, developers may miss requirements."
- Offer: "We can create high-level task groupings."
- If insisted: Provide design document directly to developers

**Recommendation**: Complete all three phases for best results. Each phase builds on the previous and catches issues early.

---

## Execution Options

### Option 1: Orchestrator Agent (Recommended)

Use `spec-orchestrator` agent for guided workflow:
- Agent walks through all three phases
- Validates at each gate
- Coordinates with specialized agents
- Saves specs to proper locations

**When to use**: First time, complex features, need guidance

### Option 2: Phase-Specific Agents

Use specialized agents directly:
- `requirements-agent` for Requirements phase only
- `design-agent` for Design phase only
- `tasks-agent` for Tasks phase only

**When to use**: Experienced with process, working on specific phase, revising one phase

### Option 3: Direct Commands

Use commands for automated workflow:
- `/spec-workflow [feature-name]` for complete process
- `/requirements [description]` for Requirements only
- `/design [requirements-file]` for Design only
- `/tasks [design-file]` for Tasks only

**When to use**: Batch processing, automation, experienced users

### Option 4: Skills Directly

Activate skills through natural conversation:
- Mention "requirements" → activates `requirements-skill`
- Mention "design" or "architecture" → activates `design-skill`
- Mention "tasks" or "breakdown" → activates `tasks-skill`

**When to use**: Flexible workflow, specific questions, exploration

---

## Best Practices

### Do

- ✅ Complete all three phases in order
- ✅ Get explicit approval at each phase gate
- ✅ Reference previous phase documents
- ✅ Maintain traceability (requirements → design → tasks)
- ✅ Validate quality at each phase
- ✅ Save all documents to `specs/` directory
- ✅ Use consistent naming: `[phase]-[feature-name].md`

### Don't

- ❌ Skip phases without user agreement
- ❌ Proceed to next phase without approval
- ❌ Lose traceability between phases
- ❌ Create vague or incomplete specs
- ❌ Forget to save documents
- ❌ Ignore validation checklists

## Worktree Integration (Optional)

After tasks are complete, consider worktree for implementation:

**Benefits**:
- Isolated development environment
- Separate ports, database, configuration
- Parallel development without conflicts
- Safe experimentation

**When to use**:
- Complex features needing isolation
- Multiple developers working in parallel
- Want to test without affecting main codebase
- Experimenting with implementation approach

**How to create**:
- Use `/create_worktree [feature-name]`
- Or use `worktree-manager-skill`
- See: [Worktree Integration Guide](../../docs/worktree-integration.md)

**Note**: Worktrees are optional. Many features can be implemented in main branch.

---

## File Outputs

### Requirements Document
**Location**: `specs/requirements-[feature-name].md`
**Contents**:
- Introduction and scope
- User stories with acceptance criteria (EARS format)
- Non-functional requirements
- Constraints and assumptions
- Success criteria

### Design Document
**Location**: `specs/design-[feature-name].md`
**Contents**:
- Architecture overview
- Component definitions
- Data models
- Error handling strategy
- Testing strategy
- Design decisions with rationale

### Tasks Document
**Location**: `specs/tasks-[feature-name].md`
**Contents**:
- Implementation overview
- Sequenced task breakdown
- Dependencies and parallel work notes
- Implementation strategy
- Optional worktree guidance

---

## Reference Documentation

**For Requirements Phase**:
- [Requirements Skill](../../.claude/skills/requirements-skill/SKILL.md)
- [EARS Reference](../../.claude/skills/requirements-skill/EARS_REFERENCE.md)
- [Kiro Requirements Phase](../../kiro/spec-process-guide/process/requirements-phase.md)

**For Design Phase**:
- [Design Skill](../../.claude/skills/design-skill/SKILL.md)
- [Architecture Patterns](../../.claude/skills/design-skill/ARCHITECTURE_PATTERNS.md)
- [Kiro Design Phase](../../kiro/spec-process-guide/process/design-phase.md)

**For Tasks Phase**:
- [Tasks Skill](../../.claude/skills/tasks-skill/SKILL.md)
- [Sequencing Strategies](../../.claude/skills/tasks-skill/SEQUENCING_STRATEGIES.md)
- [Kiro Tasks Phase](../../kiro/spec-process-guide/process/tasks-phase.md)

**Execution Options**:
- [Workflow Patterns Guide](../../docs/workflow-patterns.md)
- [Worktree Integration](../../docs/worktree-integration.md)

---

## Summary

This skill orchestrates the complete spec-driven development process:

1. **Requirements**: Clear, testable requirements using EARS format
2. **Design**: Technical architecture and implementation plan
3. **Tasks**: Actionable, sequenced implementation tasks

Each phase validates before proceeding. All documents are saved to `specs/` directory with consistent naming.

The result: Complete specification ready for systematic implementation.


