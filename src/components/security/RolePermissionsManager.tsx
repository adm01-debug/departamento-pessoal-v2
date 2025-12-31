/**
 * Componente para gerenciar permissões de roles
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Shield, Users, UserCog, User, Eye } from 'lucide-react';
import { 
  ALL_PERMISSIONS, 
  MODULES, 
  MODULE_LABELS,
  ROLE_PERMISSIONS,
  type Role 
} from '@/types/permissions';

const ROLES: { value: Role; label: string; icon: typeof Shield; description: string }[] = [
  { value: 'admin', label: 'Administrador', icon: Shield, description: 'Acesso total ao sistema' },
  { value: 'gestor', label: 'Gestor', icon: UserCog, description: 'Acesso intermediário' },
  { value: 'rh', label: 'RH', icon: User, description: 'Gestão de pessoas' },
  { value: 'user', label: 'Usuário', icon: Eye, description: 'Apenas visualização' }
];

export function RolePermissionsManager() {
  const [selectedRole, setSelectedRole] = useState<Role>('admin');
  
  const rolePermissions = ROLE_PERMISSIONS[selectedRole] || [];

  // Agrupar permissões por módulo
  const getPermissionsByModule = (module: string) => {
    return ALL_PERMISSIONS.filter(p => p.module === module);
  };

  // Verificar se todos de um módulo estão selecionados
  const isModuleFullySelected = (module: string): boolean => {
    const modulePerm = getPermissionsByModule(module);
    return modulePerm.every(p => rolePermissions.includes(p.code));
  };

  // Verificar se alguns do módulo estão selecionados
  const isModulePartiallySelected = (module: string): boolean => {
    const modulePerm = getPermissionsByModule(module);
    const selected = modulePerm.filter(p => rolePermissions.includes(p.code)).length;
    return selected > 0 && selected < modulePerm.length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Permissões por Role
        </CardTitle>
        <CardDescription>
          Visualize as permissões padrão para cada nível de acesso
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Seletor de Role */}
        <div className="flex gap-2 flex-wrap">
          {ROLES.map(role => {
            const Icon = role.icon;
            return (
              <Button
                key={role.value}
                variant={selectedRole === role.value ? 'default' : 'outline'}
                onClick={() => setSelectedRole(role.value)}
                size="sm"
              >
                <Icon className="h-4 w-4 mr-2" />
                {role.label}
              </Button>
            );
          })}
        </div>

        {/* Lista de Permissões por Módulo */}
        <div className="space-y-4">
          {MODULES.map(module => {
            const modulePerms = getPermissionsByModule(module);
            const allSelected = isModuleFullySelected(module);
            const partialSelected = isModulePartiallySelected(module);

            return (
              <div key={module} className="border rounded-lg">
                <div className="flex items-center justify-between p-3 bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={allSelected}
                      ref={(el) => {
                        if (el) {
                          (el as HTMLButtonElement & { indeterminate: boolean }).indeterminate = partialSelected;
                        }
                      }}
                      disabled
                    />
                    <span className="font-medium">
                      {MODULE_LABELS[module] || module}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {modulePerms.filter(p => rolePermissions.includes(p.code)).length}/{modulePerms.length}
                  </span>
                </div>
                <div className="p-3 space-y-2">
                  {modulePerms.map(permission => (
                    <div
                      key={permission.code}
                      className="flex items-center gap-3 pl-6"
                    >
                      <Checkbox
                        checked={rolePermissions.includes(permission.code)}
                        disabled
                      />
                      <div>
                        <p className="text-sm">{permission.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default RolePermissionsManager;
