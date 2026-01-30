# Commands for Spec-Driven Development

Automated workflows with minimal interaction for fast execution.

## Overview

Commands execute workflows automatically with predefined steps. Unlike agents (interactive) or skills (advisory), commands are **fast, automated, and scriptable**.

**Invoke**: `/command-name [arguments]`

## Available Commands

### /batch-spec [sequential|parallel|custom] 🆕 ⚡

**Purpose**: Create specs for ALL features in APP_PLAN.md automatically

**Usage**:
```bash
/batch-spec                  # Interactive: choose mode
/batch-spec sequential       # Process one by one
/batch-spec parallel         # Process all simultaneously (fastest!)
/batch-spec custom           # Choose specific features
```

**What It Does**:
1. Reads APP_PLAN.md feature list
2. Processes each feature through Requirements → Design → Tasks
3. Creates 3 files per feature
4. Updates APP_PLAN.md with status

**Processing Modes**:
- **Sequential**: One at a time, review each (50-75 min for 5 features)
- **Parallel**: All simultaneously with subagents (10-15 min total!)
- **Custom**: Select specific features to process

**Output**: Complete specs for all features
- 5 features → 15 files (requirements, design, tasks for each)

**Time Savings**: 
- Manual: 5-10 hours for 5 features
- Batch Parallel: 10-15 minutes total!

**Perfect For**: MVPs, greenfield projects, batch planning

[Full Documentation →](batch-spec.md) | [Batch Processing Guide →](../../docs/batch-spec-processing.md)

---

### /spec-workflow [feature-name]
**Purpose**: Execute complete Requirements → Design → Tasks workflow

**Usage**:
```bash
/spec-workflow user-authentication
/spec-workflow file-upload-system
/spec-workflow payment-processing
```

**What It Does**:
1. Creates requirements with EARS format
2. Validates and gets approval
3. Creates technical design
4. Validates and gets approval
5. Creates implementation tasks
6. Saves all three documents

**Output Files**:
- `specs/requirements-[feature-name].md`
- `specs/design-[feature-name].md`
- `specs/tasks-[feature-name].md`

**Time**: 15-30 minutes with clarifying questions

[Full Documentation →](spec-workflow.md)

---

### /requirements [feature-description]
**Purpose**: Create requirements document only

**Usage**:
```bash
/requirements user authentication with email and password
/requirements file upload with virus scanning and thumbnails
/requirements search with filters and sorting
```

**What It Does**:
1. Parses feature description
2. Asks about users, constraints, scope
3. Creates user stories
4. Writes EARS acceptance criteria
5. Defines non-functional requirements
6. Validates and saves

**Output**: `specs/requirements-[generated-name].md`

**Time**: 10-15 minutes

[Full Documentation →](requirements.md)

---

### /design [requirements-file]
**Purpose**: Create design from requirements document

**Usage**:
```bash
/design specs/requirements-user-authentication.md
/design requirements-file-upload.md
/design specs/requirements-search.md
```

**What It Does**:
1. Loads requirements document
2. Analyzes design drivers
3. Designs architecture and components
4. Defines data models
5. Plans error handling and testing
6. Documents decisions
7. Validates and saves

**Output**: `specs/design-[feature-name].md`

**Time**: 15-20 minutes

[Full Documentation →](design.md)

---

### /tasks [design-file]
**Purpose**: Create tasks from design document

**Usage**:
```bash
/tasks specs/design-user-authentication.md
/tasks design-file-upload.md
/tasks specs/design-search.md
```

**What It Does**:
1. Loads design and requirements
2. Chooses sequencing strategy
3. Creates task hierarchy
4. Defines specific tasks
5. Sequences with dependencies
6. Validates and saves

**Output**: `specs/tasks-[feature-name].md`

**Time**: 10-15 minutes

[Full Documentation →](tasks.md)

---

## Usage Patterns

### Pattern 1: Complete Workflow

**One command for everything**:
```bash
/spec-workflow notification-system
```

**Best For**:
- New features from scratch
- Want all three documents
- Standard workflow
- Batch processing

**Result**: Complete specification in 15-30 minutes

---

### Pattern 2: Phase-by-Phase

**Individual commands per phase**:
```bash
# Step 1
/requirements real-time chat with presence indicators

# Step 2 (after requirements approved)
/design specs/requirements-real-time-chat.md

# Step 3 (after design approved)
/tasks specs/design-real-time-chat.md
```

**Best For**:
- Want control at each phase
- Revising single phase
- Different people handling phases
- Complex features needing review

**Result**: Three documents with approval gates between

---

### Pattern 3: Revision Workflow

**Update specific phase**:
```bash
# Revise requirements
/requirements updated user authentication with OAuth

# Revise design based on new requirements
/design specs/requirements-user-authentication-v2.md

# Revise tasks based on new design
/tasks specs/design-user-authentication-v2.md
```

**Best For**:
- Requirements changed
- Design needs update
- Task breakdown needs refinement
- Iterative development

---

## Command Characteristics

### Speed
- ⚡ Fastest execution option
- ⚡ Minimal questions
- ⚡ Automated workflows
- ⚡ Batch-friendly

### Consistency
- ✅ Same quality every time
- ✅ Follows best practices
- ✅ Standard format
- ✅ Predictable output

### Limitations
- ❌ Less interactive than agents
- ❌ Less flexible than skills
- ❌ Fixed workflow steps
- ❌ Limited customization per run

### When to Use
- ✅ Know what you want
- ✅ Standard workflows
- ✅ Need speed
- ✅ Batch processing
- ✅ Automation/scripting

### When NOT to Use
- ❌ Learning the process
- ❌ Complex or unusual features
- ❌ Need extensive guidance
- ❌ Want deep customization

Use agents or skills for learning and complex cases.

---

## Command vs Agent vs Skill

### Command (Automated)
```bash
/spec-workflow payment-system
```
- Fast, automated execution
- Minimal interaction
- Produces documents
- Best for: Speed, batch processing

### Agent (Interactive)
```
@spec-orchestrator create spec for payment system
```
- Interactive workflow
- Guided process
- Validation gates
- Best for: First time, complex features

### Skill (Advisory)
```
"Help me write EARS requirements"
```
- Provides guidance
- No file creation
- Advisory role
- Best for: Learning, exploration

---

## Integration with Other Tools

### With Worktrees

After creating tasks, use worktree:
```bash
# Create specs
/spec-workflow new-feature

# Create isolated environment
/create_worktree new-feature
```

### With Hooks

Commands trigger hooks automatically:
- `UserPromptSubmit`: When command invoked
- `PreToolUse` / `PostToolUse`: During execution
- `Stop`: When command completes

Hooks provide observability and tracking.

### In Scripts

Commands can be scripted:
```bash
#!/bin/bash

# Batch create specs for multiple features
features=("auth" "search" "notifications")

for feature in "${features[@]}"; do
    echo "Creating spec for $feature..."
    claude /spec-workflow $feature
done
```

---

## File Naming Conventions

Commands use consistent naming:

**Input Features**:
- Use natural language: "user authentication"
- Spaces are fine: "file upload system"

**Output Files**:
- Kebab-case: `user-authentication`, `file-upload-system`
- Prefixed by phase: `requirements-`, `design-`, `tasks-`
- Extension: `.md`

**Examples**:
```bash
/spec-workflow "notification system"
→ requirements-notification-system.md
→ design-notification-system.md
→ tasks-notification-system.md
```

---

## Error Handling

### Missing Arguments
```bash
/spec-workflow
→ Error: Feature name required
→ Usage: /spec-workflow [feature-name]
```

### File Already Exists
```bash
/requirements user auth
→ Warning: specs/requirements-user-auth.md exists
→ Options: 1) Overwrite 2) Use different name 3) Cancel
```

### Missing Prerequisites
```bash
/design specs/requirements-missing.md
→ Error: Requirements file not found
→ Create requirements first: /requirements [description]
```

### Invalid File Path
```bash
/tasks wrong-path/design.md
→ Error: Design file not found at wrong-path/design.md
→ Check path and try again
```

---

## Advanced Usage

### Chaining Commands

```bash
# Create and immediately move to implementation
/spec-workflow new-feature && /create_worktree new-feature
```

### Custom Output Locations

Commands use environment or configuration:
```bash
# In .env or config
SPECS_DIR=custom/specs/path
```

### With Different Models

Commands can be configured for different models (requires settings update):
```json
{
  "commands": {
    "spec-workflow": {
      "model": "claude-sonnet-4-5"
    }
  }
}
```

---

## Best Practices

### Naming Features
- ✅ Use descriptive names: "user-authentication"
- ✅ Be specific: "file-upload-with-scanning"
- ❌ Too generic: "feature1"
- ❌ Too long: "comprehensive-user-authentication-system-with-oauth-and-2fa"

### Workflow Order
- ✅ Requirements first
- ✅ Design from requirements
- ✅ Tasks from design
- ❌ Don't skip phases
- ❌ Don't work backwards

### File Management
- ✅ Keep all specs in `specs/` directory
- ✅ Use consistent naming
- ✅ Version control all spec files
- ❌ Don't scatter specs across directories

### Quality Checks
- ✅ Review generated docs
- ✅ Validate at each phase
- ✅ Get stakeholder approval
- ❌ Don't blindly trust output
- ❌ Don't skip validation

---

## Summary

**4 Main Commands**:
- `/spec-workflow` - Complete three-phase workflow
- `/requirements` - Requirements only
- `/design` - Design from requirements
- `/tasks` - Tasks from design

**Characteristics**:
- Fast and automated
- Minimal interaction
- Consistent output
- Scriptable

**Best For**:
- Speed and efficiency
- Standard workflows
- Batch processing
- Experienced users

**Consider Agents Instead When**:
- Learning the process
- Complex or unusual features
- Want guidance and interaction
- First time creating specs

---

**Related Documentation**:
- [Main Guide](../../SPEC_DRIVEN_DEVELOPMENT.md)
- [Skills Documentation](../skills/README.md)
- [Agents Documentation](../agents/README.md)
- [Workflow Patterns](../../docs/workflow-patterns.md)

