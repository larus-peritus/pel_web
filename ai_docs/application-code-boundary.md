# Application Code Boundary - Critical Context

**For All AI Agents and Skills Creating Specifications**

## Core Principle

**Only code in the `apps/` directory is application code.**

Everything else is process management and should be **excluded** from spec creation.

## Directory Classification

### ✅ Application Code (Analyze for Specs)

```
apps/
└── [app-name]/              ← ALL application code here
    ├── src/                 ← Source code
    ├── tests/               ← Test files
    ├── docs/                ← App-specific docs
    ├── config/              ← App configs
    └── ...                  ← Any app-related files
```

**When creating specs:**
- ✅ Analyze code in `apps/`
- ✅ Reference code from `apps/`
- ✅ Suggest changes to `apps/`
- ✅ Create implementation tasks for `apps/`

### ❌ Process Management (Exclude from Specs)

```
.claude/                     ← Claude Code configuration
  ├── skills/                ← Skill definitions
  ├── agents/                ← Agent definitions
  ├── commands/              ← Command definitions
  ├── hooks/                 ← Lifecycle hooks
  └── settings.json          ← Claude settings

kiro/                        ← Spec-driven methodology docs
specs/                       ← Generated specifications
docs/                        ← Workflow guides
templates/                   ← Spec templates
examples/                    ← Example workflows
ai_docs/                     ← AI assistant documentation
app_docs/                    ← Process documentation
scripts/                     ← Automation scripts
images/                      ← Documentation images
```

**When creating specs:**
- ❌ Don't analyze these directories
- ❌ Don't reference code from these directories
- ❌ Don't suggest changes to these directories
- ❌ Don't create tasks for these directories

## Why This Matters

### Problem Without Boundary

Without this boundary:
1. Specs would reference framework code, not application code
2. Users would be confused about what to implement
3. Framework changes would affect specs
4. Specs would be polluted with non-application concerns

### Solution With Boundary

With clear boundary:
1. Specs focus only on application logic
2. Users know exactly where to implement (in `apps/`)
3. Framework updates don't affect specs
4. Clean separation of concerns

## Agent Behaviors

### When Analyzing Codebase

**DO:**
```bash
# Analyze application code
find apps/ -type f -name "*.js"
grep -r "function" apps/
Read: apps/my-app/src/component.ts
```

**DON'T:**
```bash
# Don't analyze process code for specs
find .claude/ -type f
grep -r "function" kiro/
Read: .claude/skills/requirements-skill/SKILL.md
```

### When Creating Requirements

**DO:**
- Reference user workflows in `apps/[app-name]/`
- Analyze existing features in `apps/[app-name]/src/`
- Consider app-specific constraints

**DON'T:**
- Reference Claude Code skills or agents
- Analyze methodology documentation
- Include framework capabilities as requirements

### When Creating Design

**DO:**
- Design components that go in `apps/[app-name]/src/`
- Reference existing app architecture in `apps/`
- Suggest file structure within `apps/[app-name]/`

**DON'T:**
- Design changes to `.claude/` or `kiro/`
- Reference framework components as if they're app components
- Suggest modifying process management code

### When Creating Tasks

**DO:**
- Create tasks that implement code in `apps/[app-name]/`
- Reference app-specific files and directories
- Suggest tests in `apps/[app-name]/tests/`

**DON'T:**
- Create tasks for modifying `.claude/` or other process folders
- Reference framework files in implementation tasks
- Suggest changes outside `apps/`

## Detection and Correction

### If User Requests Spec for Process Code

**User**: "Create spec for the requirements skill"

**Agent Response**:
```
⚠️ Note: `.claude/skills/requirements-skill/` is part of the 
process management framework, not application code.

Application code is located in: apps/

Did you mean:
A) Create spec for a feature in apps/[app-name]/
B) Understand how the requirements-skill works (documentation, not spec)
C) Something else

Please clarify what you'd like to spec.
```

### If User Asks to Analyze Mixed Code

**User**: "Analyze the authentication system"

**Agent Response**:
```
I'll analyze the authentication code in your application.

Looking in: apps/[app-name]/src/auth/

[Analysis of app code only]

Note: I'm focusing on your application code in apps/. 
If you want me to understand the spec-driven development 
framework itself, let me know separately.
```

## Prime Command Integration

The `/prime` command establishes this boundary explicitly:

1. Detects if `apps/` is empty or has code
2. Explains the directory structure
3. Sets context: "Only apps/ is application code"
4. Guides user to appropriate workflow

After priming, all agents should:
- Remember the boundary
- Focus only on `apps/` for specs
- Correct if user references process code

## Examples

### ✅ Good Spec Creation Request

```
User: "Create spec for user profile management"

Agent:
1. Looks for existing code in apps/[app-name]/src/profile/
2. Creates requirements based on app needs
3. Designs components for apps/[app-name]/src/profile/
4. Creates tasks to implement in apps/[app-name]/
```

### ❌ Bad Spec Creation Request (Corrected)

```
User: "Create spec for the meta-agent"

Agent: "⚠️ The meta-agent is in .claude/agents/ which is process 
management, not application code.

Application code is in: apps/

Would you like to:
A) Create spec for a feature in your app (apps/[app-name]/)
B) Learn how meta-agent works (documentation)
C) Create a new agent for your workflow (use existing meta-agent)"
```

## Integration Points

### All Spec-Creating Agents Must:

1. **requirements-agent**: Only analyze app code in `apps/`
2. **design-agent**: Only design for code in `apps/`
3. **tasks-agent**: Only create tasks for implementing in `apps/`
4. **spec-orchestrator**: Enforce boundary across all phases
5. **spec-batch-processor**: Apply boundary to all features

### All Spec-Creating Skills Must:

1. **requirements-skill**: Guide users to spec app features only
2. **design-skill**: Provide patterns for app code in `apps/`
3. **tasks-skill**: Create tasks targeting `apps/`
4. **spec-orchestrator-skill**: Maintain boundary awareness

### Commands Must:

1. **/spec-workflow**: Analyze only `apps/` code
2. **/requirements**: Focus on app requirements
3. **/design**: Design for app architecture in `apps/`
4. **/tasks**: Create tasks for `apps/` implementation
5. **/prime**: Establish and explain the boundary

## Validation

Before creating any spec, validate:

```
✅ Is the feature/component in apps/? → Proceed
❌ Is it in .claude/, kiro/, docs/, etc.? → Redirect user
❓ Is location unclear? → Ask for clarification
```

## Summary

**Simple Rule**: If it's not in `apps/`, it's not application code.

**For Specs**: Only analyze, reference, and create tasks for code in `apps/`.

**For Everything Else**: It's the framework that helps you build apps, not the apps themselves.

---

**This boundary is critical for clean, focused, useful specifications.**

All AI assistants must enforce this boundary consistently.


