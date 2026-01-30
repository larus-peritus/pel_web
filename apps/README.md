# Application Code Directory

This is where **all application code** for your projects lives.

## 📁 Structure

Each application should have its own directory:

```
apps/
├── my-web-app/              ← First app
│   ├── src/
│   ├── tests/
│   ├── package.json
│   └── README.md
│
├── my-api-service/          ← Second app
│   ├── src/
│   ├── tests/
│   ├── requirements.txt
│   └── README.md
│
└── my-mobile-app/           ← Third app
    ├── src/
    ├── tests/
    ├── pubspec.yaml
    └── README.md
```

## 🎯 Important Principles

### ✅ Application Code Boundary

**Application code goes here:**
- `apps/[your-app-name]/` - All your app code

**Process management stays outside:**
- `.claude/` - Claude Code configuration
- `kiro/` - Spec-driven development methodology
- `specs/` - Generated specifications
- `docs/` - Workflow guides
- `templates/` - Spec templates
- `examples/` - Example workflows

**Why this matters:**
- When Claude creates specs, it only analyzes code in `apps/`
- Process management folders are ignored during spec creation
- This keeps specs focused on YOUR code, not the framework

### ✅ One App Per Directory

Each app should be self-contained:

```
apps/my-app/
├── src/                     ← Source code
├── tests/                   ← Test files
├── docs/                    ← App-specific docs
├── config/                  ← App config files
├── package.json             ← Dependencies
├── .env.example             ← Environment template
└── README.md                ← App documentation
```

### ✅ Multiple Apps Supported

You can have multiple applications in this repository:

- **Monorepo**: Multiple related apps
- **Microservices**: Each service in its own directory
- **Platform**: Web app + mobile app + API
- **Experimentation**: Prototype vs production

## 🚀 Getting Started

### Starting Fresh (No Code Yet)

1. **Plan your app:**
   ```bash
   @app-planner I want to build [your app idea]
   ```

2. **Create all specs:**
   ```bash
   @spec-batch-processor
   # or
   /batch-spec parallel
   ```

3. **Create your app directory:**
   ```bash
   mkdir apps/my-app-name
   cd apps/my-app-name
   ```

4. **Initialize your project:**
   ```bash
   # For Node.js
   npm init

   # For Python
   python -m venv venv
   pip install -r requirements.txt

   # For your framework
   [framework-specific init]
   ```

5. **Implement features following specs:**
   - Read `specs/[feature-name]-tasks.md`
   - Implement in `apps/my-app-name/src/`
   - Test as you go

### Adding to Existing Code

1. **Prime the repository:**
   ```bash
   /prime
   ```

2. **Create spec for new feature:**
   ```bash
   @spec-orchestrator create spec for [feature-name]
   ```

3. **Implement in your app:**
   - Follow `specs/[feature-name]-tasks.md`
   - Add to `apps/[your-app]/src/`

## 📝 Naming Conventions

### App Directory Names

Use lowercase with hyphens:
- ✅ `my-web-app`
- ✅ `user-api-service`
- ✅ `mobile-ios-app`
- ❌ `MyWebApp`
- ❌ `user_api_service`

### Internal Structure

Follow your language/framework conventions:
- **JavaScript/TypeScript**: `src/`, `tests/`, `dist/`
- **Python**: `src/`, `tests/`, `venv/`
- **Go**: `cmd/`, `pkg/`, `internal/`
- **Java**: `src/main/`, `src/test/`

## 🔧 Configuration Files

### App-Level Configs (Inside `apps/[app-name]/`)

- `.env.example` - Environment variables template
- `package.json` / `requirements.txt` / `go.mod` - Dependencies
- `tsconfig.json` / `pyproject.toml` - Language config
- `.eslintrc` / `.prettierrc` - Code style
- `jest.config.js` / `pytest.ini` - Testing config

### Repository-Level Configs (Outside `apps/`)

- `.gitignore` - Git exclusions
- `.cursorignore` - Cursor IDE exclusions
- `.claude/settings.json` - Claude Code settings

## 🧪 Testing

Each app should have its own tests:

```
apps/my-app/
├── src/
│   ├── feature-a.ts
│   └── feature-b.ts
└── tests/
    ├── feature-a.test.ts
    └── feature-b.test.ts
```

Run tests from the app directory:
```bash
cd apps/my-app
npm test
# or
pytest
# or your test command
```

## 📊 Spec-Code Relationship

Specs in `specs/` directory map to code in `apps/`:

```
specs/
├── user-authentication-requirements.md
├── user-authentication-design.md
└── user-authentication-tasks.md
            ↓
            Implementation
            ↓
apps/my-app/src/
├── auth/
│   ├── AuthService.ts
│   ├── UserModel.ts
│   └── TokenManager.ts
└── tests/
    └── auth/
        └── AuthService.test.ts
```

## 🚨 Common Mistakes to Avoid

### ❌ Don't Put App Code Outside `apps/`

**Wrong:**
```
src/              ← App code in root
tests/
package.json
```

**Correct:**
```
apps/my-app/      ← App code in apps/
  src/
  tests/
  package.json
```

### ❌ Don't Mix Multiple Apps in One Directory

**Wrong:**
```
apps/everything/
  web-frontend/
  mobile-app/
  api-service/
```

**Correct:**
```
apps/
  web-frontend/
  mobile-app/
  api-service/
```

### ❌ Don't Ignore Specs When Implementing

**Wrong:**
```
1. Create spec
2. Ignore spec
3. Code whatever
```

**Correct:**
```
1. Create spec
2. Read specs/[feature]-tasks.md
3. Implement following task breakdown
4. Test following specs/[feature]-requirements.md
```

## 🎓 Examples

### Single Web App

```
apps/
└── task-manager/
    ├── src/
    │   ├── components/
    │   ├── services/
    │   └── models/
    ├── tests/
    ├── package.json
    └── README.md
```

### Microservices Platform

```
apps/
├── user-service/
│   └── ...
├── product-service/
│   └── ...
├── order-service/
│   └── ...
└── notification-service/
    └── ...
```

### Web + Mobile

```
apps/
├── web-app/
│   ├── src/
│   └── package.json
├── mobile-ios/
│   └── src/
└── mobile-android/
    └── src/
```

## 💡 Tips

### Use Worktrees for Feature Isolation (Optional)

Create isolated environments for feature development:

```bash
# Create worktree for feature
/create_worktree feature-user-profiles

# Your app is now in:
trees/feature-user-profiles/apps/my-app/

# Develop in isolation with unique ports
# Merge back when complete
```

### Keep App READMEs Updated

Each app should have its own README:

```markdown
# My App Name

## What it does
[Description]

## Setup
[Installation steps]

## Running
[How to run]

## Testing
[How to test]

## Specs
See specs/ directory in repository root:
- [requirements](../../specs/feature-requirements.md)
- [design](../../specs/feature-design.md)
- [tasks](../../specs/feature-tasks.md)
```

## 📚 Related Documentation

- [Repository README](../README.md) - Overall repository guide
- [Spec-Driven Development](../SPEC_DRIVEN_DEVELOPMENT.md) - Full methodology
- [Quick Reference](../docs/QUICK_REFERENCE.md) - Command finder
- [Workflow Patterns](../docs/workflow-patterns.md) - Execution examples

---

**Ready to build?** Start with `/prime` to get personalized guidance! 🚀


