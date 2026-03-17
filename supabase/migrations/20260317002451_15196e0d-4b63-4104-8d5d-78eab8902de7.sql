
-- Corrigir Security Definer Views — converter para SECURITY INVOKER
-- Postgres 15+ views são SECURITY INVOKER por padrão, mas precisamos explicitamente definir

ALTER VIEW public.vw_dashboard_time SET (security_invoker = true);
ALTER VIEW public.vw_colaboradores_completo SET (security_invoker = true);
ALTER VIEW public.vw_alertas_rh SET (security_invoker = true);
ALTER VIEW public.vw_kpi_turnover SET (security_invoker = true);
ALTER VIEW public.vw_kpi_absenteismo SET (security_invoker = true);
ALTER VIEW public.vw_banco_horas_saldo SET (security_invoker = true);
ALTER VIEW public.vw_cadastro_incompleto SET (security_invoker = true);
ALTER VIEW public.vw_batidas_dia SET (security_invoker = true);
ALTER VIEW public.vw_ferias_resumo SET (security_invoker = true);
ALTER VIEW public.vw_faltas_mensal SET (security_invoker = true);
ALTER VIEW public.vw_kpi_ponto_resumo SET (security_invoker = true);
ALTER VIEW public.vw_kpi_beneficios_custo SET (security_invoker = true);
ALTER VIEW public.vw_folha_ponto_mensal SET (security_invoker = true);

-- Verificar se existe a view pontos_abertos e corrigir também
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = 'pontos_abertos') THEN
    EXECUTE 'ALTER VIEW public.pontos_abertos SET (security_invoker = true)';
  END IF;
END$$;
