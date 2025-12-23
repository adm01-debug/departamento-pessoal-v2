/**
 * Helper para tratamento de erros de API
 */
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Ocorreu um erro inesperado';
}

/**
 * Helper para retry de requisições
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | null = null;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  throw lastError;
}

/**
 * Helper para timeout de requisições
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  ms = 30000
): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms)
  );
  return Promise.race([promise, timeout]);
}

/**
 * Helper para debounce de requisições
 */
export function createDebouncedFetch<T>(
  fn: () => Promise<T>,
  delay = 300
): () => Promise<T> {
  let timeoutId: NodeJS.Timeout | null = null;
  let pendingPromise: Promise<T> | null = null;

  return () => {
    if (timeoutId) clearTimeout(timeoutId);
    if (!pendingPromise) {
      pendingPromise = new Promise((resolve, reject) => {
        timeoutId = setTimeout(async () => {
          try {
            resolve(await fn());
          } catch (e) {
            reject(e);
          } finally {
            pendingPromise = null;
          }
        }, delay);
      });
    }
    return pendingPromise;
  };
}
