/**
 * @fileoverview Região live para anúncios de leitores de tela
 * @module components/common/LiveRegion
 */
import { memo, type ReactNode } from 'react';

/** Props do LiveRegion */
interface LiveRegionProps {
  /** Conteúdo a anunciar */
  children: ReactNode;
  /** Política de anúncio */
  'aria-live'?: 'polite' | 'assertive' | 'off';
  /** Se é atômica */
  'aria-atomic'?: boolean;
  /** Role da região */
  role?: 'status' | 'alert' | 'log';
}

/**
 * Região para anúncios acessíveis de leitores de tela
 * @example
 * ```tsx
 * <LiveRegion aria-live="polite">
 *   {message && <p>{message}</p>}
 * </LiveRegion>
 * ```
 */
export const LiveRegion = memo(function LiveRegion({
  children,
  'aria-live': ariaLive = 'polite',
  'aria-atomic': ariaAtomic = true,
  role = 'status',
}: LiveRegionProps) {
  return (
    <div
      role={role}
      aria-live={ariaLive}
      aria-atomic={ariaAtomic}
      className="sr-only"
    >
      {children}
    </div>
  );
});

/**
 * Componente para alertas assertivos
 */
export const AlertRegion = memo(function AlertRegion({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <LiveRegion aria-live="assertive" role="alert">
      {children}
    </LiveRegion>
  );
});
