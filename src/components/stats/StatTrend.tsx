/**
 * @module StatTrend
 * @description Indicador de tendência para estatísticas
 * @category Stats
 */

import React from "react";
import { TrendingUp, TrendingDown, Minus, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Direção da tendência
 */
type TrendDirection = "up" | "down" | "neutral";

/**
 * Estilo do ícone
 */
type IconStyle = "trending" | "arrow";

/**
 * Props do componente StatTrend
 */
interface StatTrendProps {
  /** Valor da variação (ex: 5.2 para +5.2%) */
  value: number;
  /** Mostrar como porcentagem */
  asPercent?: boolean;
  /** Inverter cores (menor = melhor) */
  invertColors?: boolean;
  /** Estilo do ícone */
  iconStyle?: IconStyle;
  /** Mostrar ícone */
  showIcon?: boolean;
  /** Tamanho */
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
 * StatTrend - Indicador de tendência
 *
 * @description Mostra a variação de uma métrica com
 * cor e ícone indicando a direção da tendência
 *
 * @example
 * ```tsx
 * <StatTrend value={5.2} />
 * <StatTrend value={-3.5} invertColors />
 * <StatTrend value={12} asPercent iconStyle="arrow" />
 * ```
 */
export const StatTrend = React.memo(function StatTrend({
  value,
  asPercent = true,
  invertColors = false,
  iconStyle = "trending",
  showIcon = true,
  size = "md",
  className,
}: StatTrendProps) {
  // Determinar direção
  const direction: TrendDirection = value > 0 ? "up" : value < 0 ? "down" : "neutral";

  // Determinar cor
  const colorClass = direction === "neutral"
    ? "text-gray-500"
    : (direction === "up") !== invertColors
      ? "text-green-600"
      : "text-red-600";

  // Selecionar ícone
  const getIcon = () => {
    if (direction === "neutral") return Minus;
    if (iconStyle === "arrow") {
      return direction === "up" ? ArrowUp : ArrowDown;
    }
    return direction === "up" ? TrendingUp : TrendingDown;
  };

  const Icon = getIcon();
  const { text: textClass, icon: iconClass } = sizeClasses[size];

  // Formatar valor
  const displayValue = `${value > 0 ? "+" : ""}${value.toFixed(1)}${asPercent ? "%" : ""}`;

  return (
    <div className={cn("flex items-center gap-1", colorClass, className)}>
      {showIcon && <Icon className={iconClass} />}
      <span className={cn("font-medium", textClass)}>{displayValue}</span>
    </div>
  );
});

StatTrend.displayName = "StatTrend";

export default StatTrend;
export type { StatTrendProps, TrendDirection };
