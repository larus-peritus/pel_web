# Implementation Context

This directory tracks the current state of implementation for all features in your application.

## Purpose

The `context/` directory serves as the **single source of truth** for:
- What has been implemented
- What modules exist and how they work
- Overall system architecture
- Integration points between components
- Current implementation status

**Builder agents read this context before implementing any task** to ensure consistency, avoid duplication, and follow established patterns.

## Directory Structure

```
context/
├── README.md                    ← This file
├── architecture.md              ← Overall system architecture
├── IMPLEMENTATION_STATUS.md     ← Current implementation status
├── features/
│   ├── [feature-1].md          ← Feature-specific documentation
│   ├── [feature-2].md
│   └── ...
└── modules/
    ├── [Module1].md            ← Module-specific documentation
    ├── [Module2].md
    └── ...
```

## Files

### architecture.md

**Purpose**: Document the overall system architecture

**Contains**:
- Application structure
- Technology stack
- Architectural decisions
- Patterns and conventions
- Dependencies
- Integration points

**Updated**: When architecture changes (rarely after initial setup)

**Template**: `context/architecture.md.template`

### IMPLEMENTATION_STATUS.md

**Purpose**: Track implementation progress for all features

**Contains**:
- Feature list with status
- Completed tasks
- In-progress tasks
- Pending tasks
- What was created (files, modules)
- Last updated timestamp

**Updated**: After each task completion

**Template**: `context/IMPLEMENTATION_STATUS.md.template`

### features/[feature-name].md

**Purpose**: Document a specific feature's implementation

**Contains**:
- Feature overview (from requirements)
- Architecture (from design)
- Implementation status
- Modules that implement this feature
- Dependencies
- Tests
- Notes and decisions

**Updated**: As feature implementation progresses

**Template**: `context/features/FEATURE_TEMPLATE.md`

### modules/[ModuleName].md

**Purpose**: Document a specific module's implementation

**Contains**:
- Module location and purpose
- Exports (classes, functions, types)
- Key functionality
- Dependencies
- Tests
- Integration points
- Usage examples

**Updated**: When module is created or modified

**Template**: `context/modules/MODULE_TEMPLATE.md`

## Workflow Integration

### Builder Agent Workflow

When a builder-agent implements a task:

1. **Reads context**:
   - `architecture.md` - Understand overall structure
   - `IMPLEMENTATION_STATUS.md` - Know current state
   - `features/[feature].md` - Understand feature being built
   - Relevant `modules/*.md` - Reuse existing modules

2. **Implements task** in `apps/` directory

3. **Updates context**:
   - Creates/updates `modules/[Module].md` for new code
   - Updates `IMPLEMENTATION_STATUS.md` with completion
   - Updates `features/[feature].md` with progress

4. **Marks task complete** in `specs/[feature]-tasks.md`

### Implementation Coordinator Workflow

When implementation-coordinator manages multiple tasks:

1. **Reads** `IMPLEMENTATION_STATUS.md` to find pending tasks
2. **Spawns** builder-agents for each task (1:1 mapping)
3. **Waits** for batch to complete
4. **Aggregates** results and updates overall status
5. **Continues** with next batch

## Best Practices

### Keep Context Current

**Context should always reflect the actual state of the code**:
- Update context immediately when code changes
- Don't wait until feature is complete
- Include timestamp with updates
- Note who/what made the change

### Be Specific and Clear

**Good context documentation**:
- ✅ "Implemented User.validateEmail() using RFC 5322 regex pattern"
- ✅ "AuthService uses bcrypt with salt rounds = 10 for password hashing"
- ✅ "Database migrations are in apps/my-app/migrations/, run with `npm run migrate`"

**Bad context documentation**:
- ❌ "Added email validation"
- ❌ "Password stuff works"
- ❌ "Database things"

### Link Related Components

**Always show relationships**:
- Which requirements this module implements
- Which other modules this integrates with
- Where tests are located
- What design decisions were made

### Use Examples

**Show how to use modules**:
```typescript
// Example usage in module documentation
import { AuthService } from './services/AuthService';

const auth = new AuthService();
const token = await auth.login(email, password);
```

## Context Lifecycle

### Initial Setup

When starting a new project:

1. Copy templates to create initial files:
   ```bash
   cp context/architecture.md.template context/architecture.md
   cp context/IMPLEMENTATION_STATUS.md.template context/IMPLEMENTATION_STATUS.md
   ```

2. Fill in initial architecture information
3. Initialize with features from APP_PLAN.md

### During Implementation

As features are built:

1. Builder agents create module documentation
2. Builder agents update implementation status
3. Implementation coordinator aggregates progress
4. Context grows naturally as code is written

### Maintenance

Keep context accurate:

1. Update when code changes
2. Remove outdated information
3. Correct inconsistencies
4. Add examples and clarifications

## Context vs Specs

### Specs (`specs/` directory)

- **What to build** (requirements)
- **How to architect it** (design)
- **Steps to implement** (tasks)
- Created before implementation
- Relatively static

### Context (`context/` directory)

- **What has been built**
- **How it actually works**
- **Current state of implementation**
- Updated during implementation
- Always evolving

**Relationship**: Specs are the plan, Context is the reality.

## Templates

All templates are in the `context/` directory:

- `architecture.md.template` - System architecture template
- `IMPLEMENTATION_STATUS.md.template` - Status tracking template
- `features/FEATURE_TEMPLATE.md` - Feature documentation template
- `modules/MODULE_TEMPLATE.md` - Module documentation template

Copy and customize for your project.

## Integration with Hooks

### Post-Task Hook

After a builder-agent completes a task:
- Hook reads the context updates
- Optionally triggers notifications
- Logs implementation events

### Pre-Task Hook

Before a builder-agent starts a task:
- Hook ensures context is loaded
- Validates context is available
- Logs task start

See `.claude/hooks/` for hook implementations.

## FAQ

**Q: When should context be updated?**  
A: Immediately after implementing any code. Don't wait.

**Q: Who updates context?**  
A: Builder agents update module docs and feature progress. Implementation coordinator updates overall status.

**Q: What if context gets out of sync with code?**  
A: Fix it immediately. Context must reflect reality. Review and update regularly.

**Q: How detailed should context be?**  
A: Detailed enough that a new builder agent can understand and integrate properly. Include examples.

**Q: Can I delete old context files?**  
A: Only if the corresponding code is also deleted. Keep context synchronized with code.

---

**Context is the memory of your implementation. Keep it accurate, clear, and current!**


