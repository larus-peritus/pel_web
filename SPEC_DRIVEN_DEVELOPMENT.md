# Spec-Driven Development with Claude Code

Complete specification workflow using Claude Code's Skills, Agents, Commands, and Hooks.

## Overview

This repository implements **spec-driven development**: a systematic approach to building software through three phases:

1. **Requirements** → Capture clear, testable requirements using EARS format
2. **Design** → Create technical architecture and component specifications  
3. **Tasks** → Break down into actionable, sequential implementation steps

**Powered by Claude Code**: Skills for reusable expertise, Agents for specialized workflows, Commands for automation, and Hooks for event tracking.

---

## 🚀 Find Your Starting Point

**[📋 Quick Reference Guide →](docs/QUICK_REFERENCE.md)** - Decision tree to find the right command for your situation

---

## 📌 Critical: Application Code Boundary

**All application code must be in the `apps/` directory.**

```
✅ Application Code (Spec This):
   apps/[your-app-name]/     ← Your code here

❌ Process Management (Don't Spec This):
   .claude/                  ← Claude Code configuration
   kiro/                     ← Methodology docs
   specs/                    ← Generated specs
   docs/                     ← Workflow guides
   templates/                ← Spec templates
   examples/                 ← Examples
   ai_docs/                  ← AI docs
   app_docs/                 ← Process docs
   scripts/                  ← Scripts
```

**Why This Matters:**
- Specs should only analyze/reference code in `apps/`
- Process folders are the framework for building apps
- This keeps specs focused on YOUR code, not the framework

**When You Run `/prime`:**
- Claude detects if `apps/` is empty (greenfield) or has code (existing)
- You're guided to the appropriate workflow

[📖 See apps/README.md for details →](apps/README.md)

---

## Quick Start (15 Minutes)

### Starting From an App Idea? 🆕

If you're starting a completely new project from just an idea:

**Step 1: Create App Plan**
```
@app-planner I want to build [your app idea]
```
→ Creates `APP_PLAN.md` with all features prioritized

**Step 2: Batch Create All Specs** ✨ NEW!
```
@spec-batch-processor
```
or
```
/batch-spec parallel
```
→ Creates complete specs for ALL features automatically (10-15 minutes!)

**Result**: Full specifications ready for implementation 🎉

**What You Get**:
- Feature breakdown and prioritization (`APP_PLAN.md`)
- Complete specs for all MVP features (3 files per feature)
- Ready to implement systematically

**Example**: "I want to build a habit tracking app" → 5 MVP features identified → All specs created in 15 minutes!

[📖 Complete Greenfield App Guide →](docs/greenfield-app-workflow.md) | [📖 Batch Processing Guide →](docs/batch-spec-processing.md)

---

### Already Know Your Feature?

### Option 1: Orchestrator Agent (Recommended for First Time)

```
@spec-orchestrator create spec for user authentication
```

The orchestrator guides you through all three phases with validation gates.

### Option 2: Direct Command (Fastest)

```bash
/spec-workflow user-authentication
```

Creates requirements, design, and tasks automatically with prompts for clarification.

### Option 3: Phase-by-Phase Agents

```
@requirements-agent create requirements for file upload
@design-agent create design from specs/requirements-file-upload.md
@tasks-agent create tasks from specs/design-file-upload.md
```

Use specialized agents for focused work on each phase.

---

## The Three Phases

### Phase 1: Requirements

**Purpose**: Transform vague feature ideas into clear, testable requirements

**Output**: `specs/requirements-[feature].md`

**Contains**:
- User stories with clear value propositions
- EARS-format acceptance criteria (WHEN/IF/WHILE/WHERE...SHALL)
- Non-functional requirements (performance, security, usability)
- Constraints and assumptions
- Success criteria

**Tools Available**:
- **Skill**: `requirements-skill` - Activates automatically when you mention "requirements"
- **Agent**: `@requirements-agent` - Specialized agent for requirements phase
- **Command**: `/requirements [description]` - Automated requirements creation

**Example**:
```
WHEN user provides valid credentials THEN system SHALL authenticate within 2 seconds
IF user fails authentication 3 times THEN system SHALL lock account for 15 minutes
```

[Learn More: Requirements Phase →](kiro/spec-process-guide/process/requirements-phase.md)

### Phase 2: Design

**Purpose**: Translate requirements into technical architecture and implementation plan

**Output**: `specs/design-[feature].md`

**Contains**:
- System architecture and component structure
- Data models with validation rules
- API and interface definitions
- Error handling strategy
- Testing approach
- Design decisions with rationale

**Tools Available**:
- **Skill**: `design-skill` - Activates when you mention "design" or "architecture"
- **Agent**: `@design-agent` - Can research docs and create technical designs
- **Command**: `/design [requirements-file]` - Automated design from requirements

**Research Integration**: Design agent can use `@docs-scraper` to fetch official documentation.

[Learn More: Design Phase →](kiro/spec-process-guide/process/design-phase.md)

### Phase 3: Tasks

**Purpose**: Break down design into actionable, sequenced implementation tasks

**Output**: `specs/tasks-[feature].md`

**Contains**:
- Two-level task hierarchy (epics + specific tasks)
- Tasks sized for 2-6 hours each
- Clear dependencies and sequence
- Requirements traceability
- Testing integrated throughout
- Optional worktree guidance

**Tools Available**:
- **Skill**: `tasks-skill` - Activates when you mention "tasks" or "breakdown"
- **Agent**: `@tasks-agent` - Specialized task planning
- **Command**: `/tasks [design-file]` - Automated task creation

**Sequencing Strategies**: Foundation-first, feature-slice, risk-first, or hybrid approach.

[Learn More: Tasks Phase →](kiro/spec-process-guide/process/tasks-phase.md)

---

## Execution Options

### Choose Your Workflow

**Orchestrator Agent** (Guided):
```
@spec-orchestrator create complete spec for notification system
```
- ✅ Best for: First time, complex features, need guidance
- ✅ Benefits: Step-by-step validation, quality gates, coordinated workflow
- ⏱️ Time: 30-60 minutes

**Phase-Specific Agents** (Focused):
```
@requirements-agent create requirements for search feature
@design-agent create design from specs/requirements-search.md
@tasks-agent create tasks from specs/design-search.md
```
- ✅ Best for: Working on specific phase, revising one phase, experienced users
- ✅ Benefits: Specialized expertise, focused workflow, flexible
- ⏱️ Time: 10-20 minutes per phase

**Direct Commands** (Automated):
```bash
/spec-workflow payment-processing      # Complete workflow
/requirements user profile management  # Requirements only
/design specs/requirements-profile.md  # Design only
/tasks specs/design-profile.md         # Tasks only
```
- ✅ Best for: Batch processing, experienced users, automation
- ✅ Benefits: Fast, consistent, scriptable
- ⏱️ Time: 5-15 minutes per phase

**Skills (Conversational)**:
```
"I need help creating requirements for a file upload feature"
"Design an architecture for real-time notifications"
"Break down this design into implementation tasks"
```
- ✅ Best for: Flexible exploration, specific questions, learning
- ✅ Benefits: Natural interaction, contextual help, adaptive
- ⏱️ Time: Varies

[Decision Guide: Which Option to Choose? →](docs/workflow-patterns.md)

---

## Features & Capabilities

### Skills (Reusable Expertise)

Located in `.claude/skills/`:

- **requirements-skill**: EARS format guidance, validation checklists
- **design-skill**: Architecture patterns, decision frameworks
- **tasks-skill**: Sequencing strategies, breakdown templates
- **spec-orchestrator-skill**: Coordinates all three phases

Skills activate automatically based on conversation context.

[Skills Documentation →](.claude/skills/README.md)

### Agents (Specialized Workflows)

Located in `.claude/agents/`:

- **spec-orchestrator**: Guides through complete workflow
- **requirements-agent**: Requirements phase specialist
- **design-agent**: Technical design expert (can research docs)
- **tasks-agent**: Implementation planning specialist

Invoke with `@agent-name` or let orchestrator delegate.

[Agents Documentation →](.claude/agents/README.md)

### Commands (Automation)

Located in `.claude/commands/`:

- `/spec-workflow [feature-name]`: Complete three-phase workflow
- `/requirements [description]`: Create requirements only
- `/design [requirements-file]`: Create design from requirements
- `/tasks [design-file]`: Create tasks from design

Commands execute workflows with minimal interaction.

[Commands Documentation →](.claude/commands/README.md)

### Hooks (Event Tracking)

Located in `.claude/hooks/`:

- Tracks all tool usage during spec creation
- Logs session events and progress
- Supports observability dashboard
- Enables HITL (Human-in-the-Loop) notifications

Hooks run automatically in background.

[Hooks Integration →](docs/hooks-integration.md)

---

## Optional: Worktree Integration

After creating specs, optionally use **worktrees** for isolated implementation:

```bash
/create_worktree [feature-name]
```

**Benefits**:
- Isolated development environment
- Separate ports, database, configuration
- Parallel development without conflicts
- Safe experimentation

**When to Use**:
- Complex features needing isolation
- Parallel development by multiple developers
- Want to test without affecting main codebase
- Experimenting with implementation approaches

**Note**: Worktrees are **optional**. Many features implement fine in main branch.

[Worktree Guide →](docs/worktree-integration.md)

---

## File Structure

```
peritus-repo-template/
├── .claude/
│   ├── skills/              # Reusable capabilities
│   │   ├── requirements-skill/
│   │   ├── design-skill/
│   │   ├── tasks-skill/
│   │   └── spec-orchestrator-skill/
│   ├── agents/              # Specialized workflows
│   │   ├── spec-orchestrator.md
│   │   ├── requirements-agent.md
│   │   ├── design-agent.md
│   │   └── tasks-agent.md
│   ├── commands/            # Automation commands
│   │   ├── spec-workflow.md
│   │   ├── requirements.md
│   │   ├── design.md
│   │   └── tasks.md
│   └── hooks/               # Event tracking
├── specs/                   # Generated specifications
│   ├── requirements-*.md
│   ├── design-*.md
│   └── tasks-*.md
├── kiro/                    # Methodology documentation
│   └── spec-process-guide/
└── docs/                    # Guides and patterns
    ├── workflow-patterns.md
    ├── worktree-integration.md
    └── hooks-integration.md
```

---

## Example Workflow

### Creating User Authentication Spec

**Step 1: Start with Orchestrator**
```
@spec-orchestrator create spec for user authentication with email and password
```

**Step 2: Requirements Phase**
- Orchestrator asks about users, constraints, success criteria
- Creates user stories and EARS acceptance criteria
- Validates requirements
- Saves to `specs/requirements-user-authentication.md`
- Asks for approval

**Step 3: Design Phase**
- Analyzes requirements
- Designs architecture (JWT tokens, bcrypt hashing, Redis sessions)
- Defines components (AuthService, UserRepository, SessionManager)
- Plans error handling and testing
- Saves to `specs/design-user-authentication.md`
- Asks for approval

**Step 4: Tasks Phase**
- Breaks down design into tasks
- Sequences: Setup → Models → Services → API → Integration
- Defines 12-15 specific tasks (2-6 hours each)
- Saves to `specs/tasks-user-authentication.md`
- Complete!

**Step 5: Optional Worktree**
```bash
/create_worktree user-authentication
```
- Creates isolated environment on port 4010/5183
- Ready for implementation

**Result**: Three complete spec documents ready for systematic implementation.

---

## Quality Standards

### Requirements Document Must Have
- [ ] User stories with clear roles, features, and benefits
- [ ] EARS-format acceptance criteria for all scenarios
- [ ] Non-functional requirements (performance, security, usability)
- [ ] Constraints and assumptions documented
- [ ] All requirements are testable

### Design Document Must Have
- [ ] System architecture overview
- [ ] Component definitions with clear responsibilities
- [ ] Data models with validation rules
- [ ] Error handling strategy
- [ ] Testing strategy for all layers
- [ ] Design decisions with rationale
- [ ] Traceability to requirements

### Tasks Document Must Have
- [ ] Two-level task hierarchy (epics + tasks)
- [ ] Tasks properly sized (2-6 hours each)
- [ ] Clear dependencies and sequence
- [ ] Requirements references for all tasks
- [ ] Testing integrated throughout

---

## Methodology Foundation

This implementation is based on **Kiro methodology** for spec-driven development:

- **EARS (Easy Approach to Requirements Syntax)**: Structured requirement format
- **Three-Phase Process**: Requirements → Design → Tasks
- **Quality Gates**: Validation at each phase transition
- **Traceability**: Clear links from requirements through tasks

[Explore Kiro Methodology →](kiro/README.md)

---

## Learning Resources

### Getting Started
1. [Quick Start](#quick-start-15-minutes) - Create your first spec in 15 minutes
2. [Workflow Patterns](docs/workflow-patterns.md) - See complete examples
3. [Skills Guide](.claude/skills/README.md) - Understanding skills

### Going Deeper
4. [Requirements Phase Guide](kiro/spec-process-guide/process/requirements-phase.md)
5. [Design Phase Guide](kiro/spec-process-guide/process/design-phase.md)
6. [Tasks Phase Guide](kiro/spec-process-guide/process/tasks-phase.md)

### Advanced Usage
7. [Agents Documentation](.claude/agents/README.md) - Specialized workflows
8. [Commands Reference](.claude/commands/README.md) - Automation options
9. [Worktree Integration](docs/worktree-integration.md) - Isolated environments
10. [Hooks Integration](docs/hooks-integration.md) - Event tracking

---

## Starting From an App Idea

### Complete Greenfield Workflow

**Scenario**: You have an app idea but no features defined, no code yet.

**Solution**: Use app-planner agent

```
@app-planner I want to build a recipe sharing app
```

**What Happens**:

1. **Discovery**: Agent asks about your vision, users, platform
2. **Feature Identification**: Helps identify all features (auth, recipe creation, browsing, search, etc.)
3. **Prioritization**: Categorizes features into MVP, Phase 2, Future
4. **Sequencing**: Recommends implementation order
5. **App Plan Document**: Creates `APP_PLAN.md` with complete breakdown

**Output**: `APP_PLAN.md`
```markdown
# App Plan: Recipe Sharing App

## Essential Features (MVP)
1. User Authentication → Spec it: @spec-orchestrator
2. Recipe Creation → Spec it: @spec-orchestrator  
3. Recipe Browsing → Spec it: @spec-orchestrator
4. Recipe Saving → Spec it: @spec-orchestrator

## Important Features (Phase 2)
5. Search & Filters
6. Ratings & Comments

## Nice-to-Have (Future)
7. Meal Planning
8. Shopping Lists

## Implementation Sequence
Phase 1: Auth + Recipe Management (Week 1-2)
Phase 2: Browsing + Saving (Week 3-4)
Phase 3: Search + Social (Week 5-6)
```

**Then**: Create specs for each feature one at a time:
```
@spec-orchestrator create spec for user-authentication
[Implement it]
@spec-orchestrator create spec for recipe-creation
[Implement it]
...
```

**Result**: Systematic path from idea → features → specs → implementation

---

## FAQ

**Q: I have an app idea but no features defined. Where do I start?**  
A: Use `@app-planner` to break down your idea into features, then create specs for each feature with `@spec-orchestrator`.

**Q: Do I need to complete all three phases?**  
A: Yes, for best results. Each phase builds on the previous and catches issues early. However, you can work on phases separately if needed.

**Q: Which execution option should I use?**  
A: Start with orchestrator agent for guidance. Once familiar, use commands for speed or agents for focused work. See [workflow patterns](docs/workflow-patterns.md).

**Q: How long does it take?**  
A: Complete workflow: 30-60 minutes. Individual phases: 10-20 minutes each. Commands are fastest at 5-15 minutes per phase.

**Q: Do I need to use worktrees?**  
A: No, worktrees are optional. Use them for complex features, parallel development, or when you want isolation. Many features implement fine in main branch.

**Q: Can I revise a phase after approval?**  
A: Yes! You can always go back and refine. Use phase-specific agents or commands to update individual documents.

**Q: How do skills activate?**  
A: Automatically based on keywords. Mention "requirements" → requirements-skill activates. Mention "design" → design-skill activates.

**Q: Can I create my own skills for project-specific patterns?**  
A: Yes! Use the `meta-skill` to create new skills. See `.claude/skills/meta-skill/SKILL.md`.

---

## Success Stories

This template enables:
- ✅ **Clear Requirements**: No more vague "build something fast" requests
- ✅ **Technical Clarity**: Design before coding prevents rework
- ✅ **Systematic Implementation**: Tasks guide step-by-step development
- ✅ **Quality Assurance**: Testing integrated from requirements through tasks
- ✅ **Knowledge Preservation**: Complete documentation of decisions and rationale
- ✅ **Team Alignment**: Shared understanding from requirements through implementation

---

## Contributing

Improvements welcome! This is a template repository designed to be copied and customized for your projects.

To use in your own project:
1. Copy `.claude/` folder structure
2. Copy `specs/` directory
3. Optionally copy `kiro/` methodology docs
4. Customize skills, agents, and commands for your needs

---

## Support

- **Documentation**: See `kiro/spec-process-guide/`
- **Examples**: See `docs/workflow-patterns.md`
- **Skills Reference**: See `.claude/skills/README.md`
- **Agents Reference**: See `.claude/agents/README.md`

---

**Ready to Start?**

```
@spec-orchestrator create spec for [your feature]
```

or

```bash
/spec-workflow [your-feature-name]
```

Transform your feature ideas into systematic, high-quality specifications!

