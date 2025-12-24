/**
 * @fileoverview Divisor vertical
 * @module components/divider/DividerVertical
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';

interface DividerVerticalProps { className?: string; height?: string; }

export const DividerVertical = memo(function DividerVertical({ className, height = '100%' }: DividerVerticalProps) {
  return <div className={cn('border-l border-border mx-4', className)} style={{ height }} />;
});
