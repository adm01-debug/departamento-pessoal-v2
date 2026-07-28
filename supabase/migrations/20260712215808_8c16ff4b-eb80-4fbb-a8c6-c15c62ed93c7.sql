
-- Função utilitária para purgar conflitos de lock antigos
CREATE OR REPLACE FUNCTION public.purge_old_lock_conflicts()
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_removed integer;
BEGIN
  DELETE FROM public.folha_lock_conflicts WHERE created_at < now() - interval '90 days';
  GET DIAGNOSTICS v_removed = ROW_COUNT;
  RETURN v_removed;
END $$;
REVOKE ALL ON FUNCTION public.purge_old_lock_conflicts() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.purge_old_lock_conflicts() TO service_role;

-- Função para purgar bloqueios de IP e tentativas geo antigas
CREATE OR REPLACE FUNCTION public.purge_expired_security_data()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_ips int; v_geo int;
BEGIN
  DELETE FROM public.blocked_ips WHERE expires_at IS NOT NULL AND expires_at < now() AND permanent = false;
  GET DIAGNOSTICS v_ips = ROW_COUNT;
  DELETE FROM public.geo_blocked_attempts WHERE created_at < now() - interval '90 days';
  GET DIAGNOSTICS v_geo = ROW_COUNT;
  RETURN jsonb_build_object('ips_removed', v_ips, 'geo_removed', v_geo);
END $$;
REVOKE ALL ON FUNCTION public.purge_expired_security_data() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.purge_expired_security_data() TO service_role;

-- Função para consumir fila LGPD
CREATE OR REPLACE FUNCTION public.process_lgpd_cleanup_queue()
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_processed integer := 0;
BEGIN
  -- Marca como processado o que passou do prazo de retenção
  UPDATE public.lgpd_fila_limpeza
     SET status = 'processado', processado_em = now()
   WHERE status = 'pendente'
     AND data_prevista_limpeza <= now();
  GET DIAGNOSTICS v_processed = ROW_COUNT;
  RETURN v_processed;
END $$;
REVOKE ALL ON FUNCTION public.process_lgpd_cleanup_queue() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.process_lgpd_cleanup_queue() TO service_role;

-- Unschedule anteriores (idempotência)
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT jobname FROM cron.job WHERE jobname IN (
    'purge-idempotency-daily','cleanup-logs-daily','cleanup-rate-limits-daily',
    'purge-lock-conflicts-daily','purge-security-data-daily','check-idempotency-anomalies',
    'lgpd-cleanup-daily'
  ) LOOP
    PERFORM cron.unschedule(r.jobname);
  END LOOP;
END $$;

SELECT cron.schedule('purge-idempotency-daily',      '0 3 * * *',   $$SELECT public.purge_expired_idempotency_keys();$$);
SELECT cron.schedule('cleanup-logs-daily',           '15 3 * * *',  $$SELECT public.fn_cleanup_old_logs();$$);
SELECT cron.schedule('cleanup-rate-limits-daily',    '30 3 * * *',  $$SELECT public.cleanup_security_logs();$$);
SELECT cron.schedule('purge-lock-conflicts-daily',   '45 3 * * *',  $$SELECT public.purge_old_lock_conflicts();$$);
SELECT cron.schedule('purge-security-data-daily',    '0 4 * * *',   $$SELECT public.purge_expired_security_data();$$);
SELECT cron.schedule('lgpd-cleanup-daily',           '15 4 * * *',  $$SELECT public.process_lgpd_cleanup_queue();$$);
SELECT cron.schedule('check-idempotency-anomalies',  '*/15 * * * *',$$SELECT public.check_idempotency_anomalies();$$);
