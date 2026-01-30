# Implementation Workflow Guide

Complete guide to implementing features from specifications using builder agents and context management.

## Overview

After creating specs (Requirements → Design → Tasks), the implementation phase begins. This guide explains how to systematically build features using builder agents, context tracking, and parallel execution.

## The Complete Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1-3: SPEC CREATION (Already Complete)                    │
│ Requirements → Design → Tasks                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 4: IMPLEMENTATION                                         │
│ Specs → Working Code in apps/                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Components

### 1. Builder Skill (`.claude/skills/builder-skill/`)

**Purpose**: Expert implementation guidance

**Provides**:
- Context-driven implementation patterns
- Spec-to-code workflows
- Testing guidance
- Documentation standards

**Auto-activates when**: You mention "implement", "build feature", "code from spec"

### 2. Builder Agent (`.claude/agents/builder-agent.md`)

**Purpose**: Implements ONE task from a task file

**Process**:
1. Reads context (`context/`)
2. Reads task from `specs/[feature]-tasks.md`
3. Implements code in `apps/` directory
4. Writes tests
5. Updates context documentation
6. Marks task complete

**Invoke**: `@builder-agent Task 1.2 from user-authentication`

### 3. Implementation Coordinator (`.claude/agents/implementation-coordinator.md`)

**Purpose**: Manages parallel execution of multiple tasks

**Process**:
1. Reads task file to find pending tasks
2. Processes tasks in batches (default: 3 at a time)
3. Spawns ONE builder-agent per task (1:1 mapping)
4. Waits for batch to complete
5. Aggregates results
6. Continues with next batch

**Invoke**: `@implementation-coordinator user-authentication 3`

### 4. Context Directory (`context/`)

**Purpose**: Track current implementation state

**Structure**:
```
context/
├── README.md                    ← Usage guide
├── architecture.md              ← System architecture
├── IMPLEMENTATION_STATUS.md     ← Current status
├── features/
│   └── [feature-name].md       ← Feature-specific docs
└── modules/
    └── [ModuleName].md         ← Module-specific docs
```

**Updated**: Automatically by builder agents after each task

### 5. Commands

- **`/implement-feature [name]`** - Implement all tasks for a feature
- **`/implement-task [feature] [id]`** - Implement single task
- **`/update-context [feature]`** - Manually refresh context

### 6. Hooks

- **`task_complete.py`** - Logs task completions
- **`context_update.py`** - Validates context updates

## Usage Patterns

### Pattern 1: Implement Entire Feature (Recommended)

**Use Case**: Feature spec is complete, want to implement all tasks

```bash
# Using command
/implement-feature user-authentication

# Or using agent
@implementation-coordinator user-authentication
```

**What Happens**:
```
1. Coordinator reads specs/user-authentication-tasks.md
2. Finds 10 pending tasks
3. Processes in batches of 3:

Batch 1 (Tasks 1-3):
  → @builder-agent Task 1.1
  → @builder-agent Task 1.2  
  → @builder-agent Task 1.3
  → All run in parallel
  → Wait for completion

Batch 2 (Tasks 4-6):
  → @builder-agent Task 1.4
  → @builder-agent Task 1.5
  → @builder-agent Task 1.6
  → All run in parallel
  → Wait for completion

[Continues until all tasks complete]

4. Final summary shows all created files
5. Context fully updated
6. Feature ready for testing
```

**Time**: ~10-15 minutes per batch of 3 tasks

### Pattern 2: Implement Single Task

**Use Case**: Want to work on specific task only

```bash
# Using command
/implement-task user-authentication 1.2

# Or using agent
@builder-agent Task 1.2 from user-authentication
```

**What Happens**:
```
1. Builder reads context
2. Reads Task 1.2 from task file
3. Implements the specific task
4. Tests
5. Updates context
6. Marks complete
7. Reports what was created
```

**Time**: ~5-10 minutes per task

### Pattern 3: Parallel Custom Batch

**Use Case**: Want to implement specific set of tasks in parallel

```bash
# Start 3 separate builder agents manually
@builder-agent Task 1.2 from user-authentication
@builder-agent Task 1.3 from user-authentication
@builder-agent Task 1.4 from user-authentication

# All run in parallel
```

**What Happens**:
- Each builder works independently
- All update context concurrently
- All complete around the same time

**Time**: ~10-15 minutes for all 3

## Detailed Workflow

### Before Implementation

**1. Ensure Specs Are Complete**:
```
✅ specs/user-authentication-requirements.md
✅ specs/user-authentication-design.md
✅ specs/user-authentication-tasks.md
```

**2. Initialize Context** (if first feature):
```bash
# Copy templates
cp context/architecture.md.template context/architecture.md
cp context/IMPLEMENTATION_STATUS.md.template context/IMPLEMENTATION_STATUS.md

# Fill in your architecture details
# Edit context/architecture.md
```

**3. Verify App Structure**:
```
✅ apps/my-app/ directory exists
✅ apps/my-app/src/ exists
✅ apps/my-app/tests/ exists
```

### During Implementation

**Automatic Process** (when using builder agents):

```
For Each Task:
  1. Builder reads context
     - context/architecture.md
     - context/IMPLEMENTATION_STATUS.md
     - Relevant context/modules/*.md
  
  2. Builder reads task specification
     - specs/[feature]-requirements.md
     - specs/[feature]-design.md
     - specs/[feature]-tasks.md
  
  3. Builder implements in apps/
     - Creates source files
     - Follows existing patterns
     - Handles errors
  
  4. Builder writes tests
     - Unit tests
     - Integration tests if needed
  
  5. Builder updates context
     - Creates/updates context/modules/[Module].md
     - Updates context/features/[feature].md
     - Updates context/IMPLEMENTATION_STATUS.md
  
  6. Builder marks task complete
     - Updates specs/[feature]-tasks.md
     - Changes [ ] to [x]
     - Adds completion details
  
  7. Hooks trigger
     - task_complete.py logs completion
     - context_update.py validates context
     - Optional TTS announcement
```

### After Implementation

**1. Review Implementation**:
```bash
# Check what was created
ls -la apps/my-app/src/
ls -la apps/my-app/tests/

# Review context
cat context/IMPLEMENTATION_STATUS.md
cat context/features/user-authentication.md
```

**2. Run Tests**:
```bash
cd apps/my-app
npm test
# or
pytest
```

**3. Verify Context**:
```bash
# Ensure context is up to date
/update-context user-authentication
```

**4. Integration Testing**:
```bash
# Test feature end-to-end
# Run integration tests
# Verify with requirements
```

## Context Management

### Context Flow

```
Builder Agent Implements Task
          ↓
Creates/Modifies Code in apps/
          ↓
Builder Creates Module Documentation
          ↓
context/modules/[Module].md ← Detailed module info
          ↓
Builder Updates Feature Documentation
          ↓
context/features/[feature].md ← Feature progress
          ↓
Implementation Coordinator Aggregates
          ↓
context/IMPLEMENTATION_STATUS.md ← Overall status
          ↓
Hooks Validate and Log
          ↓
context/update.log ← Audit trail
```

### What Gets Documented

**For Each Module** (`context/modules/[Module].md`):
- Location in codebase
- Purpose and functionality
- Exports (classes, functions, types)
- Dependencies
- Tests location
- Usage examples
- Integration points

**For Each Feature** (`context/features/[feature].md`):
- Overview (from requirements)
- Architecture (from design)
- Implementation status
- Modules created
- Testing status
- Integration notes

**Overall Status** (`context/IMPLEMENTATION_STATUS.md`):
- All features and their status
- Completed tasks per feature
- In-progress tasks
- Pending tasks
- Recent activity
- Dependencies added

### Context Benefits

**For Builder Agents**:
- Know what exists (avoid duplication)
- Follow established patterns
- Integrate properly
- Reuse existing modules

**For Developers**:
- Onboarding documentation
- Architecture reference
- Implementation history
- Integration guide

**For Teams**:
- Shared understanding
- Consistent patterns
- Progress tracking
- Knowledge base

## Best Practices

### Sequential vs Parallel

**Use Sequential When** (batch size = 1):
- ✅ Tasks have strong dependencies
- ✅ Learning the system
- ✅ Want to review each task
- ✅ Complex integration

**Use Parallel When** (batch size = 3+):
- ✅ Tasks are independent
- ✅ Feature is well-scoped
- ✅ Want speed
- ✅ Team can review together

### Task Breakdown

**Good Task Size**:
- ✅ 2-6 hours of work
- ✅ One clear objective
- ✅ Testable independently
- ✅ Specific file(s) to create/modify

**Too Large**:
- ❌ Multiple days of work
- ❌ Multiple objectives
- ❌ Hard to test in isolation

**Too Small**:
- ❌ < 30 minutes
- ❌ Trivial changes
- ❌ Could be combined

### Context Hygiene

**Keep Context Current**:
- Update immediately after changes
- Don't let it drift
- Review periodically
- Fix inaccuracies promptly

**Be Specific**:
- Include examples
- Note integrations
- Document decisions
- Link related components

**Maintain Structure**:
- Use templates
- Follow naming conventions
- Consistent formatting
- Clear organization

## Troubleshooting

### Context Out of Sync

**Problem**: Context doesn't match code

**Solution**:
```bash
# Refresh context
/update-context

# Or manually review and update
# Edit context files to match reality
```

### Task Failures

**Problem**: Builder agent can't complete task

**Common Causes**:
- Task specification unclear
- Missing dependencies
- Conflicting requirements
- Integration issues

**Solutions**:
- Clarify task in tasks file
- Implement dependencies first
- Review design for conflicts
- Update context with integration points

### Parallel Conflicts

**Problem**: Multiple builders creating similar code

**Prevention**:
- Clear task boundaries
- Good task descriptions
- Check dependencies
- Use coordinator (it manages conflicts)

**If It Happens**:
- Review all implementations
- Keep best version
- Update context
- Refactor if needed

## Examples

### Example 1: User Authentication (10 Tasks)

**Command**:
```bash
/implement-feature user-authentication
```

**Process**:
```
Batch 1 (Tasks 1-3):
  ✅ 1.1: Project setup
  ✅ 1.2: User model
  ✅ 1.3: Validation
  Time: 12 minutes

Batch 2 (Tasks 4-6):
  ✅ 2.1: AuthService
  ✅ 2.2: Registration
  ✅ 2.3: Login
  Time: 15 minutes

Batch 3 (Tasks 7-9):
  ✅ 2.4: JWT middleware
  ✅ 3.1: API endpoints
  ✅ 3.2: Error handling
  Time: 13 minutes

Batch 4 (Task 10):
  ✅ 4.1: Integration tests
  Time: 8 minutes

Total: ~48 minutes
```

**Result**:
- 12 files created in `apps/my-app/src/`
- 10 test files in `apps/my-app/tests/`
- 6 module docs in `context/modules/`
- Feature doc in `context/features/user-authentication.md`
- Status updated in `context/IMPLEMENTATION_STATUS.md`

### Example 2: Single Critical Task

**Command**:
```bash
/implement-task payment-processing 2.3
```

**Process**:
```
1. Read context (2 minutes)
2. Implement Stripe integration (5 minutes)
3. Write tests (2 minutes)
4. Update context (1 minute)

Total: ~10 minutes
```

**Result**:
- 1 file: `apps/my-app/src/services/PaymentService.ts`
- 1 test: `apps/my-app/tests/services/PaymentService.test.ts`
- 1 module doc: `context/modules/PaymentService.md`
- Task marked complete

## Summary

**Implementation workflow**:
1. Complete specs (Requirements → Design → Tasks)
2. Initialize context (first time only)
3. Choose implementation approach:
   - Full feature: `/implement-feature [name]`
   - Single task: `/implement-task [feature] [id]`
   - Custom parallel: Multiple `@builder-agent` calls
4. Builder agents implement with context awareness
5. Context updates automatically
6. Review, test, and integrate

**Key Benefits**:
- **Speed**: Parallel execution with batching
- **Quality**: Context-driven consistency
- **Documentation**: Automatic context updates
- **Traceability**: Link back to requirements
- **Maintainability**: Clear module documentation

**The system transforms specs into working code systematically and automatically!**

---

**Related Documentation**:
- [Builder Skill](../.claude/skills/builder-skill/SKILL.md)
- [Builder Agent](../.claude/agents/builder-agent.md)
- [Implementation Coordinator](../.claude/agents/implementation-coordinator.md)
- [Context README](../context/README.md)


