import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePonto } from '@/hooks/usePonto';
describe('usePonto', () => { it('gerencia ponto', () => { const { result } = renderHook(() => usePonto()); expect(result.current.registros).toBeDefined(); }); });
