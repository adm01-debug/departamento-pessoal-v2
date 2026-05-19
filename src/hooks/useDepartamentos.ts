import { useGenericCrud } from './useGenericCrud';
import { departamentoService } from '@/services/departamentoService';
import { useEmpresas } from './useEmpresas';
import { Departamento } from '@/types/entities';

export function useDepartamentos() {
  const { empresaAtual } = useEmpresas();
  const empresaId = empresaAtual?.id;

  const crud = useGenericCrud<Departamento>({
    queryKey: 'departamentos',
    service: departamentoService,
    initialPageSize: 10,
    filters: empresaId ? { empresa_id: empresaId } : {},
    successMessages: {
      create: 'Departamento criado com sucesso',
      update: 'Departamento atualizado',
      delete: 'Departamento excluído'
    }
  });

  return {
    ...crud,
    departamentos: crud.items,
  };
}
