/**
 * @file AlertDescription.tsx
 * @description Descrição/corpo do alerta
 * @category Components/Alert
 */

import React, { memo } from 'react';
import { AlertDescription as ShadcnAlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

/**
 * Props do AlertDescription
 */
export interface AlertDescriptionProps {
  /** Conteúdo da descrição */
  children: React.ReactNode;
  /** Classe adicional */
  className?: string;
  /** Tamanho do texto */
  size?: 'sm' | 'md' | 'lg';
  /** Se deve truncar texto longo */
  truncate?: boolean;
  /** Máximo de linhas antes de truncar */
  maxLines?: number;
}

const sizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

/**
 * Descrição/corpo do alerta
 * 
 * @example
 * ```tsx
 * <AlertDescription size="md">
 *   Sua operação foi concluída com sucesso.
 * </AlertDescription>
 * ```
 */
export const AlertDescription = memo(function AlertDescription({
  children,
  className,
  size = 'md',
  truncate = false,
  maxLines,
}: AlertDescriptionProps) {
  return (
    <ShadcnAlertDescription
      className={cn(
        sizeClasses[size],
        'leading-relaxed',
        truncate && 'truncate',
        maxLines && `line-clamp-${maxLines}`,
        className
      )}
    >
      {children}
    </ShadcnAlertDescription>
  );
});

AlertDescription.displayName = 'AlertDescription';

export default AlertDescription;
