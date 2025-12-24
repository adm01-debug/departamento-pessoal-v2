/**
 * @module PrintButton
 * @description Botão para impressão de conteúdo
 * @category Print
 */

import React from "react";
import { Printer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Props do componente PrintButton
 */
interface PrintButtonProps {
  /** Callback ao clicar */
  onClick?: () => void;
  /** ID do elemento a imprimir */
  targetId?: string;
  /** Estado de carregamento */
  isLoading?: boolean;
  /** Desabilitado */
  disabled?: boolean;
  /** Texto do botão */
  label?: string;
  /** Mostrar apenas ícone */
  iconOnly?: boolean;
  /** Variante do botão */
  variant?: "default" | "outline" | "secondary" | "ghost";
  /** Tamanho do botão */
  size?: "sm" | "default" | "lg" | "icon";
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * PrintButton - Botão de impressão
 *
 * @description Botão com ícone de impressora que pode
 * disparar window.print() ou callback personalizado
 *
 * @example
 * ```tsx
 * <PrintButton />
 * <PrintButton label="Imprimir Relatório" onClick={handlePrint} />
 * <PrintButton iconOnly size="icon" />
 * ```
 */
export const PrintButton = React.memo(function PrintButton({
  onClick,
  targetId,
  isLoading = false,
  disabled = false,
  label = "Imprimir",
  iconOnly = false,
  variant = "outline",
  size = "default",
  className,
}: PrintButtonProps) {
  /**
   * Handler de impressão
   */
  const handlePrint = React.useCallback(() => {
    if (onClick) {
      onClick();
      return;
    }

    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(element.innerHTML);
          printWindow.document.close();
          printWindow.print();
        }
      }
    } else {
      window.print();
    }
  }, [onClick, targetId]);

  return (
    <Button
      onClick={handlePrint}
      disabled={disabled || isLoading}
      variant={variant}
      size={iconOnly ? "icon" : size}
      className={cn(!iconOnly && "gap-2", className)}
      title={iconOnly ? label : undefined}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Printer className="h-4 w-4" />
      )}
      {!iconOnly && label}
    </Button>
  );
});

PrintButton.displayName = "PrintButton";

export default PrintButton;
export type { PrintButtonProps };
