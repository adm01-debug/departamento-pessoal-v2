import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useDocumentos(colaboradorId?: string) {
  const queryClient = useQueryClient();

  const { data: documentos = [], isLoading } = useQuery({
    queryKey: ['documentos', colaboradorId],
    queryFn: async () => {
      let query = supabase.from('documentos').select('*').order('created_at', { ascending: false });
      if (colaboradorId) query = query.eq('colaborador_id', colaboradorId);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const criarDocumento = useMutation({
    mutationFn: async (doc: any) => {
      const { data, error } = await supabase.from('documentos').insert(doc).select().maybeSingle();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
      toast.success('Documento criado!');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const excluirDocumento = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('documentos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
      toast.success('Documento excluído');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return { documentos, isLoading, criarDocumento, excluirDocumento };
}
