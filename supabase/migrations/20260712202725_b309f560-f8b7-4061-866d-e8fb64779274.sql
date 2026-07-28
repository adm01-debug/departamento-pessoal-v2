
-- View de métricas de idempotência agregadas por endpoint
CREATE OR REPLACE VIEW public.v_idempotency_metrics
WITH (security_invoker = true) AS
SELECT
  endpoint,
  COUNT(*) FILTER (WHERE created_at > now() - interval '24 hours') AS total_24h,
  COUNT(*) FILTER (WHERE created_at > now() - interval '7 days')   AS total_7d,
  COUNT(*) FILTER (WHERE status = 'completed' AND created_at > now() - interval '24 hours') AS completed_24h,
  COUNT(*) FILTER (WHERE status = 'pending'   AND created_at > now() - interval '24 hours') AS pending_24h,
  COUNT(*) FILTER (WHERE status = 'failed'    AND created_at > now() - interval '24 hours') AS failed_24h,
  COUNT(*) FILTER (WHERE response_status = 409 AND created_at > now() - interval '24 hours') AS conflict_24h,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE status = 'failed' AND created_at > now() - interval '24 hours')
    / NULLIF(COUNT(*) FILTER (WHERE created_at > now() - interval '24 hours'), 0),
    2
  ) AS failure_rate_pct_24h,
  MAX(created_at) AS last_seen_at
FROM public.idempotency_keys
GROUP BY endpoint;

GRANT SELECT ON public.v_idempotency_metrics TO authenticated;
GRANT SELECT ON public.v_idempotency_metrics TO service_role;

-- Função consolidada para dashboards (admin-only)
CREATE OR REPLACE FUNCTION public.get_idempotency_health()
RETURNS TABLE (
  endpoint          TEXT,
  total_24h         BIGINT,
  completed_24h     BIGINT,
  pending_24h       BIGINT,
  failed_24h        BIGINT,
  conflict_24h      BIGINT,
  failure_rate_pct  NUMERIC,
  last_seen_at      TIMESTAMPTZ
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT endpoint, total_24h, completed_24h, pending_24h, failed_24h,
         conflict_24h, failure_rate_pct_24h, last_seen_at
  FROM public.v_idempotency_metrics
  WHERE public.has_role(auth.uid(), 'admin'::app_role)
  ORDER BY total_24h DESC NULLS LAST;
$$;

REVOKE ALL ON FUNCTION public.get_idempotency_health() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_idempotency_health() TO authenticated;
