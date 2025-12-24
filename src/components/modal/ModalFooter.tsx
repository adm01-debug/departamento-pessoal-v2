/**
 * @module ModalFooter
 * @description Rodapé do modal com ações
 * @category Modal
 */

import React from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * Props do componente ModalFooter
 */
interface ModalFooterProps {
  /** Conteúdo/ações do footer */
  children: React.ReactNode;
  /** Alinhamento dos botões */
  align?: "start" | "center" | "end" | "between";
  /** Empilhar em mobile */
  stackOnMobile?: boolean;
  /** Borda superior */
  bordered?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Mapeamento de alinhamentos
 */
const alignClasses: Record<string, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

/**
 * ModalFooter - Rodapé do modal
 *
 * @description Área de ações do modal com botões
 * de confirmar, cancelar, etc.
 *
 * @example
 * ```tsx
 * <ModalFooter>
 *   <Button variant="outline" onClick={onCancel}>Cancelar</Button>
 *   <Button onClick={onConfirm}>Confirmar</Button>
 * </ModalFooter>
 * <ModalFooter align="between">
 *   <Button variant="destructive">Excluir</Button>
 *   <div className="flex gap-2">
 *     <Button variant="outline">Cancelar</Button>
 *     <Button>Salvar</Button>
 *   </div>
 * </ModalFooter>
 * ```
 */
export const ModalFooter = React.memo(function ModalFooter({
  children,
  align = "end",
  stackOnMobile = true,
  bordered = true,
  className,
}: ModalFooterProps) {
  return (
    <DialogFooter
      className={cn(
        "flex gap-2 pt-4",
        alignClasses[align],
        stackOnMobile && "flex-col-reverse sm:flex-row",
        bordered && "border-t mt-4",
        className
      )}
    >
      {children}
    </DialogFooter>
  );
});

ModalFooter.displayName = "ModalFooter";

export default ModalFooter;
export type { ModalFooterProps };
