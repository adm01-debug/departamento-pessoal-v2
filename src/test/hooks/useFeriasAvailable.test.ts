import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFeriasAvailable } from '@/hooks/useFeriasAvailable';
describe('useFeriasAvailable', () => { it('calcula disponíveis', () => { const { result } = renderHook(() => useFeriasAvailable('colab-1')); expect(result.current.diasDisponiveis).toBeDefined(); }); });
