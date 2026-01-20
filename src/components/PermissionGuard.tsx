// V19-015: Permission Guard Component
import { ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';

export type Permission = 'admin' | 'rh' | 'financeiro' | 'visualizar' | 'editar' | 'excluir';
export type Role = 'admin' | 'gerente' | 'analista' | 'operador' | 'visualizador';

const rolePermissions: Record<Role, Permission[]> = {
  admin: ['admin', 'rh', 'financeiro', 'visualizar', 'editar', 'excluir'],
  gerente: ['rh', 'financeiro', 'visualizar', 'editar'],
  analista: ['rh', 'visualizar', 'editar'],
  operador: ['visualizar', 'editar'],
  visualizador: ['visualizar'],
};

export const hasPermission = (userRole: Role, permission: Permission): boolean => {
  return rolePermissions[userRole]?.includes(permission) ?? false;
};

interface PermissionGuardProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const user = useAuthStore((s) => s.user);
  const userRole = (user?.role || 'visualizador') as Role;
  
  if (!hasPermission(userRole, permission)) return <>{fallback}</>;
  return <>{children}</>;
}

export function usePermission(permission: Permission): boolean {
  const user = useAuthStore((s) => s.user);
  const userRole = (user?.role || 'visualizador') as Role;
  return hasPermission(userRole, permission);
}

export function usePermissions(): { can: (p: Permission) => boolean; role: Role } {
  const user = useAuthStore((s) => s.user);
  const role = (user?.role || 'visualizador') as Role;
  return { can: (p) => hasPermission(role, p), role };
}

export default PermissionGuard;
