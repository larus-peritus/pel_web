---
name: Environment Setup Guide
description: Expert guidance for initializing development environments based on specs. Use when setting up a new project, initializing apps/ directory, configuring tech stack, or preparing for implementation.
allowed-tools: Read, Write, Bash
---

# Environment Setup Guide

Expert guidance for transforming specifications into a fully configured, ready-to-code development environment.

## Purpose

You are an expert DevOps engineer and project bootstrapper. Your goal is to take completed specifications and create a properly configured development environment in the `apps/` directory, with all necessary tooling, frameworks, and best practices in place.

## When to Use

Use this skill when:
- Specs are complete (Requirements, Design, Tasks)
- Ready to start implementation
- Need to initialize `apps/[app-name]/` directory
- Setting up tech stack from design specs
- Configuring development tools and CI/CD

## Core Principles

### 1. Spec-Driven Setup

**Always start by reading specs**:
```
Read: APP_PLAN.md (for app name and overview)
Read: specs/[feature]-design.md (for tech stack decisions)
Read: context/architecture.md.template (for structure guidance)
```

Extract:
- Application name
- Primary language/framework
- Database choices
- Testing strategy
- Deployment target

### 2. Best Practices by Default

**Every environment should include**:
- ✅ Proper directory structure
- ✅ Dependency management (package.json, requirements.txt, go.mod)
- ✅ Testing framework configured
- ✅ Linting and formatting tools
- ✅ Git initialization (if not already done)
- ✅ CI/CD configuration
- ✅ Environment variable templates
- ✅ Documentation (README)

### 3. Tech Stack Specific

**Recognize and configure correctly**:
- **Node.js/TypeScript**: package.json, tsconfig.json, jest/vitest, eslint, prettier
- **Python**: pyproject.toml/requirements.txt, pytest, black, mypy
- **Go**: go.mod, testing package, golangci-lint
- **Rust**: Cargo.toml, cargo test, rustfmt, clippy

## Setup Workflow

### Step 1: Read and Understand Specs

**Extract Configuration**:
```markdown
From APP_PLAN.md:
- App Name: [name]
- App Type: [web/mobile/api/cli]
- Platform: [browser/node/mobile/desktop]

From design specs:
- Language: [TypeScript/Python/Go/Rust]
- Framework: [React/Vue/Express/FastAPI/etc]
- Database: [PostgreSQL/MongoDB/SQLite]
- Testing: [Jest/pytest/Go testing]
- Build Tool: [Vite/Webpack/etc]
```

### Step 2: Create Directory Structure

**Standard structure**:
```
apps/[app-name]/
├── src/                    ← Source code
│   ├── index.ts/main.py   ← Entry point
│   ├── components/        ← Components (if applicable)
│   ├── services/          ← Business logic
│   ├── models/            ← Data models
│   └── utils/             ← Utilities
├── tests/                 ← Tests
│   ├── unit/
│   └── integration/
├── docs/                  ← App-specific docs
├── .gitignore            ← Ignore patterns
├── README.md             ← App documentation
└── [config files]        ← Tech-specific configs
```

### Step 3: Initialize Project

**For Node.js/TypeScript**:
```bash
cd apps/[app-name]
npm init -y
npm install --save-dev typescript @types/node
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install --save-dev prettier

# Create tsconfig.json
# Create jest.config.js
# Create .eslintrc.json
# Create .prettierrc
```

**For Python**:
```bash
cd apps/[app-name]
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Create pyproject.toml or requirements.txt
pip install pytest pytest-cov
pip install black mypy pylint

# Create pytest.ini
# Create .pylintrc
```

**For Go**:
```bash
cd apps/[app-name]
go mod init [module-name]

# Go has built-in testing, just create test files
# Add golangci-lint config
```

### Step 4: Create Configuration Files

**TypeScript tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Jest jest.config.js**:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage'
};
```

**Python pytest.ini**:
```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = -v --cov=src --cov-report=html
```

### Step 5: Set Up Testing Framework

**Create initial test**:

```typescript
// tests/example.test.ts
describe('Example Test Suite', () => {
  test('should pass initial test', () => {
    expect(true).toBe(true);
  });
});
```

**Run to verify**:
```bash
npm test  # or pytest, go test, cargo test
```

### Step 6: Initialize Git (if needed)

**If not already initialized**:
```bash
cd apps/[app-name]
git init
git add .
git commit -m "Initial project setup"
```

**Create .gitignore**:
```
# Node.js
node_modules/
dist/
.env
*.log

# Python
__pycache__/
*.pyc
venv/
.pytest_cache/
.coverage

# Go
bin/
*.exe

# IDE
.vscode/
.idea/
*.swp
```

### Step 7: Create CI/CD Configuration

**GitHub Actions (.github/workflows/ci.yml)**:
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
        working-directory: apps/[app-name]
      
      - name: Run linter
        run: npm run lint
        working-directory: apps/[app-name]
      
      - name: Run tests
        run: npm test
        working-directory: apps/[app-name]
```

### Step 8: Create README

**apps/[app-name]/README.md**:
```markdown
# [App Name]

[Brief description from APP_PLAN.md]

## Tech Stack

- Language: [TypeScript/Python/Go]
- Framework: [React/Express/FastAPI]
- Database: [PostgreSQL/MongoDB]
- Testing: [Jest/pytest/Go testing]

## Setup

\`\`\`bash
cd apps/[app-name]
npm install  # or pip install -r requirements.txt
\`\`\`

## Development

\`\`\`bash
npm run dev  # or python main.py, go run main.go
\`\`\`

## Testing

\`\`\`bash
npm test  # or pytest, go test
\`\`\`

## Building

\`\`\`bash
npm run build  # or python -m build, go build
\`\`\`

## Project Structure

See [Project Documentation](../../docs/) for overall architecture.
See [Specs](../../specs/) for requirements and design.

## Implementation Guide

This project follows spec-driven development. Implementation tasks are defined in:
- \`specs/[feature]-tasks.md\` files

Use implementation agents to build features:
\`\`\`bash
/implement-feature [feature-name]
\`\`\`
```

### Step 9: Update Context

**Create/update context/architecture.md**:
```markdown
## Application Structure

\`\`\`
apps/[app-name]/
├── src/              ← Source code
├── tests/            ← Test files
└── docs/             ← App-specific docs
\`\`\`

## Technology Stack

### Runtime
- Language: [TypeScript 5.0]
- Runtime: [Node.js 18]
- Framework: [Express 4.18]

### Database
- Primary: [PostgreSQL 15]
- ORM: [Prisma 5.0]

### Testing
- Framework: [Jest 29]
- Coverage: [>80% target]

### Build & Deploy
- Build: [Vite 4.0]
- CI/CD: [GitHub Actions]
- Deployment: [TBD]

## Development Workflow

1. Specs define what to build
2. Implementation agents build it
3. Tests verify functionality
4. CI/CD deploys automatically
```

### Step 10: Verify Setup

**Run verification checklist**:
```bash
# 1. Directory exists
ls apps/[app-name]

# 2. Dependencies installed
cd apps/[app-name] && npm list  # or pip list, go list

# 3. Tests can run
npm test

# 4. Linter works
npm run lint

# 5. App can start (if applicable)
npm run dev
```

## Tech Stack Patterns

### Web Application (React/TypeScript)

**Key files**:
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Build configuration
- `jest.config.js` - Testing configuration
- `.eslintrc.json` - Linting rules
- `tailwind.config.js` - Styling (if using Tailwind)

**Directory structure**:
```
src/
├── components/    ← React components
├── pages/         ← Page components
├── hooks/         ← Custom hooks
├── services/      ← API services
├── types/         ← TypeScript types
├── utils/         ← Utilities
└── App.tsx        ← Main app component
```

### API Server (Express/TypeScript)

**Key files**:
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config
- `jest.config.js` - Testing
- `.env.example` - Environment variables template

**Directory structure**:
```
src/
├── routes/        ← API routes
├── controllers/   ← Request handlers
├── services/      ← Business logic
├── models/        ← Data models
├── middleware/    ← Express middleware
├── utils/         ← Utilities
└── index.ts       ← Server entry point
```

### Python Application (FastAPI/Flask)

**Key files**:
- `pyproject.toml` or `requirements.txt`
- `pytest.ini` - Testing configuration
- `.env.example` - Environment variables
- `setup.py` or `pyproject.toml` - Package setup

**Directory structure**:
```
src/
├── api/           ← API endpoints
├── models/        ← Data models
├── services/      ← Business logic
├── utils/         ← Utilities
└── main.py        ← Application entry
```

### CLI Application (Go)

**Key files**:
- `go.mod` - Module definition
- `go.sum` - Dependency checksums
- `Makefile` - Build scripts

**Directory structure**:
```
cmd/
└── [app-name]/
    └── main.go    ← Entry point
pkg/
├── commands/      ← CLI commands
├── config/        ← Configuration
└── utils/         ← Utilities
internal/
└── ...            ← Private packages
```

## Common Configurations

### Environment Variables

**Create .env.example**:
```
# Database
DATABASE_URL=postgresql://localhost:5432/myapp
DATABASE_POOL_SIZE=10

# API
API_PORT=3000
API_HOST=localhost

# Authentication
JWT_SECRET=change-me-in-production
SESSION_TIMEOUT=3600

# External Services
STRIPE_API_KEY=sk_test_...
SENDGRID_API_KEY=...

# Development
NODE_ENV=development
LOG_LEVEL=debug
```

### Package Scripts

**package.json scripts**:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "type-check": "tsc --noEmit"
  }
}
```

## Best Practices

### Security

- ✅ Never commit secrets (use .env, add to .gitignore)
- ✅ Use environment variables for configuration
- ✅ Set up dependency vulnerability scanning
- ✅ Configure CORS properly
- ✅ Use HTTPS in production

### Testing

- ✅ Set up testing framework from day 1
- ✅ Aim for >80% code coverage
- ✅ Write unit tests for business logic
- ✅ Write integration tests for APIs
- ✅ Configure CI to run tests automatically

### Code Quality

- ✅ Configure linter and formatter
- ✅ Set up pre-commit hooks
- ✅ Use TypeScript strict mode
- ✅ Document public APIs
- ✅ Follow consistent naming conventions

### Performance

- ✅ Enable tree-shaking in build
- ✅ Use lazy loading where appropriate
- ✅ Configure caching strategies
- ✅ Optimize bundle size
- ✅ Set up performance monitoring

## Troubleshooting

### Issue: Dependencies won't install

**Solution**:
- Check Node.js/Python version compatibility
- Clear cache (`npm cache clean --force`, `pip cache purge`)
- Delete `node_modules`/`venv` and reinstall
- Check for conflicting global packages

### Issue: Tests won't run

**Solution**:
- Verify test framework is installed
- Check configuration file paths
- Ensure test files match naming pattern
- Verify imports/paths are correct

### Issue: Build fails

**Solution**:
- Check TypeScript configuration
- Verify all dependencies are installed
- Look for syntax errors
- Check for missing type definitions

## Integration with Implementation

**After environment setup**:

1. **Context is ready**: `context/architecture.md` documents the tech stack
2. **Structure exists**: `apps/[app-name]/` has proper directories
3. **Tools work**: Testing, linting, building all functional
4. **Ready to build**: Implementation agents can start creating features

**Next steps**:
```bash
# Verify setup
cd apps/[app-name]
npm test  # Should pass initial test

# Start implementation
/implement-feature [feature-name]
```

## Summary

**Environment setup workflow**:
1. Read specs (APP_PLAN, design docs)
2. Extract tech stack decisions
3. Create directory structure
4. Initialize project with proper tools
5. Configure testing, linting, CI/CD
6. Document setup in README and context
7. Verify everything works
8. Ready for implementation!

**The environment bridges specs and code - it's the foundation for systematic feature development.**


