import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { empresaService } from '@/services';
import { toast } from 'sonner';
import { useState } from 'react';

export function useTodasEmpresas() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [search, setSearch] = useState('');

  const query = useQuery({
    queryKey: ['todas-empresas-list', { search, page, pageSize }],
    queryFn: () => empresaService.list({ search, page, pageSize }),
  });

  const criarMutation = useMutation({
    mutationFn: (data: any) => empresaService.criar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todas-empresas-list'] });
      toast.success('Empresa criada');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => empresaService.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todas-empresas-list'] });
      toast.success('Empresa atualizada');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => empresaService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todas-empresas-list'] });
      toast.success('Empresa excluída');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    empresas: query.data?.data || [],
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
