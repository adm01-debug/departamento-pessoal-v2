import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { beneficioService } from '@/services/beneficioService';
import { useEmpresas } from './useEmpresas';
import { toast } from 'sonner';
import { useGenericCrud } from './useGenericCrud';

export function useBeneficios() {
  const { empresaAtual } = useEmpresas();
  const empresaId = empresaAtual?.id;
  const qc = useQueryClient();

  const crud = useGenericCrud<any>({
    queryKey: 'beneficios',
    service: beneficioService,
    filters: { empresa_id: empresaId },
  });

  const resumoQuery = useQuery({
    queryKey: ['beneficios-resumo', empresaId],
    queryFn: () => beneficioService.obterResumoCustos(empresaId!),
    enabled: !!empresaId,
  });

  return {
    ...crud,
    beneficios: crud.items,
    resumo: resumoQuery.data || {},
    isLoading: crud.isLoading || resumoQuery.isLoading,
    criarBeneficio: { mutateAsync: crud.criar, mutate: crud.criar, isPending: crud.isCreating },
    atualizarBeneficio: { mutateAsync: (args: { id: string, dados: any }) => crud.atualizar(args.id, args.dados), isPending: crud.isUpdating },

    excluirBeneficio: { mutateAsync: crud.excluir, isPending: crud.isDeleting },
    tiposBeneficio: ['transporte', 'alimentacao', 'saude', 'vida', 'outros']
  };
}


