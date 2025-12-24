/**
 * @module Comparison
 * @description Componente de comparação de valores
 * @category Stats
 */

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Props do componente Comparison
 */
interface ComparisonProps {
  /** Valor atual */
  current: number;
  /** Valor anterior para comparação */
  previous: number;
  /** Formato de exibição */
  format?: "percent" | "absolute" | "both";
  /** Inverter lógica (menor = melhor) */
  invertColors?: boolean;
  /** Mostrar ícone de tendência */
  showIcon?: boolean;
  /** Tamanho do componente */
  size?: "sm" | "md" | "lg";
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Mapeamento de tamanhos
 */
const sizeClasses: Record<string, { text: string; icon: string }> = {
  sm: { text: "text-xs", icon: "h-3 w-3" },
  md: { text: "text-sm", icon: "h-4 w-4" },
  lg: { text: "text-base", icon: "h-5 w-5" },
};

/**
 * Comparison - Comparação de valores
 *
 * @description Exibe a diferença entre dois valores
 * com indicadores visuais de tendência
 *
 * @example
 * ```tsx
 * <Comparison current={150} previous={100} />
 * <Comparison current={80} previous={100} invertColors />
 * <Comparison current={1200} previous={1000} format="both" />
 * ```
 */
export const Comparison = React.memo(function Comparison({
  current,
  previous,
  format = "percent",
  invertColors = false,
  showIcon = true,
  size = "md",
  className,
}: ComparisonProps) {
  // Calcular diferença
  const diff = current - previous;
  const percentChange = previous !== 0 
    ? ((diff / previous) * 100) 
    : 0;

  // Determinar direção
  const isPositive = diff > 0;
  const isNeutral = diff === 0;

  // Determinar cor (considerando inversão)
  const colorClass = isNeutral
    ? "text-gray-500"
    : (isPositive !== invertColors)
      ? "text-green-600"
      : "text-red-600";

  // Selecionar ícone
  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

  // Formatar texto
  const formatValue = () => {
    const absPercent = Math.abs(percentChange).toFixed(1);
    const absDiff = Math.abs(diff);
    const sign = isPositive ? "+" : "-";

    switch (format) {
      case "absolute":
        return `${sign}${absDiff}`;
      case "both":
        return `${sign}${absPercent}% (${sign}${absDiff})`;
      default:
        return `${sign}${absPercent}%`;
    }
  };

  const { text: textClass, icon: iconClass } = sizeClasses[size];

  return (
    <div className={cn("flex items-center gap-1", colorClass, className)}>
      {showIcon && <Icon className={iconClass} />}
      <span className={cn("font-medium", textClass)}>
        {formatValue()}
      </span>
    </div>
  );
});

Comparison.displayName = "Comparison";

export default Comparison;
export type { ComparisonProps };
