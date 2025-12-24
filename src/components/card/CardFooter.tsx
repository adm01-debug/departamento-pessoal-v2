/**
 * @fileoverview Rodapé do card
 * @module components/card/CardFooter
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Props do CardFooter */
interface CardFooterProps {
  /** Conteúdo do rodapé */
  children: ReactNode;
  /** Classes CSS adicionais */
  className?: string;
  /** Alinhamento dos itens */
  align?: 'start' | 'center' | 'end' | 'between';
  /** Borda superior */
  bordered?: boolean;
}

/** Mapeamento de alinhamentos */
const alignStyles: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
};

/**
 * Rodapé do card para ações e informações secundárias
 * @param props - Propriedades do componente
 * @returns Elemento JSX do rodapé
 */
export const CardFooter = memo(function CardFooter({
  children,
  className,
  align = 'end',
  bordered = true,
}: CardFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 p-4 pt-0',
        bordered && 'border-t pt-4',
        alignStyles[align],
        className
      )}
    >
      {children}
    </div>
  );
});
