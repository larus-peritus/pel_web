---
description: Initialize development environment from specs. Creates apps/[app-name]/ with proper tech stack, testing, CI/CD. Use after specs are complete, before implementation starts.
argument-hint: "[app-name]"
allowed-tools: Read, Write, Edit, Bash, Delegate
---

# Setup Environment Command

Automates development environment initialization from completed specifications.

## Purpose

Transform `APP_PLAN.md` and design specs → Fully configured development environment in `apps/[app-name]/`.

## Variables

- `APP_NAME`: $ARGUMENTS[0] (Optional: app name, defaults to extracting from APP_PLAN.md)

## Instructions

- Use after all specs are complete (Requirements, Design, Tasks)
- Use before starting implementation
- Reads APP_PLAN.md for app details
- Reads design specs for tech stack
- Creates complete project structure with all tooling
- Delegates to environment-setup-agent

## Usage

```bash
# Auto-detect app name from APP_PLAN.md
/setup-environment

# Specify app name
/setup-environment my-awesome-app
```

## Workflow

1. **Read APP_PLAN.md**: Extract app name and overview
2. **Read Design Specs**: Extract tech stack decisions
3. **Delegate to Agent**: Let environment-setup-agent handle setup
4. **Verify Setup**: Ensure everything works
5. **Report**: Show what was created and next steps

## Expected Output

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 ENVIRONMENT SETUP INITIATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reading specifications...
✅ APP_PLAN.md found
✅ Design specs found (3 features)

App Name: [my-app]
Tech Stack: TypeScript, Node.js, React, PostgreSQL
Target: apps/my-app/

Delegating to @environment-setup-agent...

[Agent performs setup...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ENVIRONMENT SETUP COMPLETE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Created:
- apps/my-app/ directory structure
- Package configuration (package.json)
- TypeScript setup (tsconfig.json)
- Testing framework (Jest)
- Linting (ESLint + Prettier)
- CI/CD (GitHub Actions)
- Documentation (README.md)

Tests: ✅ Passing (1/1)
Build: ✅ Working
Lint: ✅ Configured

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Start implementing features:

/implement-feature user-authentication

or

@implementation-coordinator user-authentication 3

Ready to build! 🎉
```

## When to Use

**Use `/setup-environment` when**:
- ✅ All specs are complete (Requirements, Design, Tasks)
- ✅ Haven't created `apps/[app-name]/` yet
- ✅ Ready to start coding
- ✅ Need proper project structure and tooling

**Don't use if**:
- Project already initialized (use `/update-context` instead)
- Specs not complete (finish specs first)
- Different environment needed (customize setup-agent instead)

## Integration with Workflow

**Complete Development Flow**:
```bash
# 1. Plan app
@app-planner I want to build a recipe app

# 2. Create specs
@spec-batch-processor

# 3. Setup environment ✨
/setup-environment

# 4. Implement features
/implement-feature user-authentication
/implement-feature recipe-creation
```

## What Gets Created

### Directory Structure
```
apps/[app-name]/
├── src/
│   ├── index.ts          ← Entry point
│   ├── components/       ← Components (if web app)
│   ├── services/         ← Business logic
│   ├── models/           ← Data models
│   └── utils/            ← Utilities
├── tests/
│   ├── unit/             ← Unit tests
│   └── integration/      ← Integration tests
├── docs/                 ← App documentation
├── .github/workflows/    ← CI/CD
├── package.json          ← Dependencies
├── tsconfig.json         ← TypeScript config
├── jest.config.js        ← Testing config
├── .eslintrc.json        ← Linting rules
├── .prettierrc           ← Formatting rules
├── .gitignore            ← Git ignores
├── .env.example          ← Environment template
└── README.md             ← Documentation
```

### Configuration Files

**All configured**:
- Package manager (npm/pip/go)
- Type checking (TypeScript/mypy)
- Testing framework (Jest/pytest/Go testing)
- Linting (ESLint/pylint/golangci-lint)
- Formatting (Prettier/black/gofmt)
- CI/CD (GitHub Actions)

### Documentation

**Created automatically**:
- `apps/[app-name]/README.md` - Project documentation
- `context/architecture.md` - Updated with tech stack
- `context/IMPLEMENTATION_STATUS.md` - Setup logged

## Error Handling

**If APP_PLAN.md not found**:
```
❌ Error: APP_PLAN.md not found

Please create an app plan first:
@app-planner I want to build [your app idea]
```

**If directory already exists**:
```
⚠️ Warning: apps/[app-name]/ already exists

Options:
A) Use different app name: /setup-environment [different-name]
B) Update existing setup: /update-context
C) Remove and recreate (destructive)
```

**If specs incomplete**:
```
⚠️ Warning: Some specs are incomplete

Found specs:
✅ user-authentication (complete)
⏳ recipe-creation (missing tasks)
⏳ recipe-browsing (not started)

Please complete all specs before setting up environment:
@spec-batch-processor
```

## Tech Stack Detection

**Auto-detects from design specs**:

| Indicators | Tech Stack |
|------------|------------|
| "React", "Vue", "Angular" | Web frontend framework |
| "Express", "FastAPI", "Gin" | Backend framework |
| "TypeScript", "Python", "Go" | Primary language |
| "PostgreSQL", "MongoDB" | Database |
| "Jest", "pytest", "Go testing" | Testing framework |

**Configures accordingly**:
- Node.js → package.json, npm, tsconfig.json
- Python → pyproject.toml, venv, pytest
- Go → go.mod, go test, golangci-lint

## Verification Steps

**Command verifies**:
1. ✅ Directory created successfully
2. ✅ Dependencies installed
3. ✅ Tests can run and pass
4. ✅ Linter works
5. ✅ Build completes
6. ✅ CI/CD configured

**If any fail, reports issue and suggests fix.**

## Best Practices

**Before Running**:
- ✅ Complete all specs (Req, Design, Tasks)
- ✅ Review design specs for tech stack accuracy
- ✅ Decide on app name

**After Running**:
- ✅ Verify setup with `cd apps/[app]/ && npm test`
- ✅ Review created README
- ✅ Check context/architecture.md is updated
- ✅ Ready to implement features!

## Example Scenarios

### Scenario 1: TypeScript Web App

```bash
$ /setup-environment

Reading specs...
Detected: TypeScript + React + PostgreSQL

Creating environment...
✅ apps/recipe-app/ created
✅ package.json with React, TypeScript
✅ Vite configured
✅ Jest + Testing Library
✅ Tailwind CSS
✅ ESLint + Prettier
✅ GitHub Actions CI

Ready to implement!
```

### Scenario 2: Python API

```bash
$ /setup-environment api-server

Reading specs...
Detected: Python + FastAPI + MongoDB

Creating environment...
✅ apps/api-server/ created
✅ pyproject.toml with FastAPI
✅ Virtual environment
✅ pytest configured
✅ black + mypy
✅ Docker configuration
✅ GitHub Actions CI

Ready to implement!
```

### Scenario 3: Go CLI Tool

```bash
$ /setup-environment cli-tool

Reading specs...
Detected: Go CLI application

Creating environment...
✅ apps/cli-tool/ created
✅ go.mod initialized
✅ cmd/ and pkg/ structure
✅ Go testing
✅ golangci-lint
✅ Makefile
✅ GitHub Actions CI

Ready to implement!
```

## Time Estimate

**Typical setup time**: 2-5 minutes

- Reading specs: ~30 seconds
- Creating structure: ~30 seconds
- Installing dependencies: ~1-3 minutes
- Configuration: ~30 seconds
- Verification: ~30 seconds

**Much faster than manual setup!** (which can take 30-60 minutes)

## Integration Points

### With Spec Creation
- Reads APP_PLAN.md for app details
- Reads design specs for tech stack
- Uses architecture.md.template for guidance

### With Implementation
- Creates structure for builder agents
- Sets up testing for automatic test creation
- Prepares context for documentation

### With Context
- Updates context/architecture.md
- Creates/updates context/IMPLEMENTATION_STATUS.md
- Logs setup completion

## Summary

**`/setup-environment` command**:
- Bridges specs → code
- Creates production-ready environment
- Configures all tooling automatically
- Saves 30-60 minutes of manual setup
- Ensures best practices from day 1

**The foundation for systematic feature development!** 🚀


