/**
 * @fileoverview Cabeçalho do card
 * @module components/card/CardHeader
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

/** Props do CardHeader */
interface CardHeaderProps {
  /** Conteúdo do cabeçalho */
  children?: ReactNode;
  /** Título do card */
  title?: string;
  /** Subtítulo opcional */
  subtitle?: string;
  /** Ícone opcional */
  icon?: LucideIcon;
  /** Ações do cabeçalho (botões, menus) */
  actions?: ReactNode;
  /** Classes CSS adicionais */
  className?: string;
  /** Se exibe borda inferior */
  bordered?: boolean;
}

/**
 * Cabeçalho do card com título, ícone e ações
 * @param props - Propriedades do componente
 * @returns Elemento JSX do cabeçalho
 */
export const CardHeader = memo(function CardHeader({
  children,
  title,
  subtitle,
  icon: Icon,
  actions,
  className,
  bordered = false,
}: CardHeaderProps) {
  if (children) {
    return (
      <div className={cn('p-4', bordered && 'border-b', className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-between p-4', bordered && 'border-b', className)}>
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
        <div>
          {title && <h3 className="font-semibold">{title}</h3>}
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
});
