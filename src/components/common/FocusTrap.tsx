/**
 * @fileoverview Componente para trap de foco em modais
 * @module components/common/FocusTrap
 */
import { useEffect, useRef, type ReactNode, memo } from 'react';

/** Props do FocusTrap */
interface FocusTrapProps {
  /** Conteúdo a ter foco trapped */
  children: ReactNode;
  /** Se o trap está ativo */
  active?: boolean;
  /** Elemento a focar inicialmente */
  initialFocus?: React.RefObject<HTMLElement>;
}

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Componente que mantém o foco dentro de um container
 * Útil para modais e dialogs
 */
export const FocusTrap = memo(function FocusTrap({
  children,
  active = true,
  initialFocus,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    // Focar elemento inicial ou primeiro focusável
    const focusableElements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (initialFocus?.current) {
      initialFocus.current.focus();
    } else if (firstElement) {
      firstElement.focus();
    }

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [active, initialFocus]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
});
