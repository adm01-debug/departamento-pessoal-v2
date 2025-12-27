import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useTheme } from '@/hooks/useTheme';
describe('useTheme', () => { it('gerencia tema', () => { const { result } = renderHook(() => useTheme()); expect(result.current.theme).toBeDefined(); act(() => { result.current.setTheme('dark'); }); }); });
