/**
 * @fileoverview Hook para Intersection Observer
 * @module hooks/useIntersectionObserver
 */
import { useState, useEffect, useRef, type RefObject } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver<T extends Element>(
  options: UseIntersectionObserverOptions = {}
): [RefObject<T>, boolean, IntersectionObserverEntry | undefined] {
  const { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false } = options;
  const elementRef = useRef<T>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const frozen = entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    const node = elementRef?.current;
    if (!node || frozen) return;

    const observer = new IntersectionObserver(
      ([e]) => setEntry(e),
      { threshold, root, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, root, rootMargin, frozen]);

  return [elementRef, !!entry?.isIntersecting, entry];
}
