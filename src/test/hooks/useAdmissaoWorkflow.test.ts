import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useAdmissaoWorkflow } from '@/hooks/useAdmissaoWorkflow';
describe('useAdmissaoWorkflow', () => {
  it('inicializa workflow', () => { const { result } = renderHook(() => useAdmissaoWorkflow()); expect(result.current.currentStep).toBeDefined(); });
  it('avança step', () => { const { result } = renderHook(() => useAdmissaoWorkflow()); act(() => { result.current.nextStep(); }); });
});
