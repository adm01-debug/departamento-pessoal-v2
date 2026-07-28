import { useEmpresas } from './useEmpresas';
import { useGenericCrud } from './useGenericCrud';
import { folhaService } from '@/services/folhaService';

export function useFolha(competencia?: string) {
  const { empresaAtual } = useEmpresas();
  const empresaId = empresaAtual?.id;

  const filters: Record<string, unknown> = { empresa_id: empresaId };
  if (competencia) filters.competencia = competencia;

  const crud = useGenericCrud<unknown>({
    queryKey: 'folhas',
    service: folhaService,
    filters,
    empresaId,
  });

  return {
    ...crud,
    folhas: crud.items,
  };
}
