import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useWindowSize } from '@/hooks/useWindowSize';
describe('useWindowSize', () => { it('retorna dimensões', () => { const { result } = renderHook(() => useWindowSize()); expect(result.current.width).toBeDefined(); expect(result.current.height).toBeDefined(); }); });
