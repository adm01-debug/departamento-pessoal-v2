/** Utilitários de acessibilidade WCAG 2.1 AA */
export const a11yUtils = {
  /** Gera ID único para aria-labelledby */
  generateId: (prefix: string) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`,
  
  /** Verifica contraste de cores WCAG AA (4.5:1 para texto normal) */
  checkContrast: (fg: string, bg: string): boolean => {
    const getLuminance = (hex: string) => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = ((rgb >> 16) & 0xff) / 255;
      const g = ((rgb >> 8) & 0xff) / 255;
      const b = (rgb & 0xff) / 255;
      const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
    };
    const l1 = getLuminance(fg), l2 = getLuminance(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return ratio >= 4.5;
  },
  
  /** Props padrão para elementos focáveis */
  focusableProps: { tabIndex: 0, role: 'button' as const },
  
  /** Anuncia mensagem para leitores de tela */
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const el = document.createElement('div');
    el.setAttribute('aria-live', priority);
    el.setAttribute('aria-atomic', 'true');
    el.className = 'sr-only';
    document.body.appendChild(el);
    setTimeout(() => { el.textContent = message; }, 100);
    setTimeout(() => { document.body.removeChild(el); }, 1000);
  }
};

export const srOnly = 'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0';
