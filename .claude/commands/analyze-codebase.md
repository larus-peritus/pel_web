---
description: Analyze existing code to reverse-engineer specifications. Generates requirements, design, and refactoring tasks from implementation. Use for legacy code, external codebases, or understanding what's already implemented. Multi-app aware.
argument-hint: "[optional: app-name] [optional: quick/deep]"
allowed-tools: Read, Write, Edit, Grep, List, Glob, Bash, Delegate
---

# Analyze Codebase Command

**Reverse-engineer specs from existing code.**

## Purpose

Analyze existing code in `apps/[app-name]/` and generate complete specifications:
- Requirements (what it does)
- Design (how it works)
- Tasks (what's done, what's missing, refactoring needed)

Use this to integrate existing codebases into spec-driven development.

## Usage

```bash
# With work context
/set-context recipe-app
/analyze-codebase

# Explicit app name
/analyze-codebase recipe-app

# With analysis depth
/analyze-codebase recipe-app deep
/analyze-codebase recipe-app quick

# Auto-detect (single app)
/analyze-codebase
```

## Arguments

- `[app-name]` (optional): App to analyze - uses work context if not provided
- `[depth]` (optional): `quick` (30 min) or `deep` (2-3 hr) - default: quick

## App Name Resolution

**Priority order**:
1. Explicit app name in arguments
2. Work context from `.claude-work-context.json`
3. Single app auto-detect
4. Ask user

## Analysis Depths

### Quick Analysis (~30 minutes)

**Analyzes**:
- Directory structure
- Main entry points
- Key features (from routes/components)
- Critical issues (security, bugs)
- High-level architecture

**Generates**:
- Feature list with status
- Basic requirements
- High-level design
- Critical refactoring tasks

**Best for**:
- Initial assessment
- Quick understanding
- Prioritizing work

### Deep Analysis (~2-3 hours)

**Analyzes**:
- All source files
- Test coverage (detailed)
- Architecture patterns
- Data flow
- Error handling
- Security audit
- Performance analysis
- Code quality
- Technical debt

**Generates**:
- Complete requirements specs
- Detailed design docs
- Comprehensive refactoring plan
- Module documentation
- Implementation status

**Best for**:
- Complete documentation
- Major refactoring
- Legacy system integration

## Workflow

### Step 1: Determine App

```bash
# Check work context
if [ -f .claude-work-context.json ]; then
  APP_NAME=$(jq -r '.current_app' .claude-work-context.json)
elif [ $# -gt 0 ]; then
  APP_NAME=$1
elif [ $(ls -1 apps/ | wc -l) -eq 1 ]; then
  APP_NAME=$(ls -1 apps/)
else
  # Ask user
  echo "Available apps:" && ls -1 apps/
fi
```

### Step 2: Delegate to Code Analyzer

```
Delegate to @code-analyzer:
"Analyze the codebase in apps/[app-name]/ and generate complete specs.

App: [app-name]
Depth: [quick/deep]

Generate:
- Requirements specs (reverse-engineered)
- Design docs (as-implemented)
- Refactoring & completion tasks
- Implementation status

Save all specs to: apps/[app-name]/specs/
Update context: apps/[app-name]/context/
"
```

### Step 3: Report Results

Agent handles full analysis and reporting.

## What Gets Generated

### Specs Created

```
apps/[app-name]/specs/
├── SPEC_CREATION_STATUS.md       ← Overview of all specs
├── [feature]-requirements.md      ← What feature does
├── [feature]-design.md            ← How feature works
├── [feature]-tasks.md             ← Refactoring/completion tasks
└── [repeat for each feature]
```

### Context Updated

```
apps/[app-name]/context/
├── architecture.md                ← System architecture (as-is)
├── IMPLEMENTATION_STATUS.md       ← Feature status & metrics
├── features/
│   └── [feature].md              ← Feature documentation
└── modules/
    └── [Module].md               ← Module documentation
```

## Expected Output

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 CODEBASE ANALYSIS: recipe-app
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

App: recipe-app
📍 Using work context
Depth: Quick Analysis

Analyzing:
- Directory structure... ✅
- Entry points... ✅
- Features... ✅ (3 found)
- Architecture... ✅
- Tests... ✅ (58% coverage)
- Issues... ✅ (4 critical)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 ANALYSIS COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Features Identified: 3 implemented, 1 planned
Files Analyzed: 71 source, 23 test
Test Coverage: 58%
Security: ⚠️ 4 critical issues

Generated Specs:
📄 apps/recipe-app/specs/user-authentication-requirements.md
📄 apps/recipe-app/specs/user-authentication-design.md
📄 apps/recipe-app/specs/user-authentication-tasks.md
📄 apps/recipe-app/specs/recipe-management-requirements.md
📄 apps/recipe-app/specs/recipe-management-design.md
📄 apps/recipe-app/specs/recipe-management-tasks.md
[...]

Context Updated:
📄 apps/recipe-app/context/IMPLEMENTATION_STATUS.md
📄 apps/recipe-app/context/architecture.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Review specs: apps/recipe-app/specs/
2. Fix critical issues: /implement-task user-authentication 1.1
3. Add tests: /implement-task recipe-management 3.1
4. Complete missing: /implement-feature admin-dashboard

Your legacy code is now in spec-driven development! 🚀
```

## Use Cases

### Use Case 1: Legacy Codebase

**Scenario**: You have old code with no docs

```bash
/set-context legacy-app
/analyze-codebase deep

# Reviews generated specs
# Prioritizes refactoring
/implement-task auth 1.1  # Fix security
/implement-task core 2.3  # Add tests
```

### Use Case 2: External Code

**Scenario**: Code from another developer/team

```bash
/analyze-codebase external-app quick

# Understands what exists
# Identifies gaps
@spec-orchestrator create spec for [missing-feature]
```

### Use Case 3: Inherited Project

**Scenario**: Taking over a project

```bash
/analyze-codebase inherited-app deep

# Complete documentation
# Refactoring plan
# Continue development with specs
```

### Use Case 4: Understand Implementation

**Scenario**: Know what's already done

```bash
/set-context my-app
/analyze-codebase

# Check IMPLEMENTATION_STATUS.md
# See what's implemented vs planned
# Decide what to build next
```

## Providing Additional Context

### With Development Logs

If you have logs from development:

```bash
/analyze-codebase my-app deep

# Agent will ask:
"Do you have development logs?"

# Provide path:
apps/my-app/docs/dev-log.md
```

Agent will read logs and enrich specs with:
- Development timeline
- Known issues
- Design decisions
- Future plans

### With Existing Docs

If you have partial documentation:

```bash
/analyze-codebase my-app deep

# Agent asks for docs
# Provide:
apps/my-app/docs/architecture.md
apps/my-app/README.md
```

Agent integrates existing docs into generated specs.

### Specific Files to Analyze

For focused analysis:

```bash
/analyze-codebase my-app

# When asked for scope:
"Analyze these files:
- apps/my-app/src/auth/
- apps/my-app/src/api/users.ts
- apps/my-app/src/models/User.ts"
```

## After Analysis

### Review Specs

```bash
# Read generated specs
cat apps/[app-name]/specs/*-requirements.md
cat apps/[app-name]/specs/*-design.md
cat apps/[app-name]/specs/*-tasks.md
```

**Verify accuracy**:
- Requirements match actual functionality?
- Design correctly documented?
- Missing pieces identified?

**Refine if needed**:
- Edit specs to correct misunderstandings
- Add business context AI couldn't infer
- Clarify ambiguous areas

### Prioritize Work

Check refactoring tasks:

```bash
# See what needs fixing
cat apps/[app-name]/specs/*-tasks.md
```

**Prioritize**:
1. 🔴 Critical security issues
2. ⚠️ High-priority bugs
3. ⚠️ Missing tests
4. 🔶 Technical debt
5. ✅ New features

### Start Implementation

```bash
# Fix critical issues first
/implement-task [feature] 1.1  # Security fix

# Add missing tests
/implement-task [feature] 3.1  # Tests

# Complete missing features
/implement-feature [missing-feature]
```

### Use Spec-Driven Development Going Forward

```bash
# For new features
@spec-orchestrator create spec for [new-feature]
/implement-feature [new-feature]

# Track progress
/prime  # Shows updated status
```

## Best Practices

### Before Analysis

**Organize Code**:
- Ensure code is in `apps/[app-name]/`
- Have tests in `apps/[app-name]/tests/`
- Gather any logs/docs

**Set Context**:
```bash
/set-context [app-name]
```

### During Analysis

**Provide Context**:
- Share development logs if available
- Point to existing docs
- Mention known issues

**Be Patient**:
- Quick: ~30 minutes
- Deep: ~2-3 hours

### After Analysis

**Review Carefully**:
- AI infers from code - may miss business context
- Verify requirements are accurate
- Correct any misunderstandings

**Prioritize**:
- Security issues first
- Then bugs and tests
- Then technical debt
- Finally new features

**Iterate**:
- Use `/analyze-codebase` again after major changes
- Keep specs up to date
- Track progress in IMPLEMENTATION_STATUS.md

## Integration with Other Commands

### After Analysis

```bash
# Setup environment if needed
/setup-environment [app-name]

# Implement refactoring tasks
/implement-task [feature] [task-id]

# Complete missing features
/implement-feature [feature]

# Check status
/prime
```

### Before New Features

```bash
# Understand current state
/analyze-codebase

# Plan new feature
@spec-orchestrator create spec for [new-feature]

# Implement
/implement-feature [new-feature]
```

## Limitations

**Cannot Infer**:
- Business requirements not evident in code
- User stories beyond implemented functionality
- Design rationale (only current state)
- Future plans (unless in comments/docs)

**Best Effort**:
- Test coverage (approximate)
- Feature completeness (based on visible code)
- Security analysis (not a full audit)
- Performance (static analysis only)

**Always Review**:
- Generated specs are inferred
- Verify accuracy
- Add missing context
- Correct misunderstandings

## Troubleshooting

### Issue: Analysis Too Slow

**Solution**: Use quick analysis first
```bash
/analyze-codebase [app] quick
```

### Issue: Missing Features

**Solution**: Provide logs/docs
```
"I have development logs at apps/[app]/docs/dev-log.md"
```

### Issue: Incorrect Specs

**Solution**: Edit generated specs
```bash
# Edit requirements
edit apps/[app]/specs/[feature]-requirements.md

# Add missing context
```

### Issue: Can't Find Features

**Solution**: Point to specific files
```
"Analyze these files specifically:
- apps/[app]/src/auth/
- apps/[app]/src/recipes/"
```

## Summary

**Use `/analyze-codebase` to**:
- Document existing code
- Understand legacy systems
- Integrate external codebases
- Create refactoring plans
- Identify gaps and issues
- Generate specs from implementation

**Result**: Legacy code → Spec-driven development ✨

---

**Transform existing code into documented, spec-driven development!** 🔍→📄

