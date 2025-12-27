import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useViaCEP } from '@/hooks/useViaCEP';
describe('useViaCEP', () => { it('busca CEP', () => { const { result } = renderHook(() => useViaCEP()); expect(result.current.buscar).toBeDefined(); }); });
