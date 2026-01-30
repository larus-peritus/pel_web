# Spec-Driven Development Repository Template

A complete template repository for systematic software development using Claude Code's AI-assisted workflow.

---

## 🚀 First Time Setup

When you first open this repository in Claude Code, run:

```bash
/prime
```

This will analyze your repository and guide you to the appropriate workflow based on whether you have existing code or are starting fresh.

---

## 📁 Repository Structure

This repository supports **multiple independent applications** with complete isolation:

### Multi-App Architecture 🎯 NEW!
```
apps/
├── recipe-app/               ← First application
│   ├── .git/                ← Independent git repository
│   ├── APP_PLAN.md          ← App-specific plan
│   ├── specs/               ← App-specific specifications
│   │   ├── SPEC_CREATION_STATUS.md
│   │   ├── feature1-requirements.md
│   │   ├── feature1-design.md
│   │   └── feature1-tasks.md
│   ├── context/             ← App-specific context
│   │   ├── architecture.md
│   │   ├── IMPLEMENTATION_STATUS.md
│   │   ├── features/
│   │   └── modules/
│   ├── src/                 ← Source code
│   ├── tests/               ← Tests
│   ├── package.json         ← Dependencies
│   └── README.md            ← App documentation
│
├── mobile-app/              ← Second application
│   ├── .git/                ← Independent git
│   ├── APP_PLAN.md          ← Separate plan
│   ├── specs/               ← Separate specs
│   ├── context/             ← Separate context
│   └── ...
│
└── api-server/              ← Third application
    └── ...
```

**Key Benefits**:
- ✅ Complete isolation per app (specs, context, code, git)
- ✅ Parallel development on multiple apps
- ✅ Independent versioning and deployment
- ✅ Shared tooling and methodology

### Process Management (Shared Framework)
```
.claude/                       ← Claude Code configuration (Skills, Agents, Commands, Hooks)
kiro/                         ← Spec-driven development methodology
docs/                         ← Process guides and workflow patterns
context/                      ← Templates only (apps have their own context/)
templates/                    ← Spec templates
examples/                     ← Example workflows
ai_docs/                      ← AI assistant documentation
scripts/                      ← Automation scripts
```

**These are shared tools** - they work across all apps in `apps/`.

---

## 🎯 Two Starting Scenarios

### Scenario 1: Starting a New App (Empty `apps/` Folder)

If you're building a new application from scratch:

#### Option A: Guided Greenfield Workflow (Recommended) 🌱

Create a complete app plan and all specs automatically:

```bash
# Step 1: Create app plan with feature breakdown
@app-planner I want to build [describe your app idea]

# Example:
@app-planner I want to build a recipe sharing app

# Agent asks for app name: "recipe-app"
# This creates: apps/recipe-app/APP_PLAN.md with prioritized features

# Step 2: Batch create all specs (10-15 minutes!)
@spec-batch-processor
# Agent detects app: recipe-app (or asks if multiple apps exist)
# or explicitly:
@spec-batch-processor --app recipe-app

# This creates: Complete specs in apps/recipe-app/specs/

# Step 3: Setup development environment
/setup-environment recipe-app
# This creates: apps/recipe-app/src/, context/, tests/, configs

# Step 4: Implement features
/implement-feature recipe-app user-authentication
```

**What You Get**:
- `apps/recipe-app/APP_PLAN.md` - Feature breakdown (MVP, Phase 2, Future)
- `apps/recipe-app/specs/[feature]-requirements.md` - EARS format requirements
- `apps/recipe-app/specs/[feature]-design.md` - Technical architecture
- `apps/recipe-app/specs/[feature]-tasks.md` - Implementation steps
- `apps/recipe-app/src/` - Configured development environment
- `apps/recipe-app/context/` - Implementation tracking

**Time**: 45-75 minutes from idea to ready-to-implement code

[📖 Complete Greenfield Guide →](docs/greenfield-app-workflow.md)  
[📖 Multi-App Architecture →](docs/MULTI_APP_ARCHITECTURE.md)

#### Option B: Manual Workflow (Feature by Feature)

Build specs for individual features as you go:

```bash
# Create spec for one feature in an app
@spec-orchestrator create spec for user authentication in recipe-app

# This creates:
# - apps/recipe-app/specs/user-authentication-requirements.md
# - apps/recipe-app/specs/user-authentication-design.md
# - apps/recipe-app/specs/user-authentication-tasks.md

# Then implement following the tasks
# Repeat for next feature
```

**Best For**: Learning the system, highly dependent features, exploratory development

#### Option C: Multiple Apps in Parallel

Work on multiple applications simultaneously:

```bash
# Create first app
@app-planner I want to build a recipe sharing web app
# Name: recipe-app

# Create second app
@app-planner I want to build a mobile companion app
# Name: mobile-app

# Check status of all apps
/prime
# Shows: recipe-app (planned), mobile-app (planned)

# Create specs for first app
@spec-batch-processor --app recipe-app

# Create specs for second app
@spec-batch-processor --app mobile-app

# Work on both in parallel!
```

**Best For**: Microservices, frontend + backend, multiple products

---

### Scenario 2: Existing App (Code in `apps/` Folder)

If you already have one or more applications in the `apps/` folder:

#### Step 1: Understand Existing Code

```bash
# Analyze all apps
/prime

# Or analyze specific app
/prime recipe-app
```

Claude will:
1. Scan all apps in `apps/` directory
2. Show status of each app (specs, environment, implementation)
3. Analyze codebases
4. Provide recommendations for next steps

**Example Output**:
```markdown
📦 MULTI-APP REPOSITORY

Found 2 applications:

1. recipe-app
   Status: ✅ Env set up, 🔨 Implementation 60%
   Specs: ✅ 5/5 complete
   
2. mobile-app
   Status: ✅ Specs complete, ⏳ Env needed
   Specs: ✅ 3/3 complete

→ Next: /setup-environment mobile-app
```

#### Step 2: Choose Your Next Action

**Add a New Feature** (to existing app):
```bash
# Create spec for new feature in specific app
@spec-orchestrator create spec for export to PDF in recipe-app

# Then implement
/implement-feature recipe-app pdf-export
```

**Add a New App**:
```bash
# Plan new app
@app-planner I want to build an admin dashboard

# Create specs
@spec-batch-processor --app admin-dashboard

# Setup environment
/setup-environment admin-dashboard
```

**Document Existing Features**:
```bash
# Reverse engineer specs from code
@requirements-agent document requirements for recipe creation in recipe-app
```

**Check Status Across All Apps**:
```bash
# See all apps at a glance
/prime
```

---

### Scenario 3: Legacy/Existing Code (Without Specs) 🔄 NEW!

If you have existing code that was developed with a different method or has no documentation:

#### **Reverse Engineering Workflow** - Code → Specs

Transform existing codebases into spec-driven development:

```bash
# Step 1: Place your existing code
# Move code into apps/[app-name]/
mv my-legacy-app apps/legacy-app/

# Step 2: Set context
/set-context legacy-app

# Step 3: Analyze existing code
/analyze-codebase deep
# or for quick analysis:
/analyze-codebase quick

# Agent will:
# - Analyze directory structure
# - Identify implemented features
# - Reverse-engineer requirements
# - Document architecture
# - Create refactoring tasks
# - Find gaps and missing pieces
```

**What You Get**:
- **Requirements** - What the code actually does (EARS format)
- **Design** - How it's architected (as-implemented)
- **Tasks** - Refactoring plan, missing features, technical debt
- **Status** - Implementation status, test coverage, issues

**Example Output**:
```markdown
📊 ANALYSIS COMPLETE

Features Found: 5 implemented, 2 partial, 1 missing
Test Coverage: 45%
Security Issues: 🔴 3 critical

Generated Specs:
- apps/legacy-app/specs/user-auth-requirements.md
- apps/legacy-app/specs/user-auth-design.md
- apps/legacy-app/specs/user-auth-tasks.md
[... for each feature]

Context Created:
- apps/legacy-app/context/IMPLEMENTATION_STATUS.md
- apps/legacy-app/context/architecture.md

Priority Actions:
1. 🔴 Fix SQL injection (user-auth-tasks.md, Task 1.1)
2. ⚠️ Add missing tests (user-auth-tasks.md, Task 3.1)
3. ✅ Complete admin dashboard (admin-tasks.md, Task 2.1)
```

**Then Refactor/Complete**:
```bash
# Fix critical issues
/implement-task user-auth 1.1  # Security fix

# Add missing tests
/implement-task user-auth 3.1  # Tests

# Complete missing features
/implement-feature admin-dashboard
```

**Use Cases**:
- ✅ Legacy codebases without documentation
- ✅ Code inherited from another team
- ✅ External code you need to maintain
- ✅ Prototypes going to production
- ✅ Understanding what's already implemented

**Time**: 30 min (quick) to 2-3 hr (deep analysis)

[📖 Complete Reverse Engineering Guide →](docs/REVERSE_ENGINEERING_WORKFLOW.md)

**Advanced**: Provide development logs for better context:
```bash
/analyze-codebase deep

# When prompted, provide:
# - apps/legacy-app/docs/dev-log.md
# - apps/legacy-app/docs/known-issues.md
# Agent uses these to enrich generated specs
```

---

## 🛠️ Claude Code Features Available

This repository is equipped with a complete spec-driven development system:

### Skills (Auto-Activated Expertise)
- **app-planning-skill** - Transform ideas into feature lists
- **codebase-analyzer-skill** - Reverse-engineer specs from existing code 🔄 NEW!
- **requirements-skill** - EARS format requirements with validation
- **design-skill** - Architecture patterns and technical design
- **tasks-skill** - Implementation breakdown and sequencing
- **spec-orchestrator-skill** - Coordinate all three phases
- **environment-setup-skill** - Initialize development environments
- **builder-skill** - Context-driven implementation from specs
- **worktree-manager-skill** - Isolated development environments
- **meta-skill** - Create new Agent Skills

**How to Use**: Simply mention relevant concepts - skills activate automatically.

### Agents (Explicit Workflows)

**Spec Creation**:
- **@app-planner** - Break down app ideas into features
- **@code-analyzer** - Reverse-engineer specs from existing code 🔄 NEW!
- **@spec-batch-processor** - Create specs for all features automatically
- **@spec-orchestrator** - Guide through Requirements → Design → Tasks
- **@requirements-agent** - Specialize in Requirements phase
- **@design-agent** - Specialize in Design phase
- **@tasks-agent** - Specialize in Tasks phase

**Implementation**:
- **@environment-setup-agent** - Initialize development environment
- **@builder-agent** - Implement single task from spec
- **@implementation-coordinator** - Manage parallel task implementation

**Utilities**:
- **@docs-scraper** - Fetch external documentation
- **@meta-agent** - Create new agents
- **@create-worktree-subagent** - Create isolated worktrees

**How to Use**: Invoke with `@agent-name [your request]`

### Commands (Automated Execution)

**Spec Creation** (Multi-App Aware):
- **/analyze-codebase [app-name] [quick/deep]** - Reverse-engineer specs from code 🔄 NEW!
- **/batch-spec [app-name]** - Create specs for all features in an app
- **/spec-workflow [app-name] [feature]** - Complete 3-phase workflow
- **/requirements [app-name] [feature]** - Requirements phase only
- **/design [app-name] [feature]** - Design phase only
- **/tasks [app-name] [feature]** - Tasks phase only

**Implementation** (Multi-App Aware):
- **/setup-environment [app-name]** - Initialize dev environment
- **/implement-feature [app-name] [feature]** - Implement all tasks
- **/implement-task [app-name] [feature] [id]** - Implement single task
- **/update-context [app-name]** - Refresh implementation docs

**Utilities** (Multi-App Aware):
- **/prime** - Analyze all apps OR `/prime [app-name]` for specific app
- **/set-context [app-name]** - Set work context (avoid typing app names!)
- **/create_worktree [name]** - Create isolated development environment
- **/quick-plan [app-name]** - Quick engineering plan

**How to Use**: Type `/command-name [app-name] [arguments]`

**Note**: App name is typically the first argument for app-specific commands.

**💡 TIP: Use work context to avoid typing app names!** See Work Context section below.

### Work Context - Set Your App Once ✨ NEW!

**Set your work context once, then all commands automatically use that app:**

```bash
# Set context once
/set-context recipe-app

# Now these all work without specifying app! ✨
@spec-orchestrator create spec for user authentication
/batch-spec
/implement-feature user-authentication
/prime

# Switch apps
/set-context mobile-app

# Clear context
/set-context --clear
```

**How it works**:
1. **Set context**: `/set-context [app-name]` or `/work-on [app-name]`
2. **Work naturally**: All commands default to that app
3. **Switch anytime**: `/set-context [other-app]`
4. **Override**: Explicit app name still works when needed

**Priority order for determining app**:
1. Explicit app name in command (overrides context)
2. Work context from `.claude-work-context.json`
3. Single app auto-detect (if only one app exists)
4. Ask user (if multiple apps and no context)

**Benefits**:
- ✅ Less typing - set once, work naturally
- ✅ Clearer mental model - you're "in" an app
- ✅ Fewer errors from typos
- ✅ Natural workflow (like `cd` into a directory)
- ✅ Can still override when needed

**Example workflow**:
```bash
# Morning: Focus on recipe-app
/set-context recipe-app
@spec-orchestrator create spec for search
/implement-feature search
/prime  # Shows recipe-app status

# Afternoon: Switch to mobile-app
/set-context mobile-app
@spec-orchestrator create spec for notifications
/implement-feature notifications

# Quick check on api-server (doesn't change context)
/prime api-server

# Still on mobile-app
/implement-feature offline-sync
```

**Check current context**: `/set-context` (no arguments)

[📖 Complete Work Context Guide →](docs/WORK_CONTEXT.md)

### Hooks (Automatic Event Tracking)
- Session start/end logging
- Tool usage tracking
- Subagent completion notifications
- Context updates

**How They Work**: Run automatically at specific lifecycle points.

---

## 📚 Documentation

### Quick References
- **[Quick Reference Guide](docs/QUICK_REFERENCE.md)** - Decision tree and command finder
- **[Spec-Driven Development Overview](SPEC_DRIVEN_DEVELOPMENT.md)** - Complete system overview

### Detailed Guides
- **[Greenfield App Workflow](docs/greenfield-app-workflow.md)** - Build new apps from scratch
- **[Batch Spec Processing](docs/batch-spec-processing.md)** - Automate specs for all features
- **[Environment Setup Guide](docs/ENVIRONMENT_SETUP_GUIDE.md)** - Initialize dev environment ✨ NEW!
- **[Implementation Workflow](docs/implementation-workflow.md)** - Build features from specs ✨ NEW!
- **[Context Management](context/README.md)** - Track implementation and documentation ✨ NEW!
- **[Workflow Patterns](docs/workflow-patterns.md)** - Different execution approaches
- **[Worktree Integration](docs/worktree-integration.md)** - Isolated feature development
- **[Hooks Integration](docs/hooks-integration.md)** - Event tracking and automation

### Component Documentation
- **[Skills Guide](.claude/skills/README.md)** - All available skills
- **[Agents Guide](.claude/agents/README.md)** - All available agents
- **[Commands Guide](.claude/commands/README.md)** - All available commands

### Methodology
- **[Kiro Spec-Driven Development](kiro/README.md)** - The underlying methodology
- **[Templates](templates/spec-templates/README.md)** - Spec document templates
- **[Examples](examples/complete-spec-example/README.md)** - Complete example workflows

---

## 🎓 Learning Path

### First Time User (30 minutes)

1. **Read**: [Spec-Driven Development Overview](SPEC_DRIVEN_DEVELOPMENT.md)
2. **Try**: Create your first spec:
   ```bash
   @spec-orchestrator create spec for user registration
   ```
3. **Review**: Check the generated files in `specs/`
4. **Learn**: Read [Workflow Patterns](docs/workflow-patterns.md)

### Ready to Build (1 hour)

1. **Plan**: Use app-planner to break down your idea
   ```bash
   @app-planner I want to build [your app]
   ```
2. **Spec**: Batch create all specs
   ```bash
   /batch-spec parallel
   ```
3. **Implement**: Follow the tasks for each feature
4. **Iterate**: Refine and expand

---

## 🔄 Typical Workflows

### Greenfield Multi-App Workflow

```
┌─────────────────────────────────────────────────────┐
│ 1. Plan App                                         │
│    @app-planner [app idea]                          │
│    → apps/[app-name]/APP_PLAN.md                    │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ 2. Batch Create Specs                               │
│    @spec-batch-processor --app [app-name]           │
│    → apps/[app-name]/specs/*.md (15 min!)           │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ 3. Setup Environment                                │
│    /setup-environment [app-name]                    │
│    → apps/[app-name]/src/, tests/, context/         │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ 4. Implement Features                               │
│    /implement-feature [app-name] [feature]          │
│    → Working code in apps/[app-name]/src/           │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ 5. Add More Apps (Parallel Development)             │
│    Repeat steps 1-4 for additional apps            │
│    All apps isolated with own specs/code/git       │
└─────────────────────────────────────────────────────┘
```

### Multi-App Management Workflow

```
┌─────────────────────────────────────────────────────┐
│ 1. Check Status of All Apps                        │
│    /prime                                           │
│    → Shows all apps with spec/implementation status│
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ 2. Work on Specific App                             │
│    @spec-orchestrator [feature] in [app-name]       │
│    → apps/[app-name]/specs/[feature]*.md            │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ 3. Implement in Isolated Space                      │
│    /implement-feature [app-name] [feature]          │
│    → apps/[app-name]/src/[feature-code]             │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ 4. Independent Git Operations                       │
│    cd apps/[app-name]                              │
│    git commit, git push                            │
│    → Each app has own git repository               │
└─────────────────────────────────────────────────────┘
```

---

## ⚙️ Configuration

### Repository Settings

- **Claude Settings**: `.claude/settings.json` - Hooks, plugins, status line
- **Git Ignore**: `.gitignore` - Excludes worktrees, local configs
- **Cursor Ignore**: `.cursorignore` - Additional exclusions for Cursor IDE

### Application Settings

Place your application-specific configurations in:
```
apps/[your-app]/
├── .env.example
├── package.json
├── tsconfig.json
└── [other configs]
```

---

## 🚨 Important Guidelines

### ✅ Do's

- **Create all application code in `apps/[app-name]/`**
- **Use spec-driven workflow for new features**
- **Store specs in `specs/` directory**
- **Follow EARS format for requirements**
- **Use worktrees for isolated feature development** (optional)
- **Update APP_PLAN.md as features evolve**

### ❌ Don'ts

- **Don't put application code in root or process folders**
- **Don't modify `.claude/`, `kiro/`, `docs/` unless extending the framework**
- **Don't skip the spec creation process** (except for trivial changes)
- **Don't mix multiple apps in one `apps/[app-name]` folder**

---

## 🤝 Team Collaboration

### For Solo Developers

1. Create APP_PLAN.md with all features
2. Batch create specs (/batch-spec sequential)
3. Implement one feature at a time
4. Test and validate before moving to next

### For Teams

1. Create APP_PLAN.md collaboratively
2. Batch create specs (/batch-spec parallel)
3. Create worktrees for each feature:
   ```bash
   /create_worktree feature-1
   /create_worktree feature-2
   /create_worktree feature-3
   ```
4. Assign features to team members
5. Each implements in isolated worktree
6. Merge as features complete

---

## 📊 Metrics and Tracking

### Spec Coverage

Track which features have complete specs:
- ✅ Requirements defined
- ✅ Design documented
- ✅ Tasks broken down
- ⏳ Implementation in progress
- ✅ Implemented and tested

### Implementation Progress

Use APP_PLAN.md to track:
- Essential (MVP) features progress
- Phase 2 features status
- Future features backlog

---

## 🆘 Getting Help

### Quick Answers

**"Where do I start?"**
→ Run `/prime` if you have code, or `@app-planner [idea]` if starting fresh

**"How do I add a new feature?"**
→ `@spec-orchestrator create spec for [feature-name]`

**"How do I create specs for all features at once?"**
→ `@spec-batch-processor` or `/batch-spec parallel`

**"What files should I edit?"**
→ Only files in `apps/[your-app]/` and `specs/`

**"Can I skip the spec process?"**
→ Not recommended, but for trivial changes, yes. For features, always create specs.

### Documentation

- **[Quick Reference](docs/QUICK_REFERENCE.md)** - Command finder
- **[FAQ](SPEC_DRIVEN_DEVELOPMENT.md#faq)** - Common questions
- **[Workflow Patterns](docs/workflow-patterns.md)** - Execution examples

---

## 🎯 Success Metrics

You're using the system well when:

✅ All features have complete specs before implementation  
✅ Application code is organized in `apps/[app-name]/`  
✅ Specs are stored in `specs/` with clear naming  
✅ APP_PLAN.md accurately reflects project status  
✅ Requirements use EARS format and are testable  
✅ Designs address all requirements  
✅ Tasks are actionable and sequenced  
✅ Implementation follows the task breakdowns  

---

## 📝 Next Steps

### New Repository?

1. Run `/prime` to initialize
2. Choose your workflow (greenfield or manual)
3. Create your first app in `apps/[app-name]/`

### Ready to Build?

1. Review [Spec-Driven Development Overview](SPEC_DRIVEN_DEVELOPMENT.md)
2. Check out [Greenfield App Workflow](docs/greenfield-app-workflow.md)
3. Start with `@app-planner` or `@spec-orchestrator`

### Want to Learn More?

1. Read [Kiro Methodology](kiro/README.md)
2. Explore [Workflow Patterns](docs/workflow-patterns.md)
3. Review [Complete Example](examples/complete-spec-example/README.md)

---

## 🏗️ Repository Maintenance

### Updating the Framework

Process management code (`.claude/`, `kiro/`, `docs/`) can be updated from upstream:

```bash
git remote add upstream [upstream-url]
git fetch upstream
git merge upstream/main
```

Your application code in `apps/` remains untouched.

### Creating New Apps

Add additional apps as separate, isolated directories:

```
apps/
├── my-web-app/          ← Independent app
│   ├── .git/           ← Own git repository
│   ├── APP_PLAN.md     ← Own plan
│   ├── specs/          ← Own specifications
│   ├── context/        ← Own context
│   └── src/            ← Own code
│
├── my-mobile-app/       ← Independent app
│   ├── .git/           ← Own git repository
│   └── ...
│
└── my-api-service/      ← Independent app
    ├── .git/           ← Own git repository
    └── ...
```

**Each app is completely isolated**:
- Own git repository and version control
- Own specifications and planning
- Own context and documentation
- Own dependencies and configuration

**Work on multiple apps**:
```bash
# Create app 1
@app-planner [app 1 idea]

# Create app 2
@app-planner [app 2 idea]

# Check all apps
/prime

# Work on any app
@spec-batch-processor --app my-web-app
/setup-environment my-mobile-app
/implement-feature my-api-service user-auth
```

[📖 Multi-App Architecture Guide →](docs/MULTI_APP_ARCHITECTURE.md)

---

## 📄 License

This template is designed to help you build better software systematically. Use it freely for your projects.

---

**Ready to build?** Run `/prime` to get started! 🚀
