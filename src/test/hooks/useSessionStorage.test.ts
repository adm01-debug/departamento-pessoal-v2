import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSessionStorage } from '@/hooks/useSessionStorage';
describe('useSessionStorage', () => { it('armazena valor', () => { const { result } = renderHook(() => useSessionStorage('key', 'initial')); expect(result.current[0]).toBe('initial'); act(() => { result.current[1]('new value'); }); }); });
