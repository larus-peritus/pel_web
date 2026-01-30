# Requirements Validation Checklist

Comprehensive checklist to ensure requirements quality before moving to design phase.

## Phase 1: Completeness Validation

### User Coverage
- [ ] All user roles are identified
- [ ] Each user role has associated user stories
- [ ] User benefits are clearly stated
- [ ] All user interactions are covered
- [ ] User workflows are complete end-to-end

### Scenario Coverage
- [ ] Normal/happy path scenarios defined
- [ ] Edge cases identified and addressed
- [ ] Error conditions specified
- [ ] Boundary conditions covered
- [ ] Concurrent usage scenarios considered

### Requirement Types
- [ ] Functional requirements documented
- [ ] Performance requirements specified
- [ ] Security requirements included
- [ ] Usability requirements addressed
- [ ] Reliability requirements defined
- [ ] Scalability considerations documented

### Dependencies and Constraints
- [ ] Technical constraints documented
- [ ] Business constraints identified
- [ ] External dependencies listed
- [ ] Integration points specified
- [ ] Assumptions clearly stated

## Phase 2: Quality Validation

### EARS Format Compliance
- [ ] All requirements use proper EARS keywords (WHEN/IF/WHILE/WHERE)
- [ ] "SHALL" used consistently for system responses
- [ ] Each requirement has clear trigger and response
- [ ] Conditions are specific and measurable
- [ ] No ambiguous language

### Testability
- [ ] Each requirement can be tested
- [ ] Success criteria are observable
- [ ] Measurements are specific (not "fast" but "within 2 seconds")
- [ ] Pass/fail criteria are clear
- [ ] Test scenarios can be derived from requirements

### Clarity and Precision
- [ ] Requirements use active voice
- [ ] Technical jargon is avoided or explained
- [ ] No vague terms ("user-friendly", "fast", "efficient")
- [ ] Specific numbers where applicable
- [ ] No ambiguous words ("should", "might", "could")

### Independence
- [ ] Requirements don't conflict with each other
- [ ] Each requirement stands alone
- [ ] Dependencies between requirements are clear
- [ ] Requirements can be implemented separately
- [ ] No circular dependencies

### Abstraction Level
- [ ] Requirements focus on WHAT, not HOW
- [ ] No implementation details specified
- [ ] No technology choices mandated (unless truly required)
- [ ] Solution-agnostic where possible
- [ ] Appropriate level of detail (not too high, not too low)

## Phase 3: Content Validation

### User Stories
- [ ] Follow "As a [role], I want [feature], so that [benefit]" format
- [ ] Clearly state who, what, and why
- [ ] Provide clear user value
- [ ] Are independent when possible
- [ ] Are testable and demonstrable

### Acceptance Criteria
- [ ] Each user story has acceptance criteria
- [ ] Criteria use EARS format
- [ ] Both positive and negative scenarios included
- [ ] Edge cases covered
- [ ] Error handling specified

### Non-Functional Requirements
- [ ] Performance targets specified with numbers
- [ ] Security requirements are explicit
- [ ] Usability standards defined
- [ ] Reliability expectations stated
- [ ] Scalability needs addressed

## Phase 4: Consistency Validation

### Terminology
- [ ] Terms used consistently throughout
- [ ] Glossary provided for domain terms
- [ ] Acronyms defined on first use
- [ ] Same concepts use same words
- [ ] No synonyms for same concept

### Formatting
- [ ] Consistent numbering scheme
- [ ] Consistent heading structure
- [ ] Consistent acceptance criteria format
- [ ] Consistent use of EARS keywords
- [ ] Standard document structure followed

### Cross-References
- [ ] Requirements are numbered/labeled
- [ ] Dependencies reference specific requirements
- [ ] Related requirements are linked
- [ ] Traceability to business objectives
- [ ] No dangling references

## Phase 5: Stakeholder Validation

### Business Alignment
- [ ] Requirements support business objectives
- [ ] Value proposition is clear
- [ ] Success metrics are measurable
- [ ] ROI considerations addressed
- [ ] Business rules are captured

### Technical Feasibility
- [ ] Requirements are technically achievable
- [ ] Performance targets are realistic
- [ ] Integrations are feasible
- [ ] Technical constraints acknowledged
- [ ] No impossible requirements

### User Experience
- [ ] Requirements reflect user needs
- [ ] User workflows are intuitive
- [ ] Error messages are helpful
- [ ] Accessibility considered
- [ ] Mobile/responsive needs addressed (if applicable)

## Phase 6: Common Issues Check

### Avoid These Anti-Patterns

**Vague Requirements**:
- ❌ "System should be fast"
- ✅ "WHEN user requests data THEN system SHALL respond within 2 seconds"

**Implementation Details**:
- ❌ "System SHALL use PostgreSQL database"
- ✅ "WHEN data is stored THEN system SHALL persist it reliably"

**Untestable Requirements**:
- ❌ "System should be user-friendly"
- ✅ "WHEN new user completes onboarding THEN system SHALL require no more than 3 clicks to reach dashboard"

**Missing Error Cases**:
- ❌ Only specifying happy path
- ✅ Including WHEN validation fails, WHEN network error occurs, etc.

**Conflicting Requirements**:
- ❌ "System SHALL process immediately" AND "System SHALL batch for efficiency"
- ✅ Resolve conflicts and be explicit about priorities

## Final Checklist

Before proceeding to design phase:

### Documentation Quality
- [ ] Requirements document is well-structured
- [ ] Introduction provides context
- [ ] Requirements are organized logically
- [ ] Glossary is complete
- [ ] Document is version controlled

### Stakeholder Sign-Off
- [ ] Product owner has reviewed
- [ ] Technical lead has reviewed
- [ ] Security team has reviewed (if applicable)
- [ ] Compliance has reviewed (if applicable)
- [ ] Stakeholders approve moving to design

### Readiness for Design
- [ ] Requirements are stable (no major changes expected)
- [ ] All questions have been answered
- [ ] Scope is clearly defined
- [ ] Success criteria are agreed upon
- [ ] Team understands requirements

## Validation Score

Count completed items in each phase:
- **Phase 1 (Completeness)**: ___ / 20
- **Phase 2 (Quality)**: ___ / 20
- **Phase 3 (Content)**: ___ / 15
- **Phase 4 (Consistency)**: ___ / 15
- **Phase 5 (Stakeholder)**: ___ / 15
- **Phase 6 (Issues)**: ___ / 10
- **Final Checklist**: ___ / 15

**Total Score**: ___ / 110

**Recommendation**:
- 90-110: Excellent - Ready for design phase
- 70-89: Good - Minor revisions needed
- 50-69: Fair - Significant revisions needed
- Below 50: Poor - Major rework required

## Quick Validation Script

For each requirement, ask:
1. **Who**: Which user role is this for?
2. **What**: What specific behavior is required?
3. **When**: What triggers this requirement?
4. **Where**: In what context does this apply?
5. **Why**: What value does this provide?
6. **How to test**: How can this be verified?

If you can't answer all questions, the requirement needs refinement.

## Next Steps After Validation

Once validation is complete:
1. Address any failed checklist items
2. Get stakeholder approval
3. Save finalized requirements document
4. Proceed to design phase
5. Keep requirements as living document (update if needed)


