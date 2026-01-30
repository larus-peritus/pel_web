# AI Documentation

## 🚨 Critical Context (Read First)

### Application Code Boundary

**[📖 Application Code Boundary](application-code-boundary.md)** - **MUST READ FOR ALL SPEC CREATION**

**Key Rule**: Only code in `apps/` directory is application code. Everything else is process management and should NOT be included in spec creation.

**Summary**:
- ✅ `apps/[app-name]/` - Application code (analyze for specs)
- ❌ `.claude/`, `kiro/`, `docs/`, `specs/`, etc. - Process management (exclude from specs)

---

## Repository Workflow System

This repository uses a complete spec-driven development system:

- **Methodology**: See `kiro/README.md` - Spec-driven development process
- **Skills**: See `.claude/skills/README.md` - Reusable expertise
- **Agents**: See `.claude/agents/README.md` - Specialized workflows
- **Commands**: See `.claude/commands/README.md` - Automated execution
- **Workflows**: See `docs/workflow-patterns.md` - Execution examples
- **Main Guide**: See `SPEC_DRIVEN_DEVELOPMENT.md` - Complete overview

---

## Claude Code Documentation

Official Claude Code documentation links:

### Core Features
- [Claude Code Sub-Agents](https://docs.claude.com/en/docs/claude-code/sub-agents) - Delegating to specialized agents
- [Slash Commands + Custom Commands](https://docs.claude.com/en/docs/claude-code/slash-commands) - Direct command execution
- [Agent Skills](https://docs.claude.com/en/docs/claude-code/skills) - Reusable capabilities
- [MCP Servers](https://docs.claude.com/en/docs/claude-code/mcp) - Model Context Protocol integration
- [Hooks](https://docs.anthropic.com/en/docs/claude-code/hooks) - Lifecycle event handling
- [Plugins](https://docs.claude.com/en/docs/claude-code/plugins) - External integrations

### Related Technologies
- [Gemini 2.5 Computer Use](https://blog.google/technology/google-deepmind/gemini-computer-use-model/) - Google's computer use model
- [OpenAI Realtime API](https://developers.openai.com/blog/realtime-api) - Real-time API developer notes
- [OpenAI Responses API](https://developers.openai.com/blog/responses-api) - Responses API documentation

---

## For AI Assistants

When working with this repository:

### Initial Setup
1. **Always run `/prime` first** to understand repository state
2. **Read `application-code-boundary.md`** to understand the critical boundary
3. **Detect scenario**: Empty `apps/` (greenfield) vs existing code

### Creating Specifications
1. **Only analyze code in `apps/` directory**
2. **Never reference process management code** (`.claude/`, `kiro/`, etc.)
3. **Create tasks that target `apps/[app-name]/`**
4. **Validate**: Is this in `apps/`? If not, it's not application code

### Guiding Users
- **Empty `apps/`**: Guide to `@app-planner` → `@spec-batch-processor`
- **Existing `apps/`**: Guide to `@spec-orchestrator` for new features
- **User unclear**: Ask if starting fresh or adding to existing app
- **User references process code**: Redirect to application code

### Enforcing Consistency
All spec-related agents, skills, and commands must:
- Respect the `apps/` boundary
- Focus only on application code
- Exclude process management from specs
- Guide users when they reference non-app code

---

## Quick Reference

**First time in repo?** Run:
```bash
/prime
```

**Starting new app?** Use:
```bash
@app-planner [your app idea]
@spec-batch-processor
```

**Adding to existing app?** Use:
```bash
@spec-orchestrator create spec for [feature]
```

**Need help?** See:
- [Quick Reference Guide](../docs/QUICK_REFERENCE.md)
- [Spec-Driven Development Overview](../SPEC_DRIVEN_DEVELOPMENT.md)
- [Greenfield App Workflow](../docs/greenfield-app-workflow.md)

---

**Remember**: `apps/` = application code. Everything else = framework.
