import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useEntrevistaDesligamento(desligamentoId?: string) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['entrevista-desligamento', desligamentoId],
    enabled: !!desligamentoId,
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('entrevistas_desligamento' as any) as any)
        .select('*')
        .eq('desligamento_id', desligamentoId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const salvarEntrevista = useMutation({
    mutationFn: async (dados: any) => {
      const { data, error } = await (supabase
        .from('entrevistas_desligamento' as any) as any)
        .upsert({ ...dados, desligamento_id: desligamentoId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['entrevista-desligamento', desligamentoId] });
      toast.success('Entrevista de desligamento salva!');
    },
  });

  return {
    entrevista: query.data,
    isLoading: query.isLoading,
    salvar: salvarEntrevista.mutateAsync,
  };
}
