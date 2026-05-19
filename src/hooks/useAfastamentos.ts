import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { afastamentoService } from '@/services/afastamentoService';
import { useEmpresas } from './useEmpresas';
import { auditLogger } from '@/utils/auditLogger';
import { toast } from 'sonner';
import { useGenericCrud } from './useGenericCrud';

export function useAfastamentos() {
  const { empresaAtual } = useEmpresas();
  const empresaId = empresaAtual?.id;
  const [filtros, setFiltros] = useState<any>({});

  const crud = useGenericCrud<any>({
    queryKey: 'afastamentos',
    service: afastamentoService,
    filters: { ...filtros, empresaId },
    successMessages: {
      create: 'Afastamento registrado com sucesso',
      update: 'Afastamento atualizado com sucesso',
      delete: 'Afastamento excluído com sucesso'
    }
  });

  const configsQuery = useQuery({
    queryKey: ['afastamentos-configs'],
    queryFn: () => afastamentoService.listarConfiguracoes(),
  });

  return {
    ...crud,
    afastamentos: crud.items,
    configs: configsQuery.data || [],
    isLoading: crud.isLoading || configsQuery.isLoading,
    filtros,
    setFeltros: setFiltros,
  };
}

export function useProrrogacoesAfastamento(afastamentoId?: string) {
  const queryClient = useQueryClient();
  const { empresaAtual } = useEmpresas();

  const query = useQuery({
    queryKey: ['prorrogacoes-afastamento', empresaAtual?.id, afastamentoId],
    queryFn: () => afastamentoService.listarProrrogacoes(afastamentoId),
    enabled: !!empresaAtual?.id,
  });

  const criarMutation = useMutation({
    mutationFn: (data: any) => afastamentoService.criarProrrogacao(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['prorrogacoes-afastamento'] });
      queryClient.invalidateQueries({ queryKey: ['afastamentos'] });
      auditLogger.log({
        tabela: 'prorrogacoes_afastamento',
        registro_id: (data as any).id,
        acao: 'INSERT',
        dados_novos: data
      });
      toast.success('Prorrogação registrada com sucesso');
    },
    onError: (err: Error) => toast.error(`Erro ao registrar prorrogação: ${err.message}`),
  });

  return {
    prorrogacoes: query.data || [],
    isLoading: query.isLoading,
    criar: criarMutation.mutateAsync,
    isCriando: criarMutation.isPending,
  };
}

export function useDocumentosAfastamento(afastamentoId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['documentos-afastamento', afastamentoId],
    queryFn: () => afastamentoService.listarDocumentos(afastamentoId!),
    enabled: !!afastamentoId,
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, tipo }: { file: File; tipo: string }) => {
      return afastamentoService.uploadDocumento(afastamentoId!, file, tipo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos-afastamento', afastamentoId] });
      toast.success('Documento enviado com sucesso');
    },
    onError: (err: Error) => toast.error(`Erro ao enviar documento: ${err.message}`),
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => (afastamentoService as any).excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos-afastamento', afastamentoId] });
      toast.success('Documento excluído com sucesso');
    },
    onError: (err: Error) => toast.error(`Erro ao excluir documento: ${err.message}`),
  });

  return {
    documentos: query.data || [],
    isLoading: query.isLoading,
    upload: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    excluir: excluirMutation.mutateAsync,
  };
}
