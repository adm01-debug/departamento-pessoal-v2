// V18-A11Y: Utilitarios de Acessibilidade WCAG 2.1 AA
import { useCallback, useEffect, useRef } from 'react';

// V18-A11Y-002: Props de acessibilidade
export interface A11yProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-hidden'?: boolean;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  role?: string;
  tabIndex?: number;
}

// Gera props de acessibilidade para componentes
export function getA11yProps(label: string, options?: Partial<A11yProps>): A11yProps {
  return {
    'aria-label': label,
    role: 'region',
    ...options
  };
}

// V18-A11Y-003: Skip Navigation
export function SkipNavigation() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
    >
      Pular para conteúdo principal
    </a>
  );
}

// V18-A11Y-006: Hook para navegação por teclado
export function useKeyboardNavigation(items: HTMLElement[], options?: { wrap?: boolean }) {
  const currentIndex = useRef(0);
  const { wrap = true } = options || {};

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const len = items.length;
    if (len === 0) return;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        currentIndex.current = wrap 
          ? (currentIndex.current + 1) % len 
          : Math.min(currentIndex.current + 1, len - 1);
        items[currentIndex.current]?.focus();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        currentIndex.current = wrap 
          ? (currentIndex.current - 1 + len) % len 
          : Math.max(currentIndex.current - 1, 0);
        items[currentIndex.current]?.focus();
        break;
      case 'Home':
        e.preventDefault();
        currentIndex.current = 0;
        items[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        currentIndex.current = len - 1;
        items[len - 1]?.focus();
        break;
    }
  }, [items, wrap]);

  return { handleKeyDown, currentIndex };
}

// V18-A11Y-008: Focus Trap para Modais
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    container.addEventListener('keydown', handleTab);
    first?.focus();

    return () => container.removeEventListener('keydown', handleTab);
  }, [isActive]);

  return containerRef;
}

// V18-A11Y-004: Verificador de contraste
export function checkContrast(foreground: string, background: string): { ratio: number; passesAA: boolean; passesAAA: boolean } {
  const getLuminance = (hex: string): number => {
    const rgb = hex.match(/\w\w/g)?.map(x => parseInt(x, 16) / 255) || [0, 0, 0];
    const [r, g, b] = rgb.map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return { ratio: Math.round(ratio * 100) / 100, passesAA: ratio >= 4.5, passesAAA: ratio >= 7 };
}
