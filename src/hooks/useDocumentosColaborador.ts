// @ts-nocheck
/**
 * @fileoverview Hook para documentos de colaborador
 * @module hooks/useDocumentosColaborador
 */
import { useState } from 'react';
import { logger } from '@/lib/logger';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuditoriaIntegration } from './useAuditoriaIntegration';

export interface DocumentoColaborador {
  id: string;
  colaborador_id: string;
  tipo: string;
  nome_arquivo: string;
  url: string;
  tamanho_bytes: number | null;
  created_at: string;
  created_by: string | null;
}

const tiposDocumento = [
  { value: 'rg', label: 'RG' },
  { value: 'cpf', label: 'CPF' },
  { value: 'ctps', label: 'CTPS' },
  { value: 'titulo_eleitor', label: 'Título de Eleitor' },
  { value: 'certificado_reservista', label: 'Certificado de Reservista' },
  { value: 'cnh', label: 'CNH' },
  { value: 'comprovante_residencia', label: 'Comprovante de Residência' },
  { value: 'certidao_nascimento', label: 'Certidão de Nascimento' },
  { value: 'certidao_casamento', label: 'Certidão de Casamento' },
  { value: 'diploma', label: 'Diploma/Certificado' },
  { value: 'contrato', label: 'Contrato de Trabalho' },
  { value: 'exame_admissional', label: 'Exame Admissional' },
  { value: 'exame_periodico', label: 'Exame Periódico' },
  { value: 'exame_demissional', label: 'Exame Demissional' },
  { value: 'atestado', label: 'Atestado Médico' },
  { value: 'outros', label: 'Outros' },
];

export const getTiposDocumento = () => tiposDocumento;

export const getTipoLabel = (tipo: string): string => {
  const found = tiposDocumento.find(t => t.value === tipo);
  return found?.label || tipo;
};

export function useDocumentosColaborador(colaboradorId: string) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: documentos = [], isLoading } = useQuery({
    queryKey: ['documentos-colaborador', colaboradorId],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      if (!colaboradorId) return [];
      
      const { data, error } = await supabase
        .from('documentos_colaborador')
        .select('id, colaborador_id, tipo, nome, url, created_at')
        .eq('colaborador_id', colaboradorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DocumentoColaborador[];
    },
    enabled: !!colaboradorId,
  });

  const uploadDocumento = async (file: File, tipo: string): Promise<void> => {
    if (!colaboradorId) {
      toast({
        title: 'Erro',
        description: 'Colaborador não identificado.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${colaboradorId}/${tipo}_${Date.now()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('documentos-colaboradores')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documentos-colaboradores')
        .getPublicUrl(fileName);

      // Save reference in database
      const { error: dbError } = await supabase
        .from('documentos_colaborador')
        .insert({
          colaborador_id: colaboradorId,
          tipo,
          nome_arquivo: file.name,
          url: urlData.publicUrl,
          tamanho_bytes: file.size,
        });

      if (dbError) throw dbError;

      toast({
        title: 'Documento enviado',
        description: `${file.name} foi enviado com sucesso.`,
      });

      queryClient.invalidateQueries({ queryKey: ['documentos-colaborador', colaboradorId] });
    } catch (error) {
      logger.error('Erro ao enviar documento:', error);
      toast({
        title: 'Erro ao enviar documento',
        description: 'Não foi possível enviar o arquivo. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteDocumento = useMutation({
    mutationFn: async (documento: DocumentoColaborador) => {
      // Extract file path from URL
      const urlParts = documento.url.split('/');
      const filePath = urlParts.slice(-2).join('/');

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documentos-colaboradores')
        .remove([filePath]);

      if (storageError) {
        logger.warn('Erro ao deletar do storage:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('documentos_colaborador')
        .delete()
        .eq('id', documento.id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      toast({
        title: 'Documento excluído',
        description: 'O documento foi removido com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['documentos-colaborador', colaboradorId] });
    },
    onError: (error) => {
      logger.error('Erro ao excluir documento:', error);
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir o documento.',
        variant: 'destructive',
      });
    },
  });

  const downloadDocumento = async (documento: DocumentoColaborador) => {
    try {
      // Extract file path from URL
      const urlParts = documento.url.split('/');
      const filePath = urlParts.slice(-2).join('/');

      const { data, error } = await supabase.storage
        .from('documentos-colaboradores')
        .download(filePath);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = documento.nome_arquivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      logger.error('Erro ao baixar documento:', error);
      toast({
        title: 'Erro ao baixar',
        description: 'Não foi possível baixar o documento.',
        variant: 'destructive',
      });
    }
  };

  return {
    documentos,
    isLoading,
    uploading,
    uploadDocumento,
    deleteDocumento: deleteDocumento.mutate,
    downloadDocumento,
    isDeleting: deleteDocumento.isPending,
  };
}








