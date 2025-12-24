/**
 * @module ModalBody
 * @description Corpo do modal
 * @category Modal
 */

import React from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Props do componente ModalBody
 */
interface ModalBodyProps {
  /** Conteúdo do corpo */
  children: React.ReactNode;
  /** Padding interno */
  padding?: "none" | "sm" | "md" | "lg";
  /** Altura máxima com scroll */
  maxHeight?: string;
  /** Usar scroll */
  scrollable?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Mapeamento de paddings
 */
const paddingClasses: Record<string, string> = {
  none: "py-0",
  sm: "py-2",
  md: "py-4",
  lg: "py-6",
};

/**
 * ModalBody - Corpo do modal
 *
 * @description Área de conteúdo principal do modal
 * com suporte a scroll quando necessário
 *
 * @example
 * ```tsx
 * <ModalBody>
 *   <Form>...</Form>
 * </ModalBody>
 * <ModalBody scrollable maxHeight="400px">
 *   <LongContent />
 * </ModalBody>
 * ```
 */
export const ModalBody = React.memo(function ModalBody({
  children,
  padding = "md",
  maxHeight = "60vh",
  scrollable = false,
  className,
}: ModalBodyProps) {
  const content = (
    <div className={cn(paddingClasses[padding], className)}>
      {children}
    </div>
  );

  if (scrollable) {
    return (
      <ScrollArea style={{ maxHeight }} className="w-full">
        {content}
      </ScrollArea>
    );
  }

  return content;
});

ModalBody.displayName = "ModalBody";

export default ModalBody;
export type { ModalBodyProps };
