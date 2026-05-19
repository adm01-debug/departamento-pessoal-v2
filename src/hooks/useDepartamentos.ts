import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departamentoService } from '@/services/departamentoService';
import { toast } from 'sonner';
import { useState } from 'react';

export function useDepartamentos() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  const query = useQuery({
    queryKey: ['departamentos', { search, page, pageSize }],
    queryFn: () => departamentoService.listar({ search, page, pageSize }),
  });

  const criarMutation = useMutation({
    mutationFn: (data: any) => departamentoService.criar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departamentos'] });
      toast.success('Departamento criado');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => departamentoService.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departamentos'] });
      toast.success('Departamento atualizado');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => departamentoService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departamentos'] });
      toast.success('Departamento excluído');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    departamentos: query.data?.data || [],
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
