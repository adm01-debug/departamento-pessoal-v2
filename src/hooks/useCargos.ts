import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cargoService } from '@/services/cargoService';
import { useEmpresas } from './useEmpresas';
import { toast } from 'sonner';
import { useState } from 'react';

export function useCargos() {
  const { empresaAtual } = useEmpresas();
  const queryClient = useQueryClient();
  const empresaId = empresaAtual?.id;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [search, setSearch] = useState('');

  const query = useQuery({
    queryKey: ['cargos', { empresaId, search, page, pageSize }],
    queryFn: () => cargoService.listar({ empresaId, search, page, pageSize }),
    enabled: true,
  });

  const criarMutation = useMutation({
    mutationFn: (data: any) => cargoService.criar({ ...data, empresa_id: empresaId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cargos'] });
      toast.success('Cargo criado');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => cargoService.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cargos'] });
      toast.success('Cargo atualizado');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => cargoService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cargos'] });
      toast.success('Cargo excluído');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    cargos: query.data?.data || [],
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    page,
    setPage,
    pageSize,
    setPageSize,
    search,
    setSearch,
    criar: criarMutation.mutateAsync,
    atualizar: atualizarMutation.mutateAsync,
    excluir: excluirMutation.mutateAsync,
    refetch: query.refetch,
  };
}
