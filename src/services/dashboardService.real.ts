// V17-S054: DashboardService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export const dashboardServiceReal = {
  async getResumo(empresaId: string) { const { data: cols } = await supabase.from('colaboradores').select('id, status').eq('empresa_id', empresaId); const ativos = cols?.filter(c => c.status === 'ativo').length || 0; return { totalColaboradores: cols?.length || 0, ativos, afastados: 0, ferias: 0 }; },
  async getCustoFolha(empresaId: string, competencia: string) { const { data } = await supabase.from('folhas_pagamento').select('total_bruto, total_liquido').eq('empresa_id', empresaId).eq('competencia', competencia).single(); return data || { total_bruto: 0, total_liquido: 0 }; },
  async getIndicadores(empresaId: string) { return { turnover: 0, absenteismo: 0, custoMedio: 0 }; }
};
export default dashboardServiceReal;
