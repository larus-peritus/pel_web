
# Work Context - Focus on One App at a Time

**Set your work context once, then all commands automatically use that app.**

---

## The Problem

When working with multiple apps, you constantly specify the app name:

```bash
# Every. Single. Time. 😓
/implement-feature recipe-app user-auth
@spec-orchestrator create spec for cart in recipe-app
/batch-spec recipe-app
/prime recipe-app

# Switch to mobile-app? Repeat!
/implement-feature mobile-app notifications
@spec-orchestrator create spec for push in mobile-app
/batch-spec mobile-app
```

**This gets tedious fast!**

---

## The Solution: Work Context

Set your context once, then work naturally:

```bash
# Set context ONCE
/set-context recipe-app

# Now everything just works! ✨
@spec-orchestrator create spec for user auth
/batch-spec
/implement-feature user-auth
/prime

# Switch apps
/set-context mobile-app

# Now working on mobile-app
@spec-orchestrator create spec for notifications
```

---

## Quick Start

### 1. Set Context

```bash
/set-context [app-name]
```

**Example**:
```bash
/set-context recipe-app
```

**Output**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 WORK CONTEXT SET: recipe-app
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All commands now default to 'apps/recipe-app/'

✅ Spec commands → apps/recipe-app/specs/
✅ Implementation → apps/recipe-app/src/
✅ Status checks → apps/recipe-app/
```

### 2. Work Naturally

```bash
# No app name needed!
@spec-orchestrator create spec for user authentication
/batch-spec
/implement-feature user-auth
/prime
```

### 3. Switch When Needed

```bash
/set-context mobile-app
```

---

## Commands

### Set Context

```bash
/set-context [app-name]
# or
/work-on [app-name]
# or
/context [app-name]
```

**All three commands do the same thing.**

### Check Current Context

```bash
/set-context
```

**Output**:
```
📍 Current context: recipe-app
Set: 2024-11-13T16:30:00Z
```

### Clear Context

```bash
/set-context --clear
```

**Returns to multi-app mode** (must specify app with each command)

---

## How It Works

### Context File

**Location**: `.claude-work-context.json` (root directory)

**Format**:
```json
{
  "current_app": "recipe-app",
  "timestamp": "2024-11-13T16:30:00Z",
  "previous_app": "mobile-app"
}
```

**Gitignored**: Context is per-session, not committed

### Priority Order

When determining which app to use, the system checks:

1. **Explicit app name** in your command/request
2. **Work context** from `.claude-work-context.json`
3. **Single app auto-detect** (if only one app exists)
4. **Ask you** (if multiple apps and no context)

**Example**:
```bash
# Context is recipe-app

/implement-feature user-auth
→ Uses recipe-app (from context)

/implement-feature mobile-app notifications
→ Uses mobile-app (explicit override, context unchanged)
```

---

## What Commands Support Context?

### Fully Supported ✅

These commands automatically use work context:

**Spec Creation**:
- `@spec-batch-processor`
- `@spec-orchestrator`
- `@requirements-agent`
- `@design-agent`
- `@tasks-agent`
- `/batch-spec`

**Environment Setup**:
- `/setup-environment`

**Implementation**:
- `/implement-feature`
- `/implement-task`
- `@builder-agent`
- `@implementation-coordinator`

**Status**:
- `/prime` (shows detailed status of context app)

### Partial Support 🔄

These commands use context but can be explicitly overridden:

- `/prime [app-name]` - Analyzes specific app (doesn't change context)
- All commands with explicit app parameter

### Not Applicable ❌

These commands don't use context (they work across all apps):

- `@app-planner` - Creates new apps
- `/set-context` - Manages context itself

---

## Complete Workflow Examples

### Example 1: Building a Recipe App

```bash
# Set context for your work session
/set-context recipe-app

# Plan features
@app-planner I want to build a recipe sharing app
→ Creates: apps/recipe-app/APP_PLAN.md

# Create all specs
@spec-batch-processor
→ Processes: apps/recipe-app/specs/

# Setup environment
/setup-environment
→ Creates: apps/recipe-app/src/, tests/, context/

# Implement features
/implement-feature user-authentication
→ Builds in: apps/recipe-app/src/

/implement-feature recipe-creation
→ Builds in: apps/recipe-app/src/

# Check status
/prime
→ Shows: recipe-app detailed status
```

**No app name typed after initial `/set-context`!** 🎉

### Example 2: Working on Multiple Apps

```bash
# Morning: Work on web app
/set-context recipe-app
@spec-orchestrator create spec for user profiles
/implement-feature user-profiles

# Afternoon: Switch to mobile app
/set-context mobile-app
@spec-orchestrator create spec for push notifications
/implement-feature push-notifications

# Evening: Quick check on API server
/prime api-server
→ Shows api-server status (doesn't change context)

# Still on mobile-app
@spec-orchestrator create spec for offline sync
```

### Example 3: Focused Sprint

```bash
# Start of sprint: Set context
/set-context recipe-app

# Day 1: Spec phase
@spec-orchestrator create spec for search
@spec-orchestrator create spec for filters
/batch-spec
→ All work on recipe-app

# Day 2: Implementation
/implement-feature search
/implement-feature filters
→ All work on recipe-app

# Day 3: More features
@spec-orchestrator create spec for ratings
/implement-feature ratings
→ Still recipe-app

# End of sprint: Check status
/prime
→ recipe-app comprehensive status
```

### Example 4: Microservices Development

```bash
# You have: web-app, mobile-app, api-server, admin-dashboard

# Work on API first
/set-context api-server
@spec-orchestrator create spec for authentication API
@spec-orchestrator create spec for recipe API
/batch-spec
/implement-feature authentication-api

# Switch to web-app
/set-context web-app
@spec-orchestrator create spec for API integration
/implement-feature api-integration

# Quick check on mobile
/prime mobile-app
→ Doesn't change context (still web-app)

# Continue on web-app
/implement-feature recipe-list
```

---

## Best Practices

### When to Use Context

**Use context when**:
- ✅ Working on one app for extended period
- ✅ Creating multiple specs for same app
- ✅ Implementing several features in sequence
- ✅ Want cleaner, more natural commands
- ✅ Focused development sprint on one app

**Example**: Building out a feature set for recipe-app over 2-3 days

### When NOT to Use Context

**Skip context when**:
- ❌ Frequently switching between apps (every few commands)
- ❌ Running one-off commands on different apps
- ❌ Comparing or reviewing multiple apps
- ❌ Quick status checks across all apps

**Example**: Reviewing status of all 4 apps, implementing one small fix in each

### Switching Context

**Switch when your focus changes**:

```bash
# Morning standup: Working on recipe-app
/set-context recipe-app
[work for 2-3 hours]

# After lunch: Switching to mobile-app
/set-context mobile-app
[work for 2-3 hours]

# End of day: Quick reviews
/set-context --clear
/prime  # See all apps
```

**Don't switch** for quick detours:

```bash
# Context: recipe-app (your main focus)

# Quick check on mobile-app (don't switch!)
/prime mobile-app

# Quick fix on api-server (override once)
/implement-feature api-server quick-fix

# Back to recipe-app work (context unchanged)
/implement-feature user-profiles
```

### Clear Context

**Clear when**:
- ✅ End of work session
- ✅ Need to review all apps
- ✅ Switching between apps frequently
- ✅ Want explicit control

```bash
# Clear at end of day
/set-context --clear

# Clear for multi-app review session
/set-context --clear
/prime  # Shows all apps
/prime recipe-app
/prime mobile-app
/prime api-server
```

---

## Status Line Integration

Your status line can show the current work context:

**When context is set**:
```
📍 recipe-app
```

**When no context**:
```
(empty or default status line)
```

**Configuration** (`.claude/settings.json`):
```json
{
  "statusLine": {
    "type": "command",
    "command": "if [ -f .claude-work-context.json ]; then echo \"📍 $(jq -r '.current_app' .claude-work-context.json)\"; fi",
    "padding": 1
  }
}
```

---

## Troubleshooting

### Context Not Working

**Symptom**: Commands still ask for app name

**Possible Causes**:
1. Command/agent not updated yet to support context
2. Context file missing or corrupted
3. Explicitly specifying app name (overrides context)

**Solutions**:
```bash
# Check if context is set
/set-context

# Recreate context
/set-context [app-name]

# Check file exists
ls -la .claude-work-context.json
```

### Wrong App Selected

**Symptom**: Commands using unexpected app

**Cause**: Context set to different app than you think

**Solution**:
```bash
# Check current context
/set-context

# Set correct app
/set-context [correct-app]
```

### Context Persists After Session

**Symptom**: Old context from previous session

**Cause**: Context file not cleared

**Solution**:
```bash
# Clear context
/set-context --clear

# Or delete file
rm .claude-work-context.json
```

---

## Advanced Usage

### Quick Switch

```bash
# Save previous app in context file
/set-context recipe-app  # previous_app becomes mobile-app
/set-context mobile-app  # previous_app becomes recipe-app

# Could implement /switch-context to toggle between current and previous
```

### Context in Scripts

```bash
# Check context in shell script
if [ -f .claude-work-context.json ]; then
  APP=$(jq -r '.current_app' .claude-work-context.json)
  echo "Working on: $APP"
fi
```

### Context in Python

```python
from pathlib import Path
import json

def get_work_context():
    context_file = Path(".claude-work-context.json")
    if context_file.exists():
        with open(context_file) as f:
            data = json.load(f)
        return data.get("current_app")
    return None

app = get_work_context()
if app:
    print(f"Working on: {app}")
```

---

## Comparison: With vs Without Context

### Without Context (Old Way)

```bash
# Must specify app every time
/implement-feature recipe-app user-auth
/implement-feature recipe-app recipe-creation
@spec-orchestrator create spec for search in recipe-app
/batch-spec recipe-app
/prime recipe-app

# Lots of typing!
# Easy to make typos
# Mental overhead remembering to specify app
```

### With Context (New Way)

```bash
# Set once
/set-context recipe-app

# Then work naturally
/implement-feature user-auth
/implement-feature recipe-creation
@spec-orchestrator create spec for search
/batch-spec
/prime

# Much cleaner!
# Fewer typos
# Natural workflow (you're "in" an app)
```

---

## FAQ

### Q: Does context persist across Claude Code sessions?

**A**: No, context is session-specific. The file is gitignored and should be cleared between sessions. You can set it again when you start working.

### Q: Can I set context in the middle of a command?

**A**: No, set context first, then run commands. Context is checked at the start of each command.

### Q: What if I forget which app I'm on?

**A**: Run `/set-context` with no arguments to check, or look at your status line if configured.

### Q: Does setting context change any files in my apps?

**A**: No, it only creates `.claude-work-context.json` in the root (which is gitignored). Your apps are untouched.

### Q: Can multiple people work with different contexts?

**A**: Yes, if they have separate repository clones. The context file is not shared via git.

### Q: What if the context app gets deleted?

**A**: Commands will fail with "app not found". Clear context and set a new one:
```bash
/set-context --clear
/set-context [existing-app]
```

---

## Summary

**Work context makes multi-app development natural and efficient:**

✅ **Set once**: `/set-context [app-name]`  
✅ **Work naturally**: All commands use context app  
✅ **Switch easily**: `/set-context [other-app]`  
✅ **Clear when done**: `/set-context --clear`  
✅ **Override when needed**: Explicit app name still works  

**Like `cd` for your development workflow!** 📍

---

## Related Documentation

- [Multi-App Architecture](MULTI_APP_ARCHITECTURE.md) - How multi-app structure works
- [README](../README.md) - Main repository documentation
- [Prime Command](PRIME_COMMAND_ENHANCEMENTS.md) - Using /prime with context
- [Commands](../.claude/commands/README.md) - All available commands

---

**Set your context and stop typing app names everywhere!** 🚀


