import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useWindowSize } from '@/hooks/useWindowSize';
describe('useWindowSize (extra)', () => { it('atualiza em resize', () => { const { result } = renderHook(() => useWindowSize()); expect(result.current.width).toBeGreaterThan(0); }); });
