/**
 * @module SkeletonCircle
 * @description Skeleton circular para avatares e ícones
 * @category Skeleton
 */

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Tamanhos disponíveis
 */
type CircleSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Props do componente SkeletonCircle
 */
interface SkeletonCircleProps {
  /** Tamanho predefinido */
  size?: CircleSize;
  /** Tamanho customizado em pixels */
  customSize?: number;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Mapeamento de tamanhos
 */
const sizeClasses: Record<CircleSize, string> = {
  xs: "h-6 w-6",
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

/**
 * SkeletonCircle - Skeleton circular
 *
 * @description Placeholder circular com animação skeleton
 * ideal para avatares, ícones e badges em loading
 *
 * @example
 * ```tsx
 * <SkeletonCircle size="sm" />
 * <SkeletonCircle size="lg" />
 * <SkeletonCircle customSize={48} />
 * ```
 */
export const SkeletonCircle = React.memo(function SkeletonCircle({
  size = "md",
  customSize,
  className,
}: SkeletonCircleProps) {
  const style: React.CSSProperties | undefined = customSize
    ? { width: customSize, height: customSize }
    : undefined;

  return (
    <Skeleton
      className={cn(
        "rounded-full",
        !customSize && sizeClasses[size],
        className
      )}
      style={style}
    />
  );
});

SkeletonCircle.displayName = "SkeletonCircle";

export default SkeletonCircle;
export type { SkeletonCircleProps, CircleSize };
