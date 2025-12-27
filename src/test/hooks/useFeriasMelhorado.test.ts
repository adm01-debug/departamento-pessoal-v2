import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFeriasMelhorado } from '@/hooks/useFeriasMelhorado';
describe('useFeriasMelhorado', () => { it('gerencia férias', () => { const { result } = renderHook(() => useFeriasMelhorado()); expect(result.current.calcularFerias).toBeDefined(); }); });
