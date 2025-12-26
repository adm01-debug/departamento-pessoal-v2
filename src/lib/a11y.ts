/**
 * Utilitários de Acessibilidade (A11y)
 * @module a11y
 */

/** IDs para live regions */
export const LIVE_REGION_IDS = { ANNOUNCER: 'a11y-announcer', STATUS: 'a11y-status', ALERT: 'a11y-alert' };

/** Anuncia mensagem para leitores de tela */
export const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const el = document.getElementById(LIVE_REGION_IDS.ANNOUNCER);
  if (el) { el.setAttribute('aria-live', priority); el.textContent = message; }
};

/** Gera ID único para aria-describedby */
export const generateDescribedById = (prefix: string) => `${prefix}-desc-${Math.random().toString(36).substr(2, 9)}`;

/** Props padrão para botões de ícone */
export const iconButtonProps = (label: string) => ({ 'aria-label': label, role: 'button', tabIndex: 0 });

/** Props para elementos com tooltip */
export const tooltipProps = (id: string) => ({ 'aria-describedby': id });

/** Verifica se elemento está focável */
export const isFocusable = (el: HTMLElement) => {
  const focusables = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
  return el.matches(focusables) && !el.hasAttribute('disabled');
};

/** Trap focus dentro de elemento */
export const trapFocus = (container: HTMLElement) => {
  const focusables = container.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const handler = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  container.addEventListener('keydown', handler);
  return () => container.removeEventListener('keydown', handler);
};

/** Skip link para navegação */
export const SkipLinkTarget = { MAIN: 'main-content', NAV: 'main-nav', SEARCH: 'search-input' };

/** Verifica contraste WCAG */
export const checkContrast = (fg: string, bg: string): { ratio: number; passesAA: boolean; passesAAA: boolean } => {
  const getLuminance = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16 & 255) / 255, g = (rgb >> 8 & 255) / 255, b = (rgb & 255) / 255;
    const [rs, gs, bs] = [r, g, b].map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  const l1 = getLuminance(fg), l2 = getLuminance(bg);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return { ratio, passesAA: ratio >= 4.5, passesAAA: ratio >= 7 };
};
