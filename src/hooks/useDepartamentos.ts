import { useGenericCrud } from './useGenericCrud';
import { departamentoService } from '@/services/departamentoService';
import { Departamento } from '@/types/entities';

export function useDepartamentos() {
  const crud = useGenericCrud<Departamento>({
    queryKey: 'departamentos',
    service: departamentoService,
    initialPageSize: 10,
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
