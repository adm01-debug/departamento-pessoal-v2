import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { colaboradorService } from '@/services';
import { useEmpresas } from './useEmpresas';
import { toast } from 'sonner';
import { useState } from 'react';

export function useColaboradores() {
  const { empresaAtual } = useEmpresas();
  const queryClient = useQueryClient();
  const empresaId = empresaAtual?.id;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [departamento, setDepartamento] = useState('all');
  const [cargo, setCargo] = useState('all');

  const query = useQuery({
    queryKey: ['colaboradores', { empresaId, search, page, pageSize, status, departamento, cargo }],
    queryFn: async () => {
      return await colaboradorService.listar({ 
        empresaId, 
        search, 
        page, 
        pageSize, 
        status, 
        departamento, 
        cargo 
      });
    },
    enabled: true,
  });

  const criarMutation = useMutation({
    mutationFn: async (data: any) => {
      return await colaboradorService.criar({ ...data, empresa_id: empresaId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colaboradores'] });
      toast.success('Colaborador criado com sucesso');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const atualizarMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await colaboradorService.atualizar(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colaboradores'] });
      toast.success('Colaborador atualizado');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const excluirMutation = useMutation({
    mutationFn: async (id: string) => {
      return await colaboradorService.excluir(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colaboradores'] });
      toast.success('Colaborador excluído');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    colaboradores: query.data?.data || [],
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
    status,
    setStatus,
    departamento,
    setDepartamento,
    cargo,
    setCargo,
    criar: criarMutation.mutateAsync,
    atualizar: atualizarMutation.mutateAsync,
    excluir: excluirMutation.mutateAsync,
    refetch: query.refetch,
  };
}
