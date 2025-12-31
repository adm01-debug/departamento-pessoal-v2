/**
 * Hook para gerenciamento de permissões
 */
import { useAuth } from '@/contexts/AuthContext';
import { 
  ROLE_PERMISSIONS, 
  ALL_PERMISSIONS,
  MODULES,
  type Permission, 
  type Role,
  type PermissionDetails 
} from '@/types/permissions';

export function usePermissions() {
  const { user } = useAuth();
  const role = (user?.user_metadata?.role || 'viewer') as Role;
  const permissions = ROLE_PERMISSIONS[role] || [];
  
  // Verificar se tem permissão específica
  const hasPermission = (p: Permission) => permissions.includes(p);
  
  // Verificar se tem alguma das permissões (OR)
  const hasAnyPermission = (ps: Permission[]) => ps.some(p => permissions.includes(p));
  
  // Verificar se tem todas as permissões (AND)
  const hasAllPermissions = (ps: Permission[]) => ps.every(p => permissions.includes(p));
  
  // Verificar se tem acesso a um módulo
  const hasModuleAccess = (module: string) => {
    return ALL_PERMISSIONS
      .filter(p => p.module === module)
      .some(p => permissions.includes(p.code));
  };
  
  // Obter detalhes de uma permissão
  const getPermissionDetails = (code: Permission): PermissionDetails | undefined => {
    return ALL_PERMISSIONS.find(p => p.code === code);
  };
  
  // Obter permissões de um módulo
  const getModulePermissions = (module: string): PermissionDetails[] => {
    return ALL_PERMISSIONS.filter(p => p.module === module);
  };
  
  // Obter permissões do usuário com detalhes
  const getUserPermissionsDetails = (): PermissionDetails[] => {
    return ALL_PERMISSIONS.filter(p => permissions.includes(p.code));
  };

  return { 
    role, 
    permissions, 
    allPermissions: ALL_PERMISSIONS,
    modules: MODULES,
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions,
    hasModuleAccess,
    getPermissionDetails,
    getModulePermissions,
    getUserPermissionsDetails
  };
}

export type { Permission, Role, PermissionDetails };
