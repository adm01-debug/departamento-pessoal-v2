/**
 * @fileoverview Título do card
 * @module components/card/CardTitle
 */
import { memo, type ReactNode, type ElementType } from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

/** Props do CardTitle */
interface CardTitleProps {
  /** Conteúdo do título */
  children: ReactNode;
  /** Classes CSS adicionais */
  className?: string;
  /** Ícone opcional */
  icon?: LucideIcon;
  /** Elemento HTML do título */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/**
 * Título para cards com suporte a ícone
 * @param props - Propriedades do componente
 * @returns Elemento JSX do título
 */
export const CardTitle = memo(function CardTitle({
  children,
  className,
  icon: Icon,
  as: Component = 'h3',
}: CardTitleProps) {
  const Tag = Component as ElementType;
  
  return (
    <Tag
      className={cn(
        'flex items-center gap-2 font-semibold leading-none tracking-tight',
        className
      )}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {children}
    </Tag>
  );
});
