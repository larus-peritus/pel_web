import { cn } from '@/lib/utils/cn';

export interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  success: 'bg-success-50 text-success-600 border-success-500/20',
  warning: 'bg-warning-50 text-warning-600 border-warning-500/20',
  danger: 'bg-danger-50 text-danger-600 border-danger-500/20',
  info: 'bg-primary-50 text-primary-600 border-primary-500/20',
  primary: 'bg-primary-100 text-primary-700 border-primary-500/30',
  neutral: 'bg-neutral-50 text-neutral-600 border-neutral-500/20',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function Badge({
  variant,
  size = 'md',
  children,
  className
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
