
-- Hardening #17: remover grants residuais de authenticated/anon em funções privilegiadas
REVOKE EXECUTE ON FUNCTION public.check_login_lock(text, text)              FROM authenticated, anon;
REVOKE EXECUTE ON FUNCTION public.record_failed_login(text, text)           FROM authenticated, anon;
REVOKE EXECUTE ON FUNCTION public.purge_expired_idempotency_keys()          FROM authenticated, anon;
REVOKE EXECUTE ON FUNCTION public.check_idempotency_anomalies()             FROM authenticated, anon;

-- Garante service_role explícito (owner do pg_cron)
GRANT  EXECUTE ON FUNCTION public.check_login_lock(text, text)              TO service_role;
GRANT  EXECUTE ON FUNCTION public.record_failed_login(text, text)           TO service_role;
GRANT  EXECUTE ON FUNCTION public.purge_expired_idempotency_keys()          TO service_role;
GRANT  EXECUTE ON FUNCTION public.check_idempotency_anomalies()             TO service_role;
