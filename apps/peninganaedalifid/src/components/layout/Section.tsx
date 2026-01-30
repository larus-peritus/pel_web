import { cn } from '@/lib/utils/cn';

export interface SectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Section component for consistent vertical spacing and section organization
 *
 * Provides consistent vertical margins and optional title/description headers
 * for major page sections.
 */
export function Section({
  children,
  title,
  description,
  className
}: SectionProps) {
  return (
    <section className={cn('py-8 md:py-12', className)}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-neutral-600 text-base">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
