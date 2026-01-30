# Newsletter Integration (Buttondown)

## Location
- `apps/peninganaedalifid/src/components/newsletter/NewsletterSubscribe.tsx`
- `apps/peninganaedalifid/src/components/newsletter/WelcomeModal.tsx`
- `apps/peninganaedalifid/src/components/newsletter/index.ts`

## Purpose
Provides newsletter subscription functionality using Buttondown, with a first-visit welcome modal that introduces the app and collects email subscribers.

## Exports
- `NewsletterSubscribe` - Buttondown subscription form component
- `NewsletterSubscribeProps` - TypeScript interface
- `WelcomeModal` - First-visit modal with app intro + newsletter signup
- `WelcomeModalProps` - TypeScript interface
- `useResetWelcomeModal` - Hook to reset welcome modal (for testing)

## Key Functionality

### NewsletterSubscribe Component
- **Form submission** to Buttondown API with fallback to form POST
- **Email validation** with Icelandic error messages
- **Loading state** with spinner
- **Success state** with confirmation message
- **Spam-free promise** text
- **Compact mode** for inline display
- Props: `buttondownId`, `heading`, `description`, `onSuccess`, `compact`

### WelcomeModal Component
- **First-visit detection** using localStorage (`peninganaedalifid_welcome_shown`)
- **Delayed display** (1 second after page load for smooth UX)
- **App introduction** in Icelandic:
  - What is this app?
  - What can I learn? (4 key benefits)
  - How to get started? (3 steps)
- **Newsletter signup** embedded in modal
- **Dismissal remembered** in localStorage
- Props: `forceShow`, `onDismiss`, `buttondownId`

## Dependencies
- `@/components/ui/Modal` - Modal dialog component
- `@/components/ui/Button` - Button component
- `@/components/ui/Input` - Input component
- `@/lib/utils` - cn() utility

## Integration
- **Used by**: Root layout (`src/app/layout.tsx`)
- **Triggers on**: First visit to any page
- **Stores**: `peninganaedalifid_welcome_shown` in localStorage

## Usage Example

### In Root Layout (already configured)
```typescript
import { WelcomeModal } from "@/components/newsletter";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <WelcomeModal buttondownId="peninganaedalifid" />
      </body>
    </html>
  );
}
```

### Standalone Newsletter Form
```typescript
import { NewsletterSubscribe } from '@/components/newsletter';

function SidebarNewsletter() {
  return (
    <NewsletterSubscribe
      buttondownId="peninganaedalifid"
      heading="Fáðu fréttir"
      description="Skráðu þig á póstlistann"
      onSuccess={() => console.log('Subscribed!')}
    />
  );
}
```

### Testing: Reset Welcome Modal
```typescript
import { useResetWelcomeModal } from '@/components/newsletter';

function DevTools() {
  const resetWelcome = useResetWelcomeModal();
  return <button onClick={resetWelcome}>Reset Welcome</button>;
}
```

## Modal Content (Icelandic)

### Heading
"Velkominn á Peningana Edal Ifið!"

### Benefits Listed
1. ⏱️ Raunverulegt tímakaup - actual hourly wage
2. 🎯 FI-töluna þína - your FI number
3. 📊 Samanburð á útgjöldum - expense comparison
4. 🔥 FIRE leiðir - FIRE paths

### Getting Started Steps
1. Start with Actual Hourly Wage calculator
2. Set up expense baseline
3. Explore FIRE calculators

## Configuration

### Buttondown Setup
1. Create account at buttondown.email
2. Get publication ID (username)
3. Pass to components: `buttondownId="your-publication"`

### Environment Variables (optional)
```env
NEXT_PUBLIC_BUTTONDOWN_ID=peninganaedalifid
```

## Related
- **Modal Component**: `src/components/ui/Modal.tsx`
- **AdSense Integration**: Similar pattern for monetization
- **Cookie Consent**: Similar localStorage-based dismissal pattern

## Future Enhancements
- A/B testing different modal content
- Segment subscribers by calculator used
- Welcome series automation in Buttondown
- Analytics tracking for conversion rates
