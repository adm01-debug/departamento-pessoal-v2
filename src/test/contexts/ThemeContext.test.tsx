import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider, useThemeContext } from '@/contexts/ThemeContext';
describe('ThemeContext', () => { it('fornece contexto', () => { const wrapper = ({ children }: any) => <ThemeProvider>{children}</ThemeProvider>; const { result } = renderHook(() => useThemeContext(), { wrapper }); expect(result.current.theme).toBeDefined(); }); });
