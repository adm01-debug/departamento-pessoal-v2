
-- Ciência Digital do Colaborador para Medidas Disciplinares (CLT Art. 482)
CREATE TABLE IF NOT EXISTS public.medidas_ciencia_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  medida_id UUID NOT NULL REFERENCES public.medidas_disciplinares(id) ON DELETE CASCADE,
  empresa_id UUID NOT NULL,
  colaborador_id UUID NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
  used_at TIMESTAMPTZ,
  ip_address TEXT,
  user_agent TEXT,
  geolocation JSONB,
  acao TEXT CHECK (acao IN ('ciencia','recusa')),
  motivo_recusa TEXT,
  assinatura_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID
);

GRANT SELECT, INSERT, UPDATE ON public.medidas_ciencia_tokens TO authenticated;
GRANT ALL ON public.medidas_ciencia_tokens TO service_role;
GRANT SELECT, UPDATE ON public.medidas_ciencia_tokens TO anon; -- validação pública por token

ALTER TABLE public.medidas_ciencia_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "RH visualiza tokens da empresa"
  ON public.medidas_ciencia_tokens FOR SELECT TO authenticated
  USING (
    empresa_id IN (SELECT empresa_id FROM public.user_empresas WHERE user_id = auth.uid())
    AND (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'rh'))
  );

CREATE POLICY "RH gera tokens da empresa"
  ON public.medidas_ciencia_tokens FOR INSERT TO authenticated
  WITH CHECK (
    empresa_id IN (SELECT empresa_id FROM public.user_empresas WHERE user_id = auth.uid())
    AND (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'rh'))
  );

CREATE POLICY "Validação pública por token (anon consulta)"
  ON public.medidas_ciencia_tokens FOR SELECT TO anon
  USING (used_at IS NULL AND expires_at > now());

CREATE POLICY "Registro público de ciência via token"
  ON public.medidas_ciencia_tokens FOR UPDATE TO anon
  USING (used_at IS NULL AND expires_at > now())
  WITH CHECK (used_at IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_medidas_ciencia_tokens_medida ON public.medidas_ciencia_tokens(medida_id);
CREATE INDEX IF NOT EXISTS idx_medidas_ciencia_tokens_token ON public.medidas_ciencia_tokens(token) WHERE used_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_medidas_ciencia_tokens_empresa ON public.medidas_ciencia_tokens(empresa_id, created_at DESC);

-- RPC: Gerar link de ciência
CREATE OR REPLACE FUNCTION public.medida_gerar_link_ciencia(p_medida_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_medida RECORD;
  v_token TEXT;
  v_id UUID;
BEGIN
  IF NOT (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'rh')) THEN
    RAISE EXCEPTION 'Sem permissão para gerar link de ciência';
  END IF;

  SELECT id, empresa_id, colaborador_id, status_workflow
  INTO v_medida
  FROM public.medidas_disciplinares
  WHERE id = p_medida_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Medida não encontrada';
  END IF;

  IF v_medida.empresa_id NOT IN (SELECT empresa_id FROM public.user_empresas WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Acesso negado à empresa';
  END IF;

  IF v_medida.status_workflow NOT IN ('aplicada','aprovada_rh','aprovada_juridico') THEN
    RAISE EXCEPTION 'Medida deve estar aplicada/aprovada para gerar ciência';
  END IF;

  v_token := encode(gen_random_bytes(32), 'hex');

  INSERT INTO public.medidas_ciencia_tokens (medida_id, empresa_id, colaborador_id, token, created_by)
  VALUES (v_medida.id, v_medida.empresa_id, v_medida.colaborador_id, v_token, auth.uid())
  RETURNING id INTO v_id;

  RETURN jsonb_build_object(
    'success', true,
    'token', v_token,
    'token_id', v_id,
    'expires_at', now() + interval '7 days',
    'url_path', '/ciencia-medida/' || v_token
  );
END; $$;

REVOKE ALL ON FUNCTION public.medida_gerar_link_ciencia(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.medida_gerar_link_ciencia(UUID) TO authenticated;

-- RPC: Registrar ciência (chamada pública com token)
CREATE OR REPLACE FUNCTION public.medida_registrar_ciencia_publica(
  p_token TEXT,
  p_acao TEXT,
  p_motivo_recusa TEXT DEFAULT NULL,
  p_ip TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_geo JSONB DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tok RECORD;
  v_hash TEXT;
BEGIN
  IF p_acao NOT IN ('ciencia','recusa') THEN
    RAISE EXCEPTION 'Ação inválida';
  END IF;

  SELECT * INTO v_tok FROM public.medidas_ciencia_tokens
  WHERE token = p_token AND used_at IS NULL AND expires_at > now()
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Token inválido ou expirado');
  END IF;

  IF p_acao = 'recusa' AND (p_motivo_recusa IS NULL OR length(trim(p_motivo_recusa)) < 10) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Motivo de recusa obrigatório (mín. 10 caracteres)');
  END IF;

  v_hash := encode(digest(
    v_tok.token || '|' || p_acao || '|' || coalesce(p_motivo_recusa,'') || '|' || now()::text || '|' || coalesce(p_ip,''),
    'sha256'
  ), 'hex');

  UPDATE public.medidas_ciencia_tokens
  SET used_at = now(),
      acao = p_acao,
      motivo_recusa = p_motivo_recusa,
      ip_address = p_ip,
      user_agent = p_user_agent,
      geolocation = p_geo,
      assinatura_hash = v_hash
  WHERE id = v_tok.id;

  UPDATE public.medidas_disciplinares
  SET colaborador_ciente = (p_acao = 'ciencia'),
      recusa_assinatura = (p_acao = 'recusa'),
      motivo_recusa = CASE WHEN p_acao = 'recusa' THEN p_motivo_recusa ELSE motivo_recusa END,
      data_ciencia = now(),
      assinado_em = CASE WHEN p_acao = 'ciencia' THEN now() ELSE assinado_em END,
      updated_at = now()
  WHERE id = v_tok.medida_id;

  INSERT INTO public.medidas_disciplinares_workflow_log
    (medida_id, empresa_id, acao, executado_por, detalhes)
  VALUES (
    v_tok.medida_id, v_tok.empresa_id,
    'ciencia_' || p_acao,
    NULL,
    jsonb_build_object('token_id', v_tok.id, 'ip', p_ip, 'user_agent', p_user_agent,
                       'hash', v_hash, 'motivo_recusa', p_motivo_recusa)
  );

  INSERT INTO public.notificacoes (user_id, empresa_id, titulo, mensagem, tipo, link)
  SELECT ue.user_id, v_tok.empresa_id,
         CASE WHEN p_acao='ciencia' THEN 'Ciência registrada' ELSE 'Recusa de assinatura registrada' END,
         'Colaborador ' || p_acao || ' via ciência digital.',
         CASE WHEN p_acao='ciencia' THEN 'info' ELSE 'warning' END,
         '/medidas-disciplinares?id=' || v_tok.medida_id
  FROM public.user_empresas ue
  JOIN public.user_roles ur ON ur.user_id = ue.user_id
  WHERE ue.empresa_id = v_tok.empresa_id AND ur.role IN ('admin','rh');

  RETURN jsonb_build_object('success', true, 'acao', p_acao, 'hash', v_hash, 'registrado_em', now());
END; $$;

REVOKE ALL ON FUNCTION public.medida_registrar_ciencia_publica(TEXT,TEXT,TEXT,TEXT,TEXT,JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.medida_registrar_ciencia_publica(TEXT,TEXT,TEXT,TEXT,TEXT,JSONB) TO anon, authenticated;

-- RPC pública: consultar dados mínimos da medida via token (sem expor tudo)
CREATE OR REPLACE FUNCTION public.medida_consultar_por_token(p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tok RECORD;
  v_med RECORD;
  v_col RECORD;
  v_emp RECORD;
BEGIN
  SELECT * INTO v_tok FROM public.medidas_ciencia_tokens
  WHERE token = p_token AND used_at IS NULL AND expires_at > now();

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Token inválido, expirado ou já utilizado');
  END IF;

  SELECT id, tipo, descricao, data_ocorrencia, artigo_clt, dias_suspensao, gravidade, pdf_url
  INTO v_med FROM public.medidas_disciplinares WHERE id = v_tok.medida_id;

  SELECT nome, cpf FROM public.colaboradores WHERE id = v_tok.colaborador_id INTO v_col;
  SELECT razao_social, cnpj FROM public.empresas WHERE id = v_tok.empresa_id INTO v_emp;

  RETURN jsonb_build_object(
    'valid', true,
    'expires_at', v_tok.expires_at,
    'medida', row_to_json(v_med),
    'colaborador', row_to_json(v_col),
    'empresa', row_to_json(v_emp)
  );
END; $$;

REVOKE ALL ON FUNCTION public.medida_consultar_por_token(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.medida_consultar_por_token(TEXT) TO anon, authenticated;
