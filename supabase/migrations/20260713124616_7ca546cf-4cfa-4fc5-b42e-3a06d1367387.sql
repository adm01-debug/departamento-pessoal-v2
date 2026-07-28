
-- Melhoria #23 (v2): Retenção + view de trilha ajustada ao schema real

CREATE OR REPLACE FUNCTION public.purge_audit_log_old(_dias integer DEFAULT 365)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _deleted integer;
BEGIN
  IF _dias < 30 THEN
    RAISE EXCEPTION 'Retenção mínima de 30 dias por compliance';
  END IF;
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Apenas administradores podem purgar audit_log'
      USING ERRCODE = '42501';
  END IF;

  WITH del AS (
    DELETE FROM public.audit_log
    WHERE created_at < now() - (_dias || ' days')::interval
    RETURNING 1
  )
  SELECT count(*) INTO _deleted FROM del;

  RETURN _deleted;
END;
$$;

REVOKE ALL ON FUNCTION public.purge_audit_log_old(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.purge_audit_log_old(integer) TO authenticated, service_role;

CREATE OR REPLACE VIEW public.v_audit_trail
WITH (security_invoker = true)
AS
SELECT
  a.id,
  a.created_at,
  a.tabela,
  a.registro_id,
  a.acao,
  a.user_id,
  u.email        AS user_email,
  p.nome         AS user_nome,
  (a.dados_anteriores ->> 'status') AS status_anterior,
  (a.dados_novos      ->> 'status') AS status_novo,
  NULLIF(a.dados_novos ->> 'empresa_id','')::uuid AS empresa_id,
  a.dados_anteriores,
  a.dados_novos
FROM public.audit_log a
LEFT JOIN auth.users     u ON u.id = a.user_id
LEFT JOIN public.profiles p ON p.user_id = a.user_id;

GRANT SELECT ON public.v_audit_trail TO authenticated, service_role;
