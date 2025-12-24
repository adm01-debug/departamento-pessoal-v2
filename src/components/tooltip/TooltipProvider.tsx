/**
 * @module TooltipProvider
 * @description Provider global para tooltips
 * @category Tooltip
 */

import React from "react";
import { TooltipProvider as RadixTooltipProvider } from "@/components/ui/tooltip";

/**
 * Props do componente TooltipProvider
 */
interface TooltipProviderProps {
  /** Conteúdo que usará tooltips */
  children: React.ReactNode;
  /** Delay para abrir (ms) */
  delayDuration?: number;
  /** Delay ao pular entre tooltips (ms) */
  skipDelayDuration?: number;
  /** Desabilitar hover ao tocar */
  disableHoverableContent?: boolean;
}

/**
 * TooltipProvider - Provider de tooltips
 *
 * @description Wrapper que fornece contexto para
 * todos os tooltips filhos
 *
 * @example
 * ```tsx
 * <TooltipProvider delayDuration={200}>
 *   <App />
 * </TooltipProvider>
 * ```
 */
export const TooltipProvider = React.memo(function TooltipProvider({
  children,
  delayDuration = 400,
  skipDelayDuration = 300,
  disableHoverableContent = false,
}: TooltipProviderProps) {
  return (
    <RadixTooltipProvider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      disableHoverableContent={disableHoverableContent}
    >
      {children}
    </RadixTooltipProvider>
  );
});

TooltipProvider.displayName = "TooltipProvider";

export default TooltipProvider;
export type { TooltipProviderProps };
