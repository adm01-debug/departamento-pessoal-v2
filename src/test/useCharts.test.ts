import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCharts } from '@/hooks/useCharts';

describe('useCharts', () => {
  it('deve retornar configurações de charts', () => {
    const { result } = renderHook(() => useCharts());
    expect(result.current).toBeDefined();
  });

  it('deve ter configuração de cores', () => {
    const { result } = renderHook(() => useCharts());
    expect(result.current.colors).toBeDefined();
  });

  it('deve ter configuração de tooltip', () => {
    const { result } = renderHook(() => useCharts());
    expect(result.current.tooltipConfig).toBeDefined();
  });

  it('deve ter função para formatar dados', () => {
    const { result } = renderHook(() => useCharts());
    expect(typeof result.current.formatData).toBe('function');
  });

  it('deve ter configuração responsiva', () => {
    const { result } = renderHook(() => useCharts());
    expect(result.current.responsiveConfig).toBeDefined();
  });
});
