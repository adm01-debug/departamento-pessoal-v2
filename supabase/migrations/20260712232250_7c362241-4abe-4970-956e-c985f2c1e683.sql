
-- Função de manutenção: ANALYZE em tabelas transacionais críticas
CREATE OR REPLACE FUNCTION public.maintenance_weekly_analyze()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  tables text[] := ARRAY[
    'registros_ponto',
    'batidas_ponto',
    'folhas_pagamento',
    'folha_itens',
    'colaboradores',
    'audit_log_unified',
    'notificacoes',
    'esocial_eventos'
  ];
  t text;
BEGIN
  FOREACH t IN ARRAY tables LOOP
    IF EXISTS (
      SELECT 1 FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relname = t AND c.relkind = 'r'
    ) THEN
      EXECUTE format('ANALYZE public.%I', t);
    END IF;
  END LOOP;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.maintenance_weekly_analyze() FROM anon, authenticated, PUBLIC;

-- Remove agendamento antigo (idempotência) e reagenda
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'weekly-analyze-critical-tables') THEN
    PERFORM cron.unschedule('weekly-analyze-critical-tables');
  END IF;
END $$;

SELECT cron.schedule(
  'weekly-analyze-critical-tables',
  '0 4 * * 0',   -- Domingo, 04:00 UTC (01:00 America/Sao_Paulo)
  $cron$ SELECT public.maintenance_weekly_analyze(); $cron$
);
