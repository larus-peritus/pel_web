---
name: Builder Skill
description: Guide implementation of features from task specifications. Use when implementing code based on specs/[feature]-tasks.md files, need to reference context/, or need guidance on systematic feature implementation in apps/ directory.
allowed-tools: Read, Write, Edit, Grep, Bash
---

# Builder Skill

Expert guidance for implementing features from task specifications.

## Purpose

You are an expert implementation specialist who transforms task specifications into working code in the `apps/` directory, maintaining context and documentation as you build.

## When to Use

Use this skill when:
- Implementing tasks from `specs/[feature]-tasks.md`
- Need to reference existing codebase context
- Building features systematically
- Updating implementation documentation
- Marking tasks as complete

## Core Principles

### 1. Context-Driven Implementation

**Always start by reading context**:
```
Read: context/architecture.md
Read: context/IMPLEMENTATION_STATUS.md
Read: context/features/[related-features].md
```

This ensures:
- You understand the overall architecture
- You don't duplicate existing code
- You follow established patterns
- You integrate properly with existing features

### 2. Spec-Driven Development

**For each task**:
1. Read `specs/[feature-name]-requirements.md` - Understand WHAT and WHY
2. Read `specs/[feature-name]-design.md` - Understand HOW (architecture)
3. Read `specs/[feature-name]-tasks.md` - Find your specific task
4. Read context - Understand current state
5. Implement in `apps/[app-name]/` - Build the code
6. Test - Verify it works
7. Document - Update context
8. Mark complete - Update task file

### 3. Application Code Boundary

**All implementation goes in `apps/` directory**:
- ✅ `apps/[app-name]/src/` - Source code
- ✅ `apps/[app-name]/tests/` - Tests
- ✅ `apps/[app-name]/docs/` - App-specific docs
- ❌ Never implement in root, `.claude/`, `kiro/`, etc.

## Implementation Workflow

### Step 1: Load Context

**Read the full context**:
```
context/
├── architecture.md          ← Overall system architecture
├── IMPLEMENTATION_STATUS.md ← What's been built
├── features/
│   └── [feature-name].md    ← Feature-specific details
└── modules/
    └── [module-name].md     ← Module-specific details
```

**What to look for**:
- Existing patterns (file structure, naming conventions)
- Existing modules you can reuse
- Integration points (APIs, interfaces)
- Testing patterns
- Dependencies and their versions

### Step 2: Understand the Task

**Read the task specification**:
```markdown
From specs/[feature-name]-tasks.md:

- [ ] Task 1.2: Create User model with validation
  - Implement User class in apps/my-app/src/models/User.ts
  - Add email validation using regex
  - Add password hashing with bcrypt
  - Write unit tests for validation
  - Requirements: 1.2, 2.1
  - Testing: Validate email format, password strength
```

**Extract**:
- What to create
- Where to create it
- What requirements it fulfills
- How to test it

### Step 3: Implement Incrementally

**Start small, build up**:

1. **Create the basic structure**:
   ```typescript
   // apps/my-app/src/models/User.ts
   export class User {
     // Basic implementation
   }
   ```

2. **Add functionality piece by piece**:
   - Add properties
   - Add validation
   - Add methods
   - Handle errors

3. **Test as you go**:
   ```typescript
   // apps/my-app/tests/models/User.test.ts
   describe('User', () => {
     test('validates email format', () => {
       // Test implementation
     });
   });
   ```

4. **Refine based on tests**:
   - Fix failing tests
   - Handle edge cases
   - Improve error messages

### Step 4: Update Context

**After completing the task**, update context:

**Update `context/IMPLEMENTATION_STATUS.md`**:
```markdown
## Feature: User Authentication
Status: 🔄 In Progress (2/5 tasks complete)

### Completed Tasks:
- ✅ Task 1.1: Set up project structure
- ✅ Task 1.2: Create User model with validation ← NEW

### In Progress:
- 🔄 Task 1.3: Create authentication service

### Pending:
- ⏳ Task 1.4: Implement login endpoint
- ⏳ Task 1.5: Add JWT middleware

### What Was Created:
- apps/my-app/src/models/User.ts - User model with validation
- apps/my-app/tests/models/User.test.ts - Unit tests
```

**Update or create `context/modules/User.md`**:
```markdown
# User Module

## Location
`apps/my-app/src/models/User.ts`

## Purpose
User data model with validation for authentication system.

## Exports
- `class User` - User data model

## Properties
- `email: string` - User email (validated)
- `password: string` - Hashed password

## Methods
- `validateEmail()` - Email format validation
- `hashPassword()` - Password hashing with bcrypt

## Dependencies
- bcrypt - Password hashing
- validator - Email validation

## Tests
- apps/my-app/tests/models/User.test.ts

## Related
- See: context/features/user-authentication.md
- Integrates with: AuthService (pending)
```

### Step 5: Mark Task Complete

**Update the task file**:

Change from:
```markdown
- [ ] Task 1.2: Create User model with validation
```

To:
```markdown
- [x] Task 1.2: Create User model with validation ✅ Completed [YYYY-MM-DD]
  - Implemented: apps/my-app/src/models/User.ts
  - Tests: apps/my-app/tests/models/User.test.ts
  - Context: context/modules/User.md
```

## Best Practices

### Code Quality

**Follow existing patterns**:
- Use same file structure as existing code
- Follow naming conventions from codebase
- Match indentation and formatting
- Use same dependencies where possible

**Write tests**:
- Unit tests for individual functions/classes
- Integration tests for connected components
- Follow testing patterns from context

**Handle errors**:
- Check for edge cases
- Validate inputs
- Provide clear error messages
- Log appropriately

### Documentation

**Update context immediately**:
- Don't wait until feature is complete
- Document as you build
- Include examples
- Note integration points

**Be specific**:
- ✅ "Implemented User.validateEmail() using regex for RFC 5322 compliance"
- ❌ "Added email validation"

**Link related components**:
- Reference requirements that are fulfilled
- Note modules that integrate
- Link to tests

### Incremental Progress

**One task at a time**:
- Don't try to implement entire feature at once
- Complete task fully before moving to next
- Test thoroughly
- Update context

**Validate continuously**:
- Run tests after each change
- Check integration with existing code
- Verify against requirements

## Common Patterns

### Creating a New Module

```
1. Read specs/[feature]-design.md for module specification
2. Create file in apps/[app]/src/[module-path]
3. Implement core functionality
4. Add error handling
5. Write tests
6. Update context/modules/[module-name].md
7. Update context/IMPLEMENTATION_STATUS.md
8. Mark task complete in specs/[feature]-tasks.md
```

### Integrating with Existing Code

```
1. Read context/modules/[existing-module].md
2. Understand existing interfaces
3. Import and use existing modules
4. Don't duplicate functionality
5. Update context with integration notes
6. Test integration points
```

### Handling Dependencies

```
1. Check context/architecture.md for approved dependencies
2. If adding new dependency:
   - Document why it's needed
   - Note version
   - Update architecture.md
   - Update package.json
3. Use existing dependencies where possible
```

## Error Recovery

### If Task is Unclear

**Don't guess - clarify**:
- Read requirements and design more carefully
- Check context for similar implementations
- Ask for clarification if truly ambiguous
- Document assumptions you make

### If Tests Fail

**Debug systematically**:
- Read error messages carefully
- Check against requirements
- Verify inputs and outputs
- Test edge cases
- Check integration points

### If Context is Outdated

**Update it**:
- Context should always reflect current state
- If you find outdated information, correct it
- Note when context was last updated

## Integration with Other Skills

### Use with Requirements Skill

Reference requirements to understand:
- What user value this task provides
- What acceptance criteria must be met
- What edge cases to handle

### Use with Design Skill

Reference design to understand:
- System architecture
- Component interactions
- Data flow
- Error handling strategy

### Use with Tasks Skill

Reference tasks to understand:
- Dependencies between tasks
- Implementation order
- Task complexity
- Testing expectations

## Summary

**Builder workflow**:
1. Read context (architecture, status, modules)
2. Read task specification from tasks file
3. Implement in `apps/` directory
4. Write tests
5. Update context with what was created
6. Mark task complete

**Key principle**: Context-driven, spec-driven, test-driven development.

Every implementation should:
- ✅ Fulfill a requirement
- ✅ Follow the design
- ✅ Complete a task
- ✅ Update context
- ✅ Include tests
- ✅ Be documented


