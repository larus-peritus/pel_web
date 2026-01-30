# Module: [ModuleName]

## Basic Information

**Module Name**: [ModuleName]
**Location**: `apps/[app-name]/src/[path]/[file]`
**Created**: [YYYY-MM-DD]
**Last Updated**: [YYYY-MM-DD]
**Status**: ✅ Stable | 🔄 In Development | ⚠️ Needs Refactoring

## Purpose

[One paragraph description of what this module does and why it exists]

## Exports

### Classes
- **`class [ClassName]`** - [Description]
- **`class [ClassName2]`** - [Description]

### Functions
- **`function [functionName]()`** - [Description]
- **`function [functionName2]()`** - [Description]

### Types/Interfaces
- **`interface [InterfaceName]`** - [Description]
- **`type [TypeName]`** - [Description]

### Constants
- **`const [CONSTANT_NAME]`** - [Description]

## API Reference

### Class: [ClassName]

**Purpose**: [What this class does]

#### Constructor
```typescript
constructor([param1]: [type], [param2]: [type])
```

**Parameters**:
- `param1` - [Description]
- `param2` - [Description]

#### Properties
- **`public [property]: [type]`** - [Description]
- **`private [property]: [type]`** - [Description]

#### Methods

##### `[methodName]([params]): [returnType]`

**Purpose**: [What this method does]

**Parameters**:
- `param1: [type]` - [Description]
- `param2: [type]` - [Description]

**Returns**: [Description of return value]

**Throws**: [Exceptions that can be thrown]

**Example**:
```typescript
const result = instance.methodName(arg1, arg2);
```

### Function: [functionName]

```typescript
function [functionName]([param]: [type]): [returnType]
```

**Purpose**: [What this function does]

**Parameters**:
- `param: [type]` - [Description]

**Returns**: [Description]

**Example**:
```typescript
const result = functionName(value);
```

## Dependencies

### External Dependencies
| Dependency | Version | Purpose |
|------------|---------|---------|
| [package] | [1.0.0] | [Why it's used] |

### Internal Dependencies
- **[Module A]** - [What functionality is used]
- **[Module B]** - [What functionality is used]

### Used By
- **[Module C]** - [How this module is used]
- **[Module D]** - [How this module is used]

## Implementation Details

### Key Algorithms
- [Algorithm 1]: [Brief description]
- [Algorithm 2]: [Brief description]

### Data Structures
- [Data structure used and why]

### Design Patterns
- [Pattern used]: [Why it's used]

## Examples

### Basic Usage
```typescript
// [Description of what this example shows]
import { [Export] } from './[path]/[file]';

// Create instance or use function
const instance = new [ClassName](args);
const result = instance.method();
```

### Advanced Usage
```typescript
// [Description of advanced scenario]
// Code example
```

### Common Patterns
```typescript
// [Pattern 1]: [When to use this pattern]
// Code example

// [Pattern 2]: [When to use this pattern]
// Code example
```

## Testing

### Test Location
`apps/[app-name]/tests/[path]/[file].test.ts`

### Test Coverage
**Coverage**: [X]%

### Key Test Cases
- **[Test case 1]**: Tests [scenario]
- **[Test case 2]**: Tests [scenario]
- **[Test case 3]**: Tests [error case]

### Running Tests
```bash
npm test [test-file]
# or
npm test -- --testNamePattern="[module-name]"
```

## Error Handling

### Exceptions Thrown
- **`[ExceptionType]`**: Thrown when [condition]
- **`[ExceptionType]`**: Thrown when [condition]

### Error Handling Strategy
[How errors should be handled when using this module]

```typescript
try {
  const result = module.method();
} catch (error) {
  if (error instanceof [SpecificError]) {
    // Handle specific error
  }
}
```

## Performance Considerations

### Time Complexity
- `[method]`: O([complexity])
- `[method]`: O([complexity])

### Space Complexity
- [Memory usage notes]

### Optimization Notes
- [Optimization 1]
- [Optimization 2]

## Security Considerations

- [Security consideration 1]
- [Security consideration 2]

## Configuration

### Environment Variables
- `[VAR_NAME]`: [Purpose] - Required/Optional

### Configuration Options
```typescript
const config = {
  [option1]: [value],
  [option2]: [value]
};
```

## Integration

### How to Integrate
1. [Step 1]: Import the module
2. [Step 2]: Initialize/Configure
3. [Step 3]: Use the functionality

### Integration Example
```typescript
// Complete integration example
import { [Module] } from '[path]';

// Setup
const instance = new [Module](config);

// Use
const result = await instance.method();
```

## Migration Notes

### From Previous Version
[If this module replaces something, explain migration]

### Breaking Changes
- [Change 1]: [Description and migration path]
- [Change 2]: [Description and migration path]

## Maintenance

### Known Issues
- [Issue 1]: [Description and workaround]

### Future Improvements
- [Improvement 1]: [Description]
- [Improvement 2]: [Description]

### Tech Debt
- [Debt item 1]: [Description and plan to address]

## Related

### Implements Requirements
- REQ-[ID] from [specs/[feature]-requirements.md](../../specs/[feature]-requirements.md)
- REQ-[ID] from [specs/[feature]-requirements.md](../../specs/[feature]-requirements.md)

### Part of Feature
- [**[Feature Name]**](../features/[feature].md)

### Related Modules
- [**[Module A]**](Module A.md) - [Relationship]
- [**[Module B]**](ModuleB.md) - [Relationship]

## References

### External Documentation
- [Link to external resource]
- [Link to package docs]

### Design Documents
- [Link to design decision]
- [Link to architecture doc]

---

**Maintained by**: Builder agents
**Last Review**: [YYYY-MM-DD]


