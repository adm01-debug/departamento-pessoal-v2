import { useEffect } from 'react';
export function KeyboardNav({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Tab') document.body.classList.add('keyboard-nav'); };
    const mouse = () => document.body.classList.remove('keyboard-nav');
    document.addEventListener('keydown', handler);
    document.addEventListener('mousedown', mouse);
    return () => { document.removeEventListener('keydown', handler); document.removeEventListener('mousedown', mouse); };
  }, []);
  return <>{children}</>;
}
