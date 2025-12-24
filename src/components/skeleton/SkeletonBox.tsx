/**
 * @module SkeletonBox
 * @description Box de skeleton loading para áreas genéricas
 * @category Skeleton
 */

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Props do componente SkeletonBox
 */
interface SkeletonBoxProps {
  /** Largura do box */
  width?: string | number;
  /** Altura do box */
  height?: string | number;
  /** Border radius */
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Mapeamento de rounded
 */
const roundedClasses: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

/**
 * SkeletonBox - Box de loading genérico
 *
 * @description Área retangular com animação de skeleton
 * para placeholder de conteúdo em carregamento
 *
 * @example
 * ```tsx
 * <SkeletonBox width={200} height={100} />
 * <SkeletonBox width="100%" height={32} rounded="lg" />
 * <SkeletonBox className="w-full h-48" />
 * ```
 */
export const SkeletonBox = React.memo(function SkeletonBox({
  width,
  height,
  rounded = "md",
  className,
}: SkeletonBoxProps) {
  const style: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <Skeleton
      className={cn(roundedClasses[rounded], className)}
      style={style}
    />
  );
});

SkeletonBox.displayName = "SkeletonBox";

export default SkeletonBox;
export type { SkeletonBoxProps };
