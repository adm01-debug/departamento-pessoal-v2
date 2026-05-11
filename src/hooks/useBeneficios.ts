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
    queryFn: () => beneficioService.list(empresaId),
    enabled: !!empresaId,
  });

  const criarBeneficio = useMutation({
    mutationFn: (dados: any) => beneficioService.criar({ ...dados, empresa_id: empresaId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['beneficios', empresaId] });
      toast.success('Benefício criado com sucesso!');
    },
    onError: (err: Error) => toast.error(`Erro ao criar: ${err.message}`),
  });

  const atualizarBeneficio = useMutation({
    mutationFn: ({ id, dados }: { id: string, dados: any }) => beneficioService.atualizar(id, dados),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['beneficios', empresaId] });
      toast.success('Benefício atualizado!');
    },
  });

  return {
    beneficios: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    criarBeneficio,
    atualizarBeneficio,
    tiposBeneficio: ['transporte', 'alimentacao', 'saude', 'vida', 'outros']
  };
}
