// @ts-nocheck
import { useAuth } from '@/contexts/AuthContext';
export function useRBAC() {
  const { user } = useAuth();
  const hasRole = (role: string) => user?.role === role;
  const hasPermission = (permission: string) => user?.permissions?.includes(permission) ?? false;
  const can = (action: string, resource: string) => hasPermission(`${action}:${resource}`);
  return { hasRole, hasPermission, can, isAdmin: hasRole('admin') };
}
