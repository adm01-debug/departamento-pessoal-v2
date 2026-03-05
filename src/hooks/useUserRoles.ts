// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useAuditoriaIntegration } from './useAuditoriaIntegration';

export type AppRole = 'admin' | 'gestor' | 'rh' | 'user';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Permission {
  id: string;
  role: AppRole;
  resource: string;
  action: string;
  allowed: boolean;
}

const ROLE_LABELS: Record<AppRole, string> = {
  admin: 'Administrador',
  gestor: 'Gestor',
  rh: 'RH',
  user: 'Usuário',
};

const ROLE_COLORS: Record<AppRole, string> = {
  admin: 'bg-destructive text-destructive-foreground',
  gestor: 'bg-warning text-warning-foreground',
  rh: 'bg-info text-info-foreground',
  user: 'bg-muted text-muted-foreground',
};

export function useUserRoles() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar roles do usuário atual
  const { data: userRoles = [], isLoading: loadingRoles } = useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as UserRole[];
    },
    enabled: !!user?.id,
  });

  // Buscar todas as permissões
  const { data: permissions = [], isLoading: loadingPermissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('role', { ascending: true })
        .order('resource', { ascending: true });
      
      if (error) throw error;
      return data as Permission[];
    },
  });

  // Buscar todos os usuários com roles (para admin)
  const { data: allUserRoles = [], isLoading: loadingAllRoles, refetch: refetchAllRoles } = useQuery({
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
      return data;
    },
  });

  // Verificar se tem uma role específica
  const hasRole = (role: AppRole): boolean => {
    return userRoles.some(ur => ur.role === role);
  };

  // Verificar se é admin
  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  // Verificar se é gestor ou superior
  const isGestorOrHigher = (): boolean => {
    return hasRole('admin') || hasRole('gestor');
  };

  // Verificar permissão específica
  const canPerform = (resource: string, action: string): boolean => {
    // Admin pode tudo
    if (isAdmin()) return true;

    // Buscar roles do usuário
    const roles = userRoles.map(ur => ur.role);
    
    // Verificar se alguma role tem a permissão
    return roles.some(role => {
      const permission = permissions.find(
        p => p.role === role && p.resource === resource && p.action === action
      );
      return permission?.allowed ?? false;
    });
  };

  // Atribuir role a usuário
  const assignRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role,
        }, {
          onConflict: 'user_id,role',
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Permissão atribuída com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['all-user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
    },
    onError: () => {
      toast.error('Erro ao atribuir permissão');
    },
  });

  // Remover role de usuário
  const removeRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Permissão removida com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['all-user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
    },
    onError: () => {
      toast.error('Erro ao remover permissão');
    },
  });

  return {
    userRoles,
    permissions,
    allUserRoles,
    loadingRoles,
    loadingPermissions,
    loadingAllRoles,
    hasRole,
    isAdmin,
    isGestorOrHigher,
    canPerform,
    assignRole: assignRole.mutate,
    removeRole: removeRole.mutate,
    refetchAllRoles,
    ROLE_LABELS,
    ROLE_COLORS,
  };
}

