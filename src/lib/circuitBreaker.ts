export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitOptions {
  failureThreshold: number;
  resetTimeout: number;
}

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime?: number;
  private options: CircuitOptions;

  constructor(options: CircuitOptions = { failureThreshold: 5, resetTimeout: 30000 }) {
    this.options = options;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - (this.lastFailureTime || 0) > this.options.resetTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit Breaker is OPEN. Integration temporarily unavailable.');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.state = 'CLOSED';
    this.failureCount = 0;
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.options.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  getState(): CircuitState {
    return this.state;
  }
}

// Singleton instances for specific services
export const bitrixBreaker = new CircuitBreaker();
export const resendBreaker = new CircuitBreaker();
export const genericBreaker = new CircuitBreaker({ failureThreshold: 3, resetTimeout: 15000 });
