import { supabase } from '@/integrations/supabase/client';

export const pontoAbertoService = {
  async listar(empresaId?: string) {
    let query = supabase.from('pontos_abertos').select('*');
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
};
