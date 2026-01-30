---
description: Create specs for features needing documentation from apps/[app-name]/specs/SPEC_CREATION_STATUS.md. Multi-app aware - uses work context or explicit app name. Processes in batches of 3 with 1:1 feature-to-subagent mapping.
argument-hint: "[optional: app-name]"
allowed-tools: Read, Write, Edit, Grep, Delegate, Bash
---

# Batch Spec Creation Command

Automates spec creation for features that need documentation, processing 3 at a time with strict 1:1 mapping. Multi-app aware.

## Purpose
Determine app → Read `apps/[app-name]/specs/SPEC_CREATION_STATUS.md` → Find features needing specs → Process in batches of 3 → Create one subagent per feature (1:1 mapping).

## Instructions
- Multi-app aware: Uses work context or explicit app name
- Reads app-specific status file to find features needing specs
- Processes features in batches of 3 (controlled parallelization)
- Creates one subagent per feature (1:1 mapping)
- Updates status file automatically
- Delegates to spec-batch-processor agent

## Usage

```bash
# Use work context (if set)
/batch-spec

# Explicit app name
/batch-spec recipe-app

# Or
/batch-spec mobile-app
```

## App Name Resolution

**Priority order**:
1. **Explicit app name** in command argument
2. **Work context** from `.claude-work-context.json`
3. **Single app auto-detect** (if only one app exists)
4. **Ask user** (if multiple apps and no context)

## Workflow

1. **Determine App Name**:
   ```bash
   # Check work context
   if [ -f .claude-work-context.json ]; then
     APP_NAME=$(jq -r '.current_app' .claude-work-context.json)
     echo "📍 Using work context: $APP_NAME"
   elif [ $# -gt 0 ]; then
     APP_NAME=$1
   elif [ $(ls -1 apps/ | wc -l) -eq 1 ]; then
     APP_NAME=$(ls -1 apps/)
     echo "Auto-detected: $APP_NAME"
   else
     echo "Available apps:" && ls -1 apps/
     # Ask user for app name
   fi
   ```

2. **Read SPEC_CREATION_STATUS.md**: Find features needing specs
   - Location: `apps/[app-name]/specs/SPEC_CREATION_STATUS.md`
   - Fallback to `apps/[app-name]/APP_PLAN.md` if not found

3. **Identify Batch**: Group features into batches of 3

4. **Process Batch 1**: Create 3 delegations (1 per feature) → 3 subagents run in parallel
   - Delegate to `@spec-batch-processor` with app name

5. **Wait for Batch 1**: All 3 subagents complete

6. **Update Status**: Mark completed features in `apps/[app-name]/specs/SPEC_CREATION_STATUS.md`

7. **Process Batch 2**: Next 3 features (repeat)

8. **Continue**: Until all features are complete

9. **Final Report**: Summary of all created specs in `apps/[app-name]/specs/`

## Expected Output

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 BATCH SPEC CREATION COMPLETE: recipe-app
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

App: recipe-app
📍 Using work context

Read: apps/recipe-app/specs/SPEC_CREATION_STATUS.md
Features Needing Specs: 7
Batches Processed: 3 (3, 3, 1)
Total Files Created: 21

Batch 1 Complete:
✅ User Authentication (3 files)
✅ Recipe Creation (3 files)
✅ Recipe Browsing (3 files)

Batch 2 Complete:
✅ Recipe Saving (3 files)
✅ Basic Search (3 files)
✅ User Profiles (3 files)

Batch 3 Complete:
✅ Recipe Ratings (3 files)

Files Location: apps/recipe-app/specs/
Updated: apps/recipe-app/specs/SPEC_CREATION_STATUS.md

🎯 Next Steps:
A) Review all specs in apps/recipe-app/specs/
B) Setup environment: /setup-environment recipe-app
C) Start implementation: /implement-feature user-authentication

Ready to build your app systematically!
```

## Integration with Implementation

After batch spec creation:

**Sequential Implementation**:
```bash
# Implement one feature at a time
# Follow specs/[feature-1]-tasks.md
# Test, validate, repeat
```

**Parallel Implementation** (Team):
```bash
# Create isolated environments
/create_worktree feature-1
/create_worktree feature-2
/create_worktree feature-3

# Assign to team members
# Each implements in parallel
```

## Error Handling

**If SPEC_CREATION_STATUS.md not found**:
```
⚠️ apps/[app-name]/specs/SPEC_CREATION_STATUS.md not found

Checking for apps/[app-name]/APP_PLAN.md as fallback...

[If APP_PLAN.md exists]
Found APP_PLAN.md. Creating initial SPEC_CREATION_STATUS.md...

[If neither exists]
❌ No feature list found. Please create either:
- apps/[app-name]/specs/SPEC_CREATION_STATUS.md (with feature status)
- apps/[app-name]/APP_PLAN.md (will create status file from it)

Or use: @app-planner [your app idea]
```

**If feature spec fails in batch**:
```
⚠️ Batch 1 had issues:

✅ Feature 1 - Complete
❌ Feature 2 - Failed: [Error details]
✅ Feature 3 - Complete

Options:
A) Retry failed feature in next batch
B) Continue with next batch, retry failed later
C) Stop processing
```

## Report Format

After completion:

```markdown
✅ Batch Spec Creation Complete: [app-name]

App: [app-name]
Read: apps/[app-name]/specs/SPEC_CREATION_STATUS.md
Processed: [N] features in [X] batches
Total Files Created: [N * 3]

Created specs for [N] features:

apps/[app-name]/specs/
├── user-authentication-requirements.md
├── user-authentication-design.md
├── user-authentication-tasks.md
├── recipe-creation-requirements.md
├── recipe-creation-design.md
├── recipe-creation-tasks.md
└── ...

Updated: apps/[app-name]/specs/SPEC_CREATION_STATUS.md (all features marked complete)

⏱️ Total Time: [X] minutes
📁 Total Files: [N * 3]

Next: /setup-environment [app-name]
Ready for implementation!
```

## Best Practices

**Before Running**:
- ✅ Set work context: `/set-context [app-name]` (if working on one app)
- ✅ Ensure `apps/[app-name]/specs/SPEC_CREATION_STATUS.md` exists (or `APP_PLAN.md`)
- ✅ Review features that need specs
- ✅ Verify feature names are clear

**During Processing**:
- ✅ Monitor batch progress
- ✅ Review specs after each batch (optional)
- ✅ Check for any failures

**After Processing**:
- ✅ Review all created specs in `apps/[app-name]/specs/`
- ✅ Verify `SPEC_CREATION_STATUS.md` is updated
- ✅ Setup environment: `/setup-environment [app-name]`
- ✅ Plan implementation strategy

