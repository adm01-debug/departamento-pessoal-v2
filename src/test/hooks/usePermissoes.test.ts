import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePermissoes } from '@/hooks/usePermissoes';
describe('usePermissoes', () => { it('retorna permissões', () => { const { result } = renderHook(() => usePermissoes()); expect(result.current.permissoes).toBeDefined(); }); });
