---
description: Implement a single specific task from a feature's task file. Delegates to builder-agent for focused implementation.
argument-hint: "[feature-name] [task-id]"
allowed-tools: Read, Write, Edit, Grep, Delegate
---

# Implement Task Command

Implements a single task from a feature's task specification.

## Purpose

Implement one specific task from `specs/[feature-name]-tasks.md` using a builder-agent.

## Variables

- `FEATURE_NAME`: $ARGUMENTS[0] (Required: feature name, e.g., "user-authentication")
- `TASK_ID`: $ARGUMENTS[1] (Required: task ID, e.g., "1.2" or "2.1")

## Instructions

- Use when you want to implement one specific task
- Reads `specs/[feature-name]-tasks.md` to find the task
- Delegates to builder-agent for implementation
- Updates context automatically

## Usage

```bash
# Implement a specific task
/implement-task user-authentication 1.2

# Another example
/implement-task recipe-creation 2.1
```

## Workflow

1. **Find task**: Locate task in `specs/[feature-name]-tasks.md`
2. **Delegate**: Hand off to builder-agent
3. **Implementation**: Builder implements, tests, documents
4. **Update**: Context and task file updated
5. **Report**: Summary of what was created

## Expected Output

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 TASK: User Authentication - Task 1.2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task: Create User model with validation

Reading context...
Loading task specification...
Delegating to @builder-agent...

[Builder implements the task]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ TASK COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Files Created:
- apps/my-app/src/models/User.ts
- apps/my-app/tests/models/User.test.ts

Context Updated:
- context/modules/User.md
- context/IMPLEMENTATION_STATUS.md
- context/features/user-authentication.md

Task marked complete in specs/user-authentication-tasks.md

Tests: All passing ✅
```

## Error Handling

**If task not found**:
```
❌ Error: Task 1.2 not found in specs/user-authentication-tasks.md

Please check:
1. Task ID is correct
2. Task file exists
3. Task hasn't been deleted
```

**If task already complete**:
```
⚠️ Warning: Task 1.2 is already marked complete

Completed: [Date]
Files: [List of files]

Do you want to:
A) Re-implement anyway
B) Skip this task
C) Review implementation
```

## When to Use

**Use `/implement-task` when**:
- ✅ Want to work on specific task only
- ✅ Tasks have dependencies and need sequential work
- ✅ Testing implementation incrementally
- ✅ Fixing or reworking a specific task

**Use `/implement-feature` instead when**:
- Want to implement all tasks for a feature
- Want parallel processing
- Feature tasks are independent


