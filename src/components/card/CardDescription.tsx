/**
 * @fileoverview Descrição do card
 * @module components/card/CardDescription
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Props do CardDescription */
interface CardDescriptionProps {
  /** Conteúdo da descrição */
  children: ReactNode;
  /** Classes CSS adicionais */
  className?: string;
  /** Número máximo de linhas antes de truncar */
  maxLines?: number;
}

/**
 * Texto descritivo secundário para cards
 * @param props - Propriedades do componente
 * @returns Elemento JSX da descrição
 */
export const CardDescription = memo(function CardDescription({
  children,
  className,
  maxLines,
}: CardDescriptionProps) {
  const lineClampClass = maxLines ? `line-clamp-${maxLines}` : '';

  return (
    <p
      className={cn(
        'text-sm text-muted-foreground',
        lineClampClass,
        className
      )}
    >
      {children}
    </p>
  );
});
