// V15-104: src/lib/throttle.ts

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T & { cancel: () => void } {
  let inThrottle = false;
  let lastFunc: NodeJS.Timeout | null = null;
  let lastRan: number = 0;

  const throttled = function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      lastRan = Date.now();
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    } else {
      if (lastFunc) clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  } as T & { cancel: () => void };

  throttled.cancel = () => {
    if (lastFunc) {
      clearTimeout(lastFunc);
      lastFunc = null;
    }
    inThrottle = false;
  };

  return throttled;
}

export function throttleAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  limit: number
): T {
  let isRunning = false;
  let lastRan = 0;

  return (async function(this: any, ...args: Parameters<T>) {
    const now = Date.now();
    if (isRunning || now - lastRan < limit) {
      return;
    }
    isRunning = true;
    lastRan = now;
    try {
      return await func.apply(this, args);
    } finally {
      isRunning = false;
    }
  }) as T;
}
