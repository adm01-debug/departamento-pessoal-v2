import { useQuery } from '@tanstack/react-query';
import { beneficioService } from '@/services/beneficioService';
import { useEmpresas } from './useEmpresas';
import { useGenericCrud } from './useGenericCrud';

export function useBeneficios() {
  const { empresaAtual } = useEmpresas();
  const empresaId = empresaAtual?.id;

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
    criarBeneficio: { 
      mutateAsync: (data: any) => crud.criar(data), 
      mutate: (data: any) => crud.criar(data), 
      isPending: crud.isCreating 
    } as any,
    atualizarBeneficio: { 
      mutateAsync: (args: any) => crud.atualizar(args.id, args.dados),
      isPending: crud.isUpdating 
    } as any,
    excluirBeneficio: { 
      mutateAsync: (id: string) => crud.excluir(id), 
      isPending: crud.isDeleting 
    } as any,
    tiposBeneficio: ['transporte', 'alimentacao', 'saude', 'vida', 'outros']
  };
}
