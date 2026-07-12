
-- Melhoria 33: Automação de manutenção via pg_cron
-- Agenda 7 jobs periódicos para higienização e observabilidade
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Idempotente: remove jobs existentes antes de recriar
DO $$
DECLARE j text;
BEGIN
  FOR j IN SELECT jobname FROM cron.job WHERE jobname IN (
    'lovable-purge-idempotency-keys',
    'lovable-purge-lock-conflicts',
    'lovable-purge-security-data',
    'lovable-cleanup-security-logs',
    'lovable-lgpd-cleanup-queue',
    'lovable-check-idempotency-anomalies',
    'lovable-ia-provisao-alertas'
  ) LOOP
    PERFORM cron.unschedule(j);
  END LOOP;
END $$;

-- A cada 15 minutos: limpar chaves de idempotência expiradas
SELECT cron.schedule('lovable-purge-idempotency-keys', '*/15 * * * *',
  $$ SELECT public.purge_expired_idempotency_keys(); $$);

-- Diário 03:15: remover conflitos de lock > 90 dias
SELECT cron.schedule('lovable-purge-lock-conflicts', '15 3 * * *',
  $$ SELECT public.purge_old_lock_conflicts(); $$);

-- A cada hora: expirar IPs bloqueados + geo attempts antigos
SELECT cron.schedule('lovable-purge-security-data', '0 * * * *',
  $$ SELECT public.purge_expired_security_data(); $$);

-- A cada 6h: limpar login_rate_limits > 24h
SELECT cron.schedule('lovable-cleanup-security-logs', '0 */6 * * *',
  $$ SELECT public.cleanup_security_logs(); $$);

-- Diário 02:00: processar fila LGPD de retenção
SELECT cron.schedule('lovable-lgpd-cleanup-queue', '0 2 * * *',
  $$ SELECT public.process_lgpd_cleanup_queue(); $$);

-- A cada 5 minutos: detectar anomalias de idempotência (alerta > 5% falha, stuck pending)
SELECT cron.schedule('lovable-check-idempotency-anomalies', '*/5 * * * *',
  $$ SELECT public.check_idempotency_anomalies(); $$);

-- Diário 05:00: gerar alertas preditivos de provisão (férias em dobro, etc.)
SELECT cron.schedule('lovable-ia-provisao-alertas', '0 5 * * *',
  $$ SELECT public.gerar_alertas_preditivos_ia(); $$);
