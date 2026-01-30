# Spec Templates

Ready-to-use templates for creating specifications.

## Overview

Templates help you start creating specs quickly with the right structure and format.

## Available Templates

### From Kiro Methodology

The `kiro/spec-process-guide/templates/` directory contains comprehensive templates:

- **[requirements-template.md](../../kiro/spec-process-guide/templates/requirements-template.md)** - EARS-format requirements
- **[design-template.md](../../kiro/spec-process-guide/templates/design-template.md)** - Technical design structure
- **[tasks-template.md](../../kiro/spec-process-guide/templates/tasks-template.md)** - Implementation task breakdown

These templates are comprehensive with examples, checklists, and guidance.

## Claude Code Integration

### Using Templates with Skills

Skills automatically use these template structures:

```
"Help me create requirements for my feature"
→ requirements-skill activates
→ Follows requirements template structure
→ Guides you through EARS format
```

### Using Templates with Agents

Agents reference templates internally:

```
@requirements-agent create requirements for file upload
→ Uses requirements template structure
→ Generates EARS-format criteria
→ Produces properly structured document
```

### Using Templates with Commands

Commands generate documents following template structure:

```bash
/requirements user authentication system
→ Follows requirements template
→ Creates specs/requirements-user-authentication.md
→ Properly structured with all sections
```

## Template Sections

### Requirements Template Includes

- Document information (feature name, version, author)
- Introduction and scope
- Requirements with user stories
- EARS-format acceptance criteria
- Non-functional requirements
- Constraints and assumptions
- Success criteria
- Glossary
- Review checklist

### Design Template Includes

- Overview and context
- Architecture section
- Components and interfaces
- Data models
- Error handling strategy
- Testing strategy
- Design decisions
- Requirements traceability

### Tasks Template Includes

- Implementation overview
- Strategy selection
- Task hierarchy (epics + tasks)
- Task details with requirements references
- Dependencies and sequencing
- Notes and considerations

## Customizing Templates

### For Your Project

Create project-specific templates:

1. Copy Kiro templates as starting point
2. Add project-specific sections
3. Customize for your tech stack
4. Add company standards
5. Include team conventions

### Example Customization

Add sections for your needs:
```markdown
# Requirements: [Feature Name]

## Introduction
[Standard sections...]

## Company-Specific Sections
### Compliance Requirements
[HIPAA, SOC 2, GDPR requirements...]

### Cost Analysis
[Budget impact, ROI considerations...]

### Deployment Strategy
[Release plan, rollback procedures...]
```

## Using Templates Manually

### Step 1: Copy Template

```bash
cp kiro/spec-process-guide/templates/requirements-template.md specs/requirements-my-feature.md
```

### Step 2: Fill In Sections

Replace placeholders:
- `[Feature Name]` → Your feature name
- `[role]` → Actual user roles
- `[event]` → Specific events
- etc.

### Step 3: Follow Checklists

Use included checklists to validate quality.

## Template Best Practices

### Do

- ✅ Use templates as starting structure
- ✅ Customize for your project
- ✅ Follow EARS format for requirements
- ✅ Include all template sections
- ✅ Use checklists for validation

### Don't

- ❌ Skip template sections without reason
- ❌ Ignore format guidelines
- ❌ Remove traceability elements
- ❌ Forget validation checklists

## Integration with Workflow

### Templates in Orchestrator Workflow

```
@spec-orchestrator create spec for feature
↓
Requirements Phase: Uses requirements template structure
Design Phase: Uses design template structure
Tasks Phase: Uses tasks template structure
↓
Complete spec following all template patterns
```

### Templates in Direct Workflow

```bash
/spec-workflow my-feature
↓
Automatically applies:
- Requirements template structure
- Design template structure
- Tasks template structure
↓
Properly structured specs created
```

## Template Evolution

### Version Control

Keep templates in version control:
```
templates/
└── spec-templates/
    ├── README.md
    ├── requirements-v1.md
    ├── design-v1.md
    └── tasks-v1.md
```

### Team Standards

Evolve templates based on:
- Team feedback
- Project learnings
- Company standards
- Tool improvements

### Update Process

1. Propose template changes
2. Review with team
3. Update template files
4. Update skills/agents to match
5. Document changes

## Summary

**Templates Available**:
- Requirements (EARS format)
- Design (architecture and components)
- Tasks (implementation breakdown)

**Access**:
- Kiro templates: `kiro/spec-process-guide/templates/`
- Use via skills, agents, or commands
- Or copy and fill manually

**Integration**:
- Skills reference templates automatically
- Agents follow template structure
- Commands generate template-compliant docs

**Customization**:
- Start with Kiro templates
- Add project-specific sections
- Version control your templates
- Evolve based on team needs

Use templates for consistent, high-quality specifications every time.

---

**Related Documentation**:
- [Kiro Templates](../../kiro/spec-process-guide/templates/README.md)
- [Requirements Phase Guide](../../kiro/spec-process-guide/process/requirements-phase.md)
- [Design Phase Guide](../../kiro/spec-process-guide/process/design-phase.md)
- [Tasks Phase Guide](../../kiro/spec-process-guide/process/tasks-phase.md)


