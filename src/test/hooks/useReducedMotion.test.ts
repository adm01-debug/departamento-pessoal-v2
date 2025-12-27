import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useReducedMotion } from '@/hooks/useReducedMotion';
describe('useReducedMotion', () => { it('detecta preferência', () => { const { result } = renderHook(() => useReducedMotion()); expect(typeof result.current).toBe('boolean'); }); });
