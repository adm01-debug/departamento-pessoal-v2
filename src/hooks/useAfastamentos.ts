import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { afastamentoService } from '@/services/afastamentoService';
import { useEmpresas } from './useEmpresas';
import { toast } from 'sonner';

export function useAfastamentos() {
  const { empresaAtual } = useEmpresas();
  const queryClient = useQueryClient();
  const empresaId = empresaAtual?.id;
  const [filtros, setFiltros] = useState<any>({});

  const query = useQuery({
    queryKey: ['afastamentos', empresaId, filtros],
    queryFn: () => afastamentoService.listar(empresaId, filtros),
    enabled: !!empresaId,
  });

  const configsQuery = useQuery({
    queryKey: ['afastamentos-configs'],
    queryFn: () => afastamentoService.listarConfiguracoes(),
  });

  const criarMutation = useMutation({
    mutationFn: (data: any) => afastamentoService.criar({ ...data, empresa_id: empresaId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['afastamentos'] });
      toast.success('Afastamento registrado com sucesso');
    },
    onError: (err: Error) => toast.error(`Erro ao registrar: ${err.message}`),
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => afastamentoService.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['afastamentos'] });
      toast.success('Afastamento atualizado com sucesso');
    },
    onError: (err: Error) => toast.error(`Erro ao atualizar: ${err.message}`),
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => afastamentoService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['afastamentos'] });
      toast.success('Afastamento excluído com sucesso');
    },
    onError: (err: Error) => toast.error(`Erro ao excluir: ${err.message}`),
  });

  return {
    afastamentos: query.data || [],
    configs: configsQuery.data || [],
    isLoading: query.isLoading || configsQuery.isLoading,
    error: query.error,
    filtros,
    setFeltros: setFiltros,
    criar: criarMutation.mutateAsync,
    isCriando: criarMutation.isPending,
    atualizar: atualizarMutation.mutateAsync,
    isAtualizando: atualizarMutation.isPending,
    excluir: excluirMutation.mutateAsync,
    refetch: query.refetch,
  };
}

export function useProrrogacoesAfastamento() {
  const queryClient = useQueryClient();
  const { empresaAtual } = useEmpresas();

  const query = useQuery({
    queryKey: ['prorrogacoes-afastamento', empresaAtual?.id],
    queryFn: () => afastamentoService.listarProrrogacoes(),
    enabled: !!empresaAtual?.id,
  });

  const criarMutation = useMutation({
    mutationFn: (data: any) => afastamentoService.criarProrrogacao(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prorrogacoes-afastamento'] });
      queryClient.invalidateQueries({ queryKey: ['afastamentos'] });
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
    mutationFn: ({ file, tipo }: { file: File; tipo: string }) => 
      afastamentoService.uploadDocumento(afastamentoId!, file, tipo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos-afastamento', afastamentoId] });
      toast.success('Documento enviado com sucesso');
    },
    onError: (err: Error) => toast.error(`Erro ao enviar documento: ${err.message}`),
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => afastamentoService.excluir(id),
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