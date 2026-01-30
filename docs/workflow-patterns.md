# Spec-Driven Development Workflow Patterns

Complete examples showing different ways to create specifications using Skills, Agents, and Commands.

## Overview

Four execution options for spec-driven development:
1. **Orchestrator Agent**: Guided interactive workflow
2. **Phase-Specific Agents**: Focused work on individual phases
3. **Direct Commands**: Fast automated execution
4. **Skills via Conversation**: Natural advisory interaction

Choose based on experience level, feature complexity, and time constraints.

---

## Pattern 1: Orchestrator Agent Workflow

**Best For**: First time, complex features, need guidance

### Complete Example: User Authentication Feature

**Step 1: Invoke Orchestrator**
```
@spec-orchestrator create spec for user authentication with email and password
```

**Step 2: Requirements Phase**

Orchestrator asks:
- "Who are the users? (roles)"
- "What are the constraints? (technical, business)"
- "What defines success?"
- "What's in scope and out of scope?"

You answer:
- Users: New users (registration), returning users (login)
- Constraints: Must use bcrypt for passwords, 2-second auth SLA
- Success: Secure auth with account lockout after 3 failures
- In scope: Registration, login, password reset | Out of scope: OAuth, 2FA

Orchestrator creates:
- User stories with clear value
- EARS acceptance criteria
- Non-functional requirements
- Validates completeness

**Output**: `specs/requirements-user-authentication.md`

**Gate**: "Are these requirements complete and accurate?" → You approve

**Step 3: Design Phase**

Orchestrator:
- Loads approved requirements
- Designs JWT-based auth architecture
- Defines AuthService, UserRepository, SessionManager components
- Plans bcrypt hashing, Redis sessions
- Documents technology decisions
- Creates error handling strategy

**Output**: `specs/design-user-authentication.md`

**Gate**: "Does this design satisfy all requirements?" → You approve

**Step 4: Tasks Phase**

Orchestrator:
- Analyzes design components
- Chooses foundation-first sequencing
- Creates 12 tasks:
  1. Setup (2 tasks)
  2. Data models (2 tasks)
  3. Services (3 tasks)
  4. API endpoints (3 tasks)
  5. Security & testing (2 tasks)
- Sequences with dependencies
- Sizes each task (2-6 hours)

**Output**: `specs/tasks-user-authentication.md`

**Step 5: Complete**

```
✅ Complete Specification Created

Files:
- specs/requirements-user-authentication.md
- specs/design-user-authentication.md
- specs/tasks-user-authentication.md

Next: Optional worktree or begin implementation
```

**Time**: 30-45 minutes | **Interaction**: High | **Guidance**: Maximum

---

## Pattern 2: Phase-Specific Agents Workflow

**Best For**: Experienced users, working on specific phase, revisions

### Complete Example: File Upload Feature

**Phase 1: Requirements Agent**
```
@requirements-agent create requirements for file upload with virus scanning and thumbnail generation
```

Agent focuses on requirements:
- Creates user stories for upload, scan, thumbnail
- Writes EARS criteria for file size, types, scanning, processing
- Defines performance requirements (upload speed, scan time)
- Validates requirements quality

**Output**: `specs/requirements-file-upload.md`

**Time**: 10-15 minutes

---

**Phase 2: Design Agent**
```
@design-agent create design from specs/requirements-file-upload.md
```

Agent loads requirements and:
- Can research if needed: "Need Stripe API docs?" → Delegates to docs-scraper
- Designs S3 direct upload with pre-signed URLs
- Plans background worker for scan/thumbnail
- Defines FileController, ProcessingWorker, S3Service components
- Documents decision: "S3 vs local storage - chose S3 for scale"

**Output**: `specs/design-file-upload.md`

**Time**: 15-20 minutes

---

**Phase 3: Tasks Agent**
```
@tasks-agent create tasks from specs/design-file-upload.md
```

Agent analyzes design and:
- Chooses risk-first strategy (validate S3 integration early)
- Creates 14 tasks across 5 epics
- Sequences: S3 validation → Foundation → Processing → API → Integration
- Notes parallel opportunities
- Suggests worktree for isolated testing

**Output**: `specs/tasks-file-upload.md`

**Time**: 10-15 minutes

---

**Total Time**: 35-50 minutes | **Interaction**: Medium | **Flexibility**: Maximum

---

## Pattern 3: Direct Commands Workflow

**Best For**: Speed, batch processing, known requirements, experienced users

### Complete Example: Notification System

**Option A: One Command**
```bash
/spec-workflow notification-system
```

Executes all three phases with minimal prompts:
- Requirements: Asks key questions, creates EARS criteria
- Design: Analyzes requirements, designs event-driven architecture
- Tasks: Breaks into hybrid sequenced tasks

**Outputs**:
- `specs/requirements-notification-system.md`
- `specs/design-notification-system.md`
- `specs/tasks-notification-system.md`

**Time**: 15-25 minutes | **Interaction**: Minimal

---

**Option B: Phase-by-Phase Commands**
```bash
# Phase 1
/requirements real-time notifications with WebSocket and push delivery

# Review requirements.md, then Phase 2
/design specs/requirements-real-time-notifications.md

# Review design.md, then Phase 3
/tasks specs/design-real-time-notifications.md
```

**Time**: 30-40 minutes with review breaks | **Interaction**: Minimal

**Best When**:
- Want to review between phases
- Different people handling phases
- Iterative refinement needed

---

## Pattern 4: Skills via Conversation

**Best For**: Learning, exploration, specific questions, advisory

### Complete Example: Search Feature (Conversational)

**Getting Requirements Help**
```
User: "I need help writing requirements for a search feature with filters"

→ requirements-skill activates automatically

Response provides:
- EARS format examples for search queries
- Filter acceptance criteria patterns
- Performance requirement templates
- Validation checklist
```

**Getting Design Help**
```
User: "What architecture pattern should I use for search?"

→ design-skill activates automatically

Response provides:
- Elasticsearch vs database search comparison
- Architecture patterns
- Component design suggestions
- Decision framework
```

**Getting Task Help**
```
User: "How should I sequence search implementation tasks?"

→ tasks-skill activates automatically

Response provides:
- Sequencing strategies
- Example task breakdown
- Dependency management tips
```

**Characteristics**:
- No file creation (advisory only)
- Natural conversation
- Deep expertise on demand
- Learning-focused

**To Create Files**: Use agents or commands after getting advice

---

## Decision Matrix

| Scenario | Recommended Approach | Why |
|----------|---------------------|-----|
| First time creating specs | Orchestrator Agent | Maximum guidance and validation |
| Complex/unusual feature | Orchestrator Agent | Interactive problem-solving |
| Revising one phase | Phase-Specific Agent | Focused expertise |
| Standard feature, experienced user | Commands | Speed and efficiency |
| Batch creating multiple specs | Commands | Automation-friendly |
| Learning process | Skills | Advisory without commitment |
| Need documentation research | Design Agent | Can delegate to docs-scraper |
| Working on team, different people per phase | Commands or Phase Agents | Clear handoffs |

---

## Hybrid Workflows

### Hybrid 1: Orchestrator + Manual Design

```
# Use orchestrator for requirements and tasks
@spec-orchestrator create spec for payment system

# When it reaches design phase, ask to pause
"Let me design this manually, skip to tasks after"

# Manually create design
[Work with design-agent or manually]

# Resume with tasks
@tasks-agent create tasks from specs/design-payment-system.md
```

### Hybrid 2: Commands for Standard, Agent for Complex

```
# Standard requirements via command
/requirements basic CRUD for products

# Complex design via agent for guidance
@design-agent create design with research from specs/requirements-products.md

# Standard tasks via command
/tasks specs/design-products.md
```

### Hybrid 3: Skills for Learning, Agent for Execution

```
# Learn about EARS format
"Explain EARS format with examples"
→ requirements-skill provides examples

# Then execute with agent
@requirements-agent create requirements using those patterns
```

---

## Real-World Scenarios

### Scenario 1: Startup MVP (Speed Priority)

**Approach**: Direct commands
```bash
/spec-workflow user-auth
/spec-workflow product-catalog
/spec-workflow shopping-cart
/spec-workflow checkout
```

**Why**: Fast execution, standard features, experienced founder

**Time**: 2-3 hours for 4 complete specs

---

### Scenario 2: Enterprise Feature (Quality Priority)

**Approach**: Orchestrator agent with reviews
```
@spec-orchestrator create spec for compliance reporting system
[Pause for stakeholder review after each phase]
```

**Why**: Complex requirements, multiple stakeholders, quality gates critical

**Time**: Multiple days with review cycles

---

### Scenario 3: Open Source Contribution

**Approach**: Phase-specific agents with community input
```
# Create requirements, share for feedback
@requirements-agent create requirements for plugin system

# After community feedback, design
@design-agent create design from updated requirements

# Break into good-first-issue tasks
@tasks-agent create tasks with clear descriptions
```

**Why**: Community collaboration, need clear documentation, incremental work

---

## Tips for Success

### For Orchestrator Workflow
- ✅ Answer questions thoughtfully
- ✅ Provide context upfront
- ✅ Trust the validation gates
- ✅ Review before approving

### For Agent Workflows
- ✅ Have clear phase focus
- ✅ Load previous phase documents
- ✅ Use specialized capabilities (design-agent research)
- ✅ Review outputs carefully

### For Command Workflows
- ✅ Know what you want
- ✅ Have feature details ready
- ✅ Review generated docs
- ✅ Iterate if needed

### For Skill Workflows
- ✅ Ask specific questions
- ✅ Explore options
- ✅ Learn patterns
- ✅ Then execute with agents/commands

---

## Summary

**Orchestrator Agent**:
- Most guidance
- Quality gates
- Best for learning
- 30-60 minutes

**Phase Agents**:
- Focused expertise
- Flexible workflow
- Good for experienced users
- 10-20 minutes per phase

**Commands**:
- Fastest execution
- Minimal interaction
- Best for standard features
- 5-15 minutes per phase

**Skills**:
- Advisory only
- Learning focused
- No file creation
- On-demand help

**Choose based on experience, complexity, and time constraints.**

---

**Next Steps**:
- [Worktree Integration](worktree-integration.md) - Isolated implementation environments
- [Hooks Integration](hooks-integration.md) - Event tracking and observability
- [Main Guide](../SPEC_DRIVEN_DEVELOPMENT.md) - Complete system overview


