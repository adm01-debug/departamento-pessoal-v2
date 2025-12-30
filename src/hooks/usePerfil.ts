/**
 * @fileoverview Hook para perfil do usuário
 * @module hooks/usePerfil
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Perfil {
  id: string;
  user_id: string;
  nome: string;
  cargo?: string;
  departamento?: string;
  telefone?: string;
  avatar_url?: string;
}

export function usePerfil() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: perfil, isLoading } = useQuery({
    queryKey: ['perfil', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data as Perfil | null;
    },
    enabled: !!user?.id,
  });

  const updateMutation = useMutation({
    mutationFn: async (dados: Partial<Perfil>) => {
      if (!user?.id) throw new Error('Usuário não autenticado');
      const { error } = await supabase
        .from('profiles')
        .upsert({ user_id: user.id, ...dados });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfil'] });
      toast.success('Perfil atualizado!');
    },
    onError: () => toast.error('Erro ao atualizar perfil'),
  });

  return {
    perfil,
    isLoading,
    updatePerfil: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}

export default usePerfil;
