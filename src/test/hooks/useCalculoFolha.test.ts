import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCalculoFolha } from '@/hooks/useCalculoFolha';
describe('useCalculoFolha', () => {
  it('calcula folha', () => { const { result } = renderHook(() => useCalculoFolha(5000)); expect(result.current.inss).toBeDefined(); expect(result.current.irrf).toBeDefined(); expect(result.current.liquido).toBeDefined(); });
});
