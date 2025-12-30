/**
 * @fileoverview Hook para gerenciamento de usuários
 * @module hooks/useUsuarios
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Usuario {
  id: string;
  email: string;
  nome?: string;
  cargo?: string;
  ativo: boolean;
  ultimo_acesso?: string;
  created_at: string;
}

export function useUsuarios() {
  const queryClient = useQueryClient();

  const { data: usuarios = [], isLoading: loading } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('nome');
      if (error) throw error;
      return data as Usuario[];
    },
  });

  const toggleAtivoMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { error } = await supabase.from('profiles').update({ ativo }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('Usuário atualizado!');
    },
  });

  return {
    usuarios,
    loading,
    toggleAtivo: (id: string, ativo: boolean) => toggleAtivoMutation.mutateAsync({ id, ativo }),
  };
}

export default useUsuarios;
