/**
 * Utilitários de Performance
 * @module performance
 */

import { lazy, ComponentType, LazyExoticComponent } from 'react';

/** Lazy load com prefetch */
export function lazyWithPrefetch<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>): LazyExoticComponent<T> & { prefetch: () => Promise<void> } {
  const Component = lazy(factory) as LazyExoticComponent<T> & { prefetch: () => Promise<void> };
  Component.prefetch = () => factory().then(() => {});
  return Component;
}

/** Memoização com TTL */
export function memoizeWithTTL<T extends (...args: any[]) => any>(fn: T, ttl: number): T {
  const cache = new Map<string, { value: ReturnType<T>; expires: number }>();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    if (cached && Date.now() < cached.expires) return cached.value;
    const value = fn(...args);
    cache.set(key, { value, expires: Date.now() + ttl });
    return value;
  }) as T;
}

/** Request Idle Callback polyfill */
export const requestIdleCallback = window.requestIdleCallback || ((cb: IdleRequestCallback) => setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 50 }), 1));

/** Defer execution até idle */
export const deferUntilIdle = <T>(fn: () => T): Promise<T> => new Promise(resolve => requestIdleCallback(() => resolve(fn())));

/** Chunk array para processamento batch */
export const chunkArray = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
};

/** Process array em batches com delay */
export async function processBatches<T, R>(items: T[], batchSize: number, processor: (item: T) => R, delay = 0): Promise<R[]> {
  const results: R[] = [];
  const batches = chunkArray(items, batchSize);
  for (const batch of batches) {
    results.push(...batch.map(processor));
    if (delay > 0) await new Promise(r => setTimeout(r, delay));
  }
  return results;
}

/** Intersection Observer wrapper */
export const createIntersectionObserver = (callback: IntersectionObserverCallback, options?: IntersectionObserverInit) => {
  if (typeof IntersectionObserver === 'undefined') return null;
  return new IntersectionObserver(callback, options);
};

/** Prefetch de recursos */
export const prefetchResource = (url: string, as: 'script' | 'style' | 'image' | 'fetch' = 'fetch') => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  link.as = as;
  document.head.appendChild(link);
};

/** Measure performance */
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const duration = performance.now() - start;
  console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
  return duration;
};
