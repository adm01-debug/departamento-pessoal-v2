import { renderHook } from '@testing-library/react';
import { usePermissoes } from '../usePermissoes';

const mockUser = {
  id: '1',
  role: 'admin',
  permissions: ['read', 'write', 'delete'],
};

const mockRestrictedUser = {
  id: '2',
  role: 'user',
  permissions: ['read'],
};

describe('usePermissoes', () => {
  it('should check if user has permission', () => {
    const { result } = renderHook(() => usePermissoes(mockUser));
    expect(result.current.hasPermission('read')).toBe(true);
    expect(result.current.hasPermission('delete')).toBe(true);
  });

  it('should return false for missing permission', () => {
    const { result } = renderHook(() => usePermissoes(mockRestrictedUser));
    expect(result.current.hasPermission('delete')).toBe(false);
  });

  it('should check admin role', () => {
    const { result } = renderHook(() => usePermissoes(mockUser));
    expect(result.current.isAdmin).toBe(true);
  });

  it('should check non-admin role', () => {
    const { result } = renderHook(() => usePermissoes(mockRestrictedUser));
    expect(result.current.isAdmin).toBe(false);
  });

  it('should check multiple permissions', () => {
    const { result } = renderHook(() => usePermissoes(mockUser));
    expect(result.current.hasAllPermissions(['read', 'write'])).toBe(true);
    expect(result.current.hasAnyPermission(['write', 'admin'])).toBe(true);
  });

  it('should handle null user', () => {
    const { result } = renderHook(() => usePermissoes(null));
    expect(result.current.hasPermission('read')).toBe(false);
    expect(result.current.isAdmin).toBe(false);
  });

  it('should return user role', () => {
    const { result } = renderHook(() => usePermissoes(mockUser));
    expect(result.current.role).toBe('admin');
  });
});
