/**
 * @module ModalOverlay
 * @description Overlay/backdrop do modal
 * @category Modal
 */

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Props do componente ModalOverlay
 */
interface ModalOverlayProps {
  /** Overlay visível */
  visible?: boolean;
  /** Callback ao clicar */
  onClick?: () => void;
  /** Intensidade do blur */
  blur?: "none" | "sm" | "md" | "lg";
  /** Opacidade do fundo */
  opacity?: "light" | "medium" | "dark";
  /** Animado */
  animated?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Mapeamento de blur
 */
const blurClasses: Record<string, string> = {
  none: "",
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
};

/**
 * Mapeamento de opacidades
 */
const opacityClasses: Record<string, string> = {
  light: "bg-background/50",
  medium: "bg-background/70",
  dark: "bg-background/90",
};

/**
 * ModalOverlay - Overlay do modal
 *
 * @description Camada de fundo escurecido/blur
 * por trás do conteúdo do modal
 *
 * @example
 * ```tsx
 * <ModalOverlay
 *   visible={isOpen}
 *   onClick={handleClose}
 *   blur="sm"
 * />
 * ```
 */
export const ModalOverlay = React.memo(function ModalOverlay({
  visible = true,
  onClick,
  blur = "sm",
  opacity = "medium",
  animated = true,
  className,
}: ModalOverlayProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50",
        blurClasses[blur],
        opacityClasses[opacity],
        animated && "transition-opacity duration-200",
        animated && (visible ? "opacity-100" : "opacity-0"),
        className
      )}
      onClick={onClick}
      aria-hidden="true"
    />
  );
});

ModalOverlay.displayName = "ModalOverlay";

export default ModalOverlay;
export type { ModalOverlayProps };
