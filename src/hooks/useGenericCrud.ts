import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ListOptions, ListResponse } from '@/services/baseService';

interface ServiceInterface<T> {
  listar(options: ListOptions): Promise<ListResponse<T>>;
  criar(data: any): Promise<T>;
  atualizar(id: string, data: any): Promise<T>;
  excluir(id: string): Promise<void>;
}

interface UseGenericCrudOptions<T> {
  queryKey: string;
  service: ServiceInterface<T>;
  initialPageSize?: number;
  successMessages?: {
    create?: string;
    update?: string;
    delete?: string;
  };
  filters?: Record<string, any>;
  searchColumn?: string;
}

export function useGenericCrud<T>({
  queryKey,
  service,
  initialPageSize = 10,
  successMessages = {},
  filters = {},
  searchColumn
}: UseGenericCrudOptions<T>) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState('');

  // Reset page on search change
  useEffect(() => {
    setPage(1);
  }, [search]);

  const query = useQuery({
    queryKey: [queryKey, { search, page, pageSize, filters }],
    queryFn: () => service.listar({ search, page, pageSize, filters, searchColumn }),
  });

  const criarMutation = useMutation({
    mutationFn: (data: any) => service.criar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(successMessages.create || 'Registro criado com sucesso');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => service.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(successMessages.update || 'Registro atualizado com sucesso');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => service.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(successMessages.delete || 'Registro excluído com sucesso');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    items: query.data?.data || [],
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
    isCreating: criarMutation.isPending,
    isUpdating: atualizarMutation.isPending,
    isDeleting: excluirMutation.isPending,
    query
  };
}

