import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useAgendamentoRelatorios } from '@/hooks/useAgendamentoRelatorios';
describe('useAgendamentoRelatorios', () => {
  it('gerencia agendamentos', () => { const { result } = renderHook(() => useAgendamentoRelatorios()); expect(result.current.agendamentos).toBeDefined(); });
});
