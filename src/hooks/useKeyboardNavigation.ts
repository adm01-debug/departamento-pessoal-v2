import { useState, useCallback, KeyboardEvent } from 'react';
export function useKeyboardNavigation<T>(items: T[], options?: { loop?: boolean; orientation?: 'vertical' | 'horizontal' }) {
  const { loop = true, orientation = 'vertical' } = options || {};
  const [activeIndex, setActiveIndex] = useState(0);
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    if (e.key === nextKey) { e.preventDefault(); setActiveIndex(i => loop ? (i + 1) % items.length : Math.min(i + 1, items.length - 1)); }
    else if (e.key === prevKey) { e.preventDefault(); setActiveIndex(i => loop ? (i - 1 + items.length) % items.length : Math.max(i - 1, 0)); }
    else if (e.key === 'Home') { e.preventDefault(); setActiveIndex(0); }
    else if (e.key === 'End') { e.preventDefault(); setActiveIndex(items.length - 1); }
  }, [items.length, loop, orientation]);
  return { activeIndex, setActiveIndex, handleKeyDown, activeItem: items[activeIndex] };
}
