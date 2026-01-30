/**
 * UI Components Barrel Export
 *
 * This file provides a central export point for all UI components,
 * enabling clean imports like:
 *
 * @example
 * ```tsx
 * import { Button, Input, Card } from '@/components/ui';
 * ```
 */

// Form Components
export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Input } from './Input';
export type { InputProps } from './Input';

export { CurrencyInput } from './CurrencyInput';
export type { CurrencyInputProps } from './CurrencyInput';

export { NumberInput } from './NumberInput';
export type { NumberInputProps } from './NumberInput';

export { Select } from './Select';
export type { SelectProps, SelectOption } from './Select';

export { Slider } from './Slider';
export type { SliderProps } from './Slider';

export { Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';

// Container Components
export { Card, CardHeader, CardContent, CardFooter } from './Card';
export type {
  CardProps,
  CardHeaderProps,
  CardContentProps,
  CardFooterProps,
} from './Card';

// Feedback Components
export { Alert } from './Alert';
export type { AlertProps } from './Alert';

export { Badge } from './Badge';
export type { BadgeProps } from './Badge';

export { ToastContainer } from './Toast';

export { Tooltip } from './Tooltip';

// Overlay Components
export { Modal, ModalFooter } from './Modal';
export type { ModalProps, ModalFooterProps } from './Modal';
