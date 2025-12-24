/**
 * @file AlertIcon.tsx
 * @description Ícone contextual para alertas
 * @category Components/Alert
 */

import React, { memo } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  XCircle,
  Bell,
  ShieldAlert,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Tipos de ícone disponíveis
 */
export type AlertIconType = 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'alert' 
  | 'bell'
  | 'shield';

/**
 * Props do AlertIcon
 */
export interface AlertIconProps {
  /** Tipo do ícone */
  type?: AlertIconType;
  /** Ícone customizado */
  icon?: LucideIcon;
  /** Tamanho do ícone */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Classe adicional */
  className?: string;
  /** Animação de pulso */
  pulse?: boolean;
  /** Animação de rotação */
  spin?: boolean;
}

const iconMap: Record<AlertIconType, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  alert: AlertCircle,
  bell: Bell,
  shield: ShieldAlert,
};

const sizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6',
};

const colorClasses: Record<AlertIconType, string> = {
  info: 'text-blue-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-red-500',
  alert: 'text-orange-500',
  bell: 'text-purple-500',
  shield: 'text-slate-500',
};

/**
 * Ícone contextual para alertas
 * 
 * @example
 * ```tsx
 * <AlertIcon type="success" size="lg" />
 * <AlertIcon type="warning" pulse />
 * ```
 */
export const AlertIcon = memo(function AlertIcon({
  type = 'info',
  icon: CustomIcon,
  size = 'md',
  className,
  pulse = false,
  spin = false,
}: AlertIconProps) {
  const Icon = CustomIcon ?? iconMap[type];

  return (
    <Icon
      className={cn(
        sizeClasses[size],
        colorClasses[type],
        pulse && 'animate-pulse',
        spin && 'animate-spin',
        className
      )}
      aria-hidden="true"
    />
  );
});

AlertIcon.displayName = 'AlertIcon';

export default AlertIcon;
