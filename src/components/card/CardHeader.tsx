/**
 * @fileoverview Cabeçalho do card
 * @module components/card/CardHeader
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
  border?: boolean;
}

export const CardHeader = memo(function CardHeader({
  children, className, actions, border = false,
}: CardHeaderProps) {
  return (
    <div className={cn(
      'flex items-center justify-between px-4 py-3',
      border && 'border-b',
      className
    )}>
      <div className="flex-1">{children}</div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
});
