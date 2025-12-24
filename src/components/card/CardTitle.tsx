/**
 * @fileoverview Título do card
 * @module components/card/CardTitle
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface CardTitleProps {
  children: ReactNode;
  className?: string;
  icon?: LucideIcon;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CardTitle = memo(function CardTitle({
  children, className, icon: Icon, as: Tag = 'h3',
}: CardTitleProps) {
  return (
    <Tag className={cn('flex items-center gap-2 font-semibold leading-none tracking-tight', className)}>
      {Icon && <Icon className="h-5 w-5" />}
      {children}
    </Tag>
  );
});
