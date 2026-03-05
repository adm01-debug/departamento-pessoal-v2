// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Documento {
  id: string;
  colaborador_id: string;
  nome_arquivo: string;
  tipo: string;
  url: string;
  tamanho_bytes: number | null;
  created_at: string;
  created_by: string | null;
}

export function useDocumentos(colaboradorId?: string) {
  return useQuery<Documento[]>({
    queryKey: ['documentos', colaboradorId],
    queryFn: async () => {
      let query = supabase.from('documentos_colaborador').select('*');
      
      if (colaboradorId) {
        query = query.eq('colaborador_id', colaboradorId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
  });
}

export function useUploadDocumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      colaboradorId,
      file,
      tipo,
    }: {
      colaboradorId: string;
      file: File;
      tipo: string;
    }) => {
      // Upload file to storage
      const fileName = `${colaboradorId}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage.from('documentos').getPublicUrl(fileName);

      // Create document record
      const { data: result, error } = await supabase
        .from('documentos_colaborador')
        .insert({
          colaborador_id: colaboradorId,
          nome_arquivo: file.name,
          tipo,
          url: urlData.publicUrl,
          tamanho_bytes: file.size,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documentos', variables.colaboradorId] });
      toast.success('Documento enviado com sucesso');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao enviar documento: ${error.message}`);
    },
  });
}

export function useDeleteDocumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, colaboradorId }: { id: string; colaboradorId: string }) => {
      const { error } = await supabase.from('documentos_colaborador').delete().eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
      toast.success('Documento removido com sucesso');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao remover documento: ${error.message}`);
    },
  });
}
