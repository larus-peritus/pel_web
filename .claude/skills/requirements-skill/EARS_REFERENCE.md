# EARS Format Reference

Complete guide to Easy Approach to Requirements Syntax (EARS).

## Overview

EARS is a structured approach to writing clear, testable requirements using consistent keywords and patterns.

## Core Keywords

### WHEN - Event-Driven Requirements

**Purpose**: Describes triggering events that cause system responses

**Pattern**: `WHEN [event] THEN [system] SHALL [response]`

**Examples**:
- WHEN user clicks submit button THEN system SHALL validate form data
- WHEN payment completes THEN system SHALL send confirmation email
- WHEN daily backup time arrives THEN system SHALL start backup process
- WHEN API request times out THEN system SHALL return 504 error

**Use for**:
- User actions (clicks, inputs, selections)
- System events (timeouts, completions, triggers)
- External events (API calls, webhooks, scheduled tasks)
- Time-based events (schedules, deadlines, expirations)

### IF - Conditional Requirements

**Purpose**: Describes preconditions or states that determine behavior

**Pattern**: `IF [condition] THEN [system] SHALL [response]`

**Examples**:
- IF user is authenticated THEN system SHALL display protected content
- IF input is invalid THEN system SHALL display validation error
- IF user has admin role THEN system SHALL enable admin features
- IF cart is empty THEN system SHALL disable checkout button

**Use for**:
- Authentication and authorization checks
- State conditions
- Data validation
- Permission checks
- Configuration-dependent behavior

### WHILE - Continuous Requirements

**Purpose**: Describes ongoing behaviors during a continuous state

**Pattern**: `WHILE [condition] [system] SHALL [behavior]`

**Examples**:
- WHILE file is uploading system SHALL display progress bar
- WHILE user is typing system SHALL show character count
- WHILE system is processing system SHALL disable submit button
- WHILE connection is active system SHALL maintain heartbeat

**Use for**:
- Ongoing processes
- Real-time updates
- Continuous monitoring
- Active state behaviors
- Duration-based requirements

### WHERE - Contextual Requirements

**Purpose**: Describes location-specific or environment-specific behaviors

**Pattern**: `WHERE [context] [system] SHALL [behavior]`

**Examples**:
- WHERE application runs on mobile system SHALL use touch gestures
- WHERE user is in EU system SHALL display GDPR consent banner
- WHERE system is in production system SHALL log all errors
- WHERE network is offline system SHALL enable offline mode

**Use for**:
- Platform-specific behavior (mobile, desktop, web)
- Environment-specific behavior (dev, staging, production)
- Geographic requirements
- Network condition handling
- Device-specific features

## Combined Patterns

### Multiple Conditions (AND)

**Pattern**: `WHEN [event] AND [condition] THEN [system] SHALL [response]`

**Examples**:
- WHEN user submits form AND all fields are valid THEN system SHALL process submission
- WHEN payment succeeds AND inventory is available THEN system SHALL confirm order
- IF user is authenticated AND has premium subscription THEN system SHALL show premium features

### Alternative Conditions (OR)

**Pattern**: `WHEN [event] OR [event] THEN [system] SHALL [response]`

**Examples**:
- WHEN session expires OR user logs out THEN system SHALL clear user data
- IF input is empty OR contains only whitespace THEN system SHALL display error
- WHERE user is on mobile OR tablet THEN system SHALL use responsive layout

### Negation (NOT)

**Pattern**: `IF [system] does NOT [condition] THEN [system] SHALL [response]`

**Examples**:
- IF user is NOT authenticated THEN system SHALL redirect to login
- WHEN validation does NOT pass THEN system SHALL display error messages
- IF data does NOT exist THEN system SHALL create new record

## Performance Requirements

Use specific, measurable criteria:

```
WHEN user requests data THEN system SHALL respond within 2 seconds
WHEN system processes batch job THEN system SHALL complete within 5 minutes
WHILE system is under load of 1000 concurrent users system SHALL maintain 99% uptime
```

## Security Requirements

Be explicit about security behaviors:

```
IF authentication fails THEN system SHALL log security event
WHEN user password is stored THEN system SHALL encrypt using bcrypt
IF user attempts 3 failed logins THEN system SHALL lock account for 15 minutes
WHEN sensitive data is transmitted THEN system SHALL use TLS 1.3 encryption
```

## Error Handling Requirements

Cover all error scenarios:

```
WHEN network request fails THEN system SHALL retry 3 times with exponential backoff
IF database connection is lost THEN system SHALL display connection error message
WHEN API returns error THEN system SHALL log error details and display user-friendly message
IF file upload fails THEN system SHALL allow user to retry upload
```

## Common Anti-Patterns

### ❌ Vague Requirements
**Bad**: System should be fast
**Good**: WHEN user requests data THEN system SHALL respond within 2 seconds

### ❌ Implementation Details
**Bad**: System SHALL use Redis for caching
**Good**: WHEN user requests frequently accessed data THEN system SHALL return cached results

### ❌ Unmeasurable Criteria
**Bad**: System should be user-friendly
**Good**: WHEN new user completes onboarding THEN system SHALL require no more than 3 clicks to reach main features

### ❌ Combining Multiple Requirements
**Bad**: System should validate input and display errors and enable submit button
**Good**: 
- WHEN user enters invalid input THEN system SHALL display validation error
- IF validation passes THEN system SHALL enable submit button

### ❌ Missing System Response
**Bad**: WHEN user clicks button
**Good**: WHEN user clicks button THEN system SHALL submit form

## Quick Reference Table

| Keyword | Purpose | Example Trigger |
|---------|---------|-----------------|
| WHEN | Events | User actions, system events, time triggers |
| IF | Conditions | Authentication, validation, state checks |
| WHILE | Continuous | Ongoing processes, real-time updates |
| WHERE | Context | Platform, location, environment |
| SHALL | Mandate | Always use for system responses |
| AND | Combine | Multiple conditions must be true |
| OR | Alternative | Any condition can trigger |

## Writing Tips

1. **Start with the trigger**: WHEN/IF/WHILE/WHERE
2. **Identify the system**: Name it explicitly or use "system"
3. **Use SHALL**: Always use for mandatory behavior
4. **Be specific**: Include measurable criteria
5. **One requirement**: Each statement = one testable requirement
6. **Avoid "should"**: Use "SHALL" for requirements
7. **Test it**: Can you write a test for this requirement?

## Validation Questions

For each requirement, ask:
- Is the trigger (WHEN/IF/WHILE/WHERE) clear?
- Is the system response specific and measurable?
- Can this be tested?
- Are edge cases covered?
- Is this free of implementation details?

## Further Reading

- [Kiro Standards Guide](../../kiro/spec-process-guide/resources/standards.md)
- [Requirements Phase Documentation](../../kiro/spec-process-guide/process/requirements-phase.md)
- [Requirements Examples](EXAMPLES.md)


