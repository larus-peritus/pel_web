# Multi-App Architecture

**Complete isolation: Each app has its own specs, context, and git repository.**

---

## Overview

This repository supports **multiple independent applications**, each fully isolated with its own:
- ✅ Specifications (`specs/`)
- ✅ Context documentation (`context/`)
- ✅ Source code (`src/`)
- ✅ Tests (`tests/`)
- ✅ Git repository (`.git/`)

**Key Benefit**: Develop multiple apps in parallel, each with independent versioning and deployment.

---

## Directory Structure

```
peritus-repo-template/          ← Root template repository
├── .claude/                    ← Shared Claude Code tooling
│   ├── skills/                ← Reusable skills for all apps
│   ├── agents/                ← Reusable agents for all apps
│   ├── commands/              ← Commands work across all apps
│   └── hooks/                 ← Hooks work across all apps
├── kiro/                      ← Shared spec-driven methodology
├── docs/                      ← Shared documentation
├── README.md                  ← Template documentation
└── apps/                      ← 🎯 All applications live here
    ├── my-web-app/            ← First application
    │   ├── .git/              ← ✅ Independent git repository
    │   ├── APP_PLAN.md        ← ✅ App-specific plan
    │   ├── specs/             ← ✅ App-specific specifications
    │   │   ├── SPEC_CREATION_STATUS.md
    │   │   ├── feature1-requirements.md
    │   │   ├── feature1-design.md
    │   │   ├── feature1-tasks.md
    │   │   └── ...
    │   ├── context/           ← ✅ App-specific context
    │   │   ├── architecture.md
    │   │   ├── IMPLEMENTATION_STATUS.md
    │   │   ├── features/
    │   │   └── modules/
    │   ├── src/               ← Application source code
    │   ├── tests/             ← Application tests
    │   ├── package.json       ← Dependencies
    │   └── README.md          ← App documentation
    │
    ├── my-mobile-app/         ← Second application
    │   ├── .git/              ← ✅ Independent git repo
    │   ├── APP_PLAN.md        ← ✅ Separate plan
    │   ├── specs/             ← ✅ Separate specs
    │   ├── context/           ← ✅ Separate context
    │   ├── src/
    │   ├── tests/
    │   └── ...
    │
    └── my-api-server/         ← Third application
        ├── .git/
        ├── APP_PLAN.md
        ├── specs/
        ├── context/
        ├── src/
        └── ...
```

---

## Key Principles

### 1. Complete Isolation

**Each app is independent**:
- Own git repository with independent version history
- Own specifications with app-specific features
- Own context with app-specific documentation
- Own dependencies and configuration
- Own CI/CD pipeline

### 2. Shared Tooling

**Template provides reusable tools**:
- Claude Code features (skills, agents, commands) work for all apps
- Spec-driven methodology applies to any app
- Documentation and guides are universal
- Hooks and automation work across apps

### 3. Selective Git Tracking

**Two-level git structure**:
- **Root git** (optional): Tracks template infrastructure (.claude/, kiro/, docs/)
- **App git** (per-app): Tracks application code and specs

**Benefit**: Apps can be deployed independently, moved to separate repos, or shared as submodules.

---

## Workflow Per App

### Step 1: Plan App

```bash
# Create new app idea
@app-planner I want to build a recipe sharing app

# Where should APP_PLAN.md be created?
→ Specify: apps/recipe-app/APP_PLAN.md
```

**Creates**:
- `apps/recipe-app/APP_PLAN.md` with feature list

### Step 2: Create Specs

```bash
# Generate specs for this app
@spec-batch-processor --app recipe-app
```

**Creates**:
- `apps/recipe-app/specs/SPEC_CREATION_STATUS.md`
- `apps/recipe-app/specs/[feature]-requirements.md`
- `apps/recipe-app/specs/[feature]-design.md`
- `apps/recipe-app/specs/[feature]-tasks.md`

### Step 3: Setup Environment

```bash
# Initialize development environment
/setup-environment recipe-app
```

**Creates**:
- `apps/recipe-app/src/` with code structure
- `apps/recipe-app/tests/` with test structure
- `apps/recipe-app/context/` with templates
- `apps/recipe-app/package.json` and configs
- `apps/recipe-app/.git/` for version control

### Step 4: Implement Features

```bash
# Build features for this app
/implement-feature recipe-app user-authentication
```

**Updates**:
- `apps/recipe-app/src/` with code
- `apps/recipe-app/tests/` with tests
- `apps/recipe-app/context/` with documentation

---

## Updated Commands

All commands now require an **app name** argument:

### App Planning

```bash
# Old (root-level APP_PLAN.md)
@app-planner I want to build an app

# New (app-specific)
@app-planner --app recipe-app I want to build a recipe app
```

### Spec Creation

```bash
# Old (root specs/)
@spec-batch-processor

# New (app-specific specs/)
@spec-batch-processor --app recipe-app
```

### Environment Setup

```bash
# Old (single app)
/setup-environment

# New (specify app)
/setup-environment recipe-app
```

### Implementation

```bash
# Old (root context/)
/implement-feature user-auth

# New (app-specific)
/implement-feature recipe-app user-auth
```

### Prime Command

```bash
# Lists all apps and their status
/prime

# Analyze specific app
/prime recipe-app
```

---

## Multi-App Prime Output

When you run `/prime` at the root, it shows all apps:

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 MULTI-APP REPOSITORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Found 3 applications in apps/:

1. 📱 recipe-app
   Status: ✅ Environment set up, 🔨 Implementation in progress
   Specs: ✅ 5/5 complete
   Implementation: 🔨 2/5 features complete (40%)
   Tech Stack: TypeScript, React, PostgreSQL
   
2. 🌐 mobile-app
   Status: ✅ Specs complete, ⏳ Environment needed
   Specs: ✅ 7/7 complete
   Implementation: ⏳ Not started
   Tech Stack: React Native, Firebase
   
3. 🔧 api-server
   Status: 📝 Planning complete, ⏳ Specs needed
   APP_PLAN: ✅ Created
   Specs: ⏳ 0/8 created
   
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For recipe-app:
  /implement-feature recipe-app recipe-browsing

For mobile-app:
  /setup-environment mobile-app

For api-server:
  @spec-batch-processor --app api-server

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Use: /prime [app-name] for detailed app analysis
```

---

## Git Strategy

### Option 1: Root Git + App Submodules

**Root repo tracks**:
- `.claude/` (tooling)
- `kiro/` (methodology)
- `docs/` (documentation)
- `.gitmodules` (app references)

**Each app is a submodule**:
```bash
cd apps/recipe-app
git init
git remote add origin git@github.com:yourorg/recipe-app.git

cd ../..
git submodule add git@github.com:yourorg/recipe-app.git apps/recipe-app
```

### Option 2: Root Git with Ignored Apps

**Root .gitignore**:
```
apps/*/
!apps/README.md
```

**Each app is independent**:
```bash
cd apps/recipe-app
git init
git remote add origin git@github.com:yourorg/recipe-app.git
git push -u origin main
```

### Option 3: Monorepo with Subtree Deployment

**Root git tracks everything**:
- All apps in single repo
- Use `git subtree` to deploy individual apps

```bash
# Deploy recipe-app to separate repo
git subtree push --prefix apps/recipe-app recipe-app-remote main
```

---

## Benefits

### 1. **True Isolation**
- Each app evolves independently
- No cross-app dependencies
- Independent versioning and deployment

### 2. **Parallel Development**
- Work on multiple apps simultaneously
- Different tech stacks per app
- Different teams per app

### 3. **Flexible Deployment**
- Deploy apps separately
- Move apps to different repos easily
- Share apps as submodules

### 4. **Shared Best Practices**
- All apps use same spec-driven methodology
- All apps benefit from improved tooling
- Consistent development patterns

### 5. **Easy Onboarding**
- Template provides structure
- New apps start with best practices
- Documentation applies to all apps

---

## Migration from Old Structure

If you have existing root-level files:

### Migrate APP_PLAN.md

```bash
# Old location
APP_PLAN.md

# New location
mkdir -p apps/my-app
mv APP_PLAN.md apps/my-app/
```

### Migrate specs/

```bash
# Old location
specs/

# New location
mv specs/ apps/my-app/
```

### Migrate context/

```bash
# Old location
context/

# New location
mv context/ apps/my-app/
```

### Migrate application code

```bash
# If you had code directly in apps/my-app/
cd apps/my-app
mkdir specs context
# Move specs and context as above
```

---

## Creating a New App

### Complete Flow

```bash
# 1. Create app directory
mkdir -p apps/new-app
cd apps/new-app

# 2. Initialize git
git init

# 3. Plan the app
@app-planner --app new-app I want to build [description]
→ Creates: apps/new-app/APP_PLAN.md

# 4. Create specs
@spec-batch-processor --app new-app
→ Creates: apps/new-app/specs/

# 5. Setup environment
/setup-environment new-app
→ Creates: apps/new-app/src/, tests/, context/, configs

# 6. Implement features
/implement-feature new-app feature-name
→ Builds: apps/new-app/src/ with code

# 7. Commit and deploy
git add .
git commit -m "Initial implementation"
git remote add origin [your-repo]
git push -u origin main
```

---

## Best Practices

### Naming Conventions

**App directories**:
- Use kebab-case: `recipe-app`, `mobile-app`, `api-server`
- Descriptive and clear
- Match intended deployment names

**Within each app**:
- `APP_PLAN.md` - Always uppercase
- `specs/` - Lowercase directory
- `context/` - Lowercase directory
- `src/` - Lowercase directory

### Directory Structure

**Always include**:
- `APP_PLAN.md` - App planning document
- `specs/` - All specifications
- `context/` - Implementation documentation
- `src/` - Source code
- `tests/` - Test files
- `README.md` - App-specific documentation

### Git Workflow

**Per app**:
1. Initialize git after planning
2. Commit after each major phase
3. Use meaningful commit messages
4. Tag releases for deployment

### Documentation

**Each app should have**:
- `README.md` - Setup and usage
- `context/architecture.md` - Technical architecture
- `specs/` - Complete specifications
- `CHANGELOG.md` - Version history (optional)

---

## Summary

**Multi-app architecture**:
- ✅ Each app is completely isolated
- ✅ Own specs/, context/, git repository
- ✅ Shared Claude Code tooling
- ✅ Parallel development supported
- ✅ Independent deployment
- ✅ Flexible git strategies

**Commands updated to support**:
- App-specific planning
- App-specific spec creation
- App-specific environment setup
- App-specific implementation
- Multi-app status with `/prime`

**Perfect for**:
- Multiple products in one organization
- Microservices architecture
- Experimenting with different tech stacks
- Teams working on separate apps

**The template now scales from 1 to N applications!** 🚀


