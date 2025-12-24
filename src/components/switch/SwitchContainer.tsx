/**
 * @fileoverview Container para switch com label
 * @module components/switch/SwitchContainer
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Props do SwitchContainer */
interface SwitchContainerProps {
  /** Elementos filhos (switch e label) */
  children: ReactNode;
  /** Classes CSS adicionais */
  className?: string;
  /** Orientação do layout */
  orientation?: 'horizontal' | 'vertical';
  /** Se está desabilitado */
  disabled?: boolean;
}

/**
 * Container para agrupar switch com seu label
 * @param props - Propriedades do componente
 * @returns Elemento JSX
 */
export const SwitchContainer = memo(function SwitchContainer({
  children,
  className,
  orientation = 'horizontal',
  disabled = false,
}: SwitchContainerProps) {
  return (
    <div
      className={cn(
        'flex gap-3',
        orientation === 'horizontal' ? 'items-center' : 'flex-col items-start',
        disabled && 'opacity-60 pointer-events-none',
        className
      )}
    >
      {children}
    </div>
  );
});
