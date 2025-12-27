import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useMobile } from '@/hooks/use-mobile';
describe('useMobile', () => {
  it('detecta mobile', () => { const { result } = renderHook(() => useMobile()); expect(typeof result.current).toBe('boolean'); });
});
