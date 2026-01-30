# Builder Agent Notification System

**Comprehensive guide to getting notified when builder agents complete tasks.**

---

## Overview

The builder agent notification system provides multiple layers of feedback when implementation tasks complete:
1. **Visual Report** - Detailed markdown completion report
2. **Completion Marker** - JSON file with task metadata
3. **Logging** - Persistent logs in app-specific context
4. **TTS Notifications** - Audio alerts via text-to-speech
5. **SubagentStop Hook** - Automatic detection and announcement

---

## How It Works

### Flow Diagram

```
Builder Agent Completes Task
    ↓
1. Creates .builder-completion.json (metadata)
    ↓
2. Displays Visual Report (markdown)
    ↓
3. PostToolUse Hook Detects Completion
    ↓
4. task_complete.py Processes Marker
    ↓
5. Logs to apps/[app]/context/logs/
    ↓
6. Triggers TTS Notification
    ↓
7. SubagentStop Hook (with --notify flag)
    ↓
8. You Get Notified! 🔔
```

---

## Notification Layers

### 1. Visual Report (Always)

**What**: Detailed markdown report in Claude Code interface

**When**: Immediately when task completes

**Example**:
```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ TASK COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Feature: user-authentication
Task: 1.2 - Create login form component
App: recipe-app

📁 Files Created:
- apps/recipe-app/src/components/LoginForm.tsx (145 lines)
- apps/recipe-app/tests/LoginForm.test.tsx (78 lines)

📝 Context Updated:
- apps/recipe-app/context/modules/LoginForm.md (created)
- apps/recipe-app/context/IMPLEMENTATION_STATUS.md (updated)
- apps/recipe-app/context/features/user-authentication.md (updated)

✅ Task marked complete in apps/recipe-app/specs/user-authentication-tasks.md

🧪 Tests: All passing
📊 Requirements fulfilled: REQ-1.2, REQ-1.3

⏱️ Completion Time: 2024-11-13T15:30:00Z

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔔 NOTIFICATION TRIGGERED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A completion notification has been triggered via hooks.
You will receive an alert that this task is complete.
```

### 2. Completion Marker File

**What**: `.builder-completion.json` with task metadata

**When**: Created by builder-agent

**Format**:
```json
{
  "task_id": "1.2",
  "feature_name": "user-authentication",
  "app_name": "recipe-app",
  "files_created": [
    "apps/recipe-app/src/components/LoginForm.tsx",
    "apps/recipe-app/tests/LoginForm.test.tsx"
  ],
  "timestamp": "2024-11-13T15:30:00Z",
  "status": "complete"
}
```

**Lifecycle**:
- Created by builder-agent in Step 6
- Detected by task_complete.py hook
- Processed (logged, notifications triggered)
- Automatically deleted after processing

### 3. Persistent Logging

**What**: JSONL logs in app-specific context

**Where**: `apps/[app-name]/context/logs/task_completions.log`

**Format** (one JSON object per line):
```json
{"timestamp": "2024-11-13T15:30:00Z", "app": "recipe-app", "feature": "user-authentication", "task_id": "1.2", "files_created": ["apps/recipe-app/src/components/LoginForm.tsx", "apps/recipe-app/tests/LoginForm.test.tsx"]}
```

**Benefits**:
- Historical record of all completions
- Easy to parse programmatically
- Per-app isolation
- Can generate completion reports

**Query Examples**:
```bash
# View all completions for an app
cat apps/recipe-app/context/logs/task_completions.log | jq .

# Count completions
wc -l apps/recipe-app/context/logs/task_completions.log

# Find specific feature completions
cat apps/recipe-app/context/logs/task_completions.log | jq 'select(.feature == "user-authentication")'
```

### 4. TTS Notifications

**What**: Text-to-speech audio alerts

**When**: After completion marker is processed

**Message**: "Builder agent complete. [app-name]. [feature-name]. Task [task-id]."

**Supported TTS Systems** (priority order):
1. **ElevenLabs** - High-quality AI voices (requires API key)
2. **OpenAI TTS** - OpenAI text-to-speech (requires API key)
3. **pyttsx3** - Local Python TTS (no API key needed)
4. **System `say`** - macOS built-in (fallback)

**Configuration**:
```bash
# For ElevenLabs (recommended)
export ELEVENLABS_API_KEY=your_key_here

# For OpenAI TTS
export OPENAI_API_KEY=your_key_here

# For pyttsx3 or system say
# No configuration needed
```

### 5. SubagentStop Hook

**What**: Automatic detection when builder-agent subagent stops

**Configuration**: `.claude/settings.json`

**Specific for Builder Agents**:
```json
{
  "SubagentStop": [
    {
      "matcher": "builder-agent",
      "hooks": [
        {
          "type": "command",
          "command": "uv run $CLAUDE_PROJECT_DIR/.claude/hooks/subagent_stop.py --notify"
        }
      ]
    }
  ]
}
```

**The `--notify` flag**: Enables TTS announcement

**Message**: "Subagent Complete"

---

## Configuration

### Enable All Notifications

**Default**: All notification layers are enabled

**Requirements**:
- Python 3.11+ (for hooks)
- `uv` package manager (for running hooks)
- Optional: API keys for advanced TTS

### Disable Specific Notifications

**To disable TTS**:
Edit `.claude/settings.json`:
```json
{
  "matcher": "builder-agent",
  "hooks": [
    {
      "type": "command",
      "command": "uv run $CLAUDE_PROJECT_DIR/.claude/hooks/subagent_stop.py"
      // Removed --notify flag
    }
  ]
}
```

**To disable logging**:
Comment out the logging calls in `.claude/hooks/task_complete.py`

### Customize TTS Messages

**Edit**: `.claude/hooks/task_complete.py`

**Function**: `announce_builder_completion()`

```python
def announce_builder_completion(app_name: str, feature_name: str, task_id: str):
    # Customize this message
    message = f"Task {task_id} done for {app_name}"
    # ... rest of function
```

---

## Notification Scenarios

### Scenario 1: Single Task Implementation

```bash
# User runs
@builder-agent recipe-app user-authentication 1.2

# What happens:
1. Builder works on task 1.2
2. Creates code and tests
3. Updates context
4. Creates .builder-completion.json
5. Shows visual report
6. Hook detects completion
7. Logs to apps/recipe-app/context/logs/
8. TTS announces: "Builder agent complete. recipe-app. user-authentication. Task 1.2."
9. Subagent stops
10. SubagentStop hook announces: "Subagent Complete"

# Result: You get 2 audio notifications + visual report + logs
```

### Scenario 2: Multiple Tasks via Implementation Coordinator

```bash
# User runs
@implementation-coordinator recipe-app user-authentication

# What happens:
1. Coordinator reads user-authentication-tasks.md
2. Finds 5 pending tasks
3. Creates 3 builder-agent subagents (batch 1)
4. Each builder works independently
5. As each completes:
   - Visual report
   - Completion marker
   - Logging
   - TTS notification
6. After batch 1 completes (3 tasks):
   - Coordinator gets SubagentStop notification (with --notify)
   - "Subagent Complete" announcement
7. Coordinator starts batch 2 (2 tasks)
8. Repeat notifications for each task

# Result: You get notified for EACH task completion + coordinator completion
```

### Scenario 3: Parallel Multi-Feature Implementation

```bash
# User runs 3 implementations in parallel
@implementation-coordinator recipe-app user-authentication
@implementation-coordinator recipe-app recipe-creation
@implementation-coordinator recipe-app recipe-browsing

# What happens:
# Each coordinator spawns builder agents
# You get notifications for:
- Every individual task (from builder-agents)
- Every coordinator batch completion
- Every coordinator final completion

# Result: Lots of notifications! 🔔🔔🔔
```

---

## Troubleshooting

### Issue: No TTS Notifications

**Symptoms**: Visual reports work, but no audio

**Possible Causes**:
1. No TTS system available
2. API keys not set
3. `uv` not installed
4. Python version < 3.11

**Solutions**:
```bash
# Check if say command available (macOS)
which say

# Check if uv available
which uv

# Install uv if needed
curl -LsSf https://astral.sh/uv/install.sh | sh

# Set API keys
export ELEVENLABS_API_KEY=your_key
# or
export OPENAI_API_KEY=your_key

# Test TTS manually
cd .claude/hooks/utils/tts
uv run pyttsx3_tts.py "Test message"
```

### Issue: Completion Marker Not Deleted

**Symptoms**: `.builder-completion.json` remains after completion

**Cause**: Hook failed to process marker

**Solution**:
```bash
# Manually check marker
cat .builder-completion.json

# Manually delete
rm .builder-completion.json

# Check hook logs
cat apps/[app]/context/logs/task_completions.log
```

### Issue: No Logging

**Symptoms**: No files in `apps/[app]/context/logs/`

**Causes**:
1. Hook not executing
2. Permission issues
3. Path doesn't exist

**Solutions**:
```bash
# Manually create logs directory
mkdir -p apps/[app]/context/logs

# Check hook is registered
cat .claude/settings.json | grep task_complete

# Test hook manually
echo '{"tool_name": "Write", "tool_arguments": {"file_path": ".builder-completion.json"}}' | \
  python .claude/hooks/task_complete.py
```

### Issue: Too Many Notifications

**Symptoms**: Overwhelmed by audio alerts

**Solution**: Disable TTS for routine tasks

**Edit** `.claude/settings.json`:
```json
{
  "SubagentStop": [
    {
      "matcher": "builder-agent",
      "hooks": [
        {
          "type": "command",
          "command": "uv run $CLAUDE_PROJECT_DIR/.claude/hooks/subagent_stop.py"
          // No --notify flag = no TTS
        }
      ]
    }
  ]
}
```

Keep visual reports and logging, skip audio.

---

## Best Practices

### 1. Use Notifications Strategically

**Enable for**:
- Long-running tasks (>5 minutes)
- Parallel implementations
- When multitasking (working on other things)

**Disable for**:
- Quick tasks
- When actively monitoring
- When notifications are disruptive

### 2. Monitor Logs Regularly

```bash
# Weekly review
cat apps/*/context/logs/task_completions.log | jq .

# Generate completion report
cat apps/*/context/logs/task_completions.log | \
  jq -r '[.app, .feature, .task_id] | @csv' | \
  sort | uniq -c
```

### 3. Customize for Your Workflow

**Option A: Silent Mode** (visual only)
- Remove TTS from hooks
- Keep logging and visual reports

**Option B: Critical Only** (coordinator completions only)
- TTS only for implementation-coordinator
- No TTS for individual builder-agents

**Option C: Full Notifications** (default)
- All layers enabled
- Best for parallel development

---

## Summary

**Notification System Features**:
- ✅ Multi-layer feedback (visual, audio, logs)
- ✅ Multi-app aware (logs per app)
- ✅ Configurable (enable/disable as needed)
- ✅ Persistent logging (historical records)
- ✅ Multiple TTS options (ElevenLabs, OpenAI, local)
- ✅ Automatic via hooks (no manual triggering)

**Default Behavior**:
- ✅ Visual reports always shown
- ✅ Completion markers created and processed
- ✅ Logging to app-specific context
- ✅ TTS enabled for builder-agent and implementation-coordinator
- ✅ SubagentStop notifications enabled

**You now have a comprehensive notification system that keeps you informed about task completions without needing to actively monitor Claude Code!** 🔔


