import { useEmpresas } from './useEmpresas';
import { useGenericCrud } from './useGenericCrud';
import { desligamentoService } from '@/services/desligamentoService';

export function useDesligamentos() {
  const { empresaAtual } = useEmpresas();
  const empresaId = empresaAtual?.id;

  const crud = useGenericCrud<any>({
    queryKey: 'desligamentos',
    service: desligamentoService,
    filters: { empresa_id: empresaId },
  });

  return {
    ...crud,
    desligamentos: crud.items,
  };
}
