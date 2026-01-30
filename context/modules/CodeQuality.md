# Code Quality Configuration

## Location
- `/Users/larusperitus/Documents/code/peritus/pel_web/apps/peninganaedalifid/.prettierrc`
- `/Users/larusperitus/Documents/code/peritus/pel_web/apps/peninganaedalifid/eslint.config.mjs`
- `/Users/larusperitus/Documents/code/peritus/pel_web/apps/peninganaedalifid/package.json` (scripts section)

## Purpose
Provides code linting and formatting configuration for consistent code style and quality across the project.

## Components

### Prettier Configuration
Location: `.prettierrc`

Settings:
- `semi`: true (use semicolons)
- `singleQuote`: true (use single quotes)
- `tabWidth`: 2 (2 spaces for indentation)
- `trailingComma`: "es5" (trailing commas where valid in ES5)
- `printWidth`: 100 (max line length of 100 characters)

### ESLint Configuration
Location: `eslint.config.mjs`

Features:
- Next.js core web vitals rules
- Next.js TypeScript rules
- Prettier compatibility (eslint-config-prettier)
- Custom ignores for build artifacts

### NPM Scripts
Location: `package.json`

Available commands:
- `npm run lint` - Run ESLint checks
- `npm run lint:fix` - Run ESLint and auto-fix issues
- `npm run format` - Format all source files with Prettier
- `npm run format:check` - Check if files are formatted correctly

## Dependencies
- `prettier` (^3.8.0) - Code formatter
- `eslint-config-prettier` (^10.1.8) - Disables ESLint rules that conflict with Prettier
- `eslint` (^9) - JavaScript/TypeScript linter
- `eslint-config-next` (16.1.3) - Next.js specific ESLint rules

## Integration
- Used by: All source code files in the project
- Integrates with: Next.js build process, VS Code editor (when settings configured)

## Editor Integration
Note: VS Code settings file (`.vscode/settings.json`) needs to be created manually with:
- Format on save enabled
- Default formatter set to Prettier
- ESLint auto-fix on save

## Related
- Implements: Requirements US-F1, US-F2 from specs/project-foundation/requirements.md
- Part of: specs/project-foundation/design.md
- Task: F2 from specs/project-foundation/tasks.md
