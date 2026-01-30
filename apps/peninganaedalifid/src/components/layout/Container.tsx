import { cn } from '@/lib/utils';

export interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * Container component for max-width content with responsive padding
 *
 * Size variants:
 * - sm: 640px max-width
 * - md: 768px max-width
 * - lg: 1024px max-width
 * - xl: 1280px max-width
 */
export function Container({
  children,
  size = 'lg',
  className
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-[640px]',
    md: 'max-w-[768px]',
    lg: 'max-w-[1024px]',
    xl: 'max-w-[1280px]',
  };

  return (
    <div className={cn(
      'mx-auto w-full px-4 sm:px-6 lg:px-8',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
}
