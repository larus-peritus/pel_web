# Spec-Driven Development Quick Reference

Find your starting point and get the right command.

---

## Where Are You Starting From?

### 🌱 Just an App Idea

**You have**: An app concept, no features defined, blank slate

**You need**: Feature breakdown, prioritization, complete specs for all features

**Start here**:

**Step 1: App Planning**
```
@app-planner I want to build [your app idea]
```
→ Output: `APP_PLAN.md` with prioritized feature list

**Step 2: Batch Spec Creation** ⚡ NEW!
```
@spec-batch-processor
```
or
```
/batch-spec parallel
```
→ Output: Complete specs for ALL features (10-15 minutes!)

**Result**: Ready to implement 🎉

**Time**: 45-75 minutes total (Planning + Batch Specs)

**Alternative**: Create specs one at a time with `@spec-orchestrator` (slower but more controlled)

[Complete Guide →](greenfield-app-workflow.md) | [Batch Processing →](batch-spec-processing.md)

---

### 📋 Know Your Feature

**You have**: Specific feature to implement (e.g., "user authentication")

**You need**: Complete spec (Requirements + Design + Tasks)

**Start here**:
```
@spec-orchestrator create spec for [feature-name]
```
or
```
/spec-workflow [feature-name]
```

**Output**: 3 documents (requirements, design, tasks)

**Next**: Implement following tasks.md

**Time**: 1-2 hours per feature

[Workflow Patterns →](workflow-patterns.md)

---

### 📝 Have Requirements, Need Design

**You have**: `requirements-[feature].md` already written

**You need**: Technical design

**Start here**:
```
@design-agent create design from specs/requirements-[feature].md
```
or
```
/design specs/requirements-[feature].md
```

**Output**: `design-[feature].md`

**Next**: Create tasks

**Time**: 30-45 minutes

---

### 🏗️ Have Design, Need Tasks

**You have**: `design-[feature].md` already written

**You need**: Implementation task breakdown

**Start here**:
```
@tasks-agent create tasks from specs/design-[feature].md
```
or
```
/tasks specs/design-[feature].md
```

**Output**: `tasks-[feature].md`

**Next**: Implement tasks

**Time**: 20-30 minutes

---

### 🔄 Need to Revise Requirements

**You have**: Existing requirements that need updates

**You need**: Refined requirements

**Start here**:
```
@requirements-agent revise specs/requirements-[feature].md
```

**Output**: Updated requirements document

**Consider**: May need to update design and tasks too

---

### 🔄 Need to Revise Design

**You have**: Existing design that needs changes

**You need**: Updated technical design

**Start here**:
```
@design-agent revise specs/design-[feature].md
```

**Output**: Updated design document

**Consider**: May need to update tasks too

---

### 🔄 Need to Revise Tasks

**You have**: Existing tasks that need adjustment

**You need**: Updated task breakdown

**Start here**:
```
@tasks-agent revise specs/tasks-[feature].md
```

**Output**: Updated tasks document

---

## Quick Command Reference

### App Planning
```bash
@app-planner [describe your app idea]
```

### Batch Spec Creation (All Features) ⚡ NEW!
```bash
# Interactive mode (choose sequential/parallel/custom)
@spec-batch-processor
/batch-spec

# Sequential mode (one by one, review each)
/batch-spec sequential

# Parallel mode (all at once, fastest!)
/batch-spec parallel

# Custom mode (select specific features)
/batch-spec custom
```

### Full Spec Creation (Single Feature)
```bash
# Interactive, guided
@spec-orchestrator create spec for [feature]

# Automated, fast
/spec-workflow [feature-name]
```

### Individual Phases
```bash
# Requirements only
@requirements-agent create requirements for [feature]
/requirements [feature-description]

# Design only
@design-agent create design from [requirements-file]
/design [requirements-file]

# Tasks only
@tasks-agent create tasks from [design-file]
/tasks [design-file]
```

### Worktree Management (Optional)
```bash
# Create isolated environment
/create_worktree [branch-name]

# List all worktrees
/list_worktrees

# Remove worktree
/remove_worktree [branch-name]
```

---

## Decision Tree

```
Start
  │
  ├─ Have app idea only?
  │   └─ @app-planner → APP_PLAN.md → Spec each feature
  │
  ├─ Have specific feature?
  │   └─ @spec-orchestrator → Complete spec → Implement
  │
  ├─ Have requirements?
  │   └─ @design-agent → Design doc → Tasks doc
  │
  ├─ Have design?
  │   └─ @tasks-agent → Tasks doc → Implement
  │
  └─ Need to revise?
      └─ @[phase]-agent revise [file] → Updated doc
```

---

## When to Use What

### Use `@app-planner` when:
- ✅ Starting from just an idea
- ✅ No features defined
- ✅ Need MVP guidance
- ✅ Greenfield project

### Use `@spec-orchestrator` when:
- ✅ Have specific feature
- ✅ Want complete spec (all 3 phases)
- ✅ First time using system
- ✅ Want guidance and validation

### Use Phase-Specific Agents when:
- ✅ Working on one phase only
- ✅ Revising existing docs
- ✅ Experienced with process
- ✅ Want focused expertise

### Use Commands when:
- ✅ Want speed
- ✅ Minimal interaction
- ✅ Batch processing
- ✅ Know the workflow

### Use Worktrees when:
- ✅ Multiple developers
- ✅ Parallel features
- ✅ Need isolation (ports, databases)
- ⚠️ Optional for solo work

---

## Output Files Structure

After running through the workflow, you'll have:

```
your-project/
├── APP_PLAN.md                           # From @app-planner
│
├── specs/
│   ├── feature-1-requirements.md         # From @spec-orchestrator
│   ├── feature-1-design.md               # or phase-specific agents
│   ├── feature-1-tasks.md
│   │
│   ├── feature-2-requirements.md
│   ├── feature-2-design.md
│   ├── feature-2-tasks.md
│   │
│   └── ...
│
└── trees/                                # From /create_worktree (optional)
    ├── feature-1/                        # Isolated implementation env
    └── feature-2/
```

---

## Example Workflows

### Greenfield App (From Scratch)

**Day 1: Planning**
```
@app-planner I want to build a task management app
→ APP_PLAN.md with 5 MVP features
```

**Week 1: First Feature**
```
@spec-orchestrator create spec for user-authentication
→ requirements-user-authentication.md
→ design-user-authentication.md
→ tasks-user-authentication.md

[Implement following tasks.md]
```

**Week 2: Second Feature**
```
@spec-orchestrator create spec for task-management
→ Complete spec
[Implement]
```

**Weeks 3-4: Remaining MVP**
```
[Repeat for remaining features]
→ MVP Complete!
```

---

### Single Feature Addition (Existing App)

**Scenario**: Adding "export to PDF" feature to existing app

```
@spec-orchestrator create spec for export-to-pdf
→ requirements-export-to-pdf.md
→ design-export-to-pdf.md
→ tasks-export-to-pdf.md

[Implement following tasks.md]
```

**Time**: Spec (1-2 hours) + Implementation (1-2 days)

---

### Requirements Already Done

**Scenario**: PM provided requirements document

```
# Already have: requirements-payment-processing.md

@design-agent create design from specs/requirements-payment-processing.md
→ design-payment-processing.md

@tasks-agent create tasks from specs/design-payment-processing.md
→ tasks-payment-processing.md

[Implement following tasks.md]
```

---

## Common Patterns

### Pattern 1: Solo Developer, One Feature at a Time
```
@app-planner [idea] → APP_PLAN.md
For each feature:
  @spec-orchestrator [feature] → Complete spec
  Implement → Test → Validate
  Next feature
```

### Pattern 2: Team, Multiple Features in Parallel
```
@app-planner [idea] → APP_PLAN.md
Spec all MVP features:
  /spec-workflow feature-1
  /spec-workflow feature-2
  /spec-workflow feature-3
Create worktrees:
  /create_worktree feature-1
  /create_worktree feature-2
  /create_worktree feature-3
Assign to team members → Implement in parallel
```

### Pattern 3: Existing App, New Feature
```
@spec-orchestrator [new-feature] → Complete spec
Implement → Test → Merge
```

### Pattern 4: Iterative Refinement
```
@spec-orchestrator [feature] → Initial spec
Review → Identify issues
@requirements-agent revise specs/requirements-[feature].md
@design-agent revise specs/design-[feature].md
@tasks-agent revise specs/tasks-[feature].md
Implement refined spec
```

---

## Troubleshooting

### "I don't know what features I need"
→ Use `@app-planner` to brainstorm and prioritize

### "My feature is too big"
→ Break into smaller features in APP_PLAN.md, spec each separately

### "I only need requirements, not design"
→ Use `@requirements-agent` directly

### "I need to change my design"
→ Use `@design-agent revise [file]` to update

### "I want to work on multiple features at once"
→ Create specs for all, then use `/create_worktree` for each

---

## Next Steps

1. **Identify your starting point** (use decision tree above)
2. **Choose your entry command** (agent or slash command)
3. **Follow the guided workflow**
4. **Implement systematically**
5. **Iterate and improve**

---

**Full Documentation**:
- [Main Guide](../SPEC_DRIVEN_DEVELOPMENT.md)
- [Greenfield App Workflow](greenfield-app-workflow.md)
- [Workflow Patterns](workflow-patterns.md)
- [Worktree Integration](worktree-integration.md)

