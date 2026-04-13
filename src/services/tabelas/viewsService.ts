import { supabase } from '@/integrations/supabase/client';

export const viewsService = {
  alertasRH: async () => {
    const { data, error } = await supabase.from('vw_alertas_rh' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  kpiTurnover: async () => {
    const { data, error } = await supabase.from('vw_kpi_turnover' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  kpiAbsenteismo: async () => {
    const { data, error } = await supabase.from('vw_kpi_absenteismo' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  kpiBeneficiosCusto: async () => {
    const { data, error } = await supabase.from('vw_kpi_beneficios_custo' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  kpiPontoResumo: async () => {
    const { data, error } = await supabase.from('vw_kpi_ponto_resumo' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  bancoHorasSaldo: async () => {
    const { data, error } = await supabase.from('vw_banco_horas_saldo' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  feriasResumo: async () => {
    const { data, error } = await supabase.from('vw_ferias_resumo' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  faltasMensal: async () => {
    const { data, error } = await supabase.from('vw_faltas_mensal' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  cadastroIncompleto: async () => {
    const { data, error } = await supabase.from('vw_cadastro_incompleto' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  colaboradoresCompleto: async (limit = 100) => {
    const { data, error } = await supabase.from('vw_colaboradores_completo' as any).select('*').limit(limit);
    if (error) throw error;
    return data || [];
  },
  dashboardTime: async () => {
    const { data, error } = await supabase.from('vw_dashboard_time' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  batidasDia: async (data_ref: string) => {
    const { data, error } = await supabase.from('vw_batidas_dia' as any).select('*').eq('data', data_ref);
    if (error) throw error;
    return data || [];
  },
  batidasResumo: async () => {
    const { data, error } = await supabase.from('vw_batidas_resumo' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  folhaPontoMensal: async () => {
    const { data, error } = await supabase.from('vw_folha_ponto_mensal' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  alertasCompensacao: async () => {
    const { data, error } = await supabase.from('vw_alertas_compensacao' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  saldoCompensacaoMensal: async () => {
    const { data, error } = await supabase.from('vw_saldo_compensacao_mensal' as any).select('*');
    if (error) throw error;
    return data || [];
  },
};
