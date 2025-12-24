/**
 * @file CardFooter.tsx
 * @description Rodapé do card com ações
 * @category Components/Card
 */

import React, { memo } from 'react';
import { CardFooter as ShadcnCardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Props do CardFooter
 */
export interface CardFooterProps {
  /** Conteúdo do footer (normalmente botões) */
  children: React.ReactNode;
  /** Classe adicional */
  className?: string;
  /** Alinhamento dos itens */
  align?: 'left' | 'center' | 'right' | 'between' | 'around';
  /** Padding interno */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Se deve ter borda superior */
  bordered?: boolean;
  /** Cor de fundo */
  variant?: 'default' | 'muted';
}

const alignClasses = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
};

const paddingClasses = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-6',
  lg: 'p-8',
};

const variantClasses = {
  default: '',
  muted: 'bg-muted/50',
};

/**
 * Rodapé do card com ações
 * 
 * @example
 * ```tsx
 * <CardFooter align="right" bordered>
 *   <Button variant="outline">Cancelar</Button>
 *   <Button>Salvar</Button>
 * </CardFooter>
 * ```
 */
export const CardFooter = memo(function CardFooter({
  children,
  className,
  align = 'right',
  padding = 'md',
  bordered = false,
  variant = 'default',
}: CardFooterProps) {
  return (
    <ShadcnCardFooter
      className={cn(
        'flex items-center gap-2',
        alignClasses[align],
        paddingClasses[padding],
        variantClasses[variant],
        bordered && 'border-t',
        className
      )}
    >
      {children}
    </ShadcnCardFooter>
  );
});

CardFooter.displayName = 'CardFooter';

export default CardFooter;
