# Layout Components Barrel Export

## Location
`apps/peninganaedalifid/src/components/layout/index.ts`

## Purpose
Provides a centralized export point for all layout components, enabling clean and consistent imports throughout the application.

## Exports

### Layout Components
- `Header` - Site header with branding and navigation
- `Footer` - Site footer with privacy notice and attribution
- `Container` - Max-width container with responsive padding
- `Section` - Section wrapper with consistent vertical spacing

## Type Exports
Exported component prop types:
- `ContainerProps` - Container component props (size variants)
- `SectionProps` - Section component props (title, description)

Note: `Header` and `Footer` have internal prop interfaces and don't export their types.

## Usage

Instead of importing from individual files:
```tsx
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';
```

Import from the barrel export:
```tsx
import { Header, Footer, Container } from '@/components/layout';
```

## Benefits
- **Cleaner imports**: Single import statement for multiple components
- **Consistency**: Standardized import pattern across the codebase
- **Refactoring**: Easier to reorganize file structure without breaking imports
- **Tree-shaking**: Modern bundlers still tree-shake unused exports

## Related
- Implements: Task F16 from specs/project-foundation/tasks.md
- Uses: Layout components created in tasks F17-F20
