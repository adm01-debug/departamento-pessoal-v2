
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Remove jobs antigos se existirem (idempotência)
DO $$
BEGIN
  PERFORM cron.unschedule('cleanup-security-logs-daily') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'cleanup-security-logs-daily');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  PERFORM cron.unschedule('cleanup-govbr-states-daily') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'cleanup-govbr-states-daily');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  PERFORM cron.unschedule('cleanup-logs-sistema-daily') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'cleanup-logs-sistema-daily');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Agendamentos
SELECT cron.schedule(
  'cleanup-security-logs-daily',
  '0 3 * * *',
  $$ SELECT public.cleanup_security_logs(); $$
);

SELECT cron.schedule(
  'cleanup-govbr-states-daily',
  '15 3 * * *',
  $$ SELECT public.limpar_govbr_states_expirados(); $$
);

SELECT cron.schedule(
  'cleanup-logs-sistema-daily',
  '30 3 * * *',
  $$ SELECT public.fn_cleanup_old_logs(); $$
);
