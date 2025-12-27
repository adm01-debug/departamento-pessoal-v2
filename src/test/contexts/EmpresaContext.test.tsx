import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmpresaProvider, useEmpresa } from '@/contexts/EmpresaContext';
describe('EmpresaContext', () => { it('fornece contexto', () => { const wrapper = ({ children }: any) => <EmpresaProvider>{children}</EmpresaProvider>; const { result } = renderHook(() => useEmpresa(), { wrapper }); expect(result.current).toBeDefined(); }); });
