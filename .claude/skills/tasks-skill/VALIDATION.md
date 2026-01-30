# Task Validation Checklist

Ensure task breakdown quality before implementation begins.

## Completeness Validation

### Design Coverage
- [ ] All design components have corresponding tasks
- [ ] All data models have implementation tasks
- [ ] All API endpoints have implementation tasks
- [ ] All integrations have implementation tasks
- [ ] All services/business logic have implementation tasks

### Requirements Traceability
- [ ] Every requirement is addressed by at least one task
- [ ] Each task references specific requirements
- [ ] No orphan tasks (not linked to requirements)
- [ ] Critical requirements have multiple tasks (implementation + testing)

### Testing Coverage
- [ ] Unit test tasks for business logic
- [ ] Integration test tasks for component interactions
- [ ] End-to-end test tasks for user workflows
- [ ] Security test tasks if security requirements exist
- [ ] Performance test tasks if performance requirements exist

## Quality Validation

### Task Clarity
- [ ] Each task has action verb + component (e.g., "Implement auth service")
- [ ] Objectives are specific and measurable
- [ ] Files/components to create are explicitly named
- [ ] Expected functionality is clearly described
- [ ] Completion criteria are clear (or obviously testable)

### Task Sizing
- [ ] No task is too large (>1 day of work)
- [ ] No task is too small (trivial changes)
- [ ] Most tasks are 2-6 hours of focused work
- [ ] Complex tasks are broken into sub-tasks
- [ ] Tasks can be completed in one coding session

### Task Independence
- [ ] Each task produces working, testable code
- [ ] Dependencies between tasks are clearly marked
- [ ] No circular dependencies
- [ ] Tasks can be validated independently
- [ ] Minimal coordination needed within a task

## Sequencing Validation

### Dependency Chain
- [ ] Foundation tasks come first
- [ ] Each task builds on completed work
- [ ] Dependencies are explicitly noted
- [ ] No forward references (tasks depending on later tasks)
- [ ] Critical path is identifiable

### Parallel Opportunities
- [ ] Independent tasks are marked for parallel work
- [ ] Team size considerations are noted
- [ ] Integration points are planned
- [ ] Merge strategy is clear for parallel work

### Early Validation
- [ ] High-risk items addressed early (if risk-first)
- [ ] Early tasks produce testable output
- [ ] Integration tests planned at logical points
- [ ] Feedback opportunities are built in

## Feasibility Validation

### Technical Feasibility
- [ ] Required technologies are available
- [ ] Team has necessary skills (or learning plan)
- [ ] Performance targets are achievable
- [ ] External dependencies are accessible
- [ ] No impossible requirements

### Resource Feasibility
- [ ] Timeline is realistic for task count
- [ ] Team size matches workload
- [ ] Tools and infrastructure are available
- [ ] Budget supports chosen approaches

### Implementation Feasibility
- [ ] Tasks use standard patterns when possible
- [ ] Complex tasks have implementation guidance
- [ ] Edge cases are considered
- [ ] Error handling is planned
- [ ] Rollback strategies exist for risky tasks

## Structure Validation

### Hierarchy
- [ ] Uses two-level structure (epics + tasks)
- [ ] Epics group related tasks logically
- [ ] No deep nesting (beyond 2 levels)
- [ ] Numbering scheme is consistent
- [ ] Organization matches chosen strategy (foundation-first, etc.)

### Documentation
- [ ] Task list has overview section
- [ ] Implementation strategy is documented
- [ ] Dependencies section exists if needed
- [ ] Notes section for special considerations
- [ ] Worktree guidance included if relevant

## Content Validation

### Each Task Must Have
- [ ] Clear title with action verb
- [ ] Specific implementation objective
- [ ] Files/components to create or modify
- [ ] Key functionality to implement
- [ ] Testing expectations
- [ ] Requirements references (REQ-X.Y)

### Task Description Quality
- [ ] Uses active voice
- [ ] Avoids ambiguous terms
- [ ] Specifies exact actions
- [ ] Includes acceptance criteria (explicit or implicit)
- [ ] Provides enough detail to start coding

## Common Issues Check

### Anti-Pattern: Vague Tasks
❌ **Bad**: "Implement user management"
✅ **Good**: "Create User model with email validation and password hashing"

### Anti-Pattern: Missing Dependencies
❌ **Bad**: Tasks out of order, can't be completed
✅ **Good**: Clear sequence, each builds on previous

### Anti-Pattern: No Testing
❌ **Bad**: Only implementation tasks
✅ **Good**: Testing included in or alongside implementation

### Anti-Pattern: Monolithic Tasks
❌ **Bad**: "Build entire authentication system" (one task)
✅ **Good**: Broken into setup, models, services, endpoints, tests

### Anti-Pattern: No Requirements Link
❌ **Bad**: Tasks without requirement references
✅ **Good**: Every task references specific requirements

### Anti-Pattern: Non-Coding Tasks
❌ **Bad**: "Deploy to production", "User training"
✅ **Good**: Only coding and testing tasks

## Pre-Implementation Checklist

### Documentation Ready
- [ ] Tasks document is well-formatted
- [ ] Requirements document is accessible
- [ ] Design document is accessible
- [ ] All links and references are valid

### Team Ready
- [ ] Team understands task breakdown
- [ ] Roles and assignments are clear (if applicable)
- [ ] Development environment is set up
- [ ] Testing framework is configured

### Approval Obtained
- [ ] Technical lead has reviewed
- [ ] Product owner has reviewed (if applicable)
- [ ] Stakeholders understand scope
- [ ] Team agrees tasks are complete and ready

## Validation Score

### Calculate Score

**Completeness** (30 points):
- Design coverage: __/10
- Requirements traceability: __/10
- Testing coverage: __/10

**Quality** (30 points):
- Task clarity: __/10
- Task sizing: __/10
- Task independence: __/10

**Sequencing** (20 points):
- Dependency chain: __/7
- Parallel opportunities: __/7
- Early validation: __/6

**Feasibility** (20 points):
- Technical feasibility: __/7
- Resource feasibility: __/7
- Implementation feasibility: __/6

**Total Score**: __/100

### Scoring Guide

- **90-100**: Excellent - Ready to implement
- **75-89**: Good - Minor adjustments needed
- **60-74**: Fair - Significant revisions needed
- **Below 60**: Poor - Major rework required

## Quick Validation Questions

For each task, ask yourself:

1. **Can I start?** Do I have everything I need to begin?
2. **What files?** Do I know what to create or modify?
3. **How to test?** Can I test this when done?
4. **Why?** Which requirements does this address?
5. **What's next?** What task follows this one?
6. **How long?** Is this 2-6 hours of work?

If you can't answer all six questions, the task needs refinement.

## After Validation

### If Tasks Pass
1. Get final approval from stakeholders
2. Prepare development environment
3. Create any needed worktrees
4. Begin implementation following sequence

### If Tasks Need Work
1. Address identified issues
2. Refine unclear tasks
3. Resequence if needed
4. Re-validate before starting

## During Implementation

### Continuous Validation
- Review completed tasks against this checklist
- Update tasks if implementation reveals issues
- Track actual time vs estimates
- Adjust remaining tasks based on learnings

### Red Flags
- ⚠️ Tasks taking 3x longer than estimated
- ⚠️ Discovering many missing tasks
- ⚠️ Constant dependency issues
- ⚠️ Tests consistently failing
- ⚠️ Frequent requirement clarifications needed

If you see red flags, stop and reassess the task breakdown.


