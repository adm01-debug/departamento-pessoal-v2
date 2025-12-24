/**
 * @file AlertContainer.tsx
 * @description Container principal para alertas com variantes
 * @category Components/Alert
 */

import React, { memo } from 'react';
import { Alert } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Variantes de alerta disponíveis
 */
export type AlertVariant = 'default' | 'info' | 'success' | 'warning' | 'error' | 'destructive';

/**
 * Props do AlertContainer
 */
export interface AlertContainerProps {
  /** Variante visual do alerta */
  variant?: AlertVariant;
  /** Conteúdo do alerta */
  children: React.ReactNode;
  /** Classe adicional */
  className?: string;
  /** Mostrar ícone padrão da variante */
  showIcon?: boolean;
  /** Ícone customizado */
  icon?: React.ReactNode;
  /** Callback para fechar */
  onClose?: () => void;
  /** Se é dispensável */
  dismissible?: boolean;
}

const variantIcons: Record<AlertVariant, React.ReactNode> = {
  default: <Info className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
  success: <CheckCircle2 className="h-4 w-4" />,
  warning: <AlertTriangle className="h-4 w-4" />,
  error: <XCircle className="h-4 w-4" />,
  destructive: <AlertCircle className="h-4 w-4" />,
};

const variantClasses: Record<AlertVariant, string> = {
  default: 'bg-background text-foreground border',
  info: 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950 dark:text-blue-100 dark:border-blue-800',
  success: 'bg-green-50 text-green-900 border-green-200 dark:bg-green-950 dark:text-green-100 dark:border-green-800',
  warning: 'bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-100 dark:border-yellow-800',
  error: 'bg-red-50 text-red-900 border-red-200 dark:bg-red-950 dark:text-red-100 dark:border-red-800',
  destructive: 'bg-destructive/15 text-destructive border-destructive/50',
};

/**
 * Container principal para alertas
 * 
 * @example
 * ```tsx
 * <AlertContainer variant="success" showIcon>
 *   <AlertTitle>Sucesso!</AlertTitle>
 *   <AlertDescription>Operação realizada.</AlertDescription>
 * </AlertContainer>
 * ```
 */
export const AlertContainer = memo(function AlertContainer({
  variant = 'default',
  children,
  className,
  showIcon = true,
  icon,
  onClose,
  dismissible = false,
}: AlertContainerProps) {
  const displayIcon = icon ?? (showIcon ? variantIcons[variant] : null);

  return (
    <Alert
      variant={variant === 'destructive' ? 'destructive' : 'default'}
      className={cn(
        'relative',
        variantClasses[variant],
        dismissible && 'pr-10',
        className
      )}
    >
      {displayIcon && (
        <div className="mr-3 flex-shrink-0">
          {displayIcon}
        </div>
      )}
      <div className="flex-1">{children}</div>
      {dismissible && onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
          aria-label="Fechar alerta"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </Alert>
  );
});

AlertContainer.displayName = 'AlertContainer';

export default AlertContainer;
