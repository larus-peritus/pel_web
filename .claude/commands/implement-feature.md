---
description: Implement all tasks for a feature using parallel builder agents. Multi-app aware - uses work context or explicit app name. Processes tasks in batches (default 3 at a time) with 1:1 task-to-agent mapping.
argument-hint: "[feature-name] [optional: batch-size]" or "[app-name] [feature-name] [optional: batch-size]"
allowed-tools: Read, Write, Edit, Grep, Delegate, Bash
---

# Implement Feature Command

Automates implementation of all tasks for a feature by coordinating multiple builder-agent subagents. Multi-app aware.

## Purpose

Determine app → Read `apps/[app-name]/specs/[feature-name]-tasks.md` → Find pending tasks → Implement in batches using builder-agents → Update app-specific context.

## Variables

**Context-aware (recommended)**:
- `FEATURE_NAME`: $ARGUMENTS[0] (feature name, e.g., "user-authentication")
- `BATCH_SIZE`: $ARGUMENTS[1] (Optional: tasks per batch, default 3)

**Explicit app (no context)**:
- `APP_NAME`: $ARGUMENTS[0] (app name, e.g., "recipe-app")
- `FEATURE_NAME`: $ARGUMENTS[1] (feature name)
- `BATCH_SIZE`: $ARGUMENTS[2] (Optional: tasks per batch, default 3)

## Instructions

- Multi-app aware: Uses work context or explicit app name
- Use after specs are complete for a feature
- Reads `apps/[app-name]/specs/[feature-name]-tasks.md` for task list
- Spawns builder-agent for each task (1:1 mapping)
- Processes in batches for controlled parallelization
- Updates `apps/[app-name]/context/` automatically
- Delegates to implementation-coordinator agent

## Usage

```bash
# With work context set (recommended)
/set-context recipe-app
/implement-feature user-authentication
/implement-feature user-authentication 5  # Custom batch size

# Without context (explicit app name)
/implement-feature recipe-app user-authentication
/implement-feature recipe-app user-authentication 5

# Sequential mode (1 at a time)
/implement-feature user-authentication 1
```

## App Name Resolution

**Priority order**:
1. **Explicit app name** if provided as first argument and matches `apps/` directory
2. **Work context** from `.claude-work-context.json`
3. **Single app auto-detect** (if only one app exists)
4. **Ask user** (if multiple apps and no context)

## Workflow

1. **Determine app name**:
   ```bash
   # Check work context
   if [ -f .claude-work-context.json ]; then
     APP_NAME=$(jq -r '.current_app' .claude-work-context.json)
     echo "📍 Using work context: $APP_NAME"
   fi
   # Or extract from arguments / ask user
   ```

2. **Read task file**: Parse `apps/[app-name]/specs/[feature-name]-tasks.md`
3. **Identify pending tasks**: Find tasks with `[ ]` status
4. **Delegate to coordinator**: Let implementation-coordinator manage batching
5. **Batch processing**: Process N tasks at a time
6. **Context updates**: Automatic after each batch in `apps/[app-name]/context/`
7. **Final report**: Summary of all completed tasks

## Expected Output

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 FEATURE IMPLEMENTATION: User Authentication
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

App: recipe-app
Feature: user-authentication
📍 Using work context

Reading apps/recipe-app/specs/user-authentication-tasks.md...
Found: 10 pending tasks

Processing in batches of 3...

Batch 1/4: Tasks 1-3
✅ Task 1.1: Set up project structure
✅ Task 1.2: Create User model
✅ Task 1.3: Add validation

Batch 2/4: Tasks 4-6
✅ Task 2.1: Create AuthService
✅ Task 2.2: Implement registration
✅ Task 2.3: Implement login

Batch 3/4: Tasks 7-9
✅ Task 2.4: Add JWT middleware
✅ Task 3.1: Create API endpoints
✅ Task 3.2: Add error handling

Batch 4/4: Task 10
✅ Task 4.1: Integration tests

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ FEATURE COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

App: recipe-app
Feature: User Authentication
Tasks Completed: 10/10
Files Created: 15 (in apps/recipe-app/src/)
Tests: All passing

Context Updated:
- apps/recipe-app/context/features/user-authentication.md
- apps/recipe-app/context/modules/[6 module files]
- apps/recipe-app/context/IMPLEMENTATION_STATUS.md

Ready for integration testing!
```

## Integration with Context

**Before Implementation**:
- Reads `apps/[app-name]/context/architecture.md`
- Reads `apps/[app-name]/context/IMPLEMENTATION_STATUS.md`

**During Implementation**:
- Builder agents create `apps/[app-name]/context/modules/[Module].md`
- Builder agents update `apps/[app-name]/context/features/[feature].md`

**After Implementation**:
- Coordinator updates `apps/[app-name]/context/IMPLEMENTATION_STATUS.md`
- Feature marked complete in status

## Error Handling

**If task file not found**:
```
❌ Error: apps/[app-name]/specs/[feature-name]-tasks.md not found

Please ensure:
1. App name is correct
2. Feature spec exists
3. Feature name is correct
4. Tasks phase is complete

Create specs with: @spec-orchestrator create spec for [feature-name]
(Ensure work context is set: /set-context [app-name])
```

**If some tasks fail**:
```
⚠️ Feature implementation had issues

Completed: 8/10 tasks
Failed: 2 tasks
- Task 2.3: [Error details]
- Task 3.1: [Error details]

Options:
A) Retry failed tasks
B) Review and fix manually
C) Continue anyway
```

## Best Practices

**Before Running**:
- ✅ Ensure specs are complete (requirements, design, tasks)
- ✅ Review tasks file for clarity
- ✅ Verify context/ directory exists

**During Processing**:
- ✅ Monitor batch progress
- ✅ Check for errors
- ✅ Review implementations periodically

**After Processing**:
- ✅ Run full test suite
- ✅ Review context documentation
- ✅ Verify integration points
- ✅ Test feature end-to-end

