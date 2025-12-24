/**
 * @module TooltipContent
 * @description Conteúdo do tooltip
 * @category Tooltip
 */

import React from "react";
import { TooltipContent as RadixTooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * Props do componente TooltipContent
 */
interface TooltipContentProps {
  /** Conteúdo do tooltip */
  children: React.ReactNode;
  /** Posição do tooltip */
  side?: "top" | "right" | "bottom" | "left";
  /** Alinhamento */
  align?: "start" | "center" | "end";
  /** Offset do tooltip */
  sideOffset?: number;
  /** Largura máxima */
  maxWidth?: string;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * TooltipContent - Conteúdo do tooltip
 *
 * @description Componente de conteúdo para tooltips
 * com controle de posição e alinhamento
 *
 * @example
 * ```tsx
 * <TooltipProvider>
 *   <Tooltip>
 *     <TooltipTrigger>Hover aqui</TooltipTrigger>
 *     <TooltipContent side="top">
 *       Informação útil
 *     </TooltipContent>
 *   </Tooltip>
 * </TooltipProvider>
 * ```
 */
export const TooltipContent = React.memo(function TooltipContent({
  children,
  side = "top",
  align = "center",
  sideOffset = 4,
  maxWidth = "300px",
  className,
}: TooltipContentProps) {
  return (
    <RadixTooltipContent
      side={side}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5",
        "text-sm text-popover-foreground shadow-md",
        "animate-in fade-in-0 zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        "data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      style={{ maxWidth }}
    >
      {children}
    </RadixTooltipContent>
  );
});

TooltipContent.displayName = "TooltipContent";

export default TooltipContent;
export type { TooltipContentProps };
