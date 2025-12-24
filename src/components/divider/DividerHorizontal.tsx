/**
 * @fileoverview Divisor horizontal
 * @module components/divider/DividerHorizontal
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';

interface DividerHorizontalProps { className?: string; }

export const DividerHorizontal = memo(function DividerHorizontal({ className }: DividerHorizontalProps) {
  return <hr className={cn('border-t border-border my-4', className)} />;
});
