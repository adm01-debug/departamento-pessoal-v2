/**
 * @fileoverview Hook para gerenciamento de documentos
 * @module hooks/useDocumentos
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Documento {
  id: string;
  colaborador_id?: string;
  tipo: string;
  nome: string;
  url?: string;
  tamanho?: number;
  mime_type?: string;
  created_at: string;
}

export function useDocumentos(colaboradorId?: string) {
  const queryClient = useQueryClient();

  const { data: documentos = [], isLoading: loading } = useQuery({
    queryKey: ['documentos', colaboradorId],
    queryFn: async () => {
      let query = supabase.from('documentos').select('*').order('created_at', { ascending: false });
      if (colaboradorId) query = query.eq('colaborador_id', colaboradorId);
      const { data, error } = await query;
      if (error) throw error;
      return data as Documento[];
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, tipo, colaboradorId }: { file: File; tipo: string; colaboradorId?: string }) => {
      const fileName = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from('documentos').upload(fileName, file);
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('documentos').getPublicUrl(fileName);
      
      const { data, error } = await supabase.from('documentos').insert({
        nome: file.name,
        tipo,
        url: publicUrl,
        tamanho: file.size,
        mime_type: file.type,
        colaborador_id: colaboradorId,
      }).select().single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
      toast.success('Documento enviado!');
    },
    onError: () => toast.error('Erro ao enviar documento'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('documentos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
      toast.success('Documento excluído!');
    },
  });

  return {
    documentos,
    loading,
    upload: uploadMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
  };
}

export default useDocumentos;
