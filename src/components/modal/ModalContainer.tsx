/**
 * @module ModalContainer
 * @description Container/wrapper para modais
 * @category Modal
 */

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * Props do componente ModalContainer
 */
interface ModalContainerProps {
  /** Modal aberto */
  open: boolean;
  /** Callback ao fechar */
  onOpenChange: (open: boolean) => void;
  /** Conteúdo do modal */
  children: React.ReactNode;
  /** Tamanho do modal */
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /** Centralizar verticalmente */
  centered?: boolean;
  /** Fechar ao clicar no overlay */
  closeOnOverlay?: boolean;
  /** Fechar com ESC */
  closeOnEscape?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Mapeamento de tamanhos
 */
const sizeClasses: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-[95vw] max-h-[95vh]",
};

/**
 * ModalContainer - Container de modal
 *
 * @description Wrapper base para modais com controle
 * de abertura/fechamento e tamanho
 *
 * @example
 * ```tsx
 * <ModalContainer
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   size="lg"
 * >
 *   <ModalHeader title="Editar" />
 *   <ModalBody>...</ModalBody>
 *   <ModalFooter>...</ModalFooter>
 * </ModalContainer>
 * ```
 */
export const ModalContainer = React.memo(function ModalContainer({
  open,
  onOpenChange,
  children,
  size = "md",
  centered = true,
  closeOnOverlay = true,
  closeOnEscape = true,
  className,
}: ModalContainerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          sizeClasses[size],
          centered && "top-[50%] translate-y-[-50%]",
          className
        )}
        onInteractOutside={(e) => {
          if (!closeOnOverlay) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (!closeOnEscape) {
            e.preventDefault();
          }
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
});

ModalContainer.displayName = "ModalContainer";

export default ModalContainer;
export type { ModalContainerProps };
