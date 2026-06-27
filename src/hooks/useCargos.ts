import { useGenericCrud } from './useGenericCrud';
import { cargoService } from '@/services/cargoService';
import { useEmpresas } from './useEmpresas';
import { Cargo } from '@/types/entities';

export function useCargos() {
  const { empresaAtual } = useEmpresas();
  const empresaId = empresaAtual?.id;

  const crud = useGenericCrud<Cargo>({
    // Inclui empresaId na queryKey para evitar reuso de cache cross-tenant.
    queryKey: `cargos:${empresaId ?? 'none'}`,
    service: cargoService,
    initialPageSize: 15,
    filters: empresaId ? { empresa_id: empresaId } : {},
    successMessages: {
      create: 'Cargo criado com sucesso',
      update: 'Cargo atualizado',
      delete: 'Cargo excluído'
    }
  });

  return {
    ...crud,
    cargos: crud.items,
    criar: (data: any) => crud.criar({ ...data, empresa_id: empresaId }),
  };
}
