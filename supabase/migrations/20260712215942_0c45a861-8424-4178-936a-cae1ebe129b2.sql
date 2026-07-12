
-- ============================================================================
-- PARTE 1: Query Telemetry Dashboard
-- ============================================================================
CREATE OR REPLACE VIEW public.v_slow_queries_top50
WITH (security_invoker = true) AS
SELECT
  substring(pss.query, 1, 500) AS query_sample,
  pss.calls,
  round(pss.mean_exec_time::numeric, 2)  AS mean_ms,
  round(pss.max_exec_time::numeric, 2)   AS max_ms,
  round(pss.total_exec_time::numeric, 2) AS total_ms,
  round((pss.stddev_exec_time)::numeric, 2) AS stddev_ms,
  pss.rows,
  round((pss.shared_blks_hit::numeric / NULLIF(pss.shared_blks_hit + pss.shared_blks_read, 0)) * 100, 2) AS cache_hit_pct
FROM pg_stat_statements pss
WHERE pss.query NOT ILIKE '%pg_stat_statements%'
  AND pss.query NOT ILIKE '%pg_catalog%'
ORDER BY pss.total_exec_time DESC
LIMIT 50;

REVOKE ALL ON public.v_slow_queries_top50 FROM PUBLIC, anon;
GRANT SELECT ON public.v_slow_queries_top50 TO authenticated;

CREATE OR REPLACE FUNCTION public.get_query_telemetry(_limit integer DEFAULT 20)
RETURNS TABLE(query_sample text, calls bigint, mean_ms numeric, max_ms numeric, total_ms numeric, cache_hit_pct numeric)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT v.query_sample, v.calls, v.mean_ms, v.max_ms, v.total_ms, v.cache_hit_pct
  FROM public.v_slow_queries_top50 v
  WHERE public.has_role(auth.uid(), 'admin'::app_role)
  LIMIT _limit;
$$;
REVOKE ALL ON FUNCTION public.get_query_telemetry(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_query_telemetry(integer) TO authenticated;

-- ============================================================================
-- PARTE 2: DLQ Pattern em fila_processamento
-- ============================================================================
ALTER TABLE public.fila_processamento
  ADD COLUMN IF NOT EXISTS tentativas integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_tentativas integer NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS proxima_tentativa_em timestamptz,
  ADD COLUMN IF NOT EXISTS dlq boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS dlq_movido_em timestamptz,
  ADD COLUMN IF NOT EXISTS ultimo_erro text;

CREATE INDEX IF NOT EXISTS idx_fila_ready_to_process
  ON public.fila_processamento (created_at)
  WHERE status = 'pending' AND dlq = false;

CREATE INDEX IF NOT EXISTS idx_fila_dlq
  ON public.fila_processamento (dlq_movido_em DESC)
  WHERE dlq = true;

CREATE OR REPLACE FUNCTION public.fn_fila_dlq_check()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  -- Ao falhar, incrementa tentativa e agenda backoff exponencial (2^n minutos, cap 60min)
  IF NEW.status = 'failed' AND OLD.status <> 'failed' THEN
    NEW.tentativas := COALESCE(OLD.tentativas, 0) + 1;
    NEW.ultimo_erro := COALESCE(NEW.erro_log, OLD.erro_log);

    IF NEW.tentativas >= NEW.max_tentativas THEN
      NEW.dlq := true;
      NEW.dlq_movido_em := now();
    ELSE
      -- Backoff exponencial: 2, 4, 8, 16, 32 minutos (cap 60)
      NEW.proxima_tentativa_em := now() + make_interval(mins => LEAST(power(2, NEW.tentativas)::int, 60));
      NEW.status := 'pending'; -- volta pra fila
    END IF;
  END IF;
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.fn_fila_dlq_check() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.fn_fila_dlq_check() TO service_role;

DROP TRIGGER IF EXISTS trg_fila_dlq_check ON public.fila_processamento;
CREATE TRIGGER trg_fila_dlq_check
  BEFORE UPDATE ON public.fila_processamento
  FOR EACH ROW EXECUTE FUNCTION public.fn_fila_dlq_check();

-- Função de estatísticas DLQ
CREATE OR REPLACE FUNCTION public.get_dlq_stats()
RETURNS TABLE(tipo_tarefa text, total_dlq bigint, mais_recente timestamptz, ultimo_erro_sample text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT f.tipo_tarefa,
         count(*)::bigint,
         max(f.dlq_movido_em),
         substring(max(f.ultimo_erro), 1, 200)
  FROM public.fila_processamento f
  WHERE f.dlq = true
    AND public.has_role(auth.uid(), 'admin'::app_role)
  GROUP BY f.tipo_tarefa
  ORDER BY count(*) DESC;
$$;
REVOKE ALL ON FUNCTION public.get_dlq_stats() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_dlq_stats() TO authenticated;
