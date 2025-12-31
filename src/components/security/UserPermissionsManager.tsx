/**
 * Componente para visualizar permissões de um usuário
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';
import { 
  ALL_PERMISSIONS, 
  MODULES, 
  MODULE_LABELS,
  ROLE_PERMISSIONS,
  type Permission,
  type Role 
} from '@/types/permissions';

interface UserPermissionsManagerProps {
  userRole: Role;
  userName?: string;
}

export function UserPermissionsManager({ userRole, userName }: UserPermissionsManagerProps) {
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];

  // Agrupar permissões por módulo
  const getPermissionsByModule = (module: string) => {
    return ALL_PERMISSIONS.filter(p => p.module === module);
  };

  // Verificar se tem permissão
  const hasPermission = (code: Permission) => {
    return userPermissions.includes(code);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Permissões {userName && `- ${userName}`}
        </CardTitle>
        <CardDescription>
          Permissões baseadas no role: <Badge variant="outline">{userRole}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue={MODULES[0]} className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-1">
            {MODULES.map(module => (
              <TabsTrigger key={module} value={module} className="text-xs">
                {MODULE_LABELS[module] || module}
              </TabsTrigger>
            ))}
          </TabsList>

          {MODULES.map(module => (
            <TabsContent key={module} value={module} className="mt-4">
              <div className="space-y-3">
                {getPermissionsByModule(module).map(permission => {
                  const isGranted = hasPermission(permission.code);

                  return (
                    <div
                      key={permission.code}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={isGranted}
                          disabled
                        />
                        <div>
                          <p className="font-medium text-sm">{permission.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {permission.description}
                          </p>
                        </div>
                      </div>
                      {isGranted && (
                        <Badge variant="secondary" className="text-xs">
                          Via Role
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default UserPermissionsManager;
