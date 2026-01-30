---
description: Set the current work context to a specific app. All subsequent commands will default to this app until you switch or clear context.
argument-hint: "[app-name]" or "--clear"
allowed-tools: Write, Read, Bash, List
---

# Set Work Context Command

**Set which app you're working on so you don't have to specify it every time.**

## Purpose

When working with multiple apps in `apps/`, you often focus on one app at a time. This command sets that app as your "work context" so all future commands automatically default to it.

## Usage

```bash
# Set context to specific app
/set-context recipe-app

# Check current context
/set-context

# Clear context (return to multi-app mode)
/set-context --clear
```

## Aliases

- `/work-on [app-name]` - Same as `/set-context`
- `/context [app-name]` - Same as `/set-context`

## Workflow

### Step 1: Handle Different Actions

**If no argument** (check current context):
```bash
if [ -f .claude-work-context.json ]; then
  cat .claude-work-context.json | jq -r '"📍 Current context: \(.current_app)\nSet: \(.timestamp)"'
else
  echo "No work context set. Use: /set-context [app-name]"
fi
```

**If `--clear`** (clear context):
```bash
if [ -f .claude-work-context.json ]; then
  PREV_APP=$(jq -r '.current_app' .claude-work-context.json)
  rm .claude-work-context.json
  echo "✅ Work context cleared (was: $PREV_APP)"
else
  echo "No context was set"
fi
```

**If app name provided** (set context):

### Step 2: Validate App Exists

```bash
APP_NAME=$ARGUMENTS[0]

# Check if app directory exists
if [ ! -d "apps/$APP_NAME" ]; then
  echo "❌ Error: App 'apps/$APP_NAME/' not found"
  echo ""
  echo "Available apps:"
  ls -1 apps/
  exit 1
fi
```

### Step 3: Get Previous Context

```bash
# Check if context already exists
if [ -f .claude-work-context.json ]; then
  PREV_APP=$(jq -r '.current_app' .claude-work-context.json)
  ACTION="switched"
else
  PREV_APP=""
  ACTION="set"
fi
```

### Step 4: Write New Context

```bash
# Create/update context file
cat > .claude-work-context.json <<EOF
{
  "current_app": "$APP_NAME",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "previous_app": "$PREV_APP"
}
EOF
```

### Step 5: Report Success

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 WORK CONTEXT SET: [app-name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[If switching] Previous: [prev-app] → New: [app-name]
[If first time] Context: [app-name]

All commands will now default to 'apps/[app-name]/':

✅ Spec commands:
   @spec-orchestrator [feature]
   → Creates in apps/[app-name]/specs/

✅ Implementation:
   /implement-feature [feature]
   → Builds in apps/[app-name]/src/

✅ Status:
   /prime
   → Shows detailed status of [app-name]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 TIPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Check context: /set-context
• Switch apps: /set-context [other-app]
• Clear context: /set-context --clear
• Override: Specify app explicitly if needed

Your status line may show: 📍 [app-name]
```

## Examples

### Example 1: First Time Setting Context

```bash
$ /set-context recipe-app

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 WORK CONTEXT SET: recipe-app
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Context: recipe-app

All commands now default to 'apps/recipe-app/'
```

### Example 2: Switching Context

```bash
$ /set-context mobile-app

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 WORK CONTEXT SWITCHED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Previous: recipe-app → New: mobile-app

All commands now default to 'apps/mobile-app/'
```

### Example 3: Checking Current Context

```bash
$ /set-context

📍 Current context: recipe-app
Set: 2024-11-13T16:30:00Z
```

### Example 4: Clearing Context

```bash
$ /set-context --clear

✅ Work context cleared (was: recipe-app)

You're now in multi-app mode.
Specify app with each command:
/implement-feature [app-name] [feature]
```

### Example 5: Invalid App

```bash
$ /set-context nonexistent-app

❌ Error: App 'apps/nonexistent-app/' not found

Available apps:
recipe-app
mobile-app
api-server
admin-dashboard
```

## Integration with Other Commands

Once context is set, these commands work without specifying app:

### Spec Creation
```bash
# Context: recipe-app

@spec-orchestrator create spec for user authentication
# → Creates in apps/recipe-app/specs/

/batch-spec
# → Processes apps/recipe-app/specs/SPEC_CREATION_STATUS.md
```

### Implementation
```bash
# Context: recipe-app

/setup-environment
# → Sets up apps/recipe-app/src/, tests/, context/

/implement-feature user-auth
# → Implements in apps/recipe-app/

/prime
# → Shows detailed status of recipe-app
```

### Explicit Override
```bash
# Context is recipe-app, but need to work on mobile-app

/implement-feature mobile-app quick-feature
# → Works on mobile-app (doesn't change context)

# Context is still recipe-app
```

## Context File Format

**Location**: `.claude-work-context.json` (root directory, gitignored)

**Format**:
```json
{
  "current_app": "recipe-app",
  "timestamp": "2024-11-13T16:30:00Z",
  "previous_app": "mobile-app"
}
```

**Fields**:
- `current_app` (string): The app currently in context
- `timestamp` (string): When context was set (ISO 8601)
- `previous_app` (string): Previous app context (for quick switching)

## Best Practices

### When to Set Context

**Set context when**:
- ✅ Working on one app for extended period
- ✅ Creating multiple specs for same app
- ✅ Implementing multiple features in same app
- ✅ Want cleaner command syntax

**Don't set context when**:
- ❌ Frequently switching between apps
- ❌ Running one-off commands on different apps
- ❌ Reviewing status of multiple apps

### Workflow Examples

**Focused Development** (recommended):
```bash
# Morning: Work on recipe-app
/set-context recipe-app
@spec-orchestrator [feature]
/implement-feature [feature]

# Afternoon: Switch to mobile-app
/set-context mobile-app
@spec-orchestrator [feature]
/implement-feature [feature]
```

**Multi-App Mode** (no context):
```bash
/set-context --clear
/implement-feature recipe-app feature1
/implement-feature mobile-app feature2
/implement-feature api-server feature3
```

## Troubleshooting

### Issue: Context Not Persisting

**Cause**: File might be deleted or corrupted

**Solution**:
```bash
# Check if file exists
ls -la .claude-work-context.json

# Recreate context
/set-context [app-name]
```

### Issue: Commands Still Require App Name

**Cause**: Command/agent not updated to check context

**Solution**: File an issue - not all commands support context yet

### Issue: Wrong App Selected

**Cause**: Context file stale or incorrect

**Solution**:
```bash
# Check current context
/set-context

# Set correct app
/set-context [correct-app]
```

## Implementation Notes

### For Agent/Command Developers

When creating agents or commands, check for work context:

**Pattern**:
```bash
# Check for context file
if [ -f .claude-work-context.json ]; then
  CONTEXT_APP=$(jq -r '.current_app' .claude-work-context.json)
  echo "📍 Using work context: $CONTEXT_APP"
  # Use CONTEXT_APP as default if user didn't specify
fi
```

**Priority order**:
1. Explicit app name in command/request
2. Work context from `.claude-work-context.json`
3. Single app auto-detection
4. Ask user

## Related Commands

- `/prime` - Shows context app status if set
- `/prime [app-name]` - Can optionally set context
- All `/implement-*` commands use context
- All spec creation commands use context

---

**Set your work context and stop typing app names everywhere!** 📍


