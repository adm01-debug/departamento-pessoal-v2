
-- 1. Coluna para data de início do efeito (suspensão)
ALTER TABLE public.medidas_disciplinares
  ADD COLUMN IF NOT EXISTS data_inicio_efeito DATE;

-- 2. Tabela de rastreabilidade da integração
CREATE TABLE IF NOT EXISTS public.medidas_disciplinares_integracao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medida_id UUID NOT NULL REFERENCES public.medidas_disciplinares(id) ON DELETE CASCADE,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  colaborador_id UUID NOT NULL REFERENCES public.colaboradores(id) ON DELETE CASCADE,
  tipo_integracao TEXT NOT NULL CHECK (tipo_integracao IN ('afastamento','desligamento','lancamento_folha_pendente','lancamento_folha_aplicado')),
  ref_id UUID,
  competencia TEXT,
  valor NUMERIC(12,2),
  dias INTEGER,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','aplicado','cancelado','erro')),
  detalhes JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.medidas_disciplinares_integracao TO authenticated;
GRANT ALL ON public.medidas_disciplinares_integracao TO service_role;

ALTER TABLE public.medidas_disciplinares_integracao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_medidas_integracao_select" ON public.medidas_disciplinares_integracao
  FOR SELECT TO authenticated
  USING (empresa_id IN (SELECT get_user_empresas(auth.uid())));

CREATE POLICY "tenant_medidas_integracao_admin" ON public.medidas_disciplinares_integracao
  FOR ALL TO authenticated
  USING (empresa_id IN (SELECT get_user_empresas(auth.uid())) AND (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'rh')))
  WITH CHECK (empresa_id IN (SELECT get_user_empresas(auth.uid())));

CREATE INDEX IF NOT EXISTS idx_med_integ_medida ON public.medidas_disciplinares_integracao(medida_id);
CREATE INDEX IF NOT EXISTS idx_med_integ_pendentes ON public.medidas_disciplinares_integracao(empresa_id, colaborador_id) WHERE status = 'pendente';

CREATE TRIGGER trg_med_integ_updated
  BEFORE UPDATE ON public.medidas_disciplinares_integracao
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Helper: garantir rubrica de desconto por suspensão
CREATE OR REPLACE FUNCTION public.garantir_rubrica_suspensao(p_empresa_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rubrica_id UUID;
BEGIN
  SELECT id INTO v_rubrica_id
  FROM public.rubricas_folha
  WHERE empresa_id = p_empresa_id AND codigo = 'DESC_SUSP'
  LIMIT 1;

  IF v_rubrica_id IS NULL THEN
    INSERT INTO public.rubricas_folha (
      empresa_id, codigo, descricao, tipo,
      incide_inss, incide_irrf, incide_fgts, automatico, ativo, natureza_rubrica
    ) VALUES (
      p_empresa_id, 'DESC_SUSP', 'Desconto por Suspensão Disciplinar', 'desconto',
      false, false, false, true, true, 'desconto_disciplinar'
    )
    RETURNING id INTO v_rubrica_id;
  END IF;

  RETURN v_rubrica_id;
END;
$$;

REVOKE ALL ON FUNCTION public.garantir_rubrica_suspensao(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.garantir_rubrica_suspensao(UUID) TO authenticated, service_role;

-- 4. RPC principal: aplicar integração de medida disciplinar
CREATE OR REPLACE FUNCTION public.aplicar_medida_folha_ponto(p_medida_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_medida        RECORD;
  v_colab         RECORD;
  v_data_fim      DATE;
  v_afast_id      UUID;
  v_deslig_id     UUID;
  v_rubrica_id    UUID;
  v_valor_dia     NUMERIC(12,2);
  v_valor_desc    NUMERIC(12,2);
  v_competencia   TEXT;
  v_result        JSONB := '{}'::jsonb;
BEGIN
  SELECT * INTO v_medida FROM public.medidas_disciplinares WHERE id = p_medida_id;
  IF v_medida.id IS NULL THEN
    RAISE EXCEPTION 'medida_nao_encontrada';
  END IF;

  IF v_medida.status_workflow <> 'aplicada' THEN
    RAISE EXCEPTION 'medida_nao_aplicada';
  END IF;

  -- Tenant guard
  IF NOT (v_medida.empresa_id = ANY (SELECT get_user_empresas(auth.uid())))
     AND NOT (auth.role() = 'service_role') THEN
    RAISE EXCEPTION 'sem_permissao';
  END IF;

  SELECT * INTO v_colab FROM public.colaboradores WHERE id = v_medida.colaborador_id;

  -- SUSPENSÃO
  IF v_medida.tipo = 'suspensao' THEN
    IF COALESCE(v_medida.dias_suspensao,0) <= 0 THEN
      RAISE EXCEPTION 'dias_suspensao_invalidos';
    END IF;
    IF COALESCE(v_medida.dias_suspensao,0) > 30 THEN
      RAISE EXCEPTION 'dias_suspensao_excede_clt'; -- Art. 474 CLT
    END IF;

    v_data_fim := COALESCE(v_medida.data_inicio_efeito, v_medida.data_ocorrencia)
                  + (v_medida.dias_suspensao - 1);

    -- Evita duplicidade
    SELECT ref_id INTO v_afast_id
    FROM public.medidas_disciplinares_integracao
    WHERE medida_id = p_medida_id AND tipo_integracao = 'afastamento' AND status = 'aplicado'
    LIMIT 1;

    IF v_afast_id IS NULL THEN
      INSERT INTO public.afastamentos (
        colaborador_id, empresa_id, tipo, data_inicio, data_fim_prevista,
        dias_empresa, status, observacoes, created_by
      ) VALUES (
        v_medida.colaborador_id, v_medida.empresa_id, 'suspensao_disciplinar'::tipo_afastamento,
        COALESCE(v_medida.data_inicio_efeito, v_medida.data_ocorrencia), v_data_fim,
        v_medida.dias_suspensao, 'ativo'::status_afastamento,
        'Gerado automaticamente pela medida disciplinar ' || p_medida_id::text,
        auth.uid()
      )
      RETURNING id INTO v_afast_id;

      INSERT INTO public.medidas_disciplinares_integracao (
        medida_id, empresa_id, colaborador_id, tipo_integracao, ref_id, dias, status, detalhes
      ) VALUES (
        p_medida_id, v_medida.empresa_id, v_medida.colaborador_id,
        'afastamento', v_afast_id, v_medida.dias_suspensao, 'aplicado',
        jsonb_build_object('data_inicio', COALESCE(v_medida.data_inicio_efeito, v_medida.data_ocorrencia),
                           'data_fim', v_data_fim)
      );
    END IF;

    -- Desconto proporcional em folha (fila para próxima competência)
    v_rubrica_id := public.garantir_rubrica_suspensao(v_medida.empresa_id);
    v_valor_dia  := COALESCE(v_colab.salario_base, 0) / 30.0;
    v_valor_desc := ROUND(v_valor_dia * v_medida.dias_suspensao, 2);
    v_competencia := to_char(COALESCE(v_medida.data_inicio_efeito, v_medida.data_ocorrencia), 'YYYY-MM');

    IF NOT EXISTS (
      SELECT 1 FROM public.medidas_disciplinares_integracao
      WHERE medida_id = p_medida_id
        AND tipo_integracao IN ('lancamento_folha_pendente','lancamento_folha_aplicado')
    ) THEN
      INSERT INTO public.medidas_disciplinares_integracao (
        medida_id, empresa_id, colaborador_id, tipo_integracao,
        competencia, valor, dias, status, detalhes
      ) VALUES (
        p_medida_id, v_medida.empresa_id, v_medida.colaborador_id,
        'lancamento_folha_pendente', v_competencia, v_valor_desc, v_medida.dias_suspensao,
        'pendente',
        jsonb_build_object('rubrica_id', v_rubrica_id, 'rubrica_codigo', 'DESC_SUSP',
                           'valor_dia', v_valor_dia, 'salario_base', COALESCE(v_colab.salario_base,0))
      );
    END IF;

    v_result := jsonb_build_object(
      'tipo', 'suspensao',
      'afastamento_id', v_afast_id,
      'competencia', v_competencia,
      'valor_desconto', v_valor_desc,
      'dias', v_medida.dias_suspensao
    );

  -- JUSTA CAUSA
  ELSIF v_medida.tipo IN ('justa_causa','demissao_justa_causa') THEN
    SELECT ref_id INTO v_deslig_id
    FROM public.medidas_disciplinares_integracao
    WHERE medida_id = p_medida_id AND tipo_integracao = 'desligamento' AND status = 'aplicado'
    LIMIT 1;

    IF v_deslig_id IS NULL THEN
      INSERT INTO public.desligamentos (
        colaborador_id, tipo, data_desligamento, motivo, status, salario_base
      ) VALUES (
        v_medida.colaborador_id, 'justa_causa'::tipo_desligamento,
        COALESCE(v_medida.data_inicio_efeito, v_medida.data_ocorrencia),
        'Justa causa aplicada via medida disciplinar ' || p_medida_id::text ||
          coalesce(' — Art. CLT: ' || v_medida.artigo_clt, ''),
        'em_andamento', COALESCE(v_colab.salario_base, 0)
      )
      RETURNING id INTO v_deslig_id;

      INSERT INTO public.medidas_disciplinares_integracao (
        medida_id, empresa_id, colaborador_id, tipo_integracao, ref_id, status, detalhes
      ) VALUES (
        p_medida_id, v_medida.empresa_id, v_medida.colaborador_id,
        'desligamento', v_deslig_id, 'aplicado',
        jsonb_build_object('data', COALESCE(v_medida.data_inicio_efeito, v_medida.data_ocorrencia),
                           'artigo_clt', v_medida.artigo_clt)
      );
    END IF;

    v_result := jsonb_build_object('tipo', 'justa_causa', 'desligamento_id', v_deslig_id);

  ELSE
    -- Advertência ou similar: nada a integrar
    v_result := jsonb_build_object('tipo', v_medida.tipo, 'integracao', 'nao_aplicavel');
  END IF;

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.aplicar_medida_folha_ponto(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.aplicar_medida_folha_ponto(UUID) TO authenticated, service_role;

-- 5. Trigger: dispara automaticamente ao aplicar a medida
CREATE OR REPLACE FUNCTION public.trg_medida_aplicada_integrar()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status_workflow = 'aplicada'
     AND (OLD.status_workflow IS DISTINCT FROM NEW.status_workflow)
     AND NEW.tipo IN ('suspensao','justa_causa','demissao_justa_causa') THEN
    BEGIN
      PERFORM public.aplicar_medida_folha_ponto(NEW.id);
    EXCEPTION WHEN OTHERS THEN
      INSERT INTO public.medidas_disciplinares_integracao (
        medida_id, empresa_id, colaborador_id, tipo_integracao, status, detalhes
      ) VALUES (
        NEW.id, NEW.empresa_id, NEW.colaborador_id,
        CASE WHEN NEW.tipo = 'suspensao' THEN 'afastamento' ELSE 'desligamento' END,
        'erro',
        jsonb_build_object('erro', SQLERRM, 'sqlstate', SQLSTATE)
      );
    END;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_medida_aplicada_integrar ON public.medidas_disciplinares;
CREATE TRIGGER trg_medida_aplicada_integrar
  AFTER UPDATE OF status_workflow ON public.medidas_disciplinares
  FOR EACH ROW EXECUTE FUNCTION public.trg_medida_aplicada_integrar();

-- 6. RPC utilitário: consumir pendências ao gerar holerite
CREATE OR REPLACE FUNCTION public.consumir_pendencias_medida_no_holerite(
  p_holerite_id UUID, p_colaborador_id UUID, p_competencia TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_pend RECORD;
  v_count INTEGER := 0;
BEGIN
  FOR v_pend IN
    SELECT * FROM public.medidas_disciplinares_integracao
    WHERE colaborador_id = p_colaborador_id
      AND tipo_integracao = 'lancamento_folha_pendente'
      AND status = 'pendente'
      AND (competencia IS NULL OR competencia <= p_competencia)
    FOR UPDATE
  LOOP
    INSERT INTO public.lancamentos_folha (
      holerite_id, rubrica_id, rubrica_codigo, rubrica_descricao,
      tipo, referencia, valor, automatico
    ) VALUES (
      p_holerite_id,
      (v_pend.detalhes->>'rubrica_id')::uuid,
      COALESCE(v_pend.detalhes->>'rubrica_codigo','DESC_SUSP'),
      'Desconto por Suspensão Disciplinar',
      'desconto'::tipo_evento_folha,
      v_pend.dias,
      v_pend.valor,
      true
    );

    UPDATE public.medidas_disciplinares_integracao
    SET status = 'aplicado',
        tipo_integracao = 'lancamento_folha_aplicado',
        detalhes = detalhes || jsonb_build_object('holerite_id', p_holerite_id, 'aplicado_em', now())
    WHERE id = v_pend.id;

    v_count := v_count + 1;
  END LOOP;
  RETURN v_count;
END;
$$;

REVOKE ALL ON FUNCTION public.consumir_pendencias_medida_no_holerite(UUID,UUID,TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.consumir_pendencias_medida_no_holerite(UUID,UUID,TEXT) TO authenticated, service_role;
