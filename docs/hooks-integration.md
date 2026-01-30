# Hooks Integration with Spec-Driven Development

How Claude Code hooks track and respond to spec creation events.

## Overview

**Hooks** are Python scripts that run automatically at specific lifecycle events. They provide:
- Event tracking and logging
- Observability during spec creation
- Integration with external systems
- Context loading and session management

**No Action Required**: Hooks run automatically in the background during spec creation.

---

## Available Hooks

Located in `.claude/hooks/`:

### Session Hooks

**session_start.py**
- Triggers: When Claude Code session starts
- Purpose: Load context, initialize session
- Spec Usage: Can load previous spec work, set working directory

**session_end.py**
- Triggers: When session ends
- Purpose: Clean up, save session data
- Spec Usage: Archive spec session data

---

### Workflow Hooks

**user_prompt_submit.py**
- Triggers: When you submit a prompt
- Purpose: Log prompts, track workflow stage
- Spec Usage: Tracks which phase you're working on (requirements/design/tasks)

**pre_tool_use.py**
- Triggers: Before Claude uses any tool
- Purpose: Log tool intentions
- Spec Usage: Tracks when specs are being read or written

**post_tool_use.py**
- Triggers: After Claude uses a tool
- Purpose: Log tool results
- Spec Usage: Confirms spec files were created/updated

---

### Agent Hooks

**subagent_stop.py**
- Triggers: When subagent completes work
- Purpose: Log subagent results, notify completion
- Spec Usage: Tracks when requirements-agent, design-agent, or tasks-agent completes

**notification.py**
- Triggers: Custom notification events
- Purpose: Send notifications
- Spec Usage: Can notify when spec phases complete

---

### Context Hooks

**pre_compact.py**
- Triggers: Before context window compaction
- Purpose: Summarize context before compression
- Spec Usage: Preserves spec progress during long sessions

**stop.py**
- Triggers: When workflow stops
- Purpose: Save transcript and state
- Spec Usage: Saves complete spec creation session

---

## Hook Configuration

Located in `.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [...],
    "SessionEnd": [...],
    "UserPromptSubmit": [...],
    "PreToolUse": [...],
    "PostToolUse": [...],
    "SubagentStop": [...],
    "PreCompact": [...]
  }
}
```

Each hook can have multiple handlers that execute sequentially.

---

## Spec Creation Event Flow

### Example: Creating Complete Spec

**Event 1: Session Start**
```
Hook: session_start.py
Action: Initialize session, note working directory
```

**Event 2: User Prompt**
```
Hook: user_prompt_submit.py
Prompt: "@spec-orchestrator create spec for user-authentication"
Action: Log spec creation request, identify feature name
```

**Event 3: Requirements Phase**

Tool Use Sequence:
```
pre_tool_use.py  → About to write requirements file
Write Tool       → Creates specs/requirements-user-authentication.md
post_tool_use.py → Confirmed file written
```

**Event 4: Subagent Completion** (if orchestrator delegates)
```
Hook: subagent_stop.py
Agent: requirements-agent
Action: Log completion, notify requirements phase done
```

**Event 5: Design Phase**

Tool Use Sequence:
```
pre_tool_use.py  → About to read requirements
Read Tool        → Loads requirements-user-authentication.md
post_tool_use.py → Requirements loaded

pre_tool_use.py  → About to write design
Write Tool       → Creates specs/design-user-authentication.md
post_tool_use.py → Design written
```

**Event 6: Tasks Phase**

Tool Use Sequence:
```
pre_tool_use.py  → About to read design and requirements
Read Tool        → Loads both documents
post_tool_use.py → Documents loaded

pre_tool_use.py  → About to write tasks
Write Tool       → Creates specs/tasks-user-authentication.md
post_tool_use.py → Tasks written
```

**Event 7: Stop**
```
Hook: stop.py
Action: Save complete session transcript with all specs created
```

---

## Hook Data Flow

### Input to Hooks

Hooks receive JSON data via stdin:

```json
{
  "session_id": "uuid",
  "timestamp": "2025-11-13T10:30:00Z",
  "tool_name": "Write",
  "tool_args": {
    "file_path": "specs/requirements-user-authentication.md",
    "contents": "..."
  }
}
```

### Output from Hooks

Hooks can return JSON to Claude:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "SpecFileCreated",
    "additionalContext": "Requirements document created",
    "metadata": {
      "phase": "requirements",
      "feature": "user-authentication"
    }
  }
}
```

---

## Observability Integration

### Event Tracking

Hook `send_event.py` sends events to observability server:

```python
# Automatically called by hooks
send_event.py --event-type SpecCreated --summarize
```

Events tracked:
- Spec creation started
- Requirements phase complete
- Design phase complete
- Tasks phase complete
- Spec creation finished

### Dashboard Visualization

If observability server is running:
- Visit http://localhost:5173 (or worktree port)
- See real-time spec creation events
- Track agent activity
- View tool usage

**Event Timeline**:
```
10:30:00 - SessionStart
10:30:15 - SpecCreationStarted (user-authentication)
10:35:20 - RequirementsPhaseComplete
10:42:45 - DesignPhaseComplete
10:50:10 - TasksPhaseComplete
10:50:15 - SpecCreationFinished
```

---

## Custom Hook Integration

### Add Spec-Specific Hooks

Create custom hook for spec milestones:

**Example: spec_phase_complete.py**
```python
#!/usr/bin/env -S uv run --script
import json
import sys

def main():
    data = json.loads(sys.stdin.read())
    
    phase = data.get('phase')
    feature = data.get('feature')
    
    # Custom action: Notify team
    if phase == 'requirements':
        notify_team(f"Requirements ready for {feature}")
    elif phase == 'design':
        notify_team(f"Design ready for {feature}")
    elif phase == 'tasks':
        notify_team(f"Tasks ready for {feature} - ready to implement!")
    
    sys.exit(0)

if __name__ == '__main__':
    main()
```

**Add to settings.json**:
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "specs/(requirements|design|tasks)-.*\\.md",
        "hooks": [
          {
            "type": "command",
            "command": "uv run $CLAUDE_PROJECT_DIR/.claude/hooks/spec_phase_complete.py"
          }
        ]
      }
    ]
  }
}
```

---

## Logging and Debugging

### Session Logs

Hooks create logs in `logs/` directory:

```
logs/
├── session_start.json      # Session initialization
├── user_prompt_submit.json # All prompts
├── pre_tool_use.json       # Tool calls (before)
├── post_tool_use.json      # Tool results (after)
└── subagent_stop.json      # Subagent completions
```

**View Spec Creation Session**:
```bash
# See all prompts during spec creation
cat logs/user_prompt_submit.json | jq '.[] | select(.prompt | contains("spec"))'

# See all file writes
cat logs/post_tool_use.json | jq '.[] | select(.tool_name == "Write")'

# See spec files created
cat logs/post_tool_use.json | jq '.[] | select(.tool_args.file_path | contains("specs/"))'
```

---

## Spec-Specific Hook Features

### 1. Progress Tracking

Hooks track spec creation progress:
- Requirements phase: 33% complete
- Design phase: 66% complete
- Tasks phase: 100% complete

### 2. Quality Gates

Hooks can enforce validation:
- Check EARS format in requirements
- Verify design traceability
- Validate task breakdown

### 3. Team Notifications

Hooks can notify:
- Slack when specs ready for review
- Email when phase completes
- Dashboard updates in real-time

### 4. Context Preservation

Hooks save spec progress:
- Recover after interruption
- Resume spec creation
- Track iteration history

---

## Best Practices

### For Spec Creation

**Do**:
- ✅ Let hooks run automatically
- ✅ Check logs for troubleshooting
- ✅ Review observability dashboard
- ✅ Use hooks for team notifications

**Don't**:
- ❌ Disable hooks during spec creation
- ❌ Manually modify hook logs
- ❌ Ignore hook errors
- ❌ Rely on hooks for critical validation

### For Custom Hooks

**Do**:
- ✅ Make hooks idempotent (safe to re-run)
- ✅ Handle errors gracefully
- ✅ Log hook activity
- ✅ Test hooks independently

**Don't**:
- ❌ Block spec creation with long-running hooks
- ❌ Modify spec files in hooks
- ❌ Assume hooks always run
- ❌ Store critical data only in hooks

---

## Troubleshooting

### Hook Not Running

**Check**:
1. Hook file exists and is executable: `chmod +x .claude/hooks/*.py`
2. Hook configured in settings.json
3. Dependencies installed: `uv` available
4. Check logs for errors

### Hook Errors

**Debug**:
```bash
# Test hook manually
echo '{"test": "data"}' | uv run .claude/hooks/your_hook.py

# Check hook output
cat logs/[hook-name].json | jq '.[-1]'
```

### Missing Events

**Verify**:
- Hook matcher pattern correct
- Event type matches
- Hooks enabled in settings
- No syntax errors in hook scripts

---

## Integration Examples

### Example 1: Slack Notification on Spec Complete

```python
# .claude/hooks/slack_notify.py
import json, sys, requests

def main():
    data = json.loads(sys.stdin.read())
    
    if 'tasks-' in data.get('tool_args', {}).get('file_path', ''):
        feature = data['tool_args']['file_path'].split('tasks-')[1].replace('.md', '')
        
        requests.post('https://hooks.slack.com/YOUR_WEBHOOK', json={
            'text': f'✅ Complete spec ready for {feature}!\nBegin implementation.'
        })
    
    sys.exit(0)

if __name__ == '__main__':
    main()
```

### Example 2: Git Auto-Commit Specs

```python
# .claude/hooks/auto_commit_specs.py
import json, sys, subprocess

def main():
    data = json.loads(sys.stdin.read())
    file_path = data.get('tool_args', {}).get('file_path', '')
    
    if file_path.startswith('specs/'):
        subprocess.run(['git', 'add', file_path])
        phase = file_path.split('/')[1].split('-')[0]
        subprocess.run(['git', 'commit', '-m', f'Add {phase} for {file_path}'])
    
    sys.exit(0)

if __name__ == '__main__':
    main()
```

### Example 3: Validation Hook

```python
# .claude/hooks/validate_ears.py
import json, sys, re

def main():
    data = json.loads(sys.stdin.read())
    file_path = data.get('tool_args', {}).get('file_path', '')
    
    if 'requirements-' in file_path:
        contents = data['tool_args']['contents']
        
        # Check for EARS keywords
        if not re.search(r'\b(WHEN|IF|WHILE|WHERE)\b.*\bSHALL\b', contents):
            print(json.dumps({
                'warning': 'Requirements may be missing EARS format'
            }))
    
    sys.exit(0)

if __name__ == '__main__':
    main()
```

---

## Summary

**Hooks** provide automatic event tracking for spec creation:
- ✅ Track all phases (requirements → design → tasks)
- ✅ Log tool usage (reads and writes)
- ✅ Monitor agent activity
- ✅ Enable observability dashboard
- ✅ Support custom integrations

**No Setup Required**: Hooks work automatically with existing configuration.

**Customizable**: Add your own hooks for team-specific workflows.

**Observability**: View real-time spec creation in dashboard.

---

**Related Documentation**:
- [Main Guide](../SPEC_DRIVEN_DEVELOPMENT.md)
- [Workflow Patterns](workflow-patterns.md)
- [Worktree Integration](worktree-integration.md)
- [Hooks Reference](../.claude/hooks/)


