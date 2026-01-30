# UI Components Barrel Export

## Location
`apps/peninganaedalifid/src/components/ui/index.ts`

## Purpose
Provides a centralized export point for all UI components, enabling clean and consistent imports throughout the application.

## Exports

### Form Components
- `Button` - Primary button component with variants
- `Input` - Base text input component
- `CurrencyInput` - Specialized currency input with formatting
- `NumberInput` - Numeric input with validation
- `Select` - Dropdown selection component
- `Slider` - Range slider input component

### Container Components
- `Card` - Card container with elevation/outline variants
- `CardHeader` - Header section of a card
- `CardContent` - Main content area of a card
- `CardFooter` - Footer section of a card

### Feedback Components
- `Alert` - Alert message component with variants
- `Badge` - Status indicator/tag component
- `ToastContainer` - Toast notification container
- `Tooltip` - Contextual tooltip component

## Type Exports
All component prop types are also exported for external use:
- `ButtonProps`, `InputProps`, `CurrencyInputProps`, `NumberInputProps`
- `SelectProps`, `SelectOption`, `SliderProps`
- `CardProps`, `CardHeaderProps`, `CardContentProps`, `CardFooterProps`
- `AlertProps`, `BadgeProps`

## Usage

Instead of importing from individual files:
```tsx
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
```

Import from the barrel export:
```tsx
import { Button, Input, Card } from '@/components/ui';
```

## Benefits
- **Cleaner imports**: Single import statement for multiple components
- **Consistency**: Standardized import pattern across the codebase
- **Refactoring**: Easier to reorganize file structure without breaking imports
- **Tree-shaking**: Modern bundlers still tree-shake unused exports

## Related
- Implements: Task F16 from specs/project-foundation/tasks.md
- Uses: All UI components created in tasks F5-F15
