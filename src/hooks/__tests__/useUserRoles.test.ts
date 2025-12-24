import { renderHook } from '@testing-library/react';
import { useUserRoles } from '../useUserRoles';

describe('useUserRoles', () => {
  it('should return available roles', () => {
    const { result } = renderHook(() => useUserRoles());
    expect(result.current.roles).toBeDefined();
    expect(Array.isArray(result.current.roles)).toBe(true);
  });

  it('should check if role is valid', () => {
    const { result } = renderHook(() => useUserRoles());
    expect(result.current.isValidRole('admin')).toBe(true);
    expect(result.current.isValidRole('invalid_role')).toBe(false);
  });

  it('should return role permissions', () => {
    const { result } = renderHook(() => useUserRoles());
    const adminPerms = result.current.getRolePermissions('admin');
    expect(adminPerms).toBeDefined();
    expect(Array.isArray(adminPerms)).toBe(true);
  });

  it('should compare role hierarchy', () => {
    const { result } = renderHook(() => useUserRoles());
    expect(result.current.isRoleHigherOrEqual('admin', 'user')).toBe(true);
    expect(result.current.isRoleHigherOrEqual('user', 'admin')).toBe(false);
  });

  it('should get role label', () => {
    const { result } = renderHook(() => useUserRoles());
    expect(result.current.getRoleLabel('admin')).toBeDefined();
    expect(typeof result.current.getRoleLabel('admin')).toBe('string');
  });

  it('should handle unknown roles', () => {
    const { result } = renderHook(() => useUserRoles());
    expect(result.current.getRolePermissions('unknown')).toEqual([]);
    expect(result.current.getRoleLabel('unknown')).toBe('unknown');
  });
});
