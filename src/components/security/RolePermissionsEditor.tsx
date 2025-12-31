/**
 * Editor de permissões por role com persistência no banco de dados
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Users, 
  UserCog, 
  User, 
  Eye, 
  Save, 
  RotateCcw, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lock
} from 'lucide-react';
import { 
  ALL_PERMISSIONS, 
  MODULES, 
  MODULE_LABELS,
  ROLE_PERMISSIONS,
  type Role,
  type Permission 
} from '@/types/permissions';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const ROLES_CONFIG: { value: Role; label: string; icon: typeof Shield; description: string; color: string }[] = [
  { value: 'admin', label: 'Administrador', icon: Shield, description: 'Acesso total ao sistema', color: 'bg-destructive text-destructive-foreground' },
  { value: 'gestor', label: 'Gestor', icon: UserCog, description: 'Gerenciamento de equipes e processos', color: 'bg-warning text-warning-foreground' },
  { value: 'rh', label: 'RH', icon: User, description: 'Gestão de pessoas e benefícios', color: 'bg-info text-info-foreground' },
  { value: 'user', label: 'Usuário', icon: Eye, description: 'Acesso básico de visualização', color: 'bg-muted text-muted-foreground' }
];

interface RolePermissionRecord {
  id: string;
  role: string;
  permission_code: string;
  created_at: string;
}

export function RolePermissionsEditor() {
  const [selectedRole, setSelectedRole] = useState<Role>('admin');
  const [localPermissions, setLocalPermissions] = useState<Permission[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const queryClient = useQueryClient();

  // Buscar permissões do banco de dados
  const { data: dbPermissions, isLoading } = useQuery({
    queryKey: ['role-permissions', selectedRole],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*')
        .eq('role', selectedRole);
      
      if (error) {
        // Se a tabela não existe, usar permissões padrão
        console.warn('Usando permissões padrão:', error.message);
        return ROLE_PERMISSIONS[selectedRole] || [];
      }
      
      return (data as RolePermissionRecord[]).map(r => r.permission_code as Permission);
    },
  });

  // Atualizar permissões locais quando carregar do banco
  useEffect(() => {
    if (dbPermissions) {
      setLocalPermissions(dbPermissions);
      setHasChanges(false);
    }
  }, [dbPermissions]);

  // Mutation para salvar permissões
  const saveMutation = useMutation({
    mutationFn: async (permissions: Permission[]) => {
      // Primeiro, remover todas as permissões existentes para este role
      const { error: deleteError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role', selectedRole);
      
      if (deleteError) throw deleteError;

      // Inserir as novas permissões
      if (permissions.length > 0) {
        const { error: insertError } = await supabase
          .from('role_permissions')
          .insert(permissions.map(p => ({
            role: selectedRole,
            permission_code: p
          })));
        
        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      toast.success('Permissões salvas com sucesso!');
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ['role-permissions'] });
    },
    onError: (error) => {
      console.error('Erro ao salvar permissões:', error);
      toast.error('Erro ao salvar permissões');
    }
  });

  // Toggle de permissão individual
  const togglePermission = (permission: Permission) => {
    if (selectedRole === 'admin') return; // Admin sempre tem todas as permissões
    
    setLocalPermissions(prev => {
      const newPerms = prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission];
      setHasChanges(true);
      return newPerms;
    });
  };

  // Toggle de módulo inteiro
  const toggleModule = (module: string) => {
    if (selectedRole === 'admin') return;
    
    const modulePerms = ALL_PERMISSIONS.filter(p => p.module === module).map(p => p.code);
    const allSelected = modulePerms.every(p => localPermissions.includes(p));
    
    setLocalPermissions(prev => {
      const otherPerms = prev.filter(p => !modulePerms.includes(p));
      const newPerms = allSelected ? otherPerms : [...otherPerms, ...modulePerms];
      setHasChanges(true);
      return newPerms;
    });
  };

  // Resetar para permissões padrão
  const resetToDefault = () => {
    setLocalPermissions(ROLE_PERMISSIONS[selectedRole] || []);
    setHasChanges(true);
  };

  // Verificações de módulo
  const getPermissionsByModule = (module: string) => 
    ALL_PERMISSIONS.filter(p => p.module === module);

  const isModuleFullySelected = (module: string): boolean => {
    const modulePerm = getPermissionsByModule(module);
    return modulePerm.every(p => localPermissions.includes(p.code));
  };

  const isModulePartiallySelected = (module: string): boolean => {
    const modulePerm = getPermissionsByModule(module);
    const selected = modulePerm.filter(p => localPermissions.includes(p.code)).length;
    return selected > 0 && selected < modulePerm.length;
  };

  const getSelectedCount = (module: string): { selected: number; total: number } => {
    const modulePerm = getPermissionsByModule(module);
    return {
      selected: modulePerm.filter(p => localPermissions.includes(p.code)).length,
      total: modulePerm.length
    };
  };

  const totalPermissions = localPermissions.length;
  const totalAvailable = ALL_PERMISSIONS.length;

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Gerenciar Permissões por Role
            </CardTitle>
            <CardDescription>
              Configure as permissões de acesso para cada nível de usuário
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefault}
              disabled={selectedRole === 'admin' || saveMutation.isPending}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restaurar Padrão
            </Button>
            <Button
              size="sm"
              onClick={() => saveMutation.mutate(localPermissions)}
              disabled={!hasChanges || selectedRole === 'admin' || saveMutation.isPending}
            >
              {saveMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Salvar Alterações
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tabs de Roles */}
        <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as Role)}>
          <TabsList className="grid grid-cols-4 w-full">
            {ROLES_CONFIG.map(role => {
              const Icon = role.icon;
              return (
                <TabsTrigger key={role.value} value={role.value} className="gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{role.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {ROLES_CONFIG.map(role => {
            const Icon = role.icon;
            return (
              <TabsContent key={role.value} value={role.value} className="mt-4">
                {/* Header do Role */}
                <div className="flex items-center justify-between mb-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${role.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{role.label}</h3>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      {role.value === 'admin' && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          Protegido
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {totalPermissions}/{totalAvailable} permissões
                      </Badge>
                    </div>
                    {hasChanges && role.value !== 'admin' && (
                      <span className="text-xs text-warning flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        Alterações não salvas
                      </span>
                    )}
                  </div>
                </div>

                {/* Aviso para Admin */}
                {role.value === 'admin' && (
                  <div className="mb-4 p-3 bg-muted/50 border rounded-lg flex items-center gap-2 text-sm">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      O role Administrador possui todas as permissões e não pode ser editado.
                    </span>
                  </div>
                )}

                {/* Lista de Permissões */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-3">
                      {MODULES.map(module => {
                        const modulePerms = getPermissionsByModule(module);
                        const allSelected = isModuleFullySelected(module);
                        const partialSelected = isModulePartiallySelected(module);
                        const counts = getSelectedCount(module);

                        return (
                          <div key={module} className="border rounded-lg overflow-hidden">
                            {/* Header do Módulo */}
                            <div 
                              className={`flex items-center justify-between p-3 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors ${
                                role.value === 'admin' ? 'cursor-default' : ''
                              }`}
                              onClick={() => role.value !== 'admin' && toggleModule(module)}
                            >
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={allSelected}
                                  onCheckedChange={() => toggleModule(module)}
                                  disabled={role.value === 'admin'}
                                  className={partialSelected ? 'data-[state=checked]:bg-primary/50' : ''}
                                />
                                <span className="font-medium">
                                  {MODULE_LABELS[module] || module}
                                </span>
                              </div>
                              <Badge 
                                variant={allSelected ? 'default' : partialSelected ? 'secondary' : 'outline'}
                                className="font-mono text-xs"
                              >
                                {counts.selected}/{counts.total}
                              </Badge>
                            </div>

                            {/* Permissões do Módulo */}
                            <div className="divide-y">
                              {modulePerms.map(permission => {
                                const isSelected = localPermissions.includes(permission.code);
                                return (
                                  <div
                                    key={permission.code}
                                    className={`flex items-center gap-3 p-3 pl-10 hover:bg-muted/20 transition-colors ${
                                      role.value === 'admin' ? '' : 'cursor-pointer'
                                    }`}
                                    onClick={() => togglePermission(permission.code)}
                                  >
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={() => togglePermission(permission.code)}
                                      disabled={role.value === 'admin'}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium">{permission.name}</p>
                                        {isSelected && (
                                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                        )}
                                      </div>
                                      <p className="text-xs text-muted-foreground truncate">
                                        {permission.description}
                                      </p>
                                    </div>
                                    <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded hidden sm:block">
                                      {permission.code}
                                    </code>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default RolePermissionsEditor;
