/**
 * @fileoverview Corpo do card
 * @module components/card/CardBody
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Props do CardBody */
interface CardBodyProps {
  /** Conteúdo do corpo */
  children: ReactNode;
  /** Classes CSS adicionais */
  className?: string;
  /** Padding interno */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/** Mapeamento de paddings */
const paddingStyles: Record<string, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

/**
 * Corpo do card para conteúdo principal
 * @param props - Propriedades do componente
 * @returns Elemento JSX do corpo
 */
export const CardBody = memo(function CardBody({
  children,
  className,
  padding = 'md',
}: CardBodyProps) {
  return (
    <div className={cn(paddingStyles[padding], className)}>
      {children}
    </div>
  );
});
