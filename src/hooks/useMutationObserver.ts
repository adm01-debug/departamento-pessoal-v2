import { useEffect, useRef, RefObject } from 'react';
export function useMutationObserver<T extends Element>(callback: MutationCallback, options: MutationObserverInit = { childList: true, subtree: true }): RefObject<T> {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new MutationObserver(callback);
    observer.observe(el, options);
    return () => observer.disconnect();
  }, [callback, options]);
  return ref;
}
