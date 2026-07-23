
CREATE OR REPLACE FUNCTION public.medida_verificar_ciencia_hash(p_hash TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tok RECORD;
  v_med RECORD;
  v_emp RECORD;
  v_ip_mask TEXT;
BEGIN
  IF p_hash IS NULL OR length(p_hash) < 32 THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Hash inválido');
  END IF;

  SELECT * INTO v_tok FROM public.medidas_ciencia_tokens
  WHERE assinatura_hash = p_hash AND used_at IS NOT NULL;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Comprovante não localizado ou não utilizado');
  END IF;

  SELECT tipo, artigo_clt, data_ocorrencia, gravidade, dias_suspensao, numero_sequencial
  INTO v_med FROM public.medidas_disciplinares WHERE id = v_tok.medida_id;

  SELECT razao_social, cnpj FROM public.empresas WHERE id = v_tok.empresa_id INTO v_emp;

  -- Mascarar IP: 200.155.42.13 → 200.155.***.***
  IF v_tok.ip_address IS NOT NULL THEN
    v_ip_mask := regexp_replace(v_tok.ip_address, '(\d+\.\d+)\.\d+\.\d+', '\1.***.***');
  END IF;

  RETURN jsonb_build_object(
    'valid', true,
    'hash', v_tok.assinatura_hash,
    'acao', v_tok.acao,
    'registrado_em', v_tok.used_at,
    'ip_mascarado', v_ip_mask,
    'motivo_recusa', v_tok.motivo_recusa,
    'medida', jsonb_build_object(
      'tipo', v_med.tipo,
      'numero', v_med.numero_sequencial,
      'artigo_clt', v_med.artigo_clt,
      'gravidade', v_med.gravidade,
      'dias_suspensao', v_med.dias_suspensao,
      'data_ocorrencia', v_med.data_ocorrencia
    ),
    'empresa', jsonb_build_object(
      'razao_social', v_emp.razao_social,
      'cnpj', v_emp.cnpj
    )
  );
END; $$;

REVOKE ALL ON FUNCTION public.medida_verificar_ciencia_hash(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.medida_verificar_ciencia_hash(TEXT) TO anon, authenticated;
