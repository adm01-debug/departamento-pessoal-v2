
-- Garante colunas de resolução (idempotente)
ALTER TABLE public.security_alerts
  ADD COLUMN IF NOT EXISTS resolved_by uuid,
  ADD COLUMN IF NOT EXISTS resolved_at timestamptz;

-- Índice parcial para busca eficiente de alertas ativos
CREATE INDEX IF NOT EXISTS idx_security_alerts_unresolved
  ON public.security_alerts (created_at DESC)
  WHERE resolved = false;

-- Resumo de alertas ativos (admin-only)
CREATE OR REPLACE FUNCTION public.get_security_alerts_summary(_limit integer DEFAULT 50)
RETURNS TABLE(
  id uuid,
  type text,
  severity text,
  ip_address text,
  user_id uuid,
  details jsonb,
  created_at timestamptz,
  age_minutes numeric
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT sa.id, sa.type, sa.severity, sa.ip_address::text, sa.user_id,
         sa.details, sa.created_at,
         EXTRACT(EPOCH FROM (now() - sa.created_at))/60
  FROM public.security_alerts sa
  WHERE sa.resolved = false
    AND public.has_role(auth.uid(), 'admin'::app_role)
  ORDER BY
    CASE sa.severity WHEN 'critical' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
    sa.created_at DESC
  LIMIT _limit;
$$;

REVOKE EXECUTE ON FUNCTION public.get_security_alerts_summary(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_security_alerts_summary(integer) TO authenticated, service_role;

-- Resolver alerta com auditoria
CREATE OR REPLACE FUNCTION public.resolve_security_alert(_id uuid)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF NOT public.has_role(v_uid, 'admin'::app_role) THEN
    RAISE EXCEPTION 'Apenas administradores podem resolver alertas de segurança.'
      USING ERRCODE = '42501';
  END IF;

  UPDATE public.security_alerts
     SET resolved = true,
         resolved_by = v_uid,
         resolved_at = now()
   WHERE id = _id
     AND resolved = false;

  RETURN FOUND;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.resolve_security_alert(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.resolve_security_alert(uuid) TO authenticated, service_role;
