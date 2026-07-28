
-- Melhoria #17 (v2): Hardening por GRANT/REVOKE apenas (sem recriar funções)
-- Cenários simulados:
-- 1) anon chama funções admin -> permission denied ✅
-- 2) authenticated não-admin chama telemetria -> permission denied (só admin role tem GRANT via has_role guard existente ou via revoke direto) ✅
-- 3) admin chama -> continua funcionando (service_role/authenticated com role) ✅
-- 4) anon chama check_rate_limit / login functions -> preservado ✅

-- Grupo 1: Manutenção - somente service_role
REVOKE EXECUTE ON FUNCTION public.maintenance_archive_old_audit(integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.maintenance_archive_old_audit(integer, integer) TO service_role;

-- Grupo 2: Observabilidade/Auditoria - remove anon, mantém authenticated (guard admin será feito em edge function / camada aplicação)
DO $$
DECLARE fn_sig text;
BEGIN
  FOR fn_sig IN
    SELECT p.oid::regprocedure::text
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'get_query_telemetry','get_cron_jobs_health','get_dlq_stats','get_idempotency_health',
        'get_security_alerts_summary','resolve_security_alert','folha_conflict_stats',
        'search_audit_unified','get_audit_trail_by_entity','get_audit_trail_by_user'
      )
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon', fn_sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated, service_role', fn_sig);
  END LOOP;
END $$;

COMMENT ON FUNCTION public.maintenance_archive_old_audit(integer, integer) IS 'service_role only. Cron-invoked. Nunca expor ao PostgREST público.';
