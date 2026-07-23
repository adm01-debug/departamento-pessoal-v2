
-- 1) Tabela de rate limits para RPCs públicas de ciência/verificação
CREATE TABLE IF NOT EXISTS public.ciencia_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL,
  rpc_name TEXT NOT NULL,
  identifier TEXT,
  success BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.ciencia_rate_limits TO authenticated;
GRANT ALL ON public.ciencia_rate_limits TO service_role;

ALTER TABLE public.ciencia_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem auditar rate limits"
  ON public.ciencia_rate_limits FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_ciencia_rl_ip_time
  ON public.ciencia_rate_limits (ip_address, rpc_name, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ciencia_rl_created
  ON public.ciencia_rate_limits (created_at);

-- 2) Função de checagem/registro de rate limit (30 req / 10 min por IP+rpc)
CREATE OR REPLACE FUNCTION public.check_ciencia_rate_limit(
  p_rpc_name TEXT,
  p_identifier TEXT DEFAULT NULL,
  p_max_requests INT DEFAULT 30,
  p_window_minutes INT DEFAULT 10
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ip INET;
  v_count INT;
BEGIN
  BEGIN
    v_ip := COALESCE(
      NULLIF(current_setting('request.headers', true)::json->>'x-forwarded-for', ''),
      NULLIF(current_setting('request.headers', true)::json->>'cf-connecting-ip', ''),
      '0.0.0.0'
    )::INET;
  EXCEPTION WHEN OTHERS THEN
    v_ip := '0.0.0.0'::INET;
  END;

  SELECT COUNT(*) INTO v_count
  FROM public.ciencia_rate_limits
  WHERE ip_address = v_ip
    AND rpc_name = p_rpc_name
    AND created_at > now() - (p_window_minutes || ' minutes')::INTERVAL;

  INSERT INTO public.ciencia_rate_limits (ip_address, rpc_name, identifier, success)
  VALUES (v_ip, p_rpc_name, p_identifier, v_count < p_max_requests);

  RETURN v_count < p_max_requests;
END;
$$;

REVOKE ALL ON FUNCTION public.check_ciencia_rate_limit(TEXT, TEXT, INT, INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_ciencia_rate_limit(TEXT, TEXT, INT, INT) TO anon, authenticated;

-- 3) Envolver medida_consultar_por_token com rate limit
CREATE OR REPLACE FUNCTION public.medida_consultar_por_token(p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
  v_medida_id UUID;
BEGIN
  IF NOT public.check_ciencia_rate_limit('medida_consultar_por_token', left(p_token, 8)) THEN
    RAISE EXCEPTION 'rate_limit_exceeded'
      USING HINT = 'Muitas tentativas. Aguarde 10 minutos.';
  END IF;

  SELECT medida_id INTO v_medida_id
  FROM public.medidas_ciencia_tokens
  WHERE token = p_token
    AND expires_at > now()
    AND used_at IS NULL;

  IF v_medida_id IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'token_invalid_or_expired');
  END IF;

  SELECT jsonb_build_object(
    'valid', true,
    'medida_id', md.id,
    'tipo', md.tipo,
    'motivo', md.motivo,
    'descricao', md.descricao,
    'data_ocorrencia', md.data_ocorrencia,
    'empresa_nome', e.nome_fantasia,
    'colaborador_nome', c.nome_completo
  ) INTO v_result
  FROM public.medidas_disciplinares md
  JOIN public.colaboradores c ON c.id = md.colaborador_id
  JOIN public.empresas e ON e.id = md.empresa_id
  WHERE md.id = v_medida_id;

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.medida_consultar_por_token(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.medida_consultar_por_token(TEXT) TO anon, authenticated;

-- 4) Envolver medida_verificar_ciencia_hash com rate limit
CREATE OR REPLACE FUNCTION public.medida_verificar_ciencia_hash(p_hash TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  IF NOT public.check_ciencia_rate_limit('medida_verificar_ciencia_hash', left(p_hash, 12)) THEN
    RAISE EXCEPTION 'rate_limit_exceeded'
      USING HINT = 'Muitas tentativas. Aguarde 10 minutos.';
  END IF;

  SELECT jsonb_build_object(
    'valid', true,
    'medida_id', md.id,
    'tipo', md.tipo,
    'data_ocorrencia', md.data_ocorrencia,
    'empresa_nome', e.nome_fantasia,
    'acao', mct.acao,
    'data_ciencia', mct.used_at,
    'ip_mascarado', host(set_masklen(mct.ip_address::CIDR, 24))
  ) INTO v_result
  FROM public.medidas_ciencia_tokens mct
  JOIN public.medidas_disciplinares md ON md.id = mct.medida_id
  JOIN public.empresas e ON e.id = md.empresa_id
  WHERE mct.hash_comprovante = p_hash
    AND mct.used_at IS NOT NULL;

  IF v_result IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'hash_not_found');
  END IF;

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.medida_verificar_ciencia_hash(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.medida_verificar_ciencia_hash(TEXT) TO anon, authenticated;

-- 5) Limpeza automática de logs > 24h
CREATE OR REPLACE FUNCTION public.cleanup_ciencia_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.ciencia_rate_limits
  WHERE created_at < now() - INTERVAL '24 hours';
END;
$$;

REVOKE ALL ON FUNCTION public.cleanup_ciencia_rate_limits() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cleanup_ciencia_rate_limits() TO service_role;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.unschedule('cleanup-ciencia-rate-limits');
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'cleanup-ciencia-rate-limits',
      '0 7 * * *',
      $cron$SELECT public.cleanup_ciencia_rate_limits();$cron$
    );
  END IF;
END $$;
