---
description: Manually update implementation context based on current code state. Reviews code in apps/ and updates context documentation.
argument-hint: "[feature-name]"
allowed-tools: Read, Write, Edit, Grep, Bash
---

# Update Context Command

Manually update context documentation to reflect current code state.

## Purpose

Review code in `apps/` directory and update `context/` documentation to ensure it accurately reflects what has been built.

## Variables

- `FEATURE_NAME`: $ARGUMENTS[0] (Optional: specific feature to update, or all if not provided)

## Instructions

- Use when context is out of sync with code
- Use after manual code changes outside builder agents
- Use to review and refresh context documentation
- Scans code and updates relevant context files

## Usage

```bash
# Update context for specific feature
/update-context user-authentication

# Update all context
/update-context
```

## Workflow

1. **Scan code**: Review files in `apps/[app]/src/`
2. **Identify modules**: Find all modules/classes/functions
3. **Check context**: Compare with existing context documentation
4. **Update context**: Refresh module docs, feature docs, status
5. **Report**: Show what was updated

## Expected Output

```markdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 CONTEXT UPDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Scanning: apps/my-app/src/

Found Modules:
- User.ts
- AuthService.ts
- TokenManager.ts
- ValidationUtils.ts

Checking context...

Updates:
✏️ context/modules/User.md - Updated (last modified code)
✅ context/modules/AuthService.md - Up to date
✏️ context/modules/TokenManager.md - Updated (new methods added)
➕ context/modules/ValidationUtils.md - Created (was missing)

✏️ context/features/user-authentication.md - Updated progress
✏️ context/IMPLEMENTATION_STATUS.md - Synchronized

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CONTEXT UPDATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Summary:
- 4 modules reviewed
- 3 module docs updated
- 1 module doc created
- 2 feature docs updated

Context is now synchronized with code.
```

## When to Use

**Use `/update-context` when**:
- ✅ Made manual code changes
- ✅ Context seems outdated
- ✅ Added code without using builder agents
- ✅ Imported code from elsewhere
- ✅ Regular maintenance/review

**Don't need if**:
- Using builder agents (they update context automatically)
- Just reviewing code without changes

## What Gets Updated

### Module Documentation
- Scans source files
- Updates exports, methods, properties
- Refreshes dependencies
- Updates examples if needed

### Feature Documentation
- Synchronizes implementation status
- Updates module lists
- Refreshes progress tracking

### Implementation Status
- Marks tasks as complete based on code existence
- Updates file listings
- Synchronizes completion dates

## Best Practices

**Run periodically**:
- After manual coding sessions
- Before starting new features
- During code reviews
- When context feels stale

**Review changes**:
- Check what was updated
- Verify accuracy
- Add any missing details

**Keep iterating**:
- Context should always match reality
- Don't let it drift
- Update immediately after changes


