# Multi-App Migration Guide

**Comprehensive guide for updating all components to support multi-app architecture.**

---

## What Changed

The repository now supports **multiple independent applications**, each with its own isolated:
- Specifications (`apps/[app-name]/specs/`)
- Context documentation (`apps/[app-name]/context/`)
- Source code (`apps/[app-name]/src/`)
- Git repository (`apps/[app-name]/.git/`)

---

## Components Updated So Far

### ✅ 1. app-planner Agent
**File**: `.claude/agents/app-planner.md`

**Changes**:
- Step 1: Now asks for app name first
- Creates `apps/[app-name]/` directory
- Saves to `apps/[app-name]/APP_PLAN.md`

**Usage**:
```
@app-planner I want to build a recipe app
→ Asks for app name: "recipe-app"
→ Creates: apps/recipe-app/APP_PLAN.md
```

### ✅ 2. environment-setup-agent
**File**: `.claude/agents/environment-setup-agent.md`

**Changes**:
- Creates `apps/[app-name]/specs/` directory
- Creates `apps/[app-name]/context/` directory
- Copies context templates into app
- All paths now app-specific

**Usage**:
```
/setup-environment recipe-app
→ Creates: apps/recipe-app/specs/
→ Creates: apps/recipe-app]/context/
→ Creates: apps/recipe-app/src/, tests/, etc.
```

###3. Multi-App Architecture Documentation
**File**: `docs/MULTI_APP_ARCHITECTURE.md`

**Content**:
- Complete directory structure
- Workflow per app
- Multi-app prime output
- Git strategies
- Migration guide

---

## Components Needing Updates

### ⏳ 1. spec-batch-processor Agent
**File**: `.claude/agents/spec-batch-processor.md`

**Required Changes**:
- Accept `--app [app-name]` parameter
- Read from `apps/[app-name]/APP_PLAN.md`
- Read/update `apps/[app-name]/specs/SPEC_CREATION_STATUS.md`
- Create specs in `apps/[app-name]/specs/`
- Delegate to spec-orchestrator with app context

**New Usage**:
```
@spec-batch-processor --app recipe-app
→ Reads: apps/recipe-app/APP_PLAN.md
→ Creates: apps/recipe-app/specs/[feature]-*.md
→ Updates: apps/recipe-app/specs/SPEC_CREATION_STATUS.md
```

### ⏳ 2. spec-orchestrator Agent
**File**: `.claude/agents/spec-orchestrator.md`

**Required Changes**:
- Accept app name parameter
- Work with `apps/[app-name]/specs/` directory
- Read from `apps/[app-name]/APP_PLAN.md` if available

**New Usage**:
```
@spec-orchestrator --app recipe-app --feature user-authentication
→ Creates: apps/recipe-app/specs/user-authentication-*.md
```

### ⏳ 3. requirements-agent, design-agent, tasks-agent
**Files**: `.claude/agents/requirements-agent.md`, `design-agent.md`, `tasks-agent.md`

**Required Changes**:
- Accept app name parameter
- Save to `apps/[app-name]/specs/`

### ⏳ 4. builder-agent
**File**: `.claude/agents/builder-agent.md`

**Required Changes**:
- Accept app name parameter
- Read from `apps/[app-name]/specs/`
- Read/update `apps/[app-name]/context/`
- Generate code in `apps/[app-name]/src/`
- Generate tests in `apps/[app-name]/tests/`

**New Usage**:
```
@builder-agent --app recipe-app --feature user-auth --task 1.1
→ Reads: apps/recipe-app/specs/user-auth-tasks.md
→ Reads: apps/recipe-app/context/architecture.md
→ Creates: apps/recipe-app/src/... (code)
→ Updates: apps/recipe-app/context/IMPLEMENTATION_STATUS.md
```

### ⏳ 5. implementation-coordinator Agent
**File**: `.claude/agents/implementation-coordinator.md`

**Required Changes**:
- Accept app name parameter
- Read from `apps/[app-name]/specs/`
- Delegate to builder-agent with app name
- Update `apps/[app-name]/context/IMPLEMENTATION_STATUS.md`

**New Usage**:
```
@implementation-coordinator --app recipe-app --feature user-auth
→ Coordinates implementation within apps/recipe-app/
```

### ⏳ 6. /prime Command
**File**: `.claude/commands/prime.md`

**Required Changes**:
- Detect all apps in `apps/` directory
- For each app, check:
  - Does `APP_PLAN.md` exist?
  - Does `specs/` exist and what's the status?
  - Does `context/` exist?
  - What's the implementation status?
- Provide multi-app summary
- Allow `/prime [app-name]` for app-specific analysis

**New Output**:
```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 MULTI-APP REPOSITORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Found 3 applications:

1. recipe-app: ✅ Env setup, 🔨 Implementation 40%
2. mobile-app: ✅ Specs complete, ⏳ Env needed
3. api-server: 📝 Planned, ⏳ Specs needed

Use: /prime [app-name] for details
```

### ⏳ 7. /setup-environment Command
**File**: `.claude/commands/setup-environment.md`

**Required Changes**:
- Require app name: `/setup-environment [app-name]`
- Read from `apps/[app-name]/APP_PLAN.md`
- Read design specs from `apps/[app-name]/specs/`

**Already Updated**: Delegates to environment-setup-agent which is updated!

### ⏳ 8. /implement-feature Command
**File**: `.claude/commands/implement-feature.md`

**Required Changes**:
- Require app name: `/implement-feature [app-name] [feature-name]`
- Pass app name to implementation-coordinator

**New Usage**:
```
/implement-feature recipe-app user-authentication
```

### ⏳ 9. /implement-task Command
**File**: `.claude/commands/implement-task.md`

**Required Changes**:
- Require app name: `/implement-task [app-name] [feature] [task-id]`
- Pass app name to builder-agent

**New Usage**:
```
/implement-task recipe-app user-authentication 1.1
```

### ⏳ 10. /batch-spec Command
**File**: `.claude/commands/batch-spec.md`

**Required Changes**:
- Require app name: `/batch-spec [app-name]`
- Pass app name to spec-batch-processor

**New Usage**:
```
/batch-spec recipe-app
```

### ⏳ 11. Skills
**Files**: All skills in `.claude/skills/`

**Required Changes**:
- Skills should be app-agnostic (they are mostly guidance)
- When referencing file paths, use `apps/[app-name]/...`
- Update examples to show multi-app structure

**Files to review**:
- `requirements-skill/SKILL.md`
- `design-skill/SKILL.md`
- `tasks-skill/SKILL.md`
- `spec-orchestrator-skill/SKILL.md`
- `builder-skill/SKILL.md`

### ⏳ 12. Context Templates
**Files**: `context/*.template`

**Required Changes**:
- Templates stay at root level
- Environment setup copies them into `apps/[app-name]/context/`
- Update paths in templates to be app-relative

**Files**:
- `context/architecture.md.template`
- `context/IMPLEMENTATION_STATUS.md.template`
- `context/features/FEATURE_TEMPLATE.md`
- `context/modules/MODULE_TEMPLATE.md`

---

## Implementation Priority

### Phase 1: Core Agents (CRITICAL)
1. ✅ app-planner (DONE)
2. ✅ environment-setup-agent (DONE)
3. ⏳ spec-batch-processor
4. ⏳ builder-agent
5. ⏳ implementation-coordinator

### Phase 2: Commands
6. ⏳ /prime (multi-app detection)
7. ⏳ /batch-spec
8. ⏳ /implement-feature
9. ⏳ /implement-task

### Phase 3: Supporting Agents
10. ⏳ spec-orchestrator
11. ⏳ requirements-agent, design-agent, tasks-agent

### Phase 4: Documentation & Polish
12. ⏳ Update all skills with multi-app examples
13. ⏳ Update README.md with multi-app workflow
14. ⏳ Create quick-start guide for multi-app

---

## Testing Checklist

After all updates, test this complete flow:

```bash
# 1. Plan first app
@app-planner I want to build a recipe app
→ Creates: apps/recipe-app/APP_PLAN.md

# 2. Create specs
@spec-batch-processor --app recipe-app
→ Creates: apps/recipe-app/specs/*.md

# 3. Setup environment
/setup-environment recipe-app
→ Creates: apps/recipe-app/src/, context/, etc.

# 4. Implement feature
/implement-feature recipe-app user-authentication
→ Builds code in apps/recipe-app/src/

# 5. Check status
/prime
→ Shows all apps with status

# 6. Plan second app
@app-planner I want to build a mobile app
→ Creates: apps/mobile-app/APP_PLAN.md

# 7. Check status again
/prime
→ Shows both apps

# 8. Work on second app
@spec-batch-processor --app mobile-app
/setup-environment mobile-app
/implement-feature mobile-app feature-name
```

---

## Key Patterns for Updates

### Pattern 1: Accept App Name Parameter

**Before**:
```markdown
## Workflow
1. Read APP_PLAN.md
2. Create specs in specs/
```

**After**:
```markdown
## Workflow
1. Receive app name parameter
2. Read apps/[app-name]/APP_PLAN.md
3. Create specs in apps/[app-name]/specs/
```

### Pattern 2: Update All File Paths

**Before**:
- `specs/[feature]-requirements.md`
- `context/architecture.md`
- `APP_PLAN.md`

**After**:
- `apps/[app-name]/specs/[feature]-requirements.md`
- `apps/[app-name]/context/architecture.md`
- `apps/[app-name]/APP_PLAN.md`

### Pattern 3: Pass App Name in Delegations

**Before**:
```
Delegate to @builder-agent:
"Implement task 1.1 for feature user-auth"
```

**After**:
```
Delegate to @builder-agent:
"Implement task 1.1 for feature user-auth in app recipe-app.
App directory: apps/recipe-app/
Specs: apps/recipe-app/specs/
Context: apps/recipe-app/context/"
```

---

## Migration for Existing Repositories

If you have a repository with the old structure:

```bash
# 1. Create first app directory
mkdir -p apps/my-existing-app

# 2. Move APP_PLAN.md
mv APP_PLAN.md apps/my-existing-app/

# 3. Move specs
mv specs/ apps/my-existing-app/

# 4. Move context
mv context/ apps/my-existing-app/

# 5. Move source code (if already created)
mv src/ apps/my-existing-app/
mv tests/ apps/my-existing-app/
mv package.json apps/my-existing-app/
# ... move all app-specific files

# 6. Initialize git for the app
cd apps/my-existing-app
git init
git add .
git commit -m "Migrated to multi-app structure"
```

---

## Summary

**Multi-app architecture enables**:
- ✅ Multiple independent applications
- ✅ Isolated specs and context per app
- ✅ Independent git repositories
- ✅ Parallel development
- ✅ Flexible deployment

**Migration status**:
- ✅ Core structure documented
- ✅ 2 critical agents updated
- ⏳ 10+ components need updates
- ⏳ Commands need app name parameters
- ⏳ Documentation needs updates

**Next steps**:
1. Update spec-batch-processor (high priority)
2. Update builder-agent and implementation-coordinator
3. Update /prime for multi-app detection
4. Update all commands with app name parameters
5. Test complete multi-app workflow

**The foundation is in place, now we systematically update each component!** 🚀


