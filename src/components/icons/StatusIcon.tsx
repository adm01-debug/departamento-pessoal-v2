/**
 * @module StatusIcon
 * @description Ícone de status com indicador visual de estado
 * @category Icons
 */

import React from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Loader2,
  MinusCircle,
  PauseCircle,
  PlayCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Tipos de status disponíveis
 */
type StatusType =
  | "success"
  | "error"
  | "warning"
  | "pending"
  | "loading"
  | "inactive"
  | "paused"
  | "active";

/**
 * Tamanhos disponíveis
 */
type IconSize = "sm" | "md" | "lg";

/**
 * Props do componente StatusIcon
 */
interface StatusIconProps {
  /** Tipo do status */
  status: StatusType;
  /** Tamanho do ícone */
  size?: IconSize;
  /** Classes CSS adicionais */
  className?: string;
  /** Mostrar animação de pulse */
  pulse?: boolean;
}

/**
 * Mapeamento de status para ícones
 */
const statusIcons: Record<StatusType, LucideIcon> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  pending: Clock,
  loading: Loader2,
  inactive: MinusCircle,
  paused: PauseCircle,
  active: PlayCircle,
};

/**
 * Mapeamento de status para cores
 */
const statusColors: Record<StatusType, string> = {
  success: "text-green-500",
  error: "text-red-500",
  warning: "text-yellow-500",
  pending: "text-blue-500",
  loading: "text-blue-500",
  inactive: "text-gray-400",
  paused: "text-orange-500",
  active: "text-green-500",
};

/**
 * Mapeamento de tamanhos
 */
const sizeMap: Record<IconSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

/**
 * StatusIcon - Ícone visual de status
 *
 * @description Exibe um ícone correspondente ao status atual
 * com cores e animações apropriadas
 *
 * @example
 * ```tsx
 * <StatusIcon status="success" />
 * <StatusIcon status="loading" pulse />
 * <StatusIcon status="error" size="lg" />
 * ```
 */
export const StatusIcon = React.memo(function StatusIcon({
  status,
  size = "md",
  className,
  pulse = false,
}: StatusIconProps) {
  const Icon = statusIcons[status];
  const colorClass = statusColors[status];
  const sizeClass = sizeMap[size];

  return (
    <Icon
      className={cn(
        sizeClass,
        colorClass,
        status === "loading" && "animate-spin",
        pulse && "animate-pulse",
        className
      )}
    />
  );
});

StatusIcon.displayName = "StatusIcon";

export default StatusIcon;
export type { StatusIconProps, StatusType, IconSize };
