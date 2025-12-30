/**
 * @fileoverview Hook para dados do dashboard
 * @module hooks/useDashboardData
 */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

export interface DashboardData {
  totalColaboradores: number;
  admissoesNoMes: number;
  desligamentosNoMes: number;
  feriasAtivas: number;
  afastamentosAtivos: number;
  aniversariantesDoMes: number;
  turnoverRate: number;
}

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboardData'],
    queryFn: async (): Promise<DashboardData> => {
      const hoje = new Date();
      const inicioMes = startOfMonth(hoje);
      const fimMes = endOfMonth(hoje);
      const mesAtual = format(hoje, 'MM');

      // Total de colaboradores ativos
      const { count: totalColaboradores } = await supabase
        .from('colaboradores')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ativo');

      // Admissões no mês
      const { count: admissoesNoMes } = await supabase
        .from('admissoes')
        .select('*', { count: 'exact', head: true })
        .gte('data_prevista', inicioMes.toISOString())
        .lte('data_prevista', fimMes.toISOString());

      // Desligamentos no mês
      const { count: desligamentosNoMes } = await supabase
        .from('desligamentos')
        .select('*', { count: 'exact', head: true })
        .gte('data_desligamento', inicioMes.toISOString())
        .lte('data_desligamento', fimMes.toISOString());

      // Férias ativas
      const { count: feriasAtivas } = await supabase
        .from('ferias')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'em_gozo');

      // Afastamentos ativos
      const { count: afastamentosAtivos } = await supabase
        .from('afastamentos')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ativo');

      // Aniversariantes do mês (query simplificada)
      const { data: aniversariantes } = await supabase
        .from('colaboradores')
        .select('data_nascimento')
        .eq('status', 'ativo');
      
      const aniversariantesDoMes = (aniversariantes || []).filter(c => {
        if (!c.data_nascimento) return false;
        return c.data_nascimento.substring(5, 7) === mesAtual;
      }).length;

      // Calcular turnover
      const total = totalColaboradores || 1;
      const turnoverRate = (((admissoesNoMes || 0) + (desligamentosNoMes || 0)) / 2 / total) * 100;

      return {
        totalColaboradores: totalColaboradores || 0,
        admissoesNoMes: admissoesNoMes || 0,
        desligamentosNoMes: desligamentosNoMes || 0,
        feriasAtivas: feriasAtivas || 0,
        afastamentosAtivos: afastamentosAtivos || 0,
        aniversariantesDoMes,
        turnoverRate: Math.round(turnoverRate * 100) / 100,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export default useDashboardData;
