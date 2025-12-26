/** Utilitários de performance */
export const performanceUtils = {
  /** Mede tempo de execução */
  measure: async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
    const start = performance.now();
    const result = await fn();
    console.log(`[Perf] ${name}: ${(performance.now() - start).toFixed(2)}ms`);
    return result;
  },
  
  /** Debounce com leading edge opcional */
  debounce: <T extends (...args: any[]) => any>(fn: T, ms: number, leading = false) => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let lastCall = 0;
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (leading && now - lastCall > ms) { lastCall = now; return fn(...args); }
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => { lastCall = Date.now(); fn(...args); }, ms);
    };
  },
  
  /** Throttle com trailing edge */
  throttle: <T extends (...args: any[]) => any>(fn: T, ms: number) => {
    let lastCall = 0;
    let scheduled = false;
    let lastArgs: Parameters<T>;
    return (...args: Parameters<T>) => {
      lastArgs = args;
      const now = Date.now();
      if (now - lastCall >= ms) { lastCall = now; fn(...args); }
      else if (!scheduled) { scheduled = true; setTimeout(() => { scheduled = false; lastCall = Date.now(); fn(...lastArgs); }, ms - (now - lastCall)); }
    };
  },
  
  /** Idle callback com fallback */
  requestIdleCallback: (cb: () => void, timeout = 2000) => {
    if ('requestIdleCallback' in window) (window as any).requestIdleCallback(cb, { timeout });
    else setTimeout(cb, 1);
  }
};
