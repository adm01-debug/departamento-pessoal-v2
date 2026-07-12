
-- Bloqueio de alteração/exclusão de períodos fechados
CREATE OR REPLACE FUNCTION public.impedir_alteracao_periodo_ponto_fechado()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.status IN ('fechado','fechada','closed','homologado') THEN
    IF NEW.status = OLD.status THEN
      IF NEW.competencia   IS DISTINCT FROM OLD.competencia
         OR NEW.data_inicio IS DISTINCT FROM OLD.data_inicio
         OR NEW.data_fim   IS DISTINCT FROM OLD.data_fim
         OR NEW.fechado_em IS DISTINCT FROM OLD.fechado_em THEN
        RAISE EXCEPTION 'Período de ponto fechado é imutável (Portaria 671 MTP). Reabra oficialmente antes de alterar.'
          USING ERRCODE = 'check_violation';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_impedir_alteracao_periodo_ponto_fechado ON public.periodos_ponto;
CREATE TRIGGER trg_impedir_alteracao_periodo_ponto_fechado
BEFORE UPDATE ON public.periodos_ponto
FOR EACH ROW EXECUTE FUNCTION public.impedir_alteracao_periodo_ponto_fechado();

CREATE OR REPLACE FUNCTION public.proibir_delete_periodo_ponto_fechado()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.status IN ('fechado','fechada','closed','homologado') THEN
    RAISE EXCEPTION 'Períodos de ponto fechados não podem ser deletados (Portaria 671 MTP - retenção mínima 5 anos).'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_proibir_delete_periodo_ponto_fechado ON public.periodos_ponto;
CREATE TRIGGER trg_proibir_delete_periodo_ponto_fechado
BEFORE DELETE ON public.periodos_ponto
FOR EACH ROW EXECUTE FUNCTION public.proibir_delete_periodo_ponto_fechado();

-- Bloqueio de UPDATE/DELETE em batidas dentro de período fechado
CREATE OR REPLACE FUNCTION public.impedir_alteracao_batida_em_periodo_fechado()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_row RECORD;
  v_fechado BOOLEAN := false;
BEGIN
  v_row := CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;

  SELECT EXISTS (
    SELECT 1 FROM public.periodos_ponto pp
    WHERE pp.status IN ('fechado','fechada','closed','homologado')
      AND v_row.data BETWEEN pp.data_inicio AND pp.data_fim
  ) INTO v_fechado;

  IF v_fechado THEN
    IF TG_OP = 'DELETE' THEN
      RAISE EXCEPTION 'Batida de ponto em período fechado não pode ser deletada (Portaria 671 MTP).'
        USING ERRCODE = 'check_violation';
    ELSE
      -- Só permitimos flags de conciliação/observação, jamais alterar essência da batida
      IF NEW.data           IS DISTINCT FROM OLD.data
         OR NEW.hora        IS DISTINCT FROM OLD.hora
         OR NEW.tipo        IS DISTINCT FROM OLD.tipo
         OR NEW.colaborador_id IS DISTINCT FROM OLD.colaborador_id
         OR NEW.dispositivo_id IS DISTINCT FROM OLD.dispositivo_id
         OR NEW.hash_integridade IS DISTINCT FROM OLD.hash_integridade THEN
        RAISE EXCEPTION 'Batida de ponto em período fechado é imutável. Use ajuste oficial com aprovação e trilha de auditoria.'
          USING ERRCODE = 'check_violation';
      END IF;
    END IF;
  END IF;
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$;

DROP TRIGGER IF EXISTS trg_impedir_alteracao_batida_periodo_fechado_upd ON public.batidas_ponto;
CREATE TRIGGER trg_impedir_alteracao_batida_periodo_fechado_upd
BEFORE UPDATE ON public.batidas_ponto
FOR EACH ROW EXECUTE FUNCTION public.impedir_alteracao_batida_em_periodo_fechado();

DROP TRIGGER IF EXISTS trg_impedir_delete_batida_periodo_fechado ON public.batidas_ponto;
CREATE TRIGGER trg_impedir_delete_batida_periodo_fechado
BEFORE DELETE ON public.batidas_ponto
FOR EACH ROW EXECUTE FUNCTION public.impedir_alteracao_batida_em_periodo_fechado();
