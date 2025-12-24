/**
 * @fileoverview Grupo de botões com espaçamento consistente
 * @module components/button/ButtonGroup
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Props do ButtonGroup */
interface ButtonGroupProps {
  /** Botões filhos */
  children: ReactNode;
  /** Orientação do grupo */
  orientation?: 'horizontal' | 'vertical';
  /** Tamanho do espaçamento */
  gap?: 'none' | 'sm' | 'md' | 'lg';
  /** Classes CSS adicionais */
  className?: string;
  /** Alinhamento dos botões */
  align?: 'start' | 'center' | 'end' | 'stretch';
}

/** Mapeamento de gaps */
const gapStyles: Record<string, string> = {
  none: 'gap-0',
  sm: 'gap-1',
  md: 'gap-2',
  lg: 'gap-4',
};

/** Mapeamento de alinhamentos */
const alignStyles: Record<string, string> = {
  start: 'items-start justify-start',
  center: 'items-center justify-center',
  end: 'items-end justify-end',
  stretch: 'items-stretch',
};

/**
 * Agrupa botões com espaçamento e orientação consistentes
 * @param props - Propriedades do componente
 * @returns Elemento JSX do grupo de botões
 */
export const ButtonGroup = memo(function ButtonGroup({
  children,
  orientation = 'horizontal',
  gap = 'md',
  className,
  align = 'start',
}: ButtonGroupProps) {
  return (
    <div
      className={cn(
        'inline-flex',
        orientation === 'vertical' ? 'flex-col' : 'flex-row',
        gapStyles[gap],
        alignStyles[align],
        className
      )}
      role="group"
    >
      {children}
    </div>
  );
});
