# Skills for Spec-Driven Development

Reusable capabilities that activate automatically based on conversation context.

## Overview

Skills are modular expertise packages that Claude loads on-demand when relevant. Each skill contains instructions, examples, and supporting resources organized using progressive disclosure.

**How They Work**: Skills activate automatically when you mention relevant keywords. You don't explicitly invoke them - they're discovered and used based on context.

## Available Skills

### Greenfield Planning 🆕

#### app-planning-skill
**Triggers**: "app idea", "build app", "new project", "feature breakdown", "app plan"

**Purpose**: Transform app ideas into feature lists and implementation plans

**Contains**:
- App discovery framework
- Feature identification guide
- MVP prioritization
- Implementation sequencing
- App plan template

**Use When**:
- Starting with just an app idea
- No features defined yet
- Greenfield project planning
- Breaking down app concepts
- Need MVP guidance

[Full Documentation →](app-planning-skill/SKILL.md)

---

### Core Spec Skills

#### requirements-skill
**Triggers**: "requirements", "user stories", "acceptance criteria", "EARS"

**Purpose**: Guide requirements creation using EARS format

**Contains**:
- EARS format reference (WHEN/IF/WHILE/WHERE)
- Validation checklists
- Example requirements
- Best practices

**Use When**:
- Starting requirements phase
- Creating user stories
- Writing acceptance criteria
- Validating requirements

[Full Documentation →](requirements-skill/SKILL.md)

---

#### design-skill
**Triggers**: "design", "architecture", "components", "technical approach"

**Purpose**: Create technical designs from requirements

**Contains**:
- Architecture patterns
- Decision frameworks
- Component design templates
- Design examples

**Use When**:
- Creating technical designs
- Making architecture decisions
- Defining components and interfaces
- Planning system structure

[Full Documentation →](design-skill/SKILL.md)

---

#### tasks-skill
**Triggers**: "tasks", "breakdown", "implementation plan", "sequencing"

**Purpose**: Break down designs into actionable tasks

**Contains**:
- Sequencing strategies
- Task validation checklists
- Task examples
- Dependency management

**Use When**:
- Creating implementation tasks
- Planning development sequence
- Breaking down complex features
- Sequencing work

[Full Documentation →](tasks-skill/SKILL.md)

---

#### spec-orchestrator-skill
**Triggers**: "spec-driven development", "complete spec", "full workflow"

**Purpose**: Coordinate all three phases of spec-driven development

**Contains**:
- Phase transition guidance
- Validation gates
- Execution options
- Worktree integration

**Use When**:
- Creating complete specifications
- Need guidance through all phases
- Want coordinated workflow
- Learning the process

[Full Documentation →](spec-orchestrator-skill/SKILL.md)

---

### Supporting Skills

#### meta-skill
**Purpose**: Create new skills following best practices

Use this to create custom skills for your project-specific patterns.

[Documentation →](meta-skill/SKILL.md)

---

#### worktree-manager-skill
**Purpose**: Manage git worktrees for isolated development

Use this for creating parallel development environments.

[Documentation →](worktree-manager-skill/SKILL.md)

---

## Progressive Disclosure Architecture

Skills use three-level information hierarchy:

### Level 1: Metadata (Always Loaded)
- Skill name and description
- When to use this skill
- Trigger keywords

### Level 2: Instructions (Loaded When Triggered)
- Main SKILL.md file
- Workflow and procedures
- Best practices

### Level 3: Resources (Loaded as Needed)
- Supporting files (EXAMPLES.md, VALIDATION.md, etc.)
- Reference documentation
- Templates and checklists

**Benefit**: Only relevant content enters context window at any time.

## Skill Composition

Skills work together:

```
Mention "spec" → spec-orchestrator-skill activates
├─ Coordinates requirements, design, tasks phases
├─ Can activate requirements-skill for Requirements phase
├─ Can activate design-skill for Design phase
└─ Can activate tasks-skill for Tasks phase
```

**Example Flow**:
```
User: "Create spec for user authentication"
↓
spec-orchestrator-skill activates
↓
During Requirements phase: requirements-skill provides EARS guidance
During Design phase: design-skill provides architecture patterns
During Tasks phase: tasks-skill provides sequencing strategies
```

## Skill Files Structure

Each skill is a directory containing:

```
skill-name/
├── SKILL.md           # Main instructions (required)
├── EXAMPLES.md        # Usage examples (optional)
├── VALIDATION.md      # Quality checklists (optional)
├── REFERENCE.md       # Reference docs (optional)
└── [other-files].md   # Additional resources (optional)
```

**Reference Pattern**: Link to supporting files from SKILL.md:
```markdown
For detailed examples, see [EXAMPLES.md](EXAMPLES.md).
For validation, see [VALIDATION.md](VALIDATION.md).
```

Claude reads these files only when needed.

## Creating Custom Skills

Use `meta-skill` to create project-specific skills:

```
"Create a skill for our API documentation standards"
```

The meta-skill guides you through:
1. Defining skill purpose and triggers
2. Writing clear instructions
3. Adding examples
4. Creating supporting files
5. Testing skill activation

[Meta-Skill Documentation →](meta-skill/SKILL.md)

## Best Practices

### For Skill Authors

**Description**:
- ✅ Include both WHAT it does and WHEN to use it
- ✅ List trigger keywords explicitly
- ✅ Be specific, not vague

**Instructions**:
- ✅ Use clear, numbered steps
- ✅ Provide concrete examples
- ✅ Link to supporting files
- ✅ Focus on one capability

**Supporting Files**:
- ✅ Split by topic (examples, validation, reference)
- ✅ Use progressive disclosure
- ✅ Keep files focused and scannable

### For Skill Users

**Natural Activation**:
- Simply mention relevant concepts
- Skills activate automatically
- No need to explicitly invoke

**Combining Skills**:
- Skills compose naturally
- Orchestrator skill coordinates others
- Context determines which activate

**Checking Activation**:
- Ask "What skills are available?"
- Skills list themselves with descriptions
- See which skills are active in context

## Skill Priorities

When multiple skills could apply:

1. **Orchestrator skills** (like spec-orchestrator-skill) coordinate
2. **Phase-specific skills** (like requirements-skill) provide detail
3. **Supporting skills** (like worktree-manager-skill) assist as needed

Claude intelligently chooses based on conversation context and user intent.

## Troubleshooting

### Skill Not Activating

**Check Description**: Is it specific enough with trigger keywords?

**Bad**:
```yaml
description: Helps with specs
```

**Good**:
```yaml
description: Guide requirements creation using EARS format. Use when creating requirements, user stories, or acceptance criteria.
```

### Multiple Skills Active

This is normal! Skills compose together. Orchestrator skills coordinate, specialized skills provide depth.

### Want Specific Skill

Mention specific keywords:
- "EARS format" → requirements-skill
- "architecture patterns" → design-skill
- "task sequencing" → tasks-skill

## Integration with Agents and Commands

Skills power agents and commands:

**Agents use skills**:
- `requirements-agent` uses `requirements-skill`
- `design-agent` uses `design-skill`
- `tasks-agent` uses `tasks-skill`

**Commands reference skills**:
- `/requirements` activates `requirements-skill`
- `/design` activates `design-skill`
- `/tasks` activates `tasks-skill`

**Skills are the knowledge layer that agents and commands leverage.**

## Summary

- **Skills** = Reusable expertise that activates automatically
- **Progressive Disclosure** = Only load what's needed when needed
- **Composition** = Skills work together naturally
- **Customizable** = Create your own with meta-skill

For creating complete specs, start with `spec-orchestrator-skill` which coordinates all phase-specific skills.

---

**Related Documentation**:
- [Main Guide](../../SPEC_DRIVEN_DEVELOPMENT.md)
- [Agents Documentation](../agents/README.md)
- [Commands Documentation](../commands/README.md)
- [Workflow Patterns](../../docs/workflow-patterns.md)

