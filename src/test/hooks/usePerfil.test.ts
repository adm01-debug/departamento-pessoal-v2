import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePerfil } from '@/hooks/usePerfil';
describe('usePerfil', () => { it('retorna perfil', () => { const { result } = renderHook(() => usePerfil()); expect(result.current.perfil).toBeDefined(); }); });
