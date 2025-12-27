import { render, screen, renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
describe('AuthContext', () => { it('fornece contexto', () => { const wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>; const { result } = renderHook(() => useAuth(), { wrapper }); expect(result.current).toBeDefined(); }); });
