
-- Função de detecção de anomalias em idempotência (roda a cada hora via cron)
CREATE OR REPLACE FUNCTION public.check_idempotency_anomalies()
RETURNS TABLE (endpoint TEXT, severity TEXT, reason TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r RECORD;
  v_stuck_count INTEGER;
BEGIN
  -- 1) Endpoints com taxa de falha > 5% nas últimas 24h (mínimo 10 chamadas para relevância estatística)
  FOR r IN
    SELECT
      m.endpoint,
      m.total_24h,
      m.failed_24h,
      m.failure_rate_pct_24h
    FROM public.v_idempotency_metrics m
    WHERE m.total_24h >= 10
      AND m.failure_rate_pct_24h > 5
  LOOP
    -- Deduplica: só cria alerta se não houver alerta ativo (não resolvido) na última hora
    IF NOT EXISTS (
      SELECT 1 FROM public.security_alerts
      WHERE type = 'IDEMPOTENCY_HIGH_FAILURE'
        AND details->>'endpoint' = r.endpoint
        AND resolved = false
        AND created_at > now() - interval '1 hour'
    ) THEN
      INSERT INTO public.security_alerts (type, severity, details)
      VALUES (
        'IDEMPOTENCY_HIGH_FAILURE',
        CASE WHEN r.failure_rate_pct_24h > 20 THEN 'critical'
             WHEN r.failure_rate_pct_24h > 10 THEN 'high'
             ELSE 'medium' END,
        jsonb_build_object(
          'endpoint', r.endpoint,
          'failure_rate_pct', r.failure_rate_pct_24h,
          'total_24h', r.total_24h,
          'failed_24h', r.failed_24h,
          'detected_at', now()
        )
      );

      RETURN QUERY SELECT
        r.endpoint::TEXT,
        (CASE WHEN r.failure_rate_pct_24h > 20 THEN 'critical'
              WHEN r.failure_rate_pct_24h > 10 THEN 'high'
              ELSE 'medium' END)::TEXT,
        format('Taxa de falha %s%% em %s chamadas', r.failure_rate_pct_24h, r.total_24h)::TEXT;
    END IF;
  END LOOP;

  -- 2) Chaves "pending" há mais de 10 minutos (possível travamento transacional)
  SELECT COUNT(*) INTO v_stuck_count
  FROM public.idempotency_keys
  WHERE status = 'pending'
    AND created_at < now() - interval '10 minutes'
    AND expires_at > now();

  IF v_stuck_count > 0 THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.security_alerts
      WHERE type = 'IDEMPOTENCY_STUCK_PENDING'
        AND resolved = false
        AND created_at > now() - interval '1 hour'
    ) THEN
      INSERT INTO public.security_alerts (type, severity, details)
      VALUES (
        'IDEMPOTENCY_STUCK_PENDING',
        CASE WHEN v_stuck_count > 20 THEN 'high' ELSE 'medium' END,
        jsonb_build_object(
          'stuck_count', v_stuck_count,
          'threshold_minutes', 10,
          'detected_at', now()
        )
      );

      RETURN QUERY SELECT
        'multiple'::TEXT,
        (CASE WHEN v_stuck_count > 20 THEN 'high' ELSE 'medium' END)::TEXT,
        format('%s chamadas idempotentes travadas em pending > 10min', v_stuck_count)::TEXT;
    END IF;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.check_idempotency_anomalies() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_idempotency_anomalies() TO service_role;

-- Agenda execução horária
DO $$
DECLARE
  v_jobid BIGINT;
BEGIN
  SELECT jobid INTO v_jobid FROM cron.job WHERE jobname = 'check_idempotency_anomalies_hourly';
  IF v_jobid IS NOT NULL THEN
    PERFORM cron.unschedule(v_jobid);
  END IF;
END $$;

SELECT cron.schedule(
  'check_idempotency_anomalies_hourly',
  '5 * * * *',
  $$SELECT public.check_idempotency_anomalies();$$
);
