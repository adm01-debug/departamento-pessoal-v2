import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useHighContrast } from '@/hooks/useHighContrast';
describe('useHighContrast', () => { it('retorna preferência', () => { const { result } = renderHook(() => useHighContrast()); expect(typeof result.current).toBe('boolean'); }); });
