/**
 * @fileoverview Rodapé do card
 * @module components/card/CardFooter
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardFooterProps {
  children: ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end' | 'between';
  border?: boolean;
}

const alignStyles: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
};

export const CardFooter = memo(function CardFooter({
  children, className, align = 'end', border = true,
}: CardFooterProps) {
  return (
    <div className={cn(
      'flex items-center gap-2 px-4 py-3',
      border && 'border-t',
      alignStyles[align],
      className
    )}>
      {children}
    </div>
  );
});
