
ALTER TABLE public.ferias ADD COLUMN IF NOT EXISTS hash_integridade TEXT;

CREATE OR REPLACE FUNCTION public.enforce_ferias_hash()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_canonical TEXT;
BEGIN
  IF NEW.status IN ('em_gozo','paga','concluida','homologada','concluída') THEN
    v_canonical := COALESCE(NEW.colaborador_id::text,'')     || '|' ||
                   COALESCE(NEW.empresa_id::text,'')         || '|' ||
                   COALESCE(NEW.periodo_aquisitivo_id::text,'') || '|' ||
                   COALESCE(NEW.data_inicio::text,'')        || '|' ||
                   COALESCE(NEW.data_fim::text,'')           || '|' ||
                   COALESCE(NEW.dias_gozo::text,'0')         || '|' ||
                   COALESCE(NEW.dias_abono::text,'0')        || '|' ||
                   COALESCE(NEW.valor_ferias::text,'0')      || '|' ||
                   COALESCE(NEW.valor_terco::text,'0')       || '|' ||
                   COALESCE(NEW.valor_abono::text,'0')       || '|' ||
                   COALESCE(NEW.valor_terco_abono::text,'0') || '|' ||
                   COALESCE(NEW.valor_total::text,'0')       || '|' ||
                   COALESCE(NEW.descontos_inss::text,'0')    || '|' ||
                   COALESCE(NEW.descontos_irrf::text,'0')    || '|' ||
                   COALESCE(NEW.valor_liquido::text,'0');

    IF NEW.hash_integridade IS NULL OR NEW.hash_integridade = '' THEN
      NEW.hash_integridade := encode(digest(v_canonical,'sha256'),'hex');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_ferias_hash() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enforce_ferias_hash() TO service_role;

DROP TRIGGER IF EXISTS trg_enforce_ferias_hash ON public.ferias;
CREATE TRIGGER trg_enforce_ferias_hash
BEFORE INSERT OR UPDATE ON public.ferias
FOR EACH ROW EXECUTE FUNCTION public.enforce_ferias_hash();

-- Imutabilidade
CREATE OR REPLACE FUNCTION public.impedir_alteracao_ferias_concluidas()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.status IN ('em_gozo','paga','concluida','homologada','concluída') THEN
    IF NEW.status = OLD.status THEN
      IF NEW.data_inicio       IS DISTINCT FROM OLD.data_inicio
         OR NEW.data_fim       IS DISTINCT FROM OLD.data_fim
         OR NEW.dias_gozo      IS DISTINCT FROM OLD.dias_gozo
         OR NEW.dias_abono     IS DISTINCT FROM OLD.dias_abono
         OR NEW.valor_ferias   IS DISTINCT FROM OLD.valor_ferias
         OR NEW.valor_terco    IS DISTINCT FROM OLD.valor_terco
         OR NEW.valor_abono    IS DISTINCT FROM OLD.valor_abono
         OR NEW.valor_total    IS DISTINCT FROM OLD.valor_total
         OR NEW.valor_liquido  IS DISTINCT FROM OLD.valor_liquido
         OR NEW.descontos_inss IS DISTINCT FROM OLD.descontos_inss
         OR NEW.descontos_irrf IS DISTINCT FROM OLD.descontos_irrf
         OR NEW.colaborador_id IS DISTINCT FROM OLD.colaborador_id
         OR NEW.empresa_id     IS DISTINCT FROM OLD.empresa_id
         OR NEW.periodo_aquisitivo_id IS DISTINCT FROM OLD.periodo_aquisitivo_id
         OR NEW.hash_integridade IS DISTINCT FROM OLD.hash_integridade THEN
        RAISE EXCEPTION 'Férias em status % são imutáveis. Cancele oficialmente antes de alterar.', OLD.status
          USING ERRCODE = 'check_violation';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_impedir_alteracao_ferias_concluidas ON public.ferias;
CREATE TRIGGER trg_impedir_alteracao_ferias_concluidas
BEFORE UPDATE ON public.ferias
FOR EACH ROW EXECUTE FUNCTION public.impedir_alteracao_ferias_concluidas();

-- Proibir DELETE
CREATE OR REPLACE FUNCTION public.proibir_delete_ferias_concluidas()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.status IN ('em_gozo','paga','concluida','homologada','concluída') THEN
    RAISE EXCEPTION 'Férias em gozo/pagas/concluídas não podem ser deletadas (rastreabilidade CLT - retenção mínima 5 anos).'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_proibir_delete_ferias_concluidas ON public.ferias;
CREATE TRIGGER trg_proibir_delete_ferias_concluidas
BEFORE DELETE ON public.ferias
FOR EACH ROW EXECUTE FUNCTION public.proibir_delete_ferias_concluidas();
