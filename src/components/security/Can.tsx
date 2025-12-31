/**
 * Componente de controle de acesso baseado em permissões
 */

import { ReactNode } from 'react';
import { usePermissions, Permission } from '@/hooks/usePermissions';

interface CanProps {
  permission: Permission | Permission[];
  mode?: 'any' | 'all';
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Componente wrapper para controle de acesso
 * 
 * @example
 * <Can permission="colaboradores:write">
 *   <Button>Adicionar</Button>
 * </Can>
 * 
 * @example
 * <Can permission={['colaboradores:write', 'colaboradores:delete']} mode="any">
 *   <ActionsMenu />
 * </Can>
 */
export function Can({ permission, mode = 'any', fallback = null, children }: CanProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  const permissions = Array.isArray(permission) ? permission : [permission];
  
  let hasAccess = false;
  
  if (permissions.length === 1) {
    hasAccess = hasPermission(permissions[0]);
  } else if (mode === 'any') {
    hasAccess = hasAnyPermission(permissions);
  } else {
    hasAccess = hasAllPermissions(permissions);
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * HOC para proteger componentes baseado em permissões
 */
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  permission: Permission | Permission[],
  mode: 'any' | 'all' = 'any'
) {
  return function PermissionWrapper(props: P) {
    return (
      <Can permission={permission} mode={mode}>
        <WrappedComponent {...props} />
      </Can>
    );
  };
}

export default Can;
