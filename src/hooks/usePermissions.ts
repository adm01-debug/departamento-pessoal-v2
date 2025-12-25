import { useAuth } from '@/contexts/AuthContext';
import { ROLE_PERMISSIONS, type Permission, type Role } from '@/types/permissions';
export function usePermissions() {
  const { user } = useAuth();
  const role = (user?.user_metadata?.role || 'viewer') as Role;
  const permissions = ROLE_PERMISSIONS[role] || [];
  const hasPermission = (p: Permission) => permissions.includes(p);
  const hasAnyPermission = (ps: Permission[]) => ps.some(p => permissions.includes(p));
  const hasAllPermissions = (ps: Permission[]) => ps.every(p => permissions.includes(p));
  return { role, permissions, hasPermission, hasAnyPermission, hasAllPermissions };
}
