import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ListOptions, ListResponse } from '@/services/baseService';
import { loggerService } from '@/services/loggerService';

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
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Reset page on search or filter change
  useEffect(() => {
    setPage(1);
  }, [search, JSON.stringify(filters)]);

  const query = useQuery({
    queryKey: [queryKey, { search, page, pageSize, filters }],
    queryFn: async () => {
      try {
        const result = await service.listar({ search, page, pageSize, filters, searchColumn });
        return result;
      } catch (e) {
        loggerService.error(`Error fetching ${queryKey}`, { filters, search, page }, e as Error);
        throw e;
      }
    },
  });

  const criarMutation = useMutation({
    mutationFn: (data: any) => service.criar(data),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(successMessages.create || 'Registro criado com sucesso');
      loggerService.info(`${queryKey} created`, { id: (data as any)?.id });
    },
    onError: (err: Error) => {
      loggerService.error(`Failed to create ${queryKey}`, {}, err);
      toast.error(err.message);
    },
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => service.atualizar(id, data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(successMessages.update || 'Registro atualizado com sucesso');
      loggerService.info(`${queryKey} updated`, { id: variables.id });
    },
    onError: (err: Error) => {
      loggerService.error(`Failed to update ${queryKey}`, {}, err);
      toast.error(err.message);
    },
  });

  const excluirMutation = useMutation({
    mutationFn: (id: string) => service.excluir(id),
    onSuccess: (_, id) => {
      void queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(successMessages.delete || 'Registro excluído com sucesso');
      loggerService.info(`${queryKey} deleted`, { id });
    },
    onError: (err: Error) => {
      loggerService.error(`Failed to delete ${queryKey}`, {}, err);
      toast.error(err.message);
    },
  });

  const refetch = useCallback(() => {
    void query.refetch();
  }, [query]);

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
    refetch,
    isRefreshing,
    isCreating: criarMutation.isPending,
    isUpdating: atualizarMutation.isPending,
    isDeleting: excluirMutation.isPending,
    query
  };
}


