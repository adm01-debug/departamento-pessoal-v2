/**
 * @fileoverview Divisor com texto
 * @module components/divider/DividerWithText
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';

interface DividerWithTextProps { text: string; className?: string; }

export const DividerWithText = memo(function DividerWithText({ text, className }: DividerWithTextProps) {
  return (
    <div className={cn('flex items-center my-4', className)}>
      <div className="flex-1 border-t border-border" />
      <span className="px-3 text-sm text-muted-foreground">{text}</span>
      <div className="flex-1 border-t border-border" />
    </div>
  );
});
