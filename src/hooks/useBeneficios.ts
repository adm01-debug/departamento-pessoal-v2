import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { beneficioService } from '@/services';
import { useEmpresas } from './useEmpresas';
import { toast } from 'sonner';

export function useBeneficios() {
  const { empresaAtual } = useEmpresas();
  const empresaId = empresaAtual?.id;
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['beneficios', empresaId],
    queryFn: async () => {
      return await beneficioService.list(empresaId);
    },
    enabled: true,
  });

  const resumoQuery = useQuery({
    queryKey: ['beneficios-resumo', empresaId],
    queryFn: async () => {
      return await beneficioService.obterResumoCustos(empresaId!);
    },
    enabled: true,
  });

  const criarBeneficio = useMutation({
    mutationFn: async (dados: any) => {
      return await beneficioService.criar({ ...dados, empresa_id: empresaId });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['beneficios', empresaId] });
      qc.invalidateQueries({ queryKey: ['beneficios-resumo', empresaId] });
      toast.success('Benefício criado com sucesso!');
    },
    onError: (err: Error) => toast.error(`Erro ao criar: ${err.message}`),
  });

  const atualizarBeneficio = useMutation({
    mutationFn: async ({ id, dados }: { id: string, dados: any }) => {
      return await beneficioService.atualizar(id, dados);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['beneficios', empresaId] });
      qc.invalidateQueries({ queryKey: ['beneficios-resumo', empresaId] });
      toast.success('Benefício atualizado!');
    },
  });

  const excluirBeneficio = useMutation({
    mutationFn: async (id: string) => {
      return await beneficioService.excluir(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['beneficios', empresaId] });
      qc.invalidateQueries({ queryKey: ['beneficios-resumo', empresaId] });
      toast.success('Benefício excluído!');
    },
  });

  return {
    beneficios: query.data || [],
    resumo: resumoQuery.data || {},
    isLoading: query.isLoading || resumoQuery.isLoading,
    error: query.error,
    refetch: query.refetch,
    criarBeneficio,
    atualizarBeneficio,
    excluirBeneficio,
    tiposBeneficio: ['transporte', 'alimentacao', 'saude', 'vida', 'outros']
  };
}

