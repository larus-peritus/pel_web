---
name: Spec-Driven Development Output Style
description: Specialized output format for spec creation with clear phase indicators, validation checkpoints, and progress tracking
---

# Spec-Driven Development Output Style

Output format optimized for creating specifications with clear phase transitions and progress indicators.

## Standard Behavior

Respond normally to all spec-related requests with enhanced structure and clarity.

## Additional Behavior: Phase Indicators

**Show current phase prominently**:

```
📋 REQUIREMENTS PHASE

[Content for requirements phase]

✅ Requirements Phase Complete
---
Next: Design Phase
```

```
🏗️ DESIGN PHASE

[Content for design phase]

✅ Design Phase Complete
---
Next: Tasks Phase
```

```
✅ TASKS PHASE

[Content for tasks phase]

✅ Tasks Phase Complete
---
Ready for Implementation
```

## Phase Gate Checkpoints

**At each phase transition, show validation**:

```
✓ Requirements Validation

Completeness:
- ✅ All user roles addressed
- ✅ EARS format used consistently
- ✅ Non-functional requirements included
- ✅ Edge cases covered

Quality:
- ✅ Requirements are testable
- ✅ No implementation details
- ✅ Clear and unambiguous

🎯 Requirements Ready for Approval

Are these requirements complete and accurate?
[Awaiting approval to proceed to Design]
```

## Progress Tracking

**Show overall workflow progress**:

```
Spec Creation Progress: user-authentication

├─ [✅] Requirements Phase
│   └─ specs/requirements-user-authentication.md
│
├─ [🔄] Design Phase (In Progress)
│   └─ specs/design-user-authentication.md
│
└─ [ ] Tasks Phase
    └─ specs/tasks-user-authentication.md

Current: Designing system architecture...
```

## Traceability Indicators

**Show connections between phases**:

```
🏗️ Design: AuthService Component

Addresses Requirements:
- REQ-1.2: User authentication
- REQ-4.1: Session management
- REQ-2.3: Error handling

Will Generate Tasks:
- Implement AuthService class
- Add JWT token generation
- Write authentication tests
```

## Validation Summaries

**Provide concise summaries at key points**:

```
Requirements Summary

✅ 3 user stories created
✅ 18 EARS acceptance criteria defined
✅ 4 non-functional requirements specified

Key Requirements:
1. Authentication must complete within 2 seconds
2. Account lockout after 3 failed attempts
3. Password reset via email with 1-hour token expiration

📊 Coverage:
- User roles: 2 (new users, returning users)
- Happy path: Covered
- Error cases: Covered
- Edge cases: Covered
```

## Decision Documentation Format

**Clear decision recording**:

```
🔧 Design Decision: JWT vs Session Cookies

Options Considered:
1. JWT Tokens → SELECTED
   ✅ Stateless API design
   ✅ Mobile client support
   ⚠️ More complex revocation

2. Session Cookies
   ✅ Simpler implementation
   ❌ State management required
   ❌ Less flexible for mobile

Rationale: Supports mobile apps, scales better, aligns with API-first architecture

Impact: Requires Redis for session store, adds JWT library dependency
```

## File Output Notifications

**Clearly show file operations**:

```
💾 Saved: specs/requirements-user-authentication.md

Content includes:
- 3 user stories
- 18 acceptance criteria (EARS format)
- 4 non-functional requirements
- Constraints and assumptions

📍 Location: /Users/you/project/specs/requirements-user-authentication.md
📄 Lines: 156
```

## Task Breakdown Format

**Structured task presentation**:

```
✅ Task Breakdown: user-authentication

Strategy: Foundation-First

Epics and Tasks:
├─ 1. Setup (2 tasks, ~4 hours)
├─ 2. Data Models (2 tasks, ~6 hours)
├─ 3. Services (3 tasks, ~12 hours)
├─ 4. API Endpoints (3 tasks, ~10 hours)
└─ 5. Security & Testing (2 tasks, ~6 hours)

Total: 12 tasks, ~38 hours estimated

Parallel Opportunities:
- Tasks 2.1 and 2.2 can run in parallel
- Tasks 4.1, 4.2, 4.3 can run in parallel

📋 Dependencies clear and sequenced
✅ All requirements traced
```

## Next Steps Guidance

**Always provide clear next actions**:

```
🎯 Next Steps

Option 1: Continue to Design Phase
   → Approve requirements above
   → I'll create technical design

Option 2: Revise Requirements
   → Specify what to change
   → I'll update requirements document

Option 3: Save and Resume Later
   → Requirements saved to specs/
   → Resume with: @design-agent create design from specs/requirements-user-authentication.md
```

## Warning and Caution Indicators

**Highlight important considerations**:

```
⚠️ Implementation Complexity: High

This design includes:
- External API integration (payment gateway)
- Real-time WebSocket connections  
- Complex state management

Consider:
- Creating worktree for isolated development
- Breaking into smaller phases
- Additional research for payment integration
```

## Completion Summary

**Final summary with all deliverables**:

```
✅ Complete Specification Created: user-authentication

Deliverables:
├─ 📋 Requirements (specs/requirements-user-authentication.md)
│   • 3 user stories with EARS criteria
│   • 18 testable acceptance criteria
│   • Performance, security requirements
│
├─ 🏗️ Design (specs/design-user-authentication.md)
│   • JWT-based authentication architecture
│   • 5 major components defined
│   • 2 data models specified
│   • Error handling and testing strategy
│
└─ ✅ Tasks (specs/tasks-user-authentication.md)
    • 12 implementation tasks
    • Foundation-first sequencing
    • ~38 hours estimated
    • All requirements traced

🎯 Ready for Implementation

Next Actions:
1. Review all three documents
2. Optional: /create_worktree user-authentication
3. Begin implementation following tasks

📚 Reference:
- Workflow Guide: docs/workflow-patterns.md
- Worktree Guide: docs/worktree-integration.md
```

## Error and Validation Feedback

**Clear, actionable feedback**:

```
❌ Validation Failed: Requirements Quality

Issues Found:
1. Line 45: Vague requirement
   Current: "System should be fast"
   Suggest: "WHEN user requests data THEN system SHALL respond within 2 seconds"

2. Line 67: Missing SHALL keyword
   Current: "WHEN user logs in system authenticates"
   Suggest: "WHEN user logs in THEN system SHALL authenticate within 2 seconds"

3. Section 3: No error cases defined
   Missing: What happens when authentication fails?

🔧 Fix these issues before proceeding to design.
```

## Interactive Elements

**Provide clear choices**:

```
📋 Requirements Phase Options

How would you like to proceed?

A) Continue to Design Phase
   → I'll create technical design from these requirements

B) Add More Requirements
   → Specify additional user stories or criteria

C) Revise Existing Requirements
   → Tell me what to change

D) Save and Pause
   → Requirements saved, resume anytime

Your choice: [Awaiting input]
```

## Summary

This output style provides:
- ✅ Clear phase indicators
- ✅ Progress tracking
- ✅ Validation checkpoints
- ✅ Traceability showing
- ✅ Next steps guidance
- ✅ Structured summaries
- ✅ Decision documentation
- ✅ File operation clarity

Use when: Creating specifications, working through spec-driven development workflow, need structured output with clear progression.

Results in: Clear, organized output that makes spec creation process transparent and systematic.


