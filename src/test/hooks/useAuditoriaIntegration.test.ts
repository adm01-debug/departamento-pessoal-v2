import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useAuditoriaIntegration } from '@/hooks/useAuditoriaIntegration';
describe('useAuditoriaIntegration', () => {
  it('retorna funções de auditoria', () => { const { result } = renderHook(() => useAuditoriaIntegration()); expect(result.current.logAction).toBeDefined(); });
});
