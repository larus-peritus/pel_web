# Environment Setup Guide

**Complete guide to initializing development environments from specifications.**

---

## Overview

The **Environment Setup Agent** bridges the gap between completed specifications and active development. It transforms design decisions into a fully configured, production-ready development environment.

## When to Use

**Perfect timing**:
- ✅ All specs are complete (Requirements, Design, Tasks)
- ✅ Tech stack decisions finalized in design specs
- ✅ Ready to start coding
- ✅ `apps/[app-name]/` doesn't exist yet

**Not the right time**:
- ❌ Specs incomplete (finish specs first)
- ❌ Project already initialized (use `/update-context` instead)
- ❌ Still deciding on tech stack (update design specs first)

---

## What Gets Created

### Complete Project Structure

```
apps/[app-name]/
├── src/                      ← Source code
│   ├── index.ts             ← Entry point
│   ├── components/          ← UI components (if web app)
│   ├── services/            ← Business logic
│   ├── models/              ← Data models
│   └── utils/               ← Utility functions
├── tests/                   ← Test files
│   ├── unit/                ← Unit tests
│   ├── integration/         ← Integration tests
│   └── example.test.ts      ← Initial test (passing)
├── docs/                    ← App-specific documentation
├── .github/workflows/       ← CI/CD pipelines
│   └── ci.yml              ← GitHub Actions
├── package.json             ← Dependencies & scripts
├── tsconfig.json            ← TypeScript configuration
├── jest.config.js           ← Testing configuration
├── .eslintrc.json           ← Linting rules
├── .prettierrc              ← Code formatting
├── .gitignore               ← Git ignore patterns
├── .env.example             ← Environment variables template
└── README.md                ← Project documentation
```

### All Tooling Configured

**Development Tools**:
- ✅ Package manager (npm/pip/go)
- ✅ Type checking (TypeScript/mypy/Go types)
- ✅ Testing framework (Jest/pytest/Go testing)
- ✅ Linting (ESLint/pylint/golangci-lint)
- ✅ Formatting (Prettier/black/gofmt)

**CI/CD**:
- ✅ GitHub Actions workflow
- ✅ Automated testing on push/PR
- ✅ Lint checking
- ✅ Build verification

**Documentation**:
- ✅ Project README with setup instructions
- ✅ Architecture documentation updated
- ✅ Implementation status initialized

---

## Usage

### Command

```bash
# Auto-detect app name from APP_PLAN.md
/setup-environment

# Specify app name explicitly
/setup-environment my-awesome-app
```

### Agent

```bash
# Direct agent invocation
@environment-setup-agent set up environment for my app
```

---

## Complete Workflow Example

### Step-by-Step

**1. Create App Plan**
```bash
@app-planner I want to build a recipe sharing app
```
→ Creates `APP_PLAN.md` with features

**2. Generate Specs**
```bash
@spec-batch-processor
```
→ Creates specs for all features (~15-20 min)

**3. Setup Environment** ✨ NEW!
```bash
/setup-environment
```
→ Creates development environment (~2-5 min)

**Output**:
```
✅ Environment setup complete!

Created: apps/recipe-app/
Tech Stack: TypeScript, React, PostgreSQL
Tests: ✅ Passing
Build: ✅ Working

Ready to implement features!
```

**4. Implement Features**
```bash
/implement-feature user-authentication
```
→ Builds the feature (~30-50 min)

---

## Tech Stack Support

### Node.js / TypeScript

**What's created**:
- `package.json` with dependencies
- `tsconfig.json` with strict mode
- Jest testing framework
- ESLint + Prettier
- npm scripts for dev/build/test

**Example specs indicators**:
- "TypeScript", "Node.js", "React", "Express"
- "npm", "yarn", "pnpm"

**Directory structure**:
```
src/
├── components/  ← React components
├── services/    ← Business logic
├── types/       ← TypeScript types
└── utils/       ← Utilities
```

### Python

**What's created**:
- `pyproject.toml` or `requirements.txt`
- Virtual environment (venv)
- pytest configuration
- black + mypy + pylint
- Python project structure

**Example specs indicators**:
- "Python", "FastAPI", "Flask", "Django"
- "pip", "poetry", "conda"

**Directory structure**:
```
src/
├── api/         ← API endpoints
├── models/      ← Data models
├── services/    ← Business logic
└── utils/       ← Utilities
```

### Go

**What's created**:
- `go.mod` module definition
- Standard Go project layout
- Testing with Go's built-in tools
- golangci-lint configuration
- Makefile for common tasks

**Example specs indicators**:
- "Go", "Golang", "Gin", "Echo"
- "go mod"

**Directory structure**:
```
cmd/
└── [app]/
    └── main.go
pkg/
└── ...
internal/
└── ...
```

---

## What Happens During Setup

### Phase 1: Specification Analysis

**Reads**:
1. `APP_PLAN.md` - App name, overview, platform
2. `specs/*-design.md` - Tech stack decisions
3. `context/architecture.md.template` - Structure guidance

**Extracts**:
- Primary language (TypeScript/Python/Go/Rust)
- Framework (React/Express/FastAPI/Gin)
- Database (PostgreSQL/MongoDB/SQLite)
- Testing framework
- Build tools

### Phase 2: Directory Creation

**Creates structure matching tech stack**:
- Web app → components/, pages/, hooks/
- API → routes/, controllers/, middleware/
- CLI → cmd/, pkg/, internal/

**Always includes**:
- src/ - Source code
- tests/ - Test files
- docs/ - Documentation

### Phase 3: Project Initialization

**Node.js/TypeScript**:
```bash
npm init -y
npm install typescript @types/node
npm install --save-dev jest ts-jest
npm install --save-dev eslint prettier
```

**Python**:
```bash
python -m venv venv
pip install pytest black mypy
```

**Go**:
```bash
go mod init [module-name]
# Go has built-in testing
```

### Phase 4: Configuration

**Creates all config files**:
- Language config (tsconfig.json, pyproject.toml, go.mod)
- Test config (jest.config.js, pytest.ini)
- Linting (.eslintrc.json, .pylintrc, golangci-lint)
- Formatting (.prettierrc, pyproject.toml)
- CI/CD (.github/workflows/ci.yml)

### Phase 5: Initial Files

**Entry point**:
```typescript
// src/index.ts
console.log('[App Name] initialized');
export default {};
```

**Initial test**:
```typescript
// tests/example.test.ts
test('should initialize successfully', () => {
  expect(true).toBe(true);
});
```

### Phase 6: Documentation

**Creates README**:
- Setup instructions
- Development commands
- Testing guide
- Project structure
- Links to specs

**Updates context**:
- `context/architecture.md` - Tech stack details
- `context/IMPLEMENTATION_STATUS.md` - Setup logged

### Phase 7: Verification

**Runs checks**:
- ✅ Dependencies installed
- ✅ Tests pass
- ✅ Linter works
- ✅ Build succeeds
- ✅ All files created

---

## Configuration Examples

### package.json Scripts

```json
{
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "type-check": "tsc --noEmit"
  }
}
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

### Jest Configuration

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
};
```

### GitHub Actions CI

```yaml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
        working-directory: apps/[app-name]
      - run: npm test
        working-directory: apps/[app-name]
```

---

## Best Practices

### Before Setup

**Verify specs are complete**:
```bash
# Check specs exist
ls specs/

# Verify design specs have tech stack
grep -r "TypeScript\|Python\|Go" specs/*-design.md
```

**Review tech stack decisions**:
- Language choice appropriate?
- Framework matches requirements?
- Database supports use case?

### During Setup

**Let the agent work**:
- Don't interrupt the process
- Agent handles all configuration
- Verification runs automatically

### After Setup

**Verify everything works**:
```bash
cd apps/[app-name]

# Run tests
npm test  # Should pass

# Try linting
npm run lint  # Should pass

# Try building
npm run build  # Should succeed
```

**Review documentation**:
```bash
# Read the README
cat apps/[app-name]/README.md

# Check architecture
cat context/architecture.md
```

**Ready to implement**:
```bash
# Start with first feature
/implement-feature [feature-name]
```

---

## Troubleshooting

### Issue: Dependencies Won't Install

**Symptoms**:
- npm/pip install fails
- Version conflicts
- Network errors

**Solutions**:
```bash
# Clear cache
npm cache clean --force  # or pip cache purge

# Check Node.js version
node --version  # Should be 18+ for TypeScript

# Try again
cd apps/[app-name] && npm install
```

### Issue: Tests Won't Run

**Symptoms**:
- `npm test` fails
- Can't find jest
- Import errors

**Solutions**:
```bash
# Reinstall dev dependencies
npm install --save-dev jest ts-jest @types/jest

# Check jest.config.js exists
ls jest.config.js

# Run with verbose
npm test -- --verbose
```

### Issue: Build Fails

**Symptoms**:
- TypeScript errors
- Module not found
- Config issues

**Solutions**:
```bash
# Check tsconfig.json
cat tsconfig.json

# Verify all files in src/
ls -la src/

# Try type check only
npm run type-check
```

---

## Integration with Development Flow

### Position in Workflow

```
1. Planning       → @app-planner
2. Spec Creation  → @spec-batch-processor
3. Environment ✨ → /setup-environment  ← You are here
4. Implementation → @implementation-coordinator
5. Testing        → Automated in implementation
6. Deployment     → CI/CD pipeline ready
```

### Enables Implementation

**Without environment setup**:
- ❌ No place to put code
- ❌ No testing framework
- ❌ No linting
- ❌ Manual configuration needed

**With environment setup**:
- ✅ Structure ready
- ✅ Tests configured
- ✅ Linting enabled
- ✅ CI/CD working
- ✅ Ready for builder agents

### Maintains Context

**Updates**:
- `context/architecture.md` - Tech stack documented
- `context/IMPLEMENTATION_STATUS.md` - Environment setup logged
- `context/setup.log` - Setup events tracked

**Builder agents read this** to understand the environment!

---

## Time Estimates

| Activity | Duration |
|----------|----------|
| Reading specs | ~30 seconds |
| Creating structure | ~30 seconds |
| Installing dependencies | ~1-3 minutes |
| Configuration | ~30 seconds |
| Verification | ~30 seconds |
| **Total** | **~2-5 minutes** |

**Compare to manual setup**: 30-60 minutes

**Time saved**: ~25-55 minutes per project!

---

## Summary

**Environment setup**:
- Transforms specs into working development environment
- Configures all tooling automatically
- Creates production-ready structure
- Saves 30-60 minutes of setup time
- Ensures best practices from day 1
- Enables immediate feature implementation

**The bridge from planning to building!** 🚀

---

## Quick Reference

### Commands
```bash
# Setup environment
/setup-environment [app-name]

# Verify setup
cd apps/[app-name] && npm test

# Start developing
/implement-feature [feature-name]
```

### Files Created
- Project structure (src/, tests/, docs/)
- Configuration (package.json, tsconfig.json, jest.config.js)
- Tooling (linting, formatting, CI/CD)
- Documentation (README.md, architecture.md)

### Next Steps
After environment setup:
1. ✅ Verify tests pass
2. ✅ Review README
3. ✅ Check architecture.md
4. ✅ Start implementing features!

**Ready to build!** 🎉


