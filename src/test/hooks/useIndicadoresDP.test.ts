import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useIndicadoresDP } from '@/hooks/useIndicadoresDP';
describe('useIndicadoresDP', () => { it('retorna indicadores', () => { const { result } = renderHook(() => useIndicadoresDP()); expect(result.current.indicadores).toBeDefined(); }); });
