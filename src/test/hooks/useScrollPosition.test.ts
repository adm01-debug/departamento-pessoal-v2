import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useScrollPosition } from '@/hooks/useScrollPosition';
describe('useScrollPosition', () => { it('retorna posição', () => { const { result } = renderHook(() => useScrollPosition()); expect(result.current.x).toBeDefined(); expect(result.current.y).toBeDefined(); }); });
