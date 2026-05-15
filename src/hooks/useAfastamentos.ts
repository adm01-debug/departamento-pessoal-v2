import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { afastamentoService } from '@/services/afastamentoService';
import { useEmpresas } from './useEmpresas';
import { auditLogger } from '@/utils/auditLogger';
import { toast } from 'sonner';

export function useAfastamentos() {
  const { empresaAtual } = useEmpresas();
  const queryClient = useQueryClient();
  const empresaId = empresaAtual?.id;
  const [filtros, setFiltros] = useState<any>({});

  const query = useQuery({
    queryKey: ['afastamentos', empresaId, filtros],
    queryFn: async () => {
      return await afastamentoService.listar(empresaId, filtros);
    },
    enabled: !!empresaId,
  });

  const configsQuery = useQuery({
    queryKey: ['afastamentos-configs'],
    queryFn: async () => {
      return await afastamentoService.listarConfiguracoes();
    },
  });

  const criarMutation = useMutation({
    mutationFn: async (data: any) => {
      return await afastamentoService.criar({ ...data, empresa_id: empresaId });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['afastamentos'] });
      auditLogger.log({
        tabela: 'afastamentos',
        registro_id: data.id,
        acao: 'INSERT',
        dados_novos: data
      });
      toast.success('Afastamento registrado com sucesso');
    },
    onError: (err: Error) => toast.error(`Erro ao registrar: ${err.message}`),
  });

  const atualizarMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await afastamentoService.atualizar(id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['afastamentos'] });
      auditLogger.log({
        tabela: 'afastamentos',
        registro_id: variables.id,
        acao: 'UPDATE',
        dados_novos: variables.data
      });
      toast.success('Afastamento atualizado com sucesso');
    },
    onError: (err: Error) => toast.error(`Erro ao atualizar: ${err.message}`),
  });

  const excluirMutation = useMutation({
    mutationFn: async (id: string) => {
      return await afastamentoService.excluir(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['afastamentos'] });
      auditLogger.log({
        tabela: 'afastamentos',
        registro_id: id,
        acao: 'DELETE'
      });
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

export function useProrrogacoesAfastamento(afastamentoId?: string) {
  const queryClient = useQueryClient();
  const { empresaAtual } = useEmpresas();

  const query = useQuery({
    queryKey: ['prorrogacoes-afastamento', empresaAtual?.id, afastamentoId],
    queryFn: async () => {
      return await afastamentoService.listarProrrogacoes(afastamentoId);
    },
    enabled: !!empresaAtual?.id,
  });

  const criarMutation = useMutation({
    mutationFn: async (data: any) => {
      return await afastamentoService.criarProrrogacao(data);
    },
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
    queryFn: async () => {
      return await afastamentoService.listarDocumentos(afastamentoId!);
    },
    enabled: !!afastamentoId,
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, tipo }: { file: File; tipo: string }) => {
      return await afastamentoService.uploadDocumento(afastamentoId!, file, tipo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos-afastamento', afastamentoId] });
      toast.success('Documento enviado com sucesso');
    },
    onError: (err: Error) => toast.error(`Erro ao enviar documento: ${err.message}`),
  });

  const excluirMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await afastamentoService.excluir(id); // Using service delete for general deletion is common but usually documents have specific ones, service check needed if specialized
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
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
