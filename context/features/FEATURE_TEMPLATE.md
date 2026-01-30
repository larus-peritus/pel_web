# Feature: [Feature Name]

## Overview

**Feature Name**: [Feature Name]
**Status**: 🔄 In Progress | ✅ Complete | ⏳ Pending
**Started**: [YYYY-MM-DD]
**Last Updated**: [YYYY-MM-DD]

**Brief Description**: [One paragraph description of what this feature does]

## Spec References

- **Requirements**: [specs/[feature-name]-requirements.md](../../specs/[feature-name]-requirements.md)
- **Design**: [specs/[feature-name]-design.md](../../specs/[feature-name]-design.md)
- **Tasks**: [specs/[feature-name]-tasks.md](../../specs/[feature-name]-tasks.md)

## Architecture

### Overview
[High-level architecture description from design doc]

### Components
[Diagram or description of how components interact]

```
[Component A]
    ↓
[Component B] → [Component C]
    ↓
[Component D]
```

### Data Flow
[How data flows through this feature]

## Implementation Status

**Progress**: [X]/[Y] tasks complete

### Completed
- ✅ Task 1.1: [Description] - [Date]
- ✅ Task 1.2: [Description] - [Date]

### In Progress
- 🔄 Task 1.3: [Description] - Started [Date]

### Pending
- ⏳ Task 1.4: [Description]
- ⏳ Task 1.5: [Description]

## Modules

### Core Modules
- [**ModuleName1**](../modules/ModuleName1.md) - [Purpose]
- [**ModuleName2**](../modules/ModuleName2.md) - [Purpose]

### Supporting Modules
- [**UtilModule1**](../modules/UtilModule1.md) - [Purpose]

## Dependencies

### External Dependencies
- `[package-name]` ([version]) - [Purpose in this feature]

### Internal Dependencies
- Depends on: [Other features this depends on]
- Used by: [Other features that use this]

## File Structure

```
apps/[app-name]/
├── src/
│   ├── [feature-directory]/
│   │   ├── [Component1].ts
│   │   ├── [Component2].ts
│   │   └── index.ts
│   └── ...
└── tests/
    ├── [feature-directory]/
    │   ├── [Component1].test.ts
    │   └── [Component2].test.ts
    └── ...
```

## Testing

### Unit Tests
- **Location**: `apps/[app-name]/tests/[feature]/`
- **Coverage**: [X]%
- **Key Test Cases**:
  - [Test case 1]
  - [Test case 2]

### Integration Tests
- **Location**: `apps/[app-name]/tests/integration/[feature]/`
- **Scenarios Covered**:
  - [Scenario 1]
  - [Scenario 2]

## API Endpoints (if applicable)

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| GET | `/api/[path]` | [Purpose] | ✅ Implemented |
| POST | `/api/[path]` | [Purpose] | 🔄 In Progress |
| PUT | `/api/[path]` | [Purpose] | ⏳ Pending |

## Data Models (if applicable)

### Primary Models
- **[ModelName]**: [Description]
  - Key fields: [field1, field2]
  - Relationships: [Related models]

### Supporting Models
- **[ModelName]**: [Description]

## User Interface (if applicable)

### Screens/Pages
- [Screen 1]: [Purpose]
- [Screen 2]: [Purpose]

### User Flows
1. [Flow description]
2. [Flow description]

## Implementation Notes

### Key Decisions
- **[Decision Title]** ([Date]): [Decision and rationale]
- **[Decision Title]** ([Date]): [Decision and rationale]

### Challenges & Solutions
- **Challenge**: [Description]
  - **Solution**: [How it was solved]
  - **Date**: [YYYY-MM-DD]

### Performance Considerations
- [Consideration 1]
- [Consideration 2]

### Security Considerations
- [Consideration 1]
- [Consideration 2]

## Examples

### Usage Example 1
```typescript
// [Description of what this example shows]
import { [Module] } from './[path]';

// Example code
const result = await module.method();
```

### Usage Example 2
```typescript
// [Description of what this example shows]
// Example code
```

## Integration Points

### Integrates With
- **[Other Feature/Module]**: [How they integrate]
- **[External Service]**: [Purpose of integration]

### Provides To
- **[Other Feature/Module]**: [What this feature provides]

## Deployment Notes

### Environment Variables
- `[VAR_NAME]`: [Purpose] - Required/Optional

### Configuration
- [Config item 1]
- [Config item 2]

### Migration Steps (if applicable)
1. [Step 1]
2. [Step 2]

## Known Issues

- [Issue 1]: [Description and workaround if any]
- [Issue 2]: [Description and workaround if any]

## Future Enhancements

- [Enhancement 1]: [Description]
- [Enhancement 2]: [Description]

## References

### Related Documentation
- [Link to related doc]
- [Link to external resource]

### Relevant Requirements
- REQ-[ID]: [Brief description]
- REQ-[ID]: [Brief description]

---

**Maintained by**: Builder agents and implementation coordinator
**Last Review**: [YYYY-MM-DD]


