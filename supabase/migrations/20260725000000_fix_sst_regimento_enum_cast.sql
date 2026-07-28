-- Fix: enum case mismatch in sst_regimento functions
-- status_colaborador enum uses lowercase values (ativo, ferias, etc.)
-- 'ATIVO' is not a valid enum value — ::text cast is required before COALESCE
-- so COALESCE returns a text 'ativo', not trying to cast 'ATIVO' to enum.

CREATE OR REPLACE FUNCTION public.sst_regimento_dashboard(p_empresa_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_doc RECORD;
  v_total_colab INTEGER;
  v_assinados INTEGER;
BEGIN
  IF p_empresa_id NOT IN (SELECT empresa_id FROM public.user_empresas WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Sem acesso à empresa';
  END IF;

  SELECT * INTO v_doc FROM public.sst_regimento_documentos
   WHERE empresa_id = p_empresa_id AND status = 'PUBLICADO' LIMIT 1;

  SELECT count(*) INTO v_total_colab FROM public.colaboradores
   WHERE empresa_id = p_empresa_id
     AND coalesce(status::text, 'ativo') = 'ativo';

  IF v_doc.id IS NULL THEN
    RETURN jsonb_build_object('documento', null, 'total_colaboradores', v_total_colab, 'assinados', 0, 'pendentes', v_total_colab, 'adesao_pct', 0);
  END IF;

  SELECT count(*) INTO v_assinados FROM public.sst_regimento_assinaturas
   WHERE documento_id = v_doc.id;

  RETURN jsonb_build_object(
    'documento', jsonb_build_object('id', v_doc.id, 'titulo', v_doc.titulo, 'versao', v_doc.versao, 'publicado_em', v_doc.publicado_em, 'hash', v_doc.hash_sha256),
    'total_colaboradores', v_total_colab,
    'assinados', v_assinados,
    'pendentes', GREATEST(v_total_colab - v_assinados, 0),
    'adesao_pct', CASE WHEN v_total_colab > 0 THEN round((v_assinados::numeric / v_total_colab) * 100, 2) ELSE 0 END
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.sst_regimento_pendentes_lista(p_empresa_id uuid)
RETURNS TABLE (
  colaborador_id uuid,
  nome text,
  email text,
  cargo text,
  departamento text,
  tem_usuario boolean,
  ultima_notificacao timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_doc_id uuid;
  v_versao integer;
BEGIN
  IF NOT (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'super_admin')
    OR public.has_role(auth.uid(), 'rh')
  ) THEN
    RAISE EXCEPTION 'Acesso negado' USING ERRCODE = '42501';
  END IF;

  SELECT d.id, d.versao INTO v_doc_id, v_versao
  FROM public.sst_regimento_documentos d
  WHERE d.empresa_id = p_empresa_id AND d.status = 'PUBLICADO'
  ORDER BY d.versao DESC
  LIMIT 1;

  IF v_doc_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    c.id,
    COALESCE(c.nome_completo, c.nome, 'Sem nome')::text,
    c.email::text,
    c.cargo::text,
    c.departamento::text,
    (c.user_id IS NOT NULL) AS tem_usuario,
    (
      SELECT MAX(n.created_at)
      FROM public.notificacoes n
      WHERE n.user_id = c.user_id
        AND n.tipo = 'sst_regimento_pendente'
        AND (n.metadata->>'documento_id')::uuid = v_doc_id
    ) AS ultima_notificacao
  FROM public.colaboradores c
  WHERE c.empresa_id = p_empresa_id
    AND coalesce(c.status::text, 'ativo') = 'ativo'
    AND NOT EXISTS (
      SELECT 1 FROM public.sst_regimento_assinaturas a
      WHERE a.documento_id = v_doc_id AND a.colaborador_id = c.id
    )
  ORDER BY COALESCE(c.nome_completo, c.nome) ASC
  LIMIT 500;
END;
$$;
