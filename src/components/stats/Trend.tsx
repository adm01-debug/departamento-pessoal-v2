/**
 * @module Trend
 * @description Componente de tendência simplificado
 * @category Stats
 */

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Props do componente Trend
 */
interface TrendProps {
  /** Valor da tendência */
  value: number;
  /** Sufixo (ex: %, pontos) */
  suffix?: string;
  /** Prefixo (ex: R$, US$) */
  prefix?: string;
  /** Inverter lógica de cores */
  invert?: boolean;
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
 * Trend - Indicador de tendência simples
 *
 * @description Versão simplificada de indicador de tendência
 * com ícone e valor formatado
 *
 * @example
 * ```tsx
 * <Trend value={12.5} suffix="%" />
 * <Trend value={-5} suffix="%" invert />
 * <Trend value={1500} prefix="R$ " />
 * ```
 */
export const Trend = React.memo(function Trend({
  value,
  suffix = "%",
  prefix = "",
  invert = false,
  size = "md",
  className,
}: TrendProps) {
  // Determinar direção e cor
  const isPositive = value > 0;
  const isNeutral = value === 0;

  const colorClass = isNeutral
    ? "text-gray-500"
    : (isPositive !== invert)
      ? "text-green-600"
      : "text-red-600";

  // Selecionar ícone
  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

  const { text: textClass, icon: iconClass } = sizeClasses[size];

  // Formatar valor
  const displayValue = `${isPositive ? "+" : ""}${prefix}${value}${suffix}`;

  return (
    <div className={cn("inline-flex items-center gap-1", colorClass, className)}>
      <Icon className={iconClass} />
      <span className={cn("font-medium", textClass)}>{displayValue}</span>
    </div>
  );
});

Trend.displayName = "Trend";

export default Trend;
export type { TrendProps };
