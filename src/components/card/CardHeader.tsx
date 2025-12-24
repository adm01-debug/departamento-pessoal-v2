/**
 * @fileoverview Cabeçalho do card
 * @module components/card/CardHeader
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Props do CardHeader */
interface CardHeaderProps {
  /** Conteúdo do cabeçalho */
  children: ReactNode;
  /** Classes CSS adicionais */
  className?: string;
  /** Ações do cabeçalho (botões, menus) */
  actions?: ReactNode;
  /** Borda inferior */
  bordered?: boolean;
}

/**
 * Cabeçalho do card com título e ações opcionais
 * @param props - Propriedades do componente
 * @returns Elemento JSX do cabeçalho
 */
export const CardHeader = memo(function CardHeader({
  children,
  className,
  actions,
  bordered = false,
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 pb-0',
        bordered && 'border-b pb-4',
        className
      )}
    >
      <div className="space-y-1">{children}</div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
});
