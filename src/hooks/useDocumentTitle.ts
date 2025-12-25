import { useEffect, useRef } from 'react';
export function useDocumentTitle(title: string, restoreOnUnmount = true): void {
  const prev = useRef(document.title);
  useEffect(() => { document.title = title; }, [title]);
  useEffect(() => {
    if (restoreOnUnmount) return () => { document.title = prev.current; };
  }, [restoreOnUnmount]);
}
