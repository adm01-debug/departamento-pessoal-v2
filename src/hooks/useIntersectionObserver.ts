// V15-143: src/hooks/useIntersectionObserver.ts
import { useState, useEffect, useRef, RefObject } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver<T extends HTMLElement>(
  options?: UseIntersectionObserverOptions
): [RefObject<T>, boolean, IntersectionObserverEntry | undefined] {
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  const frozen = options?.freezeOnceVisible && isIntersecting;

  useEffect(() => {
    const element = ref.current;
    if (!element || frozen) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: options?.threshold ?? 0,
        root: options?.root ?? null,
        rootMargin: options?.rootMargin ?? '0px',
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options?.threshold, options?.root, options?.rootMargin, frozen]);

  return [ref, isIntersecting, entry];
}

export function useOnScreen<T extends HTMLElement>(options?: IntersectionObserverInit): [RefObject<T>, boolean] {
  const [ref, isIntersecting] = useIntersectionObserver<T>(options);
  return [ref, isIntersecting];
}

export function useLazyImage(src: string, options?: IntersectionObserverInit) {
  const [ref, isVisible] = useIntersectionObserver<HTMLImageElement>({ ...options, freezeOnceVisible: true });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (isVisible && ref.current) {
      ref.current.src = src;
      ref.current.onload = () => setLoaded(true);
    }
  }, [isVisible, src, ref]);

  return { ref, isVisible, loaded };
}
