-- Melhoria #47: Hardening final de funções SECURITY DEFINER
-- Revoga EXECUTE de authenticated/anon/PUBLIC em funções não chamadas pelo cliente.
-- Mantém apenas o whitelist realmente usado pelo frontend + helpers de auth (RLS).
DO $$
DECLARE
  r record;
  keep text[] := ARRAY[
    -- auth helpers usadas em RLS/policies
    'has_role','is_admin','get_user_roles','get_user_empresas',
    'get_user_default_empresa','get_user_scope_empresas',
    -- chamadas diretas via .rpc() no frontend
    'check_login_lock','record_failed_login','reset_login_attempts',
    'folha_conflict_stats','get_cron_jobs_health','get_dlq_stats',
    'get_idempotency_health','get_query_telemetry',
    'get_security_alerts_summary','processar_ajuste_aprovado',
    'resolve_security_alert'
  ];
BEGIN
  FOR r IN
    SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prosecdef = true
      AND NOT (p.proname = ANY(keep))
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION public.%I(%s) FROM PUBLIC, anon, authenticated;',
                   r.proname, r.args);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%I(%s) TO service_role;',
                   r.proname, r.args);
  END LOOP;
END $$;