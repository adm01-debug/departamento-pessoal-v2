import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useDesligamentoMelhorado } from '@/hooks/useDesligamentoMelhorado';
describe('useDesligamentoMelhorado', () => { it('gerencia desligamento', () => { const { result } = renderHook(() => useDesligamentoMelhorado()); expect(result.current.processDesligamento).toBeDefined(); }); });
