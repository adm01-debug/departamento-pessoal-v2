
CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
DECLARE
  v_jobid BIGINT;
BEGIN
  SELECT jobid INTO v_jobid FROM cron.job WHERE jobname = 'purge_expired_idempotency_keys_daily';
  IF v_jobid IS NOT NULL THEN
    PERFORM cron.unschedule(v_jobid);
  END IF;
END $$;

SELECT cron.schedule(
  'purge_expired_idempotency_keys_daily',
  '15 3 * * *',
  $$SELECT public.purge_expired_idempotency_keys();$$
);
