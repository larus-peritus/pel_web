# Agents for Spec-Driven Development

Specialized workflows that execute focused tasks with dedicated models and tools.

## Overview

Agents are AI assistants configured for specific workflows. Unlike skills (which activate automatically), agents are **explicitly invoked** using `@agent-name` or through delegation.

**Key Difference from Skills**:
- **Skills**: Auto-activate based on keywords, provide expertise
- **Agents**: Explicitly invoked, execute complete workflows, can use tools and delegate

## Available Agents

### Greenfield Planning 🆕

### app-planner
**Model**: Sonnet | **Color**: Orange

**Purpose**: Transform app ideas into feature lists and implementation plans

**Invoke**: `@app-planner I want to build [your app idea]`

**What It Does**:
- Conducts discovery (vision, users, platform)
- Identifies features through guided questions
- Prioritizes into MVP / Phase 2 / Future
- Sequences implementation order
- Creates APP_PLAN.md document
- Guides you to create specs for each feature

**Use When**:
- Starting with just an app idea
- No features defined yet
- Greenfield project
- Breaking down app concept
- Need systematic planning

**Output**: `APP_PLAN.md` with structured feature breakdown

**Next Step**: Guides you to use `@spec-orchestrator` for each feature

**Tools**: Read, Write, Edit, Grep

[Full Documentation →](app-planner.md)

---

### Batch Processing 🆕

### spec-batch-processor
**Model**: Sonnet | **Color**: Cyan

**Purpose**: Automate spec creation for ALL features in APP_PLAN.md

**Invoke**: `@spec-batch-processor`

**What It Does**:
- Reads APP_PLAN.md feature list
- Processes all features automatically
- Two modes: Sequential (one by one) or Parallel (simultaneous)
- Creates complete specs for each feature (3 files per feature)
- Updates APP_PLAN.md with status

**Use When**:
- Have APP_PLAN.md with multiple features
- Want to create all specs at once
- Need speed (parallel: 10-15 min total!)
- Batch processing instead of manual iteration

**Output**: Complete specs for all features in `specs/` directory

**Modes**:
- **Sequential**: Process one at a time, review each (50-75 min for 5 features)
- **Parallel**: Process all simultaneously with subagents (10-15 min total!)

**Tools**: Read, Write, Edit, Grep, AgentDelegation

[Full Documentation →](spec-batch-processor.md)

---

### Spec Workflow Agents

### spec-orchestrator
**Model**: Sonnet | **Color**: Purple

**Purpose**: Guide through complete Requirements → Design → Tasks workflow

**Invoke**: `@spec-orchestrator create spec for [feature]`

**What It Does**:
- Coordinates all three phases systematically
- Validates at each phase gate
- Can delegate to specialized agents
- Ensures quality and traceability

**Use When**:
- Creating complete specification
- First time using spec-driven development
- Need guided workflow
- Want coordinated validation

**Tools**: Read, Write, Edit, Glob, Grep, AgentDelegation

[Full Documentation →](spec-orchestrator.md)

---

### requirements-agent
**Model**: Sonnet | **Color**: Blue

**Purpose**: Requirements phase specialist

**Invoke**: `@requirements-agent create requirements for [feature]`

**What It Does**:
- Creates EARS-format acceptance criteria
- Writes user stories with clear value
- Defines non-functional requirements
- Validates requirements quality

**Use When**:
- Working on Requirements phase only
- Revising existing requirements
- Want focused requirements expertise
- Don't need full workflow

**Tools**: Read, Write, Edit, Grep

[Full Documentation →](requirements-agent.md)

---

### design-agent
**Model**: Sonnet | **Color**: Green

**Purpose**: Technical design specialist

**Invoke**: `@design-agent create design from specs/requirements-[feature].md`

**What It Does**:
- Designs system architecture
- Defines components and interfaces
- Creates data models
- Documents design decisions
- **Can research documentation** using docs-scraper

**Use When**:
- Working on Design phase only
- Revising existing design
- Need architecture expertise
- Want documentation research capability

**Tools**: Read, Write, Edit, Glob, Grep, WebFetch, AgentDelegation

**Special Capability**: Can delegate to `docs-scraper` agent for fetching official documentation.

[Full Documentation →](design-agent.md)

---

### tasks-agent
**Model**: Sonnet | **Color**: Yellow

**Purpose**: Implementation task planning specialist

**Invoke**: `@tasks-agent create tasks from specs/design-[feature].md`

**What It Does**:
- Breaks design into actionable tasks
- Sequences with dependencies
- Sizes tasks appropriately (2-6 hours)
- Traces to requirements
- Suggests worktree if appropriate

**Use When**:
- Working on Tasks phase only
- Revising existing task breakdown
- Need task planning expertise
- Want detailed sequencing

**Tools**: Read, Write, Edit, Grep

[Full Documentation →](tasks-agent.md)

---

## Agent Workflow Patterns

### Pattern 1: Orchestrator-Led (Recommended for First Time)

```
@spec-orchestrator create spec for user authentication
```

**Flow**:
1. Orchestrator guides through Requirements
2. Validates and gets approval
3. Guides through Design
4. Validates and gets approval
5. Guides through Tasks
6. Complete specification ready

**Characteristics**:
- Most guidance and structure
- Quality gates enforced
- Can delegate to specialized agents if needed
- Best learning experience

---

### Pattern 2: Phase-by-Phase (Focused Work)

```
# Phase 1: Requirements
@requirements-agent create requirements for file upload

# Phase 2: Design  
@design-agent create design from specs/requirements-file-upload.md

# Phase 3: Tasks
@tasks-agent create tasks from specs/design-file-upload.md
```

**Flow**:
- Work on one phase at a time
- Specialized expertise for each phase
- Flexible - can skip or revise phases
- Good for experienced users

**Characteristics**:
- Maximum flexibility
- Phase-specific depth
- Can work on phases in any order
- Good for revisions

---

### Pattern 3: Orchestrator with Delegation

```
@spec-orchestrator create spec for notification system
```

Orchestrator can delegate phases to specialized agents:
- Complex requirements → delegates to requirements-agent
- Needs research → design-agent delegates to docs-scraper
- Large task breakdown → delegates to tasks-agent

**Characteristics**:
- Combines guidance with specialized expertise
- Orchestrator coordinates quality
- Specialized agents provide depth
- Best of both approaches

---

## Agent Configuration

Each agent is defined with frontmatter:

```yaml
---
name: agent-name
description: When to use this agent and what it does
tools: Read, Write, Edit, ...
model: haiku | sonnet | opus
color: red | blue | green | yellow | purple | orange | pink | cyan
---
```

**Model Selection**:
- **Haiku**: Fast, lightweight tasks (docs-scraper)
- **Sonnet**: Most agents, balance of speed and quality
- **Opus**: Complex reasoning (currently meta-agent)

**Tools**: Agents have specific tool access based on their needs.

## Agent Delegation

Agents can delegate to other agents:

**Example**: design-agent delegating research
```
@design-agent create design for payment processing
↓
design-agent analyzes requirements
↓
Needs payment gateway documentation
↓
Delegates to @docs-scraper to fetch Stripe API docs
↓
design-agent continues with research context
```

**Orchestrator Delegation**:
```
@spec-orchestrator create spec for complex feature
↓
orchestrator coordinates workflow
↓
Requirements phase complex → delegates to @requirements-agent
↓
Design phase needs research → @design-agent delegates to @docs-scraper
↓
Task breakdown large → delegates to @tasks-agent
↓
orchestrator validates and coordinates
```

## Creating Custom Agents

Use `meta-agent` to create project-specific agents:

```
@meta-agent create agent for code review workflow
```

The meta-agent helps you:
1. Define agent purpose and triggers
2. Choose appropriate model and color
3. Select required tools
4. Write workflow instructions
5. Create report format

[Meta-Agent Documentation →](meta-agent.md)

## Best Practices

### When to Use Orchestrator
- ✅ First time creating specs
- ✅ Complex features
- ✅ Want guided workflow
- ✅ Need validation gates

### When to Use Phase-Specific Agents
- ✅ Working on one phase only
- ✅ Revising existing documents
- ✅ Experienced with process
- ✅ Want focused expertise

### When to Use Commands Instead
- ✅ Want automation without interaction
- ✅ Batch processing multiple specs
- ✅ Known workflow, minimal questions
- ✅ Speed over guidance

[See Workflow Patterns →](../../docs/workflow-patterns.md)

## Agent vs Skill vs Command

**Skill** (Auto-Activated Expertise):
```
"I need help with EARS format requirements"
→ requirements-skill activates automatically
→ Provides guidance and examples
→ No explicit invocation needed
```

**Agent** (Explicit Workflow):
```
@requirements-agent create requirements for feature X
→ Explicitly invoked
→ Executes complete workflow
→ Uses tools to read/write files
→ Produces requirements document
```

**Command** (Automated Execution):
```
/requirements feature X description
→ Runs automated workflow
→ Minimal interaction
→ Fast execution
→ Produces requirements document
```

**Choose Based On**:
- **Skill**: Learning, exploring, getting advice
- **Agent**: Executing workflows, need tools, want interaction
- **Command**: Speed, automation, known workflow

## Integration with Skills

Agents leverage skills for expertise:

```
@requirements-agent
↓
Uses requirements-skill for:
- EARS format guidance
- Validation checklists
- Best practices
- Examples
↓
Executes workflow with tool access
↓
Produces requirements document
```

Skills = Knowledge | Agents = Execution

## Summary

- **4 Spec Agents**: Orchestrator + 3 phase-specific
- **Orchestrator**: Guided complete workflow
- **Phase Agents**: Focused specialized work
- **Delegation**: Agents can use other agents
- **Tool Access**: Agents can read/write files
- **Customizable**: Create your own with meta-agent

---

**Related Documentation**:
- [Main Guide](../../SPEC_DRIVEN_DEVELOPMENT.md)
- [Skills Documentation](../skills/README.md)
- [Commands Documentation](../commands/README.md)
- [Workflow Patterns](../../docs/workflow-patterns.md)

