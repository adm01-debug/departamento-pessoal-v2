import { useEffect } from 'react';
export function useA11y() {
  useEffect(() => { const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Tab') document.body.classList.add('keyboard-nav'); }; const handleMouseDown = () => document.body.classList.remove('keyboard-nav'); document.addEventListener('keydown', handleKeyDown); document.addEventListener('mousedown', handleMouseDown); return () => { document.removeEventListener('keydown', handleKeyDown); document.removeEventListener('mousedown', handleMouseDown); }; }, []);
  const announceToScreenReader = (message: string) => { const el = document.createElement('div'); el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite'); el.textContent = message; document.body.appendChild(el); setTimeout(() => el.remove(), 1000); };
  return { announceToScreenReader };
}
