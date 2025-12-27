import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePontoMelhorado } from '@/hooks/usePontoMelhorado';
describe('usePontoMelhorado', () => { it('gerencia ponto', () => { const { result } = renderHook(() => usePontoMelhorado()); expect(result.current.registrarPonto).toBeDefined(); }); });
