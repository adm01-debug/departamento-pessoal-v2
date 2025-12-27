import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePermissions } from '@/hooks/usePermissions';
describe('usePermissions', () => { it('verifica permissões', () => { const { result } = renderHook(() => usePermissions()); expect(result.current.hasPermission).toBeDefined(); }); });
