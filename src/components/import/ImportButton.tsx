/**
 * @module ImportButton
 * @description Botão de importação com estado de loading
 * @category Import
 */

import React from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Props do componente ImportButton
 */
interface ImportButtonProps {
  /** Callback ao clicar */
  onClick: () => void;
  /** Estado de carregamento */
  isLoading?: boolean;
  /** Desabilitado */
  disabled?: boolean;
  /** Texto do botão */
  label?: string;
  /** Variante do botão */
  variant?: "default" | "outline" | "secondary" | "ghost";
  /** Tamanho do botão */
  size?: "sm" | "default" | "lg";
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * ImportButton - Botão para ação de importação
 *
 * @description Botão com ícone de upload e estado de loading
 * para iniciar processos de importação de dados
 *
 * @example
 * ```tsx
 * <ImportButton
 *   onClick={handleImport}
 *   isLoading={importing}
 *   label="Importar CSV"
 * />
 * ```
 */
export const ImportButton = React.memo(function ImportButton({
  onClick,
  isLoading = false,
  disabled = false,
  label = "Importar",
  variant = "default",
  size = "default",
  className,
}: ImportButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      variant={variant}
      size={size}
      className={cn("gap-2", className)}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Upload className="h-4 w-4" />
      )}
      {label}
    </Button>
  );
});

ImportButton.displayName = "ImportButton";

export default ImportButton;
export type { ImportButtonProps };
