# SubscriptionForm Component

## Location
`apps/peninganaedalifid/src/components/subscriptions/SubscriptionForm.tsx`

## Purpose
Form component for adding or editing user subscriptions in the Subscription Burn Meter feature. Provides a fully accessible, validated form with quick presets for common Icelandic subscriptions.

## Exports
- `SubscriptionForm` - Main form component
- `SubscriptionFormProps` - TypeScript interface for component props

## Key Functionality

### Dual Mode Operation
- **Add Mode**: Creates new subscriptions with quick preset selector
- **Edit Mode**: Modifies existing subscriptions, preserving `isActive` state

### Form Fields
1. **Quick Preset** (Add mode only): Dropdown with 22+ common Icelandic subscriptions
2. **Name**: Text input (required, max 100 characters)
3. **Monthly Cost**: Number input (required, must be > 0 ISK)
4. **Category**: Select dropdown with 6 Icelandic categories

### Validation Rules
All validation messages are in Icelandic:
- Name required: "Nafn má ekki vera tómt"
- Name max length: "Nafn má ekki vera lengra en 100 stafir"
- Cost required: "Kostnaður verður að vera hærri en 0 kr"
- Cost must be number: "Kostnaður verður að vera tala"

### Quick Presets
Imports `COMMON_SUBSCRIPTIONS` from `@/lib/calculations/subscriptions`:
- **Streaming**: Netflix, Spotify, Disney+, HBO Max, Amazon Prime, YouTube Premium, Apple TV+, Síminn Sport
- **Software**: iCloud, Google One, Microsoft 365, Adobe Creative Cloud, Dropbox
- **Fitness**: World Class, Fítness, Strava
- **News**: Morgunblaðið, Vísir Premium, DV, The Reykjavik Grapevine
- **Gaming**: PlayStation Plus, Xbox Game Pass, Nintendo Switch Online

### Category Options
Uses `SUBSCRIPTION_CATEGORY_LABELS` from `@/lib/calculations/subscriptions`:
- `streaming`: Streymi
- `software`: Hugbúnaður
- `fitness`: Líkamsrækt
- `news`: Fréttir og tímarit
- `gaming`: Tölvuleikir
- `other`: Annað

## Dependencies
- `@/components/ui/Input` - Text and number inputs with validation
- `@/components/ui/Select` - Category and preset dropdowns
- `@/components/ui/Button` - Form action buttons
- `@/components/ui/Card` - Layout structure (Header, Content, Footer)
- `@/lib/calculations/subscriptions` - Category labels and common presets
- `@/types/calculator` - Subscription and SubscriptionCategory types

## Props Interface
```typescript
interface SubscriptionFormProps {
  mode: 'add' | 'edit';
  subscription?: Subscription; // Required in edit mode
  onSave: (subscription: Omit<Subscription, 'id'>) => void;
  onCancel: () => void;
}
```

## State Management
- `name`: Subscription name (string)
- `monthlyCost`: Monthly cost as string (converted to number on save)
- `category`: Selected category (SubscriptionCategory)
- `quickSelect`: Selected preset index (string, add mode only)
- `errors`: Validation errors object

## User Interactions
1. **Quick Preset Selection**: Auto-populates name, cost, and category
2. **Form Input**: All fields update state on change
3. **Validation**: Triggered on form submission
4. **Submit**: Calls `onSave` with validated data (without ID)
5. **Cancel**: Calls `onCancel` without saving

## Accessibility Features
- All inputs have proper labels in Icelandic
- Required fields marked with `*` and `aria-label`
- Validation errors displayed with `role="alert"`
- `aria-invalid` attributes on inputs with errors
- Form can be submitted with Enter key
- Focus management for keyboard navigation

## Validation Behavior
- HTML5 validation prevents empty required fields
- Custom validation for:
  - Name trimming and max length (100 chars)
  - Cost must be positive number
- Validation errors cleared when quick preset selected
- Errors displayed inline below each field

## Data Flow
1. **Add Mode**: Empty form → User fills or selects preset → Validates → Calls `onSave` with new data
2. **Edit Mode**: Pre-filled form → User modifies → Validates → Calls `onSave` with updated data

## Integration Points
- Parent component provides `onSave` callback to handle subscription creation/update
- Parent component provides `onCancel` callback to close form
- Form data structure matches `Subscription` type (minus `id`)
- Preserves `isActive` state from original subscription in edit mode

## Tests
- Location: `apps/peninganaedalifid/tests/components/subscriptions/SubscriptionForm.test.tsx`
- Coverage: 24 tests covering:
  - Rendering in add/edit modes
  - Form field interactions
  - Quick preset population
  - Validation (name, cost, max length)
  - Category selection
  - Form submission with valid data
  - Cancel functionality
  - Accessibility features
  - All tests passing ✅

## Related
- Implements: Subscription Burn Meter feature requirements
- Uses: SubscriptionCategory and Subscription types
- Works with: Subscription management context/components
- Part of: `@/components/subscriptions` module

## Localization
All user-facing text is in Icelandic (IS):
- Form title: "Bæta við áskrift" / "Breyta áskrift"
- Field labels: "Nafn áskriftar", "Mánaðarkostnaður", "Flokkur", "Flýtival"
- Buttons: "Vista", "Hætta við"
- Category labels: All in Icelandic
- Validation messages: All in Icelandic

## Implementation Notes
- Currency inputs use plain number input (not CurrencyInput) for simplicity
- ISK amounts entered as whole numbers (no decimals needed)
- Quick preset only shown in add mode to avoid confusion
- Whitespace trimmed from name on submission
- Default category is "other" for new subscriptions
- Form uses Card component for consistent styling
