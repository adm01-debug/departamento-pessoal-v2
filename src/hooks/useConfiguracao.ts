/**
 * @fileoverview Hook para gerenciamento de configurações
 * @module hooks/useConfiguracao
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Configuracao {
  id: string;
  empresa_id?: string;
  chave: string;
  valor: any;
  descricao?: string;
  created_at: string;
  updated_at?: string;
}

export function useConfiguracao(empresaId?: string) {
  const queryClient = useQueryClient();

  const { data: configuracoes = [], isLoading: loading } = useQuery({
    queryKey: ['configuracoes', empresaId],
    queryFn: async () => {
      let query = supabase.from('configuracoes').select('*');
      if (empresaId) query = query.eq('empresa_id', empresaId);
      const { data, error } = await query;
      if (error) throw error;
      return data as Configuracao[];
    },
  });

  const getConfig = (chave: string, defaultValue?: any) => {
    const config = configuracoes.find(c => c.chave === chave);
    return config?.valor ?? defaultValue;
  };

  const setConfigMutation = useMutation({
    mutationFn: async ({ chave, valor }: { chave: string; valor: any }) => {
      const { error } = await supabase.from('configuracoes').upsert({ chave, valor, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes'] });
      toast.success('Configuração salva!');
    },
  });

  return {
    configuracoes,
    loading,
    getConfig,
    setConfig: (chave: string, valor: any) => setConfigMutation.mutateAsync({ chave, valor }),
  };
}

export default useConfiguracao;
