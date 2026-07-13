
-- Melhoria #21: State-machine triggers para validar transições de status
-- Bloqueia mudanças ilegais (ex: 'concluida' → 'rascunho') em tempo de escrita.
-- Admins podem forçar transições via has_role(auth.uid(),'admin').

CREATE OR REPLACE FUNCTION public.validate_status_transition(
  _table text,
  _old text,
  _new text,
  _allowed jsonb
) RETURNS void
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  IF _old IS NULL OR _new IS NULL OR _old = _new THEN RETURN; END IF;
  IF _allowed ? _old AND (_allowed -> _old) ? _new THEN RETURN; END IF;
  RAISE EXCEPTION 'Transição de status inválida em %: % → % (permitidas: %)',
    _table, _old, _new, COALESCE(_allowed -> _old, '[]'::jsonb)
    USING ERRCODE = 'check_violation';
END;
$$;

-- Bypass helper: admins podem forçar
CREATE OR REPLACE FUNCTION public._is_admin_bypass() RETURNS boolean
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  BEGIN
    IF auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'::app_role) THEN
      RETURN true;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RETURN false;
  END;
  RETURN false;
END;
$$;

-- ============================================================================
-- FERIAS
-- ============================================================================
CREATE OR REPLACE FUNCTION public.trg_ferias_status_transition() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF public._is_admin_bypass() THEN RETURN NEW; END IF;
  PERFORM public.validate_status_transition('ferias', OLD.status, NEW.status, '{
    "solicitada": ["em_analise","pendente_aprovacao","aprovada","rejeitada","cancelada"],
    "pendente_aprovacao": ["em_analise","aprovada","rejeitada","cancelada"],
    "em_analise": ["aprovada","rejeitada","cancelada","pendente_aprovacao"],
    "aprovada": ["agendada","em_gozo","cancelada"],
    "agendada": ["em_gozo","cancelada"],
    "em_gozo": ["concluida"],
    "vencida": ["cancelada"]
  }'::jsonb);
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS ferias_status_transition ON public.ferias;
CREATE TRIGGER ferias_status_transition BEFORE UPDATE OF status ON public.ferias
  FOR EACH ROW EXECUTE FUNCTION public.trg_ferias_status_transition();

-- ============================================================================
-- FALTAS
-- ============================================================================
CREATE OR REPLACE FUNCTION public.trg_faltas_status_transition() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF public._is_admin_bypass() THEN RETURN NEW; END IF;
  PERFORM public.validate_status_transition('faltas', OLD.status, NEW.status, '{
    "pendente": ["em_analise","justificada","abonada","injustificada","rejeitada"],
    "em_analise": ["justificada","abonada","injustificada","rejeitada","pendente"]
  }'::jsonb);
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS faltas_status_transition ON public.faltas;
CREATE TRIGGER faltas_status_transition BEFORE UPDATE OF status ON public.faltas
  FOR EACH ROW EXECUTE FUNCTION public.trg_faltas_status_transition();

-- ============================================================================
-- SOLICITACOES_AJUSTE_PONTO
-- ============================================================================
CREATE OR REPLACE FUNCTION public.trg_ajuste_ponto_status_transition() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF public._is_admin_bypass() THEN RETURN NEW; END IF;
  PERFORM public.validate_status_transition('solicitacoes_ajuste_ponto', OLD.status, NEW.status, '{
    "pendente": ["em_analise","aprovada","rejeitada","cancelada"],
    "em_analise": ["aprovada","rejeitada","cancelada","pendente"],
    "aprovada": ["estornada"]
  }'::jsonb);
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS ajuste_ponto_status_transition ON public.solicitacoes_ajuste_ponto;
CREATE TRIGGER ajuste_ponto_status_transition BEFORE UPDATE OF status ON public.solicitacoes_ajuste_ponto
  FOR EACH ROW EXECUTE FUNCTION public.trg_ajuste_ponto_status_transition();

-- ============================================================================
-- CICLOS_AVALIACAO
-- ============================================================================
CREATE OR REPLACE FUNCTION public.trg_ciclos_status_transition() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF public._is_admin_bypass() THEN RETURN NEW; END IF;
  PERFORM public.validate_status_transition('ciclos_avaliacao', OLD.status, NEW.status, '{
    "rascunho": ["ativo","cancelado"],
    "ativo": ["em_andamento","cancelado","arquivado"],
    "em_andamento": ["concluido","cancelado"],
    "concluido": ["arquivado"]
  }'::jsonb);
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS ciclos_status_transition ON public.ciclos_avaliacao;
CREATE TRIGGER ciclos_status_transition BEFORE UPDATE OF status ON public.ciclos_avaliacao
  FOR EACH ROW EXECUTE FUNCTION public.trg_ciclos_status_transition();

-- ============================================================================
-- DESLIGAMENTOS
-- ============================================================================
CREATE OR REPLACE FUNCTION public.trg_desligamentos_status_transition() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF public._is_admin_bypass() THEN RETURN NEW; END IF;
  PERFORM public.validate_status_transition('desligamentos', OLD.status, NEW.status, '{
    "rascunho": ["em_andamento","cancelado"],
    "em_andamento": ["aprovado","rejeitado","cancelado"],
    "aprovado": ["concluido","homologado","cancelado"],
    "concluido": ["homologado"]
  }'::jsonb);
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS desligamentos_status_transition ON public.desligamentos;
CREATE TRIGGER desligamentos_status_transition BEFORE UPDATE OF status ON public.desligamentos
  FOR EACH ROW EXECUTE FUNCTION public.trg_desligamentos_status_transition();

-- ============================================================================
-- PDIs
-- ============================================================================
CREATE OR REPLACE FUNCTION public.trg_pdis_status_transition() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF public._is_admin_bypass() THEN RETURN NEW; END IF;
  PERFORM public.validate_status_transition('pdis', OLD.status, NEW.status, '{
    "rascunho": ["ativo","cancelado"],
    "ativo": ["em_andamento","pausado","cancelado"],
    "em_andamento": ["pausado","concluido","cancelado","vencido"],
    "pausado": ["em_andamento","cancelado"]
  }'::jsonb);
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS pdis_status_transition ON public.pdis;
CREATE TRIGGER pdis_status_transition BEFORE UPDATE OF status ON public.pdis
  FOR EACH ROW EXECUTE FUNCTION public.trg_pdis_status_transition();

-- ============================================================================
-- PESQUISAS
-- ============================================================================
CREATE OR REPLACE FUNCTION public.trg_pesquisas_status_transition() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF public._is_admin_bypass() THEN RETURN NEW; END IF;
  PERFORM public.validate_status_transition('pesquisas', OLD.status, NEW.status, '{
    "rascunho": ["ativa","cancelada"],
    "ativa": ["encerrada","cancelada"],
    "encerrada": ["arquivada"]
  }'::jsonb);
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS pesquisas_status_transition ON public.pesquisas;
CREATE TRIGGER pesquisas_status_transition BEFORE UPDATE OF status ON public.pesquisas
  FOR EACH ROW EXECUTE FUNCTION public.trg_pesquisas_status_transition();

-- ============================================================================
-- VAGAS
-- ============================================================================
CREATE OR REPLACE FUNCTION public.trg_vagas_status_transition() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF public._is_admin_bypass() THEN RETURN NEW; END IF;
  PERFORM public.validate_status_transition('vagas', OLD.status, NEW.status, '{
    "rascunho": ["aberta","cancelada"],
    "aberta": ["pausada","encerrada","preenchida","cancelada"],
    "pausada": ["aberta","encerrada","cancelada"],
    "encerrada": ["arquivada"],
    "preenchida": ["arquivada"]
  }'::jsonb);
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS vagas_status_transition ON public.vagas;
CREATE TRIGGER vagas_status_transition BEFORE UPDATE OF status ON public.vagas
  FOR EACH ROW EXECUTE FUNCTION public.trg_vagas_status_transition();
