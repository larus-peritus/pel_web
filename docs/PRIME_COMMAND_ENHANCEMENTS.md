# Prime Command Enhancements

**Enhanced `/prime` command to provide intelligent, context-aware workflow recommendations based on repository state.**

---

## What Changed

The `/prime` command is now **state-aware** and provides intelligent guidance based on where you are in the development lifecycle.

### Before
- Only checked if `apps/` had code (greenfield vs existing)
- Single recommendation path

### After
- Checks **specs status** (SPEC_CREATION_STATUS.md)
- Checks **implementation status** (context/IMPLEMENTATION_STATUS.md)
- Checks **application code** (apps/ directory)
- Provides **5 different scenario-specific recommendations**

---

## New Analysis Steps

### Step 2: Analyze Spec Status (NEW!)

**Checks**:
- Does `specs/SPEC_CREATION_STATUS.md` exist?
- How many features have complete specs?
- How many features still need specs?
- Which features are in progress?

**Determines**: SPECS COMPLETE | SPECS PARTIAL | NO SPECS

### Step 3: Check Environment Setup Status (NEW!)

**Checks**:
- Does `apps/[app-name]/` directory exist?
- Is package.json/pyproject.toml/go.mod present?
- Are src/ and tests/ directories created?
- Is environment properly initialized?

**Determines**: ENVIRONMENT SET UP | PARTIAL SETUP | NOT SET UP

### Step 4: Analyze Application Code (NEW!)

**Checks**:
- How many source files exist in apps/?
- Are tests written?
- Is code beyond just setup files?

**Determines**: CODE EXISTS | MINIMAL CODE | NO CODE

### Step 5: Check Implementation Status (NEW!)

**Checks**:
- Does `context/IMPLEMENTATION_STATUS.md` exist?
- How many features have been implemented?
- Which features are in progress?
- Which features are pending?

**Determines**: FULLY IMPLEMENTED | PARTIALLY IMPLEMENTED | NOT IMPLEMENTED

### Step 6: Intelligent Recommendation (NEW!)

**Decision Matrix**:

| Spec State | Environment State | Code State | Implementation State | Recommendation |
|------------|------------------|------------|---------------------|----------------|
| NO SPECS | ANY | NO CODE | N/A | **Greenfield Workflow** → @app-planner |
| NO SPECS | ANY | CODE EXISTS | N/A | **Existing Code** → Add features |
| SPECS PARTIAL | ANY | ANY | ANY | **Continue Specs** → @spec-batch-processor |
| SPECS COMPLETE | **NOT SET UP** ✨ | ANY | N/A | **Setup Environment** → /setup-environment |
| SPECS COMPLETE | SET UP | NO CODE | NOT IMPLEMENTED | **Start Implementation** → @implementation-coordinator |
| SPECS COMPLETE | SET UP | MINIMAL CODE | NOT IMPLEMENTED | **Start Implementation** → @implementation-coordinator |
| SPECS COMPLETE | SET UP | CODE EXISTS | PARTIAL | **Continue Implementation** → @implementation-coordinator |
| SPECS COMPLETE | SET UP | CODE EXISTS | COMPLETE | **Next Phase** → Add more features |

---

## New Scenarios

### Scenario C: Specs Partially Complete

**When**: Some features have complete specs, others don't

**Report Shows**:
- Which features are complete
- Which features are pending
- Which features are in progress

**Recommends**:
```bash
@spec-batch-processor
```
→ Completes remaining specs in batches of 3

**Time Estimate**: ~10-15 minutes per batch

---

### Scenario D: Specs Complete, Environment Needed (NEW! ✨)

**When**: All features have complete specs but environment is not set up

**Report Shows**:
- All completed feature specs
- Environment status (not set up)
- Tech stack from design specs

**Recommends**:
```bash
/setup-environment
```
→ Creates apps/[app-name]/ with full environment

**Time Estimate**: ~2-5 minutes

**What Gets Created**:
- Complete directory structure (src/, tests/, docs/)
- Package configuration (package.json/pyproject.toml/go.mod)
- Testing framework (Jest/pytest/Go testing)
- Linting & formatting (ESLint/black/golangci-lint)
- CI/CD pipeline (GitHub Actions)
- Documentation (README.md)

---

### Scenario E: Environment Set Up, Ready for Implementation (NEW! ✨)

**When**: Environment is set up but features haven't been implemented

**Report Shows**:
- All completed feature specs
- Environment status (✅ set up)
- Tech stack details
- Directory structure confirmed

**Recommends**:
```bash
# Initialize context (first time)
cp context/architecture.md.template context/architecture.md
cp context/IMPLEMENTATION_STATUS.md.template context/IMPLEMENTATION_STATUS.md

# Start implementing
/implement-feature [feature-name]
```
→ Begins feature implementation with builder agents

**Time Estimate**: ~30-50 minutes per feature

**Note**: context/architecture.md may already be populated by environment setup

---

### Scenario F: Implementation in Progress

**When**: Environment set up, some features implemented, others pending

**Report Shows**:
- Completed features
- In-progress features with task counts
- Pending features
- Implementation progress percentage

**Recommends**:
```bash
# Continue with next feature
/implement-feature [next-feature]

# Or continue in-progress feature
/implement-task [feature] [next-task-id]

# Or review current state
cat context/IMPLEMENTATION_STATUS.md
```

**Time Estimate**: ~30-50 minutes per remaining feature

---

### Old Scenario D: Specs Complete, Ready for Implementation

**When**: All features have complete specs but haven't been implemented

**Report Shows**:
- All completed feature specs
- Total spec files created
- Application code status

**Recommends**:

**Step 1**: Initialize context (first time)
```bash
cp context/architecture.md.template context/architecture.md
cp context/IMPLEMENTATION_STATUS.md.template context/IMPLEMENTATION_STATUS.md
# Edit architecture.md with your tech stack
```

**Step 2**: Implement features
```bash
# Option A: Entire feature
/implement-feature [feature-name]

# Option B: Single task
/implement-task [feature-name] [task-id]
```

**Time Estimate**: ~30-50 minutes per feature (10 tasks)

---

### Scenario E: Implementation in Progress (NEW!)

**When**: Specs complete, some features implemented, others pending

**Report Shows**:
- Completed features
- In-progress features with task counts
- Pending features

**Recommends**:
```bash
# Continue with next feature
/implement-feature [next-feature]

# Or continue in-progress feature
/implement-task [feature] [next-task-id]

# Or review current state
cat context/IMPLEMENTATION_STATUS.md
```

---

## Usage Examples

### Example 1: Greenfield (No specs, no code)

```bash
$ /prime
```

**Output**:
```
🌱 GREENFIELD REPOSITORY DETECTED

Recommended:
1. @app-planner I want to build [your app]
2. @spec-batch-processor
3. /implement-feature [feature-name]
```

---

### Example 2: Partial Specs

```bash
$ /prime
```

**Output**:
```
📋 SPEC CREATION IN PROGRESS

Spec Status:
✅ Complete: 3 features
⏳ Pending: 2 features

Recommended: @spec-batch-processor
→ Completes remaining 2 features in 1 batch (~15 min)
```

---

### Example 3: Specs Complete, Ready to Build

```bash
$ /prime
```

**Output**:
```
✅ ALL SPECS COMPLETE - READY FOR IMPLEMENTATION!

Spec Status: ✅ 5 features fully spec'd
Total: 15 spec files

Recommended:
Step 1: Initialize context
Step 2: /implement-feature user-authentication
→ ~45 minutes for first feature
```

---

### Example 4: Implementation in Progress

```bash
$ /prime
```

**Output**:
```
🔨 IMPLEMENTATION IN PROGRESS

Implementation Progress:
✅ Completed: 2 features
🔄 In Progress: 1 feature (6/10 tasks)
⏳ Pending: 2 features

Recommended:
Option 1: /implement-feature [next-feature]
Option 2: /implement-task [current-feature] [next-task]
Option 3: Review context/IMPLEMENTATION_STATUS.md
```

---

## Benefits

### 1. **Context-Aware Guidance**
- Always know what to do next
- No guessing which workflow to use
- Clear progression through phases

### 2. **Time Estimates**
- Know how long each step will take
- Plan your development sessions
- Set realistic expectations

### 3. **Progress Tracking**
- See exactly where you are
- Understand what's been completed
- Know what's remaining

### 4. **Seamless Transitions**
- Smooth handoff from specs to implementation
- Clear next steps after each phase
- Guided workflow progression

### 5. **Status Transparency**
- Always know the current state
- See progress across all features
- Understand dependencies

---

## Integration with Status Files

### SPEC_CREATION_STATUS.md

**Location**: `specs/SPEC_CREATION_STATUS.md`

**Tracks**:
- Feature list with priorities
- Spec completion status per feature
- Links to spec files when complete

**Updated By**: `@spec-batch-processor`, `@spec-orchestrator`

**Prime Uses This To**: Determine which features need specs

---

### IMPLEMENTATION_STATUS.md

**Location**: `context/IMPLEMENTATION_STATUS.md`

**Tracks**:
- Implementation progress per feature
- Completed/in-progress/pending tasks
- Files created, tests written
- Module documentation created

**Updated By**: `@builder-agent`, `@implementation-coordinator`

**Prime Uses This To**: Determine which features need implementation

---

## Complete Workflow with Environment Setup (NEW! ✨)

This example shows the full flow including the new environment setup stage:

```bash
# 1. Start fresh repository
$ /prime
→ Detects: Greenfield (no specs, no code)
→ Recommends: @app-planner

# 2. Create app plan
$ @app-planner I want to build a recipe sharing app
→ Creates: APP_PLAN.md with 5 features

# 3. Check status
$ /prime
→ Detects: No specs yet
→ Recommends: @spec-batch-processor

# 4. Create all specs
$ @spec-batch-processor
→ Creates: 15 spec files (5 features × 3 files)
→ Time: ~15-20 minutes

# 5. Check status again
$ /prime
→ Detects: ✅ Specs complete, ❌ Environment not set up
→ Recommends: /setup-environment
→ Time estimate: 2-5 minutes

# 6. Setup development environment ✨ NEW!
$ /setup-environment
→ Creates: apps/recipe-app/ with full structure
→ Configures: Testing, linting, CI/CD
→ Time: ~3 minutes
→ Status: ✅ Environment ready

# 7. Check status once more
$ /prime
→ Detects: ✅ Specs complete, ✅ Environment set up, ❌ No implementation
→ Recommends: /implement-feature [feature-name]

# 8. Implement features
$ /implement-feature user-authentication
→ Creates: Working code with tests
→ Time: ~45 minutes

# 9. Check progress
$ /prime
→ Detects: 1 feature done, 4 pending
→ Progress: 20% complete
→ Recommends: /implement-feature recipe-creation

# 10. Continue building...
$ /implement-feature recipe-creation
```

**Total time from idea to first working feature**: ~1 hour!

---

## Command Flow Examples

### Complete Greenfield Flow

```bash
# 1. Prime the repository
/prime
→ Detects: Greenfield, recommends app planning

# 2. Create app plan
@app-planner I want to build a recipe sharing app
→ Creates: APP_PLAN.md

# 3. Prime again
/prime
→ Detects: No specs yet, recommends batch processing

# 4. Create all specs
@spec-batch-processor
→ Creates: All specs in specs/

# 5. Prime again
/prime
→ Detects: Specs complete, no implementation
→ Recommends: Start implementation

# 6. Implement features
/implement-feature user-authentication
→ Creates: Working code in apps/

# 7. Prime again
/prime
→ Detects: 1 feature done, 4 pending
→ Recommends: Continue implementation

# 8. Continue...
/implement-feature recipe-creation
```

**Result**: Guided through entire development lifecycle!

---

### Resuming After Break

```bash
# Come back after a break, don't remember where you left off
/prime
```

**Prime tells you**:
- Current spec status
- Current implementation status
- Exact next step to take
- Time estimate for completion

**No mental overhead** - just follow the recommendation!

---

## Technical Details

### Files Read

1. `README.md` - Repository overview
2. `SPEC_DRIVEN_DEVELOPMENT.md` - Workflow understanding
3. `ai_docs/README.md` - AI documentation
4. `specs/SPEC_CREATION_STATUS.md` - Spec status (if exists)
5. `context/IMPLEMENTATION_STATUS.md` - Implementation status (if exists)

### Commands Run

```bash
# Check specs
ls -la specs/
find specs/ -name "*-requirements.md" | wc -l
test -f specs/SPEC_CREATION_STATUS.md

# Check implementation
ls -la context/
test -f context/IMPLEMENTATION_STATUS.md

# Check apps
ls -la apps/
find apps/ -type f -name "*.ts" -o -name "*.js" -o -name "package.json"
```

### Decision Logic

```
IF no SPEC_CREATION_STATUS.md:
  IF apps/ empty:
    → Scenario A: Greenfield
  ELSE:
    → Scenario B: Existing Code

ELIF SPEC_CREATION_STATUS.md exists:
  Parse feature statuses
  
  IF some features incomplete:
    → Scenario C: Partial Specs
  
  ELIF all features complete:
    IF no context/IMPLEMENTATION_STATUS.md:
      → Scenario D: Ready for Implementation
    
    ELIF context/IMPLEMENTATION_STATUS.md exists:
      Parse implementation progress
      
      IF some features implemented:
        → Scenario E: Implementation in Progress
      
      ELIF all features implemented:
        → Scenario F: Ready for Next Phase
```

---

## Summary

The enhanced `/prime` command transforms from a simple "greenfield vs existing code" detector into an **intelligent development lifecycle navigator** that:

✅ Understands current state across all phases
✅ Provides context-specific recommendations
✅ Gives time estimates for next steps
✅ Tracks progress transparently
✅ Guides seamless phase transitions
✅ Eliminates "what do I do next?" confusion

**It's your AI project manager that always knows the current state and next best action!** 🚀

---

## Updated Development Pipeline

The `/prime` command now guides through the **complete 5-stage pipeline**:

```
1. Planning
   $ /prime → Recommends: @app-planner
   ↓
2. Spec Creation
   $ /prime → Recommends: @spec-batch-processor
   ↓
3. Environment Setup ✨ NEW!
   $ /prime → Recommends: /setup-environment
   ↓
4. Implementation
   $ /prime → Recommends: /implement-feature
   ↓
5. Continue Development
   $ /prime → Shows progress + next steps
```

**At each stage, `/prime` detects where you are and tells you exactly what to do next!**

