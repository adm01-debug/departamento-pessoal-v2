/**
 * @fileoverview Hook para gerenciamento de integrações
 * @module hooks/useIntegracoes
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Integracao {
  id: string;
  nome: string;
  tipo: 'bitrix24' | 'esocial' | 'contabil' | 'webhook' | 'api';
  config: Record<string, any>;
  ativa: boolean;
  ultimo_sync?: string;
  erros_count: number;
  created_at: string;
}

export function useIntegracoes() {
  const queryClient = useQueryClient();

  const { data: integracoes = [], isLoading: loading } = useQuery({
    queryKey: ['integracoes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('integracoes').select('*').order('nome');
      if (error) throw error;
      return data as Integracao[];
    },
  });

  const testarConexao = useMutation({
    mutationFn: async (id: string) => {
      // Simular teste de conexão
      await new Promise(r => setTimeout(r, 1000));
      return { success: true };
    },
    onSuccess: () => toast.success('Conexão OK!'),
    onError: () => toast.error('Falha na conexão'),
  });

  const sincronizar = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('integracoes').update({ 
        ultimo_sync: new Date().toISOString() 
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integracoes'] });
      toast.success('Sincronização concluída!');
    },
  });

  return {
    integracoes,
    loading,
    testarConexao: testarConexao.mutateAsync,
    sincronizar: sincronizar.mutateAsync,
    isTesting: testarConexao.isPending,
    isSyncing: sincronizar.isPending,
  };
}

export default useIntegracoes;
