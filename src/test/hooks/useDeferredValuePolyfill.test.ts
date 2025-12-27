import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useDeferredValuePolyfill } from '@/hooks/useDeferredValuePolyfill';
describe('useDeferredValuePolyfill', () => { it('retorna valor', () => { const { result } = renderHook(() => useDeferredValuePolyfill('test')); expect(result.current).toBe('test'); }); });
