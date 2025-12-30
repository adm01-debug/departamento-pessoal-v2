/**
 * @file AlertTitle.tsx
 * @description Título do alerta
 * @category Components/Alert
 */

import React, { memo } from 'react';
import { AlertTitle as ShadcnAlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

/**
 * Props do AlertTitle
 */
export interface AlertTitleProps {
  /** Texto do título */
  children: React.ReactNode;
  /** Classe adicional */
  className?: string;
  /** Tamanho do título */
  size?: 'sm' | 'md' | 'lg';
  /** Peso da fonte */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

/**
 * Título do alerta
 *
 * @example
 * ```tsx
 * <AlertTitle size="lg" weight="bold">
 *   Atenção!
 * </AlertTitle>
 * ```
 */
export const AlertTitle = memo(function AlertTitle({
  children,
  className,
  size = 'md',
  weight = 'medium',
}: AlertTitleProps) {
  return (
    <ShadcnAlertTitle
      className={cn(
        sizeClasses[size],
        weightClasses[weight],
        'mb-1 leading-none tracking-tight',
        className
      )}
    >
      {children}
    </ShadcnAlertTitle>
  );
});

AlertTitle.displayName = 'AlertTitle';

export default AlertTitle;
