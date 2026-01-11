// V15-120: src/performance/Memoization.ts

type AnyFunction = (...args: any[]) => any;

export function memoize<T extends AnyFunction>(
  fn: T,
  options?: { maxSize?: number; ttl?: number }
): T {
  const cache = new Map<string, { value: ReturnType<T>; timestamp: number }>();
  const maxSize = options?.maxSize ?? 100;
  const ttl = options?.ttl ?? Infinity;

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.value;
    }

    const result = fn(...args);
    
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    cache.set(key, { value: result, timestamp: Date.now() });
    return result;
  }) as T;
}

export function memoizeAsync<T extends AnyFunction>(
  fn: T,
  options?: { maxSize?: number; ttl?: number }
): T {
  const cache = new Map<string, { promise: Promise<any>; timestamp: number }>();
  const maxSize = options?.maxSize ?? 100;
  const ttl = options?.ttl ?? Infinity;

  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.promise;
    }

    const promise = fn(...args);
    
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    cache.set(key, { promise, timestamp: Date.now() });
    return promise;
  }) as T;
}

export function createSelector<T, R>(
  selector: (state: T) => R,
  equalityFn: (a: R, b: R) => boolean = Object.is
): (state: T) => R {
  let lastState: T;
  let lastResult: R;
  let initialized = false;

  return (state: T): R => {
    if (!initialized || state !== lastState) {
      const newResult = selector(state);
      if (!initialized || !equalityFn(newResult, lastResult)) {
        lastResult = newResult;
      }
      lastState = state;
      initialized = true;
    }
    return lastResult;
  };
}

export function shallowEqual<T extends object>(a: T, b: T): boolean {
  if (a === b) return true;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(key => (a as any)[key] === (b as any)[key]);
}
