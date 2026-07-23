
CREATE INDEX IF NOT EXISTS idx_ferias_reconciliacao_logs_empresa_executado
  ON public.ferias_reconciliacao_logs (empresa_id, executado_em DESC);

CREATE INDEX IF NOT EXISTS idx_ferias_reconciliacao_logs_pendencias
  ON public.ferias_reconciliacao_logs (empresa_id, executado_em DESC)
  WHERE restantes > 0;

CREATE OR REPLACE FUNCTION public.purgar_ferias_reconciliacao_logs_antigos()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted integer;
BEGIN
  DELETE FROM public.ferias_reconciliacao_logs
  WHERE executado_em < now() - interval '90 days';
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;

REVOKE ALL ON FUNCTION public.purgar_ferias_reconciliacao_logs_antigos() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.purgar_ferias_reconciliacao_logs_antigos() FROM anon;
REVOKE ALL ON FUNCTION public.purgar_ferias_reconciliacao_logs_antigos() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.purgar_ferias_reconciliacao_logs_antigos() TO service_role;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purgar_ferias_reconciliacao_logs_diario') THEN
    PERFORM cron.unschedule('purgar_ferias_reconciliacao_logs_diario');
  END IF;
  PERFORM cron.schedule(
    'purgar_ferias_reconciliacao_logs_diario',
    '15 7 * * *',
    'SELECT public.purgar_ferias_reconciliacao_logs_antigos();'
  );
END $$;
