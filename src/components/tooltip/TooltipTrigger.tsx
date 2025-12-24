/**
 * @fileoverview Trigger para tooltip
 * @module components/tooltip/TooltipTrigger
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TooltipTrigger as UITooltipTrigger } from '@/components/ui/tooltip';

interface TooltipTriggerProps {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
}

export const TooltipTrigger = memo(function TooltipTrigger({
  children, className, asChild = true,
}: TooltipTriggerProps) {
  return (
    <UITooltipTrigger asChild={asChild} className={cn(className)}>
      {children}
    </UITooltipTrigger>
  );
});
