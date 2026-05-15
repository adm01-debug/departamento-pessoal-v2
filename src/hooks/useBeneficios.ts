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
      const res = await beneficioService.list(empresaId);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
    enabled: !!empresaId,
  });

  const resumoQuery = useQuery({
    queryKey: ['beneficios-resumo', empresaId],
    queryFn: async () => {
      const res = await beneficioService.obterResumoCustos(empresaId!);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
    enabled: !!empresaId,
  });

  const criarBeneficio = useMutation({
    mutationFn: async (dados: any) => {
      const res = await beneficioService.criar({ ...dados, empresa_id: empresaId });
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
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
      const res = await beneficioService.atualizar(id, dados);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['beneficios', empresaId] });
      qc.invalidateQueries({ queryKey: ['beneficios-resumo', empresaId] });
      toast.success('Benefício atualizado!');
    },
  });

  const excluirBeneficio = useMutation({
    mutationFn: async (id: string) => {
      const res = await beneficioService.excluir(id);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
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

