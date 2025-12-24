/**
 * @module Modal
 * @description Modal/Dialog base
 * @category Modal
 */

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * Props do componente Modal
 */
interface ModalProps {
  /** Modal aberto */
  open: boolean;
  /** Callback ao fechar */
  onOpenChange: (open: boolean) => void;
  /** Título do modal */
  title?: string;
  /** Descrição do modal */
  description?: string;
  /** Conteúdo do modal */
  children: React.ReactNode;
  /** Tamanho do modal */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /** Fechar ao clicar fora */
  closeOnOutsideClick?: boolean;
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
  full: "max-w-[90vw]",
};

/**
 * Modal - Dialog base
 *
 * @description Componente modal genérico usando
 * Dialog do shadcn/ui
 *
 * @example
 * ```tsx
 * <Modal
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Confirmar ação"
 *   description="Você tem certeza?"
 * >
 *   <ModalContent />
 * </Modal>
 * ```
 */
export const Modal = React.memo(function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = "md",
  closeOnOutsideClick = true,
  className,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(sizeClasses[size], className)}
        onInteractOutside={(e) => {
          if (!closeOnOutsideClick) {
            e.preventDefault();
          }
        }}
      >
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
});

Modal.displayName = "Modal";

export default Modal;
export type { ModalProps };
