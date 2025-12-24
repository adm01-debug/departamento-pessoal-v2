/**
 * @module NavBadge
 * @description Badge para indicadores em itens de navegação
 * @category Navigation
 */

import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Variantes disponíveis
 */
type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

/**
 * Props do componente NavBadge
 */
interface NavBadgeProps {
  /** Conteúdo do badge (número ou texto) */
  count: number | string;
  /** Variante visual */
  variant?: BadgeVariant;
  /** Tamanho do badge */
  size?: "sm" | "md";
  /** Badge pulsante para chamar atenção */
  pulse?: boolean;
  /** Máximo a exibir (ex: 99+) */
  max?: number;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Mapeamento de tamanhos
 */
const sizeClasses: Record<string, string> = {
  sm: "h-4 min-w-4 text-[10px] px-1",
  md: "h-5 min-w-5 text-xs px-1.5",
};

/**
 * NavBadge - Badge para navegação
 *
 * @description Badge compacto para exibir contadores ou
 * indicadores em itens de menu e navegação
 *
 * @example
 * ```tsx
 * <NavBadge count={5} />
 * <NavBadge count={150} max={99} variant="destructive" />
 * <NavBadge count="Novo" variant="secondary" pulse />
 * ```
 */
export const NavBadge = React.memo(function NavBadge({
  count,
  variant = "default",
  size = "sm",
  pulse = false,
  max,
  className,
}: NavBadgeProps) {
  // Formatar valor
  const displayValue = React.useMemo(() => {
    if (typeof count === "string") return count;
    if (max && count > max) return `${max}+`;
    return count.toString();
  }, [count, max]);

  // Não renderizar se count for 0
  if (count === 0) return null;

  return (
    <Badge
      variant={variant}
      className={cn(
        "rounded-full flex items-center justify-center font-medium",
        sizeClasses[size],
        pulse && "animate-pulse",
        className
      )}
    >
      {displayValue}
    </Badge>
  );
});

NavBadge.displayName = "NavBadge";

export default NavBadge;
export type { NavBadgeProps, BadgeVariant };
