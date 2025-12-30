/**
 * @fileoverview Hook para organograma
 * @module hooks/useOrganograma
 */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface NoOrganograma {
  id: string;
  nome: string;
  cargo: string;
  departamento?: string;
  foto_url?: string;
  subordinados?: NoOrganograma[];
}

export function useOrganograma() {
  const { data: organograma = [], isLoading } = useQuery({
    queryKey: ['organograma'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('colaboradores')
        .select('id, nome, cargo, departamento, foto_url, gestor_id')
        .eq('status', 'ativo')
        .order('nome');
      
      if (error) throw error;
      
      // Montar árvore hierárquica
      const map = new Map<string, NoOrganograma>();
      const roots: NoOrganograma[] = [];
      
      data?.forEach(c => {
        map.set(c.id, { ...c, subordinados: [] });
      });
      
      data?.forEach(c => {
        const node = map.get(c.id)!;
        if (c.gestor_id && map.has(c.gestor_id)) {
          map.get(c.gestor_id)!.subordinados!.push(node);
        } else {
          roots.push(node);
        }
      });
      
      return roots;
    },
  });

  return { organograma, isLoading };
}

export default useOrganograma;
