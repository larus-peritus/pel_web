---
description: Intelligently analyze repository state (specs, code, implementation) and recommend the next best workflow. Checks SPEC_CREATION_STATUS.md, context/IMPLEMENTATION_STATUS.md, and apps/ to provide context-aware guidance.
argument-hint: ""
allowed-tools: Read, Grep, Bash, List
---

# Prime - Intelligent Repository Analysis

## Purpose
Comprehensively analyze the repository state across all development phases:
- Spec creation status (via SPEC_CREATION_STATUS.md)
- Implementation progress (via context/IMPLEMENTATION_STATUS.md)
- Application code status (via apps/ directory)

Then provide intelligent, context-aware recommendations for the next best workflow, whether that's:
- Starting from scratch with app planning
- Completing partial specs with batch processing
- Beginning implementation with builder agents
- Continuing in-progress implementation

## Workflow

### Step 1: Understand Repository Structure

**Read Core Documentation**:
```
Read: README.md
Read: SPEC_DRIVEN_DEVELOPMENT.md
Read: ai_docs/README.md
```

### Step 1.5: Check Work Context

**Check for work context file**:
```bash
if [ -f .claude-work-context.json ]; then
  CONTEXT_APP=$(jq -r '.current_app' .claude-work-context.json)
  CONTEXT_TIME=$(jq -r '.timestamp' .claude-work-context.json)
  echo "📍 Work context active: $CONTEXT_APP (set: $CONTEXT_TIME)"
else
  echo "No work context set"
fi
```

**If specific app provided as argument**:
- Analyze that app in detail
- Optionally offer to set it as work context
- Example: `/prime recipe-app`

**If work context is set and no argument provided**:
- Focus analysis on the context app
- Show detailed status for that app
- Show summary for other apps

**If no context and no argument**:
- Show overview of all apps
- Suggest setting work context if user will focus on one app

### Step 2: Analyze Spec Status

**Check for Existing Specs**:

```bash
# Check if specs directory exists and has files
ls -la specs/ 2>/dev/null || echo "No specs directory"

# Count spec files
find specs/ -type f -name "*-requirements.md" 2>/dev/null | wc -l
find specs/ -type f -name "*-design.md" 2>/dev/null | wc -l
find specs/ -type f -name "*-tasks.md" 2>/dev/null | wc -l

# Check for SPEC_CREATION_STATUS.md
test -f specs/SPEC_CREATION_STATUS.md && echo "Status file exists" || echo "No status file"
```

**If SPEC_CREATION_STATUS.md exists**, read and analyze it:
```
Read: specs/SPEC_CREATION_STATUS.md
```

Parse to determine:
- Features with status "✅ Complete" (all 3 spec files done)
- Features with status "⏳ Pending" or "🔄 In Progress" (specs incomplete)
- Features that have been implemented (check context/IMPLEMENTATION_STATUS.md if exists)

**Determine Spec State**:
- **SPECS COMPLETE**: All features have complete specs (Req + Design + Tasks)
- **SPECS PARTIAL**: Some features have specs, others don't
- **NO SPECS**: No spec files or status tracking

### Step 3: Check Environment Setup Status

**Check for initialized app directories**:

```bash
# List apps directory
ls -la apps/

# For each directory in apps/, check if it's properly initialized
for app_dir in apps/*/; do
  if [ -d "$app_dir" ]; then
    app_name=$(basename "$app_dir")
    
    # Check for key environment files
    test -f "$app_dir/package.json" && echo "$app_name: Node.js" ||
    test -f "$app_dir/pyproject.toml" && echo "$app_name: Python" ||
    test -f "$app_dir/requirements.txt" && echo "$app_name: Python" ||
    test -f "$app_dir/go.mod" && echo "$app_name: Go" ||
    test -f "$app_dir/Cargo.toml" && echo "$app_name: Rust" ||
    echo "$app_name: Unknown/Not initialized"
    
    # Check for src/ and tests/ directories
    test -d "$app_dir/src" && echo "  ✅ src/" || echo "  ❌ src/"
    test -d "$app_dir/tests" && echo "  ✅ tests/" || echo "  ❌ tests/"
  fi
done
```

**Determine Environment State**:
- **ENVIRONMENT SET UP**: `apps/[app]/` exists with package.json/pyproject.toml + src/ + tests/
- **PARTIAL SETUP**: Directory exists but missing key files/structure
- **NOT SET UP**: `apps/` empty or only contains README

### Step 4: Analyze Application Code

**Check for actual implementation**:

```bash
# Count source files in apps
find apps/ -type f \( -name "*.ts" -o -name "*.js" -o -name "*.py" -o -name "*.go" \) ! -path "*/node_modules/*" ! -path "*/venv/*" | wc -l

# Check for tests
find apps/ -path "*/tests/*" -type f | wc -l
```

**Determine Code State**:
- If source file count > 10 → **CODE EXISTS** (implementation started)
- If source file count = 1-10 → **MINIMAL CODE** (just setup files)
- If source file count = 0 → **NO CODE** (environment only)

### Step 5: Check Implementation Status

**If context/ directory exists**:
```bash
# Check if context directory exists
ls -la context/ 2>/dev/null || echo "No context directory"

# Check for implementation tracking
test -f context/IMPLEMENTATION_STATUS.md && echo "Implementation tracked" || echo "No implementation tracking"
```

**If context/IMPLEMENTATION_STATUS.md exists**, read and analyze:
```
Read: context/IMPLEMENTATION_STATUS.md
```

Determine:
- Features that have been implemented
- Features that are in progress
- Features that are pending implementation

**Determine Implementation State**:
- **FULLY IMPLEMENTED**: All spec'd features have been built
- **PARTIALLY IMPLEMENTED**: Some features built, others pending
- **NOT IMPLEMENTED**: Specs exist but no implementation yet

### Step 6: Intelligent Recommendation

Based on the combination of states, provide intelligent guidance:

| Spec State | Environment State | Code State | Implementation State | Recommendation |
|------------|------------------|------------|---------------------|----------------|
| NO SPECS | ANY | NO CODE | N/A | **Greenfield Workflow** → @app-planner |
| NO SPECS | ANY | CODE EXISTS | N/A | **Existing Code** → Add features or document |
| SPECS PARTIAL | ANY | ANY | ANY | **Continue Specs** → @spec-batch-processor |
| SPECS COMPLETE | NOT SET UP | ANY | N/A | **Setup Environment** ✨ → /setup-environment |
| SPECS COMPLETE | SET UP | NO CODE | NOT IMPLEMENTED | **Start Implementation** → @implementation-coordinator |
| SPECS COMPLETE | SET UP | MINIMAL CODE | NOT IMPLEMENTED | **Start Implementation** → @implementation-coordinator |
| SPECS COMPLETE | SET UP | CODE EXISTS | PARTIAL | **Continue Implementation** → @implementation-coordinator |
| SPECS COMPLETE | SET UP | CODE EXISTS | COMPLETE | **Ready for Next Phase** → Add more features |

### Step 7: Report and Guide

#### Scenario A: Greenfield (No Existing Code)

If `apps/` directory is empty or minimal:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌱 GREENFIELD REPOSITORY DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Repository Structure:
✅ Process framework ready (.claude/, kiro/, docs/)
✅ Spec templates available (templates/spec-templates/)
❌ No application code in apps/ directory

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 RECOMMENDED: GREENFIELD APP WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is the fastest way to go from idea to implementation-ready specs:

Step 1: Plan Your App (30-60 minutes)
   @app-planner I want to build [describe your app idea]
   
   Example:
   @app-planner I want to build a task management app with teams, 
                projects, and deadline reminders
   
   → Creates: APP_PLAN.md with prioritized features

Step 2: Batch Create All Specs (10-15 minutes!)
   @spec-batch-processor
   or
   /batch-spec parallel
   
   → Creates: Complete specs for ALL features in specs/
     - requirements-[feature].md (EARS format)
     - design-[feature].md (architecture)
     - tasks-[feature].md (implementation steps)

Step 3: Implement
   Create your app in apps/[your-app-name]/
   Follow the task breakdowns in specs/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 ALTERNATIVE: MANUAL WORKFLOWS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you prefer to work feature-by-feature:

Option A: Orchestrated Workflow (Guided)
   @spec-orchestrator create spec for [feature-name]
   
   → Interactive, walks you through:
     1. Requirements phase (EARS format)
     2. Design phase (architecture)
     3. Tasks phase (breakdown)

Option B: Phase-by-Phase (Focused)
   @requirements-agent create requirements for [feature]
   @design-agent create design for [feature]
   @tasks-agent create tasks for [feature]
   
   → Work on individual phases independently

Option C: Direct Commands (Fast)
   /spec-workflow [feature-name]
   /requirements [feature description]
   /design [requirements-file]
   /tasks [design-file]
   
   → Automated, minimal interaction

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎓 LEARNING RESOURCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quick Start:
- [Greenfield App Workflow](docs/greenfield-app-workflow.md)
- [Quick Reference Guide](docs/QUICK_REFERENCE.md)

Detailed Guides:
- [Batch Spec Processing](docs/batch-spec-processing.md)
- [Workflow Patterns](docs/workflow-patterns.md)
- [Spec-Driven Development Overview](SPEC_DRIVEN_DEVELOPMENT.md)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 IMPORTANT: Application Code Location
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All application code must go in:
   apps/[your-app-name]/

These folders are process management (NOT application code):
   .claude/       - Claude Code configuration
   kiro/          - Methodology documentation
   specs/         - Generated specifications
   docs/          - Workflow guides
   templates/     - Spec templates
   examples/      - Example workflows
   ai_docs/       - AI documentation
   app_docs/      - Process documentation
   scripts/       - Automation scripts

When creating specs, only reference code in apps/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ready to start? Choose your approach above! 🚀
```

---

#### Scenario B: Existing Code

If `apps/` directory contains application code:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 EXISTING APPLICATION CODE DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analyzing application code in apps/ directory...

[List apps found]:
apps/
├── [app-1-name]/
│   ├── src/
│   ├── tests/
│   └── package.json
└── [app-2-name]/
    └── ...

[Show summary of each app]:
- Programming language(s) detected
- Framework(s) identified  
- Key directories and structure
- Number of files
- Recent activity

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 CODEBASE SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[For each app in apps/]:

App: [app-name]
Location: apps/[app-name]/
Language: [detected language]
Framework: [detected framework]
Architecture: [observed patterns]

Key Components:
- [Component 1]: [Brief description]
- [Component 2]: [Brief description]
- [Component 3]: [Brief description]

Current State:
- [Observation about completeness]
- [Observation about structure]
- [Observation about testing]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ REPOSITORY PRIMED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I now understand your codebase structure and application code.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 WHAT WOULD YOU LIKE TO DO?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Option 1: Add a New Feature
   Create spec for a new feature to add to existing app:
   
   @spec-orchestrator create spec for [new feature]
   
   Example:
   @spec-orchestrator create spec for export to PDF
   
   → Creates complete spec (requirements, design, tasks)
   → Implement following the task breakdown

Option 2: Document Existing Features
   Reverse engineer specs from existing code:
   
   @requirements-agent document requirements for [existing feature]
   @design-agent document design for [existing component]
   
   → Creates specs for existing functionality
   → Useful for maintenance and onboarding

Option 3: Plan Refactoring
   Create design for refactoring existing code:
   
   @design-agent create refactoring design for [component/system]
   
   → Technical design for refactoring
   → Task breakdown for implementation

Option 4: Plan Next Phase
   Create comprehensive plan for upcoming features:
   
   @app-planner plan Phase 2 features for [app-name]
   
   → Feature breakdown and prioritization
   → Batch create specs for all planned features

Option 5: Batch Add Multiple Features
   Spec multiple new features at once:
   
   1. Create/update APP_PLAN.md with new features
   2. @spec-batch-processor
      or
      /batch-spec parallel
   
   → Complete specs for all features (10-15 min!)

Option 6: Create Isolated Feature Branch
   Work on feature in isolated environment:
   
   /create_worktree [feature-name]
   
   → Isolated git worktree with own ports/config
   → Develop without impacting main codebase

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 RELEVANT DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For your situation:
- [Adding Features to Existing Apps](docs/workflow-patterns.md#existing-app-workflow)
- [Spec-Driven Development Overview](SPEC_DRIVEN_DEVELOPMENT.md)
- [Quick Reference](docs/QUICK_REFERENCE.md)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 REMINDER: Application Code Boundary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Application code location:
   apps/[your-app-name]/     ← Your code here

Process management (not app code):
   .claude/, kiro/, docs/, specs/, templates/, etc.
   ← Framework for building apps

When creating/updating specs, I will only reference code in apps/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What would you like to work on? 🚀
```

---

#### Scenario C: Specs Partially Complete

If some features have complete specs but others don't:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 SPEC CREATION IN PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reading: specs/SPEC_CREATION_STATUS.md

Spec Status:
✅ Complete: [X] features
🔄 In Progress: [Y] features
⏳ Pending: [Z] features

Completed Features:
✅ [Feature 1] (3 files: requirements, design, tasks)
✅ [Feature 2] (3 files: requirements, design, tasks)

Incomplete Features:
⏳ [Feature 3] - Status: Pending
🔄 [Feature 4] - Status: In Progress (Requirements done)
⏳ [Feature 5] - Status: Pending

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 RECOMMENDED: COMPLETE REMAINING SPECS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Continue spec creation for remaining features:

@spec-batch-processor

or

/batch-spec

What it does:
- Reads specs/SPEC_CREATION_STATUS.md
- Finds [Z] features needing specs
- Processes in batches of 3
- Creates complete specs for each feature
- Updates status automatically

Time: ~10-15 minutes per batch of 3 features

After specs are complete, you can start implementation!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 ALTERNATIVE: SINGLE FEATURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you prefer to work on one feature at a time:

@spec-orchestrator create spec for [feature-name]

→ Complete spec for one specific feature

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 RELEVANT DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- [Batch Spec Processing Guide](docs/batch-spec-processing.md)
- [Spec-Driven Development](SPEC_DRIVEN_DEVELOPMENT.md)
```

---

#### Scenario D: Specs Complete, Environment Needed (NEW!)

If all features have complete specs but environment is not set up yet:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SPECS COMPLETE - ENVIRONMENT SETUP NEEDED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reading: specs/SPEC_CREATION_STATUS.md

Spec Status: ✅ [X] features fully spec'd

Complete Feature Specs:
✅ [Feature 1] - requirements, design, tasks ready
✅ [Feature 2] - requirements, design, tasks ready
✅ [Feature 3] - requirements, design, tasks ready

Total: [X] features with [X × 3 = Y] spec files

Environment Status:
❌ apps/ directory empty or no app initialized
⚠️ Need to set up development environment

Tech Stack (from design specs):
- Language: [TypeScript/Python/Go]
- Framework: [React/Express/FastAPI]
- Database: [PostgreSQL/MongoDB]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 RECOMMENDED: SETUP DEVELOPMENT ENVIRONMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your specs are complete! Before implementation, set up the environment:

/setup-environment

or

@environment-setup-agent set up environment

What it does:
- Reads APP_PLAN.md and design specs
- Creates apps/[app-name]/ directory structure
- Initializes project with proper tech stack
- Configures testing framework
- Sets up linting and formatting
- Creates CI/CD pipeline
- Generates documentation
- ~2-5 minutes total

After environment setup:
✅ Directory structure ready
✅ Dependencies installed
✅ Testing configured
✅ Linting enabled
✅ CI/CD working
✅ Ready to implement features!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 WHAT GETS CREATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

apps/[app-name]/
├── src/              ← Source code structure
│   ├── index.ts     ← Entry point
│   ├── components/  ← Components (if applicable)
│   ├── services/    ← Business logic
│   └── utils/       ← Utilities
├── tests/           ← Testing structure
│   ├── unit/        ← Unit tests
│   └── integration/ ← Integration tests
├── package.json     ← Dependencies
├── tsconfig.json    ← TypeScript config
├── jest.config.js   ← Testing config
├── .eslintrc.json   ← Linting rules
└── README.md        ← Documentation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 RELEVANT DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Essential Reads:
- [Environment Setup Guide](docs/ENVIRONMENT_SETUP_GUIDE.md) ⭐
- [Implementation Workflow](docs/implementation-workflow.md)

Ready to set up your environment! 🔧
```

---

#### Scenario E: Environment Set Up, Ready for Implementation

If environment is set up but features haven't been implemented yet:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ENVIRONMENT SET UP - READY FOR IMPLEMENTATION!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reading: specs/SPEC_CREATION_STATUS.md
Reading: apps/ directory

Spec Status: ✅ [X] features fully spec'd

Complete Feature Specs:
✅ [Feature 1] - requirements, design, tasks ready
✅ [Feature 2] - requirements, design, tasks ready
✅ [Feature 3] - requirements, design, tasks ready
✅ [Feature 4] - requirements, design, tasks ready
✅ [Feature 5] - requirements, design, tasks ready

Total: [X] features with [X × 3 = Y] spec files

Environment Status: ✅ Ready
- Directory: apps/[app-name]/
- Tech Stack: [TypeScript/Python/Go]
- Structure: ✅ src/, tests/, docs/
- Configuration: ✅ package.json, testing, linting
- CI/CD: ✅ GitHub Actions configured

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 RECOMMENDED: START IMPLEMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your environment is set up and specs are complete! Time to build:

Step 1: Initialize Context (First Time Only)
   cp context/architecture.md.template context/architecture.md
   cp context/IMPLEMENTATION_STATUS.md.template context/IMPLEMENTATION_STATUS.md
   
   Note: context/architecture.md may already be populated by environment setup
   
   → Takes 2 minutes, one-time setup

Step 2: Implement Feature (Choose One)

Option A: Implement Entire Feature (Recommended)
   /implement-feature [feature-name]
   
   or
   
   @implementation-coordinator [feature-name] 3
   
   Example:
   /implement-feature user-authentication
   
   What it does:
   - Reads specs/[feature]-tasks.md
   - Implements all tasks in batches of 3
   - Creates code in apps/[your-app]/
   - Writes tests automatically
   - Updates context/ documentation
   - ~30-50 minutes for 10 tasks
   
   Result:
   ✅ Complete working feature
   ✅ Tests passing
   ✅ Fully documented

Option B: Implement Single Task (Focused)
   /implement-task [feature-name] [task-id]
   
   Example:
   /implement-task user-authentication 1.2
   
   What it does:
   - Implements one specific task
   - ~5-10 minutes per task
   
   Best for:
   - Learning the system
   - High-dependency tasks
   - Incremental development

Step 3: Review and Test
   cd apps/[your-app]
   npm test  # or your test command
   
   Review context/IMPLEMENTATION_STATUS.md for progress

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 IMPLEMENTATION WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each feature:
1. Specs → Implementation agents → Working code
2. Automatic testing and documentation
3. Context tracking of progress
4. Ready for integration

[X] features × ~45 min = ~[time] hours total
(with parallelization built-in!)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 RELEVANT DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Essential Reads:
- [Implementation Workflow](docs/implementation-workflow.md) ⭐
- [Context Management](context/README.md)
- [Builder Agent Guide](.claude/agents/builder-agent.md)

Ready to build! 🚀
```

---

#### Scenario F: Implementation in Progress

If environment is set up and some features have been implemented:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔨 IMPLEMENTATION IN PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reading: specs/SPEC_CREATION_STATUS.md
Reading: context/IMPLEMENTATION_STATUS.md

Spec Status: ✅ [X] features fully spec'd

Implementation Progress:
✅ Completed: [A] features
🔄 In Progress: [B] features
⏳ Pending: [C] features

Completed Features:
✅ [Feature 1] - Fully implemented and tested
✅ [Feature 2] - Fully implemented and tested

In Progress:
🔄 [Feature 3] - [X]/[Y] tasks complete
   Files created: apps/[app]/src/[files]
   Last updated: [timestamp]

Pending Implementation:
⏳ [Feature 4] - Spec ready
⏳ [Feature 5] - Spec ready

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 RECOMMENDED: CONTINUE IMPLEMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Continue building remaining features:

Option 1: Implement Next Feature
   /implement-feature [next-feature-name]
   
   Example:
   /implement-feature [Feature 4]
   
   → Implements all tasks for this feature
   → ~30-50 minutes

Option 2: Continue In-Progress Feature
   /implement-task [feature] [next-task-id]
   
   Example:
   /implement-task [Feature 3] [next-task]
   
   → Continues where you left off
   → ~5-10 minutes per task

Option 3: Review Current Implementation
   Review context:
   - context/IMPLEMENTATION_STATUS.md
   - context/features/[feature].md
   - context/modules/[Module].md
   
   Run tests:
   cd apps/[app] && npm test

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 PROGRESS SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall: [A]/[X] features complete ([percentage]%)
Next up: [C] features remaining
Estimated time: ~[time] hours

Your implementation is well underway! 🚀

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 RELEVANT DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- [Implementation Workflow](docs/implementation-workflow.md)
- [Context Status](context/IMPLEMENTATION_STATUS.md)
```

---

### Step 8: Set Context for Future Interactions

**Store Key Information**:
- Repository state (greenfield vs existing)
- Apps found in `apps/` directory
- Application code boundary (`apps/` only)
- Process management folders (excluded from spec creation)

**Context for Claude**:
```
Repository State: [GREENFIELD | EXISTING_CODE]
Application Code Location: apps/
Process Management Folders: .claude/, kiro/, docs/, specs/, templates/, examples/, ai_docs/, app_docs/, scripts/, images/

Important: When creating specifications or analyzing code:
- ONLY reference code in apps/ directory
- IGNORE code in process management folders
- All new application code goes in apps/[app-name]/
- Process folders are framework, not application code
```

## Key Behaviors

### Always Remember

1. **Application Code Boundary**:
   - ✅ Code in `apps/` = Application code
   - ❌ Code in other folders = Process management

2. **Spec Creation Scope**:
   - Only analyze/reference code in `apps/`
   - Never include process management code in specs
   - New features go in `apps/[app-name]/`

3. **Guidance**:
   - Empty `apps/` → Guide to greenfield workflow
   - Existing `apps/` → Understand code, offer feature additions
   - Always suggest batch processing for multiple features

### Error Prevention

**If user asks to spec/analyze code outside apps/**:
```
⚠️ Note: The [folder/file] is part of the process management framework, 
not application code.

Application code is located in: apps/

Would you like me to:
A) Analyze code in apps/ instead
B) Understand the process framework (not for spec creation)
C) Something else
```

## Success Criteria

Priming is successful when:
- ✅ Repository state is clearly identified
- ✅ User understands the application code boundary
- ✅ User is guided to appropriate workflow
- ✅ Claude has correct context for future interactions
- ✅ User knows their next steps

## Integration with Workflows

After priming:

**Greenfield** → Guide to @app-planner or @spec-orchestrator
**Existing** → Suggest feature addition, documentation, or refactoring

Both scenarios should emphasize:
- `apps/` is for application code
- Other folders are process management
- Spec creation only references `apps/`
