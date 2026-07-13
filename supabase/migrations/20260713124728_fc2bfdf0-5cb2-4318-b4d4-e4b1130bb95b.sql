
-- Melhoria #24: Agendamento mensal de purge do audit_log

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Função interna sem o guard de admin (só invocável pelo cron/service_role)
CREATE OR REPLACE FUNCTION public._purge_audit_log_internal(_dias integer DEFAULT 365)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _deleted integer;
BEGIN
  IF _dias < 30 THEN
    RAISE EXCEPTION 'Retenção mínima de 30 dias';
  END IF;

  WITH del AS (
    DELETE FROM public.audit_log
    WHERE created_at < now() - (_dias || ' days')::interval
    RETURNING 1
  )
  SELECT count(*) INTO _deleted FROM del;

  -- Registra a execução no próprio audit_log para observabilidade
  INSERT INTO public.audit_log (tabela, registro_id, acao, user_id, dados_novos)
  VALUES ('audit_log', gen_random_uuid(), 'AUTO_PURGE', NULL,
          jsonb_build_object('deleted', _deleted, 'retention_days', _dias, 'at', now()));

  RETURN _deleted;
END;
$$;

REVOKE ALL ON FUNCTION public._purge_audit_log_internal(integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public._purge_audit_log_internal(integer) TO service_role;

-- Desagenda job anterior (se existir) e reagenda idempotente
DO $$
BEGIN
  PERFORM cron.unschedule('audit_log_monthly_purge')
  WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'audit_log_monthly_purge');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

SELECT cron.schedule(
  'audit_log_monthly_purge',
  '0 3 1 * *',  -- dia 1 do mês, 03:00 UTC
  $$ SELECT public._purge_audit_log_internal(365); $$
);
