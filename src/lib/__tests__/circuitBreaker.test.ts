import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CircuitBreaker } from '../circuitBreaker';

describe('CircuitBreaker', () => {
  let cb: CircuitBreaker;

  beforeEach(() => {
    cb = new CircuitBreaker({ failureThreshold: 3, resetTimeout: 5000 });
  });

  describe('CLOSED state (normal operation)', () => {
    it('executes fn and returns result when CLOSED', async () => {
      const result = await cb.execute(() => Promise.resolve('ok'));
      expect(result).toBe('ok');
    });

    it('starts in CLOSED state', () => {
      expect(cb.getState()).toBe('CLOSED');
    });

    it('re-throws fn errors without opening circuit below threshold', async () => {
      const err = new Error('fail');
      await expect(cb.execute(() => Promise.reject(err))).rejects.toThrow('fail');
      expect(cb.getState()).toBe('CLOSED');
    });

    it('counts failures and opens circuit at threshold', async () => {
      const fail = () => Promise.reject(new Error('x'));
      for (let i = 0; i < 3; i++) {
        await cb.execute(fail).catch(() => {});
      }
      expect(cb.getState()).toBe('OPEN');
    });

    it('resets failure count on success', async () => {
      await cb.execute(() => Promise.reject(new Error('x'))).catch(() => {});
      await cb.execute(() => Promise.reject(new Error('x'))).catch(() => {});
      await cb.execute(() => Promise.resolve('ok'));
      expect(cb.getState()).toBe('CLOSED');
      // One more failure should not open it (count was reset)
      await cb.execute(() => Promise.reject(new Error('x'))).catch(() => {});
      expect(cb.getState()).toBe('CLOSED');
    });
  });

  describe('OPEN state (circuit tripped)', () => {
    beforeEach(async () => {
      const fail = () => Promise.reject(new Error('x'));
      for (let i = 0; i < 3; i++) {
        await cb.execute(fail).catch(() => {});
      }
    });

    it('throws Circuit Breaker OPEN error without calling fn', async () => {
      const fn = vi.fn().mockResolvedValue('ok');
      await expect(cb.execute(fn)).rejects.toThrow('Circuit Breaker is OPEN');
      expect(fn).not.toHaveBeenCalled();
    });

    it('transitions to HALF_OPEN after resetTimeout', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(Date.now() + 6000);
      const fn = vi.fn().mockResolvedValue('ok');
      await cb.execute(fn);
      expect(cb.getState()).toBe('CLOSED');
      vi.useRealTimers();
    });
  });

  describe('HALF_OPEN state (recovery probe)', () => {
    beforeEach(async () => {
      vi.useFakeTimers();
      const fail = () => Promise.reject(new Error('x'));
      const baseTime = Date.now();
      for (let i = 0; i < 3; i++) {
        await cb.execute(fail).catch(() => {});
      }
      vi.setSystemTime(baseTime + 6000);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('closes circuit on successful probe', async () => {
      await cb.execute(() => Promise.resolve('ok'));
      expect(cb.getState()).toBe('CLOSED');
    });

    it('re-opens circuit on failed probe', async () => {
      await cb.execute(() => Promise.reject(new Error('still failing'))).catch(() => {});
      expect(cb.getState()).toBe('OPEN');
    });
  });

  describe('default options', () => {
    it('uses failureThreshold=5 and resetTimeout=30000 by default', async () => {
      const defaultCb = new CircuitBreaker();
      const fail = () => Promise.reject(new Error('x'));
      for (let i = 0; i < 4; i++) {
        await defaultCb.execute(fail).catch(() => {});
        expect(defaultCb.getState()).toBe('CLOSED');
      }
      await defaultCb.execute(fail).catch(() => {});
      expect(defaultCb.getState()).toBe('OPEN');
    });
  });
});
