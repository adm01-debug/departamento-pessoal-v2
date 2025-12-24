/**
 * @file BadgeContainer.tsx
 * @description Container para badges com posicionamento
 * @category Components/Badge
 */

import React, { memo } from 'react';
import { cn } from '@/lib/utils';

/**
 * Posição do badge
 */
export type BadgePosition = 
  | 'top-right' 
  | 'top-left' 
  | 'bottom-right' 
  | 'bottom-left'
  | 'inline';

/**
 * Props do BadgeContainer
 */
export interface BadgeContainerProps {
  /** Elemento que receberá o badge */
  children: React.ReactNode;
  /** Badge a ser exibido */
  badge: React.ReactNode;
  /** Posição do badge */
  position?: BadgePosition;
  /** Classe adicional do container */
  className?: string;
  /** Offset do badge (pixels) */
  offset?: number;
  /** Se o badge deve pulsar */
  pulse?: boolean;
  /** Se deve mostrar o badge */
  show?: boolean;
}

const positionClasses: Record<Exclude<BadgePosition, 'inline'>, string> = {
  'top-right': '-top-1 -right-1',
  'top-left': '-top-1 -left-1',
  'bottom-right': '-bottom-1 -right-1',
  'bottom-left': '-bottom-1 -left-1',
};

/**
 * Container para badges com posicionamento
 * 
 * @example
 * ```tsx
 * <BadgeContainer 
 *   badge={<Badge variant="destructive">3</Badge>}
 *   position="top-right"
 * >
 *   <Button>Notificações</Button>
 * </BadgeContainer>
 * ```
 */
export const BadgeContainer = memo(function BadgeContainer({
  children,
  badge,
  position = 'top-right',
  className,
  offset,
  pulse = false,
  show = true,
}: BadgeContainerProps) {
  if (!show) {
    return <>{children}</>;
  }

  if (position === 'inline') {
    return (
      <div className={cn('inline-flex items-center gap-2', className)}>
        {children}
        {badge}
      </div>
    );
  }

  const offsetStyle = offset
    ? {
        '--badge-offset': `${offset}px`,
        transform: `translate(var(--badge-offset), calc(var(--badge-offset) * -1))`,
      } as React.CSSProperties
    : undefined;

  return (
    <div className={cn('relative inline-flex', className)}>
      {children}
      <span
        className={cn(
          'absolute',
          positionClasses[position],
          pulse && 'animate-pulse',
          'z-10'
        )}
        style={offsetStyle}
      >
        {badge}
      </span>
    </div>
  );
});

BadgeContainer.displayName = 'BadgeContainer';

export default BadgeContainer;
