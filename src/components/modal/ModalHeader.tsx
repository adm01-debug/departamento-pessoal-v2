/**
 * @module ModalHeader
 * @description Cabeçalho do modal
 * @category Modal
 */

import React from "react";
import { X } from "lucide-react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Props do componente ModalHeader
 */
interface ModalHeaderProps {
  /** Título do modal */
  title: string;
  /** Descrição/subtítulo */
  description?: string;
  /** Ícone do título */
  icon?: React.ReactNode;
  /** Mostrar botão fechar */
  showClose?: boolean;
  /** Callback ao fechar */
  onClose?: () => void;
  /** Borda inferior */
  bordered?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * ModalHeader - Cabeçalho do modal
 *
 * @description Área de título e descrição do modal
 * com botão de fechar opcional
 *
 * @example
 * ```tsx
 * <ModalHeader
 *   title="Novo Funcionário"
 *   description="Preencha os dados do funcionário"
 * />
 * <ModalHeader
 *   title="Configurações"
 *   icon={<Settings />}
 *   showClose
 *   onClose={handleClose}
 * />
 * ```
 */
export const ModalHeader = React.memo(function ModalHeader({
  title,
  description,
  icon,
  showClose = false,
  onClose,
  bordered = false,
  className,
}: ModalHeaderProps) {
  return (
    <DialogHeader
      className={cn(
        "relative",
        bordered && "border-b pb-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className="text-muted-foreground flex-shrink-0">
            {icon}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <DialogTitle className="text-lg font-semibold truncate">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="mt-1">
              {description}
            </DialogDescription>
          )}
        </div>
        {showClose && onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-0 top-0 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </DialogHeader>
  );
});

ModalHeader.displayName = "ModalHeader";

export default ModalHeader;
export type { ModalHeaderProps };
