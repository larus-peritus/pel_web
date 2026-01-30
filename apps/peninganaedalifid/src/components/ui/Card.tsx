import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Card component variants
 */
const cardVariants = {
  elevated: 'bg-white rounded-xl shadow-sm border border-neutral-200',
  outlined: 'bg-white rounded-xl border-2 border-neutral-200',
};

/**
 * Card Props
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined';
}

/**
 * Card - Container component with elevation or outline styling
 *
 * @example
 * ```tsx
 * <Card variant="elevated">
 *   <CardHeader>
 *     <h2>Title</h2>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Content goes here</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
export function Card({
  children,
  variant = 'elevated',
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(cardVariants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * CardHeader Props
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * CardHeader - Header section of a card, typically contains titles
 *
 * @example
 * ```tsx
 * <CardHeader>
 *   <h2 className="text-xl font-semibold">Card Title</h2>
 *   <p className="text-sm text-neutral-600">Subtitle</p>
 * </CardHeader>
 * ```
 */
export function CardHeader({
  children,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn('px-6 py-4 border-b border-neutral-200', className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * CardContent Props
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * CardContent - Main content area of a card
 *
 * @example
 * ```tsx
 * <CardContent>
 *   <p>Your content here</p>
 * </CardContent>
 * ```
 */
export function CardContent({
  children,
  className,
  ...props
}: CardContentProps) {
  return (
    <div
      className={cn('px-6 py-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * CardFooter Props
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * CardFooter - Footer section of a card, typically contains actions
 *
 * @example
 * ```tsx
 * <CardFooter>
 *   <Button variant="primary">Save</Button>
 *   <Button variant="secondary">Cancel</Button>
 * </CardFooter>
 * ```
 */
export function CardFooter({
  children,
  className,
  ...props
}: CardFooterProps) {
  return (
    <div
      className={cn('px-6 py-4 border-t border-neutral-200 flex gap-2', className)}
      {...props}
    >
      {children}
    </div>
  );
}
