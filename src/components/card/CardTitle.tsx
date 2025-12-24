/**
 * @fileoverview Título do card
 * @module components/card/CardTitle
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Props do CardTitle */
interface CardTitleProps {
  /** Conteúdo do título */
  children: ReactNode;
  /** Classes CSS adicionais */
  className?: string;
  /** Tamanho do título */
  size?: 'sm' | 'md' | 'lg';
  /** Elemento HTML a usar */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/** Mapeamento de tamanhos */
const sizeStyles: Record<string, string> = {
  sm: 'text-base font-medium',
  md: 'text-lg font-semibold',
  lg: 'text-xl font-bold',
};

/**
 * Título para cards com estilos consistentes
 * @param props - Propriedades do componente
 * @returns Elemento JSX do título
 */
export const CardTitle = memo(function CardTitle({
  children,
  className,
  size = 'md',
  as: Component = 'h3',
}: CardTitleProps) {
  return (
    <Component
      className={cn(
        'leading-none tracking-tight',
        sizeStyles[size],
        className
      )}
    >
      {children}
    </Component>
  );
});
