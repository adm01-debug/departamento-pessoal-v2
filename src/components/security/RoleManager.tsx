/**
 * Componente para gerenciar roles de usuários
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Shield, 
  UserPlus, 
  Search, 
  Loader2,
  UserCog,
  User,
  Eye,
  Trash2,
  Plus
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Role } from '@/types/permissions';

interface UserWithRole {
  id: string;
  user_id: string;
  role: Role;
  created_at: string;
  profiles?: {
    nome?: string;
    cargo?: string;
    avatar_url?: string;
  };
}

const ROLES: { value: Role; label: string; icon: typeof Shield; color: string }[] = [
  { value: 'admin', label: 'Administrador', icon: Shield, color: 'bg-destructive text-destructive-foreground' },
  { value: 'gestor', label: 'Gestor', icon: UserCog, color: 'bg-warning text-warning-foreground' },
  { value: 'rh', label: 'RH', icon: User, color: 'bg-info text-info-foreground' },
  { value: 'user', label: 'Usuário', icon: Eye, color: 'bg-muted text-muted-foreground' }
];

interface RoleManagerProps {
  userId?: string;
  onSave?: (data: unknown) => void;
}

export const RoleManager: React.FC<RoleManagerProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('user');
  const queryClient = useQueryClient();

  // Buscar todos os usuários com roles
  const { data: userRoles = [], isLoading } = useQuery({
    queryKey: ['all-user-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          profiles:user_id (
            nome,
            cargo,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UserWithRole[];
    },
  });

  // Buscar usuários sem role atribuída
  const { data: availableUsers = [] } = useQuery({
    queryKey: ['available-users', userRoles],
    queryFn: async () => {
      const assignedUserIds = userRoles.map(ur => ur.user_id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, nome, cargo, avatar_url')
        .not('user_id', 'in', `(${assignedUserIds.length > 0 ? assignedUserIds.join(',') : '00000000-0000-0000-0000-000000000000'})`);
      
      if (error) throw error;
      return data || [];
    },
    enabled: userRoles.length >= 0,
  });

  // Mutation para adicionar role
  const addRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: Role }) => {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role }, { onConflict: 'user_id,role' });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Role atribuída com sucesso!');
      setSelectedUserId('');
      queryClient.invalidateQueries({ queryKey: ['all-user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['available-users'] });
    },
    onError: () => {
      toast.error('Erro ao atribuir role');
    }
  });

  // Mutation para remover role
  const removeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: Role }) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Role removida com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['all-user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['available-users'] });
    },
    onError: () => {
      toast.error('Erro ao remover role');
    }
  });

  // Mutation para alterar role
  const changeRoleMutation = useMutation({
    mutationFn: async ({ userId, oldRole, newRole }: { userId: string; oldRole: Role; newRole: Role }) => {
      // Remover role antiga
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', oldRole);
      
      // Adicionar nova role
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: newRole });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Role alterada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['all-user-roles'] });
    },
    onError: () => {
      toast.error('Erro ao alterar role');
    }
  });

  // Filtrar usuários
  const filteredUsers = userRoles.filter(ur => {
    const name = ur.profiles?.nome || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getRoleConfig = (role: Role) => ROLES.find(r => r.value === role) || ROLES[3];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Gerenciar Roles de Usuários
        </CardTitle>
        <CardDescription>
          Atribua e gerencie os níveis de acesso dos usuários
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Adicionar novo usuário */}
        <div className="flex gap-2 p-4 bg-muted/50 rounded-lg">
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Selecionar usuário..." />
            </SelectTrigger>
            <SelectContent>
              {availableUsers.map(user => (
                <SelectItem key={user.user_id} value={user.user_id}>
                  {user.nome || 'Usuário sem nome'}
                </SelectItem>
              ))}
              {availableUsers.length === 0 && (
                <div className="p-2 text-sm text-muted-foreground text-center">
                  Todos os usuários já possuem roles
                </div>
              )}
            </SelectContent>
          </Select>

          <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as Role)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map(role => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={() => addRoleMutation.mutate({ userId: selectedUserId, role: selectedRole })}
            disabled={!selectedUserId || addRoleMutation.isPending}
          >
            {addRoleMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Lista de usuários */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {filteredUsers.map(userRole => {
                const roleConfig = getRoleConfig(userRole.role);
                const Icon = roleConfig.icon;

                return (
                  <div
                    key={userRole.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={userRole.profiles?.avatar_url} />
                        <AvatarFallback>
                          {(userRole.profiles?.nome || 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{userRole.profiles?.nome || 'Usuário'}</p>
                        <p className="text-sm text-muted-foreground">
                          {userRole.profiles?.cargo || 'Sem cargo'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Select
                        value={userRole.role}
                        onValueChange={(newRole) => 
                          changeRoleMutation.mutate({ 
                            userId: userRole.user_id, 
                            oldRole: userRole.role, 
                            newRole: newRole as Role 
                          })
                        }
                      >
                        <SelectTrigger className="w-36">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span>{roleConfig.label}</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map(role => {
                            const RIcon = role.icon;
                            return (
                              <SelectItem key={role.value} value={role.value}>
                                <div className="flex items-center gap-2">
                                  <RIcon className="h-4 w-4" />
                                  {role.label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRoleMutation.mutate({ 
                          userId: userRole.user_id, 
                          role: userRole.role 
                        })}
                        disabled={removeRoleMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                );
              })}

              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário com role atribuída'}
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default RoleManager;
