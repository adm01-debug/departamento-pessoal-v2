import { useEffect, useCallback, useState } from 'react';

export function useKeyPress(targetKey: string): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = useCallback(({ key }: KeyboardEvent) => {
    if (key === targetKey) setKeyPressed(true);
  }, [targetKey]);

  const upHandler = useCallback(({ key }: KeyboardEvent) => {
    if (key === targetKey) setKeyPressed(false);
  }, [targetKey]);

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [downHandler, upHandler]);

  return keyPressed;
}

export function useKeyboardShortcut(
  keys: string[],
  callback: () => void,
  options?: { ctrl?: boolean; alt?: boolean; shift?: boolean }
): void {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { ctrl = false, alt = false, shift = false } = options ?? {};
      if (ctrl && !e.ctrlKey) return;
      if (alt && !e.altKey) return;
      if (shift && !e.shiftKey) return;
      if (keys.includes(e.key)) {
        e.preventDefault();
        callback();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [keys, callback, options]);
}

export default useKeyPress;
