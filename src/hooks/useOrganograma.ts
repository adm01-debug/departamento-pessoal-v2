import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresas } from './useEmpresas';

export function useOrganograma() {
  const { empresaAtual } = useEmpresas();
  const empresaId = empresaAtual?.id;

  const query = useQuery({
    queryKey: ['organograma_hierarquico', empresaId],
    enabled: !!empresaId,
    queryFn: async () => {
      if (!empresaId) return [];
      const { data: deps, error: depsError } = await supabase
        .from('departamentos')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('nome');

      if (depsError) throw depsError;

      const { data: cols, error: colsError } = await supabase
        .from('colaboradores')
        .select('id, nome_completo, departamento, email, foto_url')
        .eq('empresa_id', empresaId)
        .eq('status', 'ativo' as any);

      if (colsError) throw colsError;

      const departamentosMap = new Map();
      const rootDepartamentos: any[] = [];

      deps?.forEach(d => {
        departamentosMap.set(d.id, {
          ...d,
          colaboradores: cols?.filter(c => c.departamento === d.nome) || [],
          sub_departamentos: []
        });
      });

      departamentosMap.forEach(d => {
        if (d.departamento_pai_id && departamentosMap.has(d.departamento_pai_id)) {
          departamentosMap.get(d.departamento_pai_id).sub_departamentos.push(d);
        } else {
          rootDepartamentos.push(d);
        }
      });

      return rootDepartamentos;
    }
  });

  return {
    dados: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
}
