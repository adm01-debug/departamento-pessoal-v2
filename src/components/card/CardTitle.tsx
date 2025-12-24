/**
 * @fileoverview Título do card
 * @module components/card/CardTitle
 */
import { memo, type ReactNode } from 'react';
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
  /** Tamanho do título */
  size?: 'sm' | 'md' | 'lg';
}

/** Mapeamento de tamanhos */
const sizeStyles: Record<string, { text: string; icon: string }> = {
  sm: { text: 'text-base font-medium', icon: 'h-4 w-4' },
  md: { text: 'text-lg font-semibold', icon: 'h-5 w-5' },
  lg: { text: 'text-xl font-bold', icon: 'h-6 w-6' },
};

/**
 * Título principal do card
 * @param props - Propriedades do componente
 * @returns Elemento JSX do título
 */
export const CardTitle = memo(function CardTitle({
  children,
  className,
  icon: Icon,
  size = 'md',
}: CardTitleProps) {
  const styles = sizeStyles[size];

  return (
    <h3 className={cn('flex items-center gap-2', styles.text, className)}>
      {Icon && <Icon className={styles.icon} />}
      {children}
    </h3>
  );
});
