/**
 * @file BadgeContent.tsx
 * @description Conteúdo estilizado para badges
 * @category Components/Badge
 */

import React, { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Variantes de badge
 */
export type BadgeVariant = 
  | 'default' 
  | 'secondary' 
  | 'destructive' 
  | 'outline'
  | 'success'
  | 'warning'
  | 'info';

/**
 * Props do BadgeContent
 */
export interface BadgeContentProps {
  /** Conteúdo do badge */
  children: React.ReactNode;
  /** Variante visual */
  variant?: BadgeVariant;
  /** Tamanho */
  size?: 'sm' | 'md' | 'lg';
  /** Ícone à esquerda */
  icon?: React.ReactNode;
  /** Se é arredondado (pill) */
  rounded?: boolean;
  /** Classe adicional */
  className?: string;
  /** Callback de clique */
  onClick?: () => void;
  /** Se pode ser removido */
  removable?: boolean;
  /** Callback de remoção */
  onRemove?: () => void;
}

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-sm px-2.5 py-0.5',
  lg: 'text-base px-3 py-1',
};

const customVariantClasses: Partial<Record<BadgeVariant, string>> = {
  success: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100',
  info: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100',
};

/**
 * Conteúdo estilizado para badges
 * 
 * @example
 * ```tsx
 * <BadgeContent variant="success" icon={<Check />}>
 *   Aprovado
 * </BadgeContent>
 * ```
 */
export const BadgeContent = memo(function BadgeContent({
  children,
  variant = 'default',
  size = 'md',
  icon,
  rounded = false,
  className,
  onClick,
  removable = false,
  onRemove,
}: BadgeContentProps) {
  const isCustomVariant = variant in customVariantClasses;
  const baseVariant = isCustomVariant ? 'outline' : variant;

  return (
    <Badge
      variant={baseVariant as 'default' | 'secondary' | 'destructive' | 'outline'}
      onClick={onClick}
      className={cn(
        sizeClasses[size],
        rounded && 'rounded-full',
        onClick && 'cursor-pointer hover:opacity-80',
        isCustomVariant && customVariantClasses[variant],
        className
      )}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:text-destructive"
          aria-label="Remover"
        >
          ×
        </button>
      )}
    </Badge>
  );
});

BadgeContent.displayName = 'BadgeContent';

export default BadgeContent;
