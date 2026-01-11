// V15-145: src/hooks/useKeyPress.ts
import { useState, useEffect, useCallback } from 'react';

export function useKeyPress(targetKey: string): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      if (e.key === targetKey) setKeyPressed(true);
    };
    const upHandler = (e: KeyboardEvent) => {
      if (e.key === targetKey) setKeyPressed(false);
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return keyPressed;
}

export function useKeyboardShortcut(
  keys: string[],
  callback: () => void,
  options?: { ctrl?: boolean; shift?: boolean; alt?: boolean; meta?: boolean }
) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { ctrl, shift, alt, meta } = options ?? {};
    
    if (ctrl && !event.ctrlKey) return;
    if (shift && !event.shiftKey) return;
    if (alt && !event.altKey) return;
    if (meta && !event.metaKey) return;

    if (keys.includes(event.key.toLowerCase())) {
      event.preventDefault();
      callback();
    }
  }, [keys, callback, options]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export function useHotkeys(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = [
        e.ctrlKey && 'ctrl',
        e.shiftKey && 'shift',
        e.altKey && 'alt',
        e.metaKey && 'meta',
        e.key.toLowerCase()
      ].filter(Boolean).join('+');

      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
