import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCharts } from '@/hooks/useCharts';
describe('useCharts', () => {
  it('retorna configurações', () => { const { result } = renderHook(() => useCharts()); expect(result.current.colors).toBeDefined(); });
});
