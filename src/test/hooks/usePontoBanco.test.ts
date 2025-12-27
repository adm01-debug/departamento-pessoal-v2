import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePontoBanco } from '@/hooks/usePontoBanco';
describe('usePontoBanco', () => { it('calcula banco horas', () => { const { result } = renderHook(() => usePontoBanco('colab-1')); expect(result.current.saldo).toBeDefined(); }); });
