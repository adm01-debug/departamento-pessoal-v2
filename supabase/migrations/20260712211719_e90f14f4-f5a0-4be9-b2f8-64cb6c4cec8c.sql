
-- Defesa em profundidade: WORM em holerites assinados
CREATE OR REPLACE FUNCTION public.enforce_holerite_signed_hash()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_canonical TEXT;
  v_expected TEXT;
BEGIN
  IF NEW.assinado = true THEN
    v_canonical := COALESCE(NEW.folha_id::text,'')       || '|' ||
                   COALESCE(NEW.colaborador_id::text,'') || '|' ||
                   COALESCE(NEW.colaborador_cpf,'')      || '|' ||
                   COALESCE(NEW.total_proventos::text,'0')|| '|' ||
                   COALESCE(NEW.total_descontos::text,'0')|| '|' ||
                   COALESCE(NEW.liquido::text,'0')       || '|' ||
                   COALESCE(NEW.valor_inss::text,'0')    || '|' ||
                   COALESCE(NEW.valor_irrf::text,'0')    || '|' ||
                   COALESCE(NEW.valor_fgts::text,'0');
    v_expected := encode(digest(v_canonical,'sha256'),'hex');

    IF NEW.hash_assinatura IS NULL OR NEW.hash_assinatura = '' THEN
      NEW.hash_assinatura := v_expected;
    END IF;

    IF NEW.data_assinatura IS NULL THEN
      NEW.data_assinatura := now();
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_holerite_signed_hash() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enforce_holerite_signed_hash() TO service_role;

DROP TRIGGER IF EXISTS trg_enforce_holerite_signed_hash ON public.holerites;
CREATE TRIGGER trg_enforce_holerite_signed_hash
BEFORE INSERT OR UPDATE ON public.holerites
FOR EACH ROW EXECUTE FUNCTION public.enforce_holerite_signed_hash();

-- Imutabilidade: holerite assinado não pode ter valores/hash alterados
CREATE OR REPLACE FUNCTION public.impedir_alteracao_holerite_assinado()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.assinado = true THEN
    IF NEW.total_proventos IS DISTINCT FROM OLD.total_proventos
       OR NEW.total_descontos IS DISTINCT FROM OLD.total_descontos
       OR NEW.liquido         IS DISTINCT FROM OLD.liquido
       OR NEW.valor_inss      IS DISTINCT FROM OLD.valor_inss
       OR NEW.valor_irrf      IS DISTINCT FROM OLD.valor_irrf
       OR NEW.valor_fgts      IS DISTINCT FROM OLD.valor_fgts
       OR NEW.hash_assinatura IS DISTINCT FROM OLD.hash_assinatura
       OR NEW.data_assinatura IS DISTINCT FROM OLD.data_assinatura
       OR NEW.colaborador_id  IS DISTINCT FROM OLD.colaborador_id
       OR NEW.folha_id        IS DISTINCT FROM OLD.folha_id
       OR NEW.assinado        IS DISTINCT FROM OLD.assinado THEN
      RAISE EXCEPTION 'Holerite assinado é imutável (WORM). Campos financeiros/assinatura não podem ser alterados.'
        USING ERRCODE = 'check_violation';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_impedir_alteracao_holerite_assinado ON public.holerites;
CREATE TRIGGER trg_impedir_alteracao_holerite_assinado
BEFORE UPDATE ON public.holerites
FOR EACH ROW EXECUTE FUNCTION public.impedir_alteracao_holerite_assinado();

-- Proibir DELETE de holerite assinado (retenção fiscal 5 anos)
CREATE OR REPLACE FUNCTION public.proibir_delete_holerite_assinado()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.assinado = true THEN
    RAISE EXCEPTION 'Holerites assinados não podem ser deletados (exigência fiscal - retenção mínima 5 anos).'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_proibir_delete_holerite_assinado ON public.holerites;
CREATE TRIGGER trg_proibir_delete_holerite_assinado
BEFORE DELETE ON public.holerites
FOR EACH ROW EXECUTE FUNCTION public.proibir_delete_holerite_assinado();
