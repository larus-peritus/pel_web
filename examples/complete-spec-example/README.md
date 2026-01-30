# Complete Spec Example: User Authentication System

This example demonstrates the complete spec-driven development workflow for a user authentication feature.

## Feature Description

Secure user authentication supporting:
- Email/password registration
- Login with session management
- Password reset via email
- Account lockout after failed attempts

## Execution Approach

**Method Used**: Orchestrator Agent (guided workflow)

**Command**:
```
@spec-orchestrator create spec for user authentication with email and password
```

**Time**: 45 minutes with clarifying questions

---

## Phase 1: Requirements

**File**: [requirements-user-authentication.md](requirements-user-authentication.md)

**Created**: EARS-format requirements with:
- 3 user stories (registration, login, password reset)
- 18 acceptance criteria using WHEN/IF/THEN/SHALL
- 4 non-functional requirements (performance, security, usability, reliability)
- Constraints (bcrypt, 2-second SLA, GDPR compliance)

**Key Requirements**:
```
WHEN user provides valid credentials THEN system SHALL authenticate within 2 seconds
IF user fails authentication 3 times THEN system SHALL lock account for 15 minutes
WHEN password reset requested THEN system SHALL send email within 1 minute
```

**Validation**: All user roles covered, testable criteria, no implementation details

---

## Phase 2: Design

**File**: [design-user-authentication.md](design-user-authentication.md)

**Created**: Technical design with:
- JWT-based authentication architecture
- 5 major components (AuthController, AuthService, UserRepository, SessionRepository, Middleware)
- 2 data models (User, Session)
- Error handling strategy
- Testing approach (unit, integration, security tests)
- 3 key design decisions documented

**Architecture**:
```
Client → AuthController → AuthService → UserRepository → PostgreSQL
                      ↓
                 SessionRepository → Redis
```

**Key Decisions**:
1. JWT tokens vs session cookies → Chose JWT for stateless API
2. bcrypt vs argon2 for hashing → Chose bcrypt (industry standard)
3. Redis vs database for sessions → Chose Redis (fast revocation)

---

## Phase 3: Tasks

**File**: [tasks-user-authentication.md](tasks-user-authentication.md)

**Created**: Implementation breakdown with:
- 12 tasks across 5 epics
- Foundation-first sequencing strategy
- Tasks sized 2-6 hours each
- Clear dependencies marked
- All requirements traced

**Task Structure**:
```
1. Setup (2 tasks) → 2. Data Models (2 tasks) → 
3. Services (3 tasks) → 4. API Endpoints (3 tasks) → 
5. Security & Testing (2 tasks)
```

**Example Task**:
```markdown
- [ ] 3.1 Implement user registration service
  - Create UserService with register method
  - Add email uniqueness check
  - Implement password hashing with bcrypt (cost 12)
  - Add error handling for duplicate emails
  - Write unit tests for registration scenarios
  - Requirements: REQ-1.2
```

---

## Workflow Demonstrated

### Step-by-Step Process

**1. Initiation**
```
User: @spec-orchestrator create spec for user authentication
Orchestrator: Activates and begins Requirements phase
```

**2. Requirements Phase**
- Orchestrator asks about users, constraints, scope
- Creates user stories and EARS criteria
- Validates requirements quality
- Saves to specs/requirements-user-authentication.md
- Gets approval to proceed

**3. Design Phase**
- Loads approved requirements
- Designs architecture and components
- Documents decisions with rationale
- Saves to specs/design-user-authentication.md
- Gets approval to proceed

**4. Tasks Phase**
- Analyzes design components
- Creates sequenced task breakdown
- Validates completeness and sizing
- Saves to specs/tasks-user-authentication.md
- Complete!

**5. Optional Worktree**
```bash
/create_worktree user-authentication
```
- Creates isolated environment
- Ready for systematic implementation

---

## Key Patterns Illustrated

### EARS Format Requirements
```
WHEN [event] THEN system SHALL [response]
IF [condition] THEN system SHALL [behavior]
```

### Design Decisions with Rationale
```
Decision: JWT vs Session Cookies
Chosen: JWT
Rationale: Supports mobile, scales better, stateless API design
Trade-off: More complex revocation (acceptable with Redis)
```

### Task Sizing and Sequencing
- Tasks are 2-6 hours each
- Dependencies explicitly marked
- Requirements traced throughout
- Testing integrated with implementation

### Traceability

**Requirements → Design**:
- REQ-1.2 (User authentication) → AuthService, JWT tokens
- REQ-4.1 (Session management) → SessionRepository, Redis
- REQ-2.3 (Error handling) → Error handling strategy

**Design → Tasks**:
- AuthService component → Tasks 3.1, 3.2
- User model → Task 2.1
- API endpoints → Tasks 4.1, 4.2, 4.3

**Requirements → Tasks**:
- Each task references specific requirements
- All requirements covered by at least one task
- Testability maintained throughout

---

## Lessons from This Example

### What Worked Well

1. **EARS Format**: Made requirements precise and testable
2. **Design Decisions**: Documented rationale prevents later questions
3. **Task Sequencing**: Foundation-first made dependencies clear
4. **Traceability**: Easy to verify complete coverage
5. **Validation Gates**: Caught gaps before moving to next phase

### Common Pitfalls Avoided

1. **Vague Requirements**: Used specific, measurable criteria
2. **Implementation in Requirements**: Stayed solution-agnostic
3. **Monolithic Tasks**: Broke down into 2-6 hour chunks
4. **Lost Traceability**: Maintained REQ references throughout
5. **Skipping Validation**: Checked quality at each phase

---

## Using This Example

### As a Template

Copy structure for similar features:
- Authentication patterns
- CRUD operations with validation
- API design with error handling
- Security-conscious features

### As a Learning Tool

Study to understand:
- How EARS format works in practice
- What level of detail for design
- How to size and sequence tasks
- How traceability works end-to-end

### As a Reference

Refer to when creating your own specs:
- EARS format examples
- Design decision documentation
- Task breakdown patterns
- Quality validation checkpoints

---

## Files in This Example

- `README.md` (this file) - Overview and lessons
- `requirements-user-authentication.md` - Complete requirements document
- `design-user-authentication.md` - Complete design document
- `tasks-user-authentication.md` - Complete tasks document

**Note**: The actual spec files demonstrate full formatting, all details, and complete traceability. Review them to see the patterns in action.

---

## Creating Similar Specs

**For similar features**:
```
@spec-orchestrator create spec for [your feature similar to authentication]
```

**Using this as reference**:
1. Follow same three-phase structure
2. Use EARS format for requirements
3. Document design decisions with rationale
4. Break tasks into 2-6 hour chunks
5. Maintain traceability throughout

**Adapt for your context**:
- Different technology stack
- Different security requirements
- Different scale requirements
- Different team structure

---

## Summary

This example shows complete spec-driven development for user authentication:

✅ **Requirements**: Clear, testable, EARS format  
✅ **Design**: Architecture, components, decisions  
✅ **Tasks**: Actionable, sequenced, sized appropriately  
✅ **Traceability**: Requirements → Design → Tasks  
✅ **Quality**: Validated at each phase  

**Result**: Systematic, high-quality specification ready for implementation.

Use as template, learning tool, or reference for your own spec creation.


