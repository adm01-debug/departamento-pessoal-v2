import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useAuditoriaWrapper } from '@/hooks/useAuditoriaWrapper';
describe('useAuditoriaWrapper', () => {
  it('retorna wrapper', () => { const { result } = renderHook(() => useAuditoriaWrapper()); expect(result.current.wrap).toBeDefined(); });
});
