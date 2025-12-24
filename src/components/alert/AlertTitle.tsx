/**
 * @fileoverview Título para componente de alerta
 * @module components/alert/AlertTitle
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Props do AlertTitle */
interface AlertTitleProps {
  /** Conteúdo do título */
  children: ReactNode;
  /** Classes CSS adicionais */
  className?: string;
  /** Variante do alerta para estilização */
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
}

/** Mapeamento de variantes para estilos */
const variantStyles: Record<string, string> = {
  default: 'text-foreground',
  destructive: 'text-destructive',
  success: 'text-green-700 dark:text-green-400',
  warning: 'text-yellow-700 dark:text-yellow-400',
  info: 'text-blue-700 dark:text-blue-400',
};

/**
 * Componente de título para alertas
 * @param props - Propriedades do componente
 * @returns Elemento JSX do título
 */
export const AlertTitle = memo(function AlertTitle({
  children,
  className,
  variant = 'default',
}: AlertTitleProps) {
  return (
    <h5
      className={cn(
        'mb-1 font-semibold leading-none tracking-tight',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </h5>
  );
});
