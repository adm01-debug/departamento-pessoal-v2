import { memo, type ReactNode } from 'react';
import { Tooltip as TooltipPrimitive, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
interface Props { children: ReactNode; content: string; side?: 'top' | 'right' | 'bottom' | 'left'; }
export const Tooltip = memo(function Tooltip({ children, content, side = 'top' }: Props) {
  return (
    <TooltipProvider>
      <TooltipPrimitive>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}><p>{content}</p></TooltipContent>
      </TooltipPrimitive>
    </TooltipProvider>
  );
});
