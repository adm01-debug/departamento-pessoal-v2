-- Melhoria #10: Retenção automatizada de logs de auditoria (>180 dias)
-- Move dados antigos para tabela de arquivo e purga da tabela quente

-- 1) Tabela de arquivo (mesma estrutura, sem índices pesados)
CREATE TABLE IF NOT EXISTS public.audit_log_unified_archive (
  LIKE public.audit_log_unified INCLUDING DEFAULTS INCLUDING CONSTRAINTS
);

GRANT SELECT ON public.audit_log_unified_archive TO authenticated;
GRANT ALL ON public.audit_log_unified_archive TO service_role;

ALTER TABLE public.audit_log_unified_archive ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins podem ler audit archive" ON public.audit_log_unified_archive;
CREATE POLICY "Admins podem ler audit archive"
  ON public.audit_log_unified_archive
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Append-only: bloquear UPDATE/DELETE (exceto pelo owner/service_role via SECURITY DEFINER)
DROP TRIGGER IF EXISTS trg_audit_archive_append_only ON public.audit_log_unified_archive;
CREATE TRIGGER trg_audit_archive_append_only
  BEFORE UPDATE OR DELETE ON public.audit_log_unified_archive
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_append_only();

-- Índice mínimo para consultas históricas por data/empresa
CREATE INDEX IF NOT EXISTS idx_audit_archive_occurred_at
  ON public.audit_log_unified_archive (occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_archive_empresa
  ON public.audit_log_unified_archive (empresa_id, occurred_at DESC);

-- 2) Função de retenção: arquiva + purga em lotes
CREATE OR REPLACE FUNCTION public.maintenance_archive_old_audit(_days INTEGER DEFAULT 180, _batch INTEGER DEFAULT 5000)
RETURNS TABLE(archived BIGINT, purged BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cutoff TIMESTAMPTZ := now() - make_interval(days => _days);
  v_archived BIGINT := 0;
  v_purged BIGINT := 0;
  v_ids UUID[];
BEGIN
  LOOP
    SELECT array_agg(id) INTO v_ids
    FROM (
      SELECT id FROM public.audit_log_unified
      WHERE occurred_at < v_cutoff
      ORDER BY occurred_at ASC
      LIMIT _batch
    ) s;

    EXIT WHEN v_ids IS NULL OR array_length(v_ids, 1) = 0;

    -- Arquiva (ignora conflitos, idempotente)
    WITH moved AS (
      INSERT INTO public.audit_log_unified_archive
      SELECT * FROM public.audit_log_unified WHERE id = ANY(v_ids)
      ON CONFLICT (id) DO NOTHING
      RETURNING 1
    )
    SELECT count(*) INTO v_archived FROM moved;

    -- Purga da tabela quente (bypass do trigger append-only via SECURITY DEFINER + session_replication_role)
    PERFORM set_config('session_replication_role', 'replica', true);
    DELETE FROM public.audit_log_unified WHERE id = ANY(v_ids);
    GET DIAGNOSTICS v_purged = ROW_COUNT;
    PERFORM set_config('session_replication_role', 'origin', true);

    -- Commit implícito por iteração via COMMIT não é possível em plpgsql aqui;
    -- lote pequeno mantém transação curta.
  END LOOP;

  RETURN QUERY SELECT v_archived, v_purged;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.maintenance_archive_old_audit(INTEGER, INTEGER) FROM anon, authenticated;

-- 3) Agendamento pg_cron: todo dia 03:00 UTC (00:00 São Paulo)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.unschedule(jobid) FROM cron.job WHERE jobname = 'lovable-audit-retention-daily';
    PERFORM cron.schedule(
      'lovable-audit-retention-daily',
      '0 3 * * *',
      $cron$ SELECT public.maintenance_archive_old_audit(180, 5000); $cron$
    );
  END IF;
END $$;

COMMENT ON FUNCTION public.maintenance_archive_old_audit IS
  'Arquiva logs de auditoria (audit_log_unified) mais antigos que N dias para a tabela _archive e purga da tabela quente. Executa em lotes.';