import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useUserRoles } from '@/hooks/useUserRoles';
describe('useUserRoles', () => { it('retorna roles', () => { const { result } = renderHook(() => useUserRoles()); expect(result.current.roles).toBeDefined(); expect(result.current.hasRole).toBeDefined(); }); });
