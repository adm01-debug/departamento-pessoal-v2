/**
 * @file CardHeader.tsx
 * @description Cabeçalho do card
 * @category Components/Card
 */

import React, { memo } from 'react';
import { CardHeader as ShadcnCardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Props do CardHeader
 */
export interface CardHeaderProps {
  /** Conteúdo do header */
  children: React.ReactNode;
  /** Classe adicional */
  className?: string;
  /** Padding interno */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Se deve ter borda inferior */
  bordered?: boolean;
  /** Ações à direita */
  actions?: React.ReactNode;
  /** Ícone à esquerda */
  icon?: React.ReactNode;
  /** Variante de fundo */
  variant?: 'default' | 'muted' | 'primary';
}

const paddingClasses = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-6',
  lg: 'p-8',
};

const variantClasses = {
  default: '',
  muted: 'bg-muted/50',
  primary: 'bg-primary/5',
};

/**
 * Cabeçalho do card
 * 
 * @example
 * ```tsx
 * <CardHeader 
 *   icon={<User />} 
 *   actions={<Button size="sm">Editar</Button>}
 *   bordered
 * >
 *   <CardTitle>Perfil</CardTitle>
 *   <CardDescription>Informações do usuário</CardDescription>
 * </CardHeader>
 * ```
 */
export const CardHeader = memo(function CardHeader({
  children,
  className,
  padding = 'md',
  bordered = false,
  actions,
  icon,
  variant = 'default',
}: CardHeaderProps) {
  const hasExtras = icon || actions;

  if (!hasExtras) {
    return (
      <ShadcnCardHeader
        className={cn(
          paddingClasses[padding],
          variantClasses[variant],
          bordered && 'border-b',
          className
        )}
      >
        {children}
      </ShadcnCardHeader>
    );
  }

  return (
    <ShadcnCardHeader
      className={cn(
        'flex flex-row items-start gap-4',
        paddingClasses[padding],
        variantClasses[variant],
        bordered && 'border-b',
        className
      )}
    >
      {icon && (
        <div className="shrink-0 mt-1">
          {icon}
        </div>
      )}
      <div className="flex-1 space-y-1.5">
        {children}
      </div>
      {actions && (
        <div className="shrink-0">
          {actions}
        </div>
      )}
    </ShadcnCardHeader>
  );
});

CardHeader.displayName = 'CardHeader';

export default CardHeader;
