
-- ============================================================================
-- WORM: CAT (Comunicação de Acidente de Trabalho) - eSocial S-2210
-- Cenários simulados:
--  1. CAT inicial de acidente típico -> imutável após protocolo INSS
--  2. CAT de óbito -> imutável (base para benefício pensão)
--  3. CAT de doença ocupacional -> imutável (nexo previdenciário)
--  4. CAT reabertura/comunicação de óbito posterior -> nova CAT, não altera original
--  5. Tentativa de alterar tipo/data/parte do corpo pós-transmissão: BLOQUEADO
--  6. Tentativa de mascarar óbito (houve_obito true->false): BLOQUEADO
--  7. Correção antes de transmitir (status_esocial=pendente): permitida
-- ============================================================================

ALTER TABLE public.sst_cat
  ADD COLUMN IF NOT EXISTS hash_integridade TEXT;

CREATE OR REPLACE FUNCTION public.enforce_cat_hash()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_canonical TEXT;
BEGIN
  IF NEW.protocolo_esocial IS NOT NULL AND NEW.protocolo_esocial <> ''
     OR NEW.status_esocial IN ('enviado','processado','aceito','transmitido') THEN

    v_canonical := COALESCE(NEW.colaborador_id::text,'')      || '|' ||
                   COALESCE(NEW.empresa_id::text,'')          || '|' ||
                   COALESCE(NEW.data_acidente::text,'')       || '|' ||
                   COALESCE(NEW.tipo_acidente,'')             || '|' ||
                   COALESCE(NEW.local_acidente,'')            || '|' ||
                   COALESCE(NEW.parte_corpo_atingida,'')      || '|' ||
                   COALESCE(NEW.agente_causador,'')           || '|' ||
                   COALESCE(NEW.houve_afastamento::text,'false') || '|' ||
                   COALESCE(NEW.houve_obito::text,'false')    || '|' ||
                   COALESCE(NEW.protocolo_esocial,'');

    IF NEW.hash_integridade IS NULL OR NEW.hash_integridade = '' THEN
      NEW.hash_integridade := encode(digest(v_canonical,'sha256'),'hex');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_cat_hash() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enforce_cat_hash() TO service_role;

DROP TRIGGER IF EXISTS tr_enforce_cat_hash ON public.sst_cat;
CREATE TRIGGER tr_enforce_cat_hash
  BEFORE INSERT OR UPDATE ON public.sst_cat
  FOR EACH ROW EXECUTE FUNCTION public.enforce_cat_hash();

-- Imutabilidade após transmissão
CREATE OR REPLACE FUNCTION public.impedir_alteracao_cat_transmitida()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF (OLD.protocolo_esocial IS NOT NULL AND OLD.protocolo_esocial <> '')
     OR OLD.status_esocial IN ('enviado','processado','aceito','transmitido') THEN
    IF NEW.colaborador_id       IS DISTINCT FROM OLD.colaborador_id
       OR NEW.empresa_id        IS DISTINCT FROM OLD.empresa_id
       OR NEW.data_acidente     IS DISTINCT FROM OLD.data_acidente
       OR NEW.tipo_acidente     IS DISTINCT FROM OLD.tipo_acidente
       OR NEW.local_acidente    IS DISTINCT FROM OLD.local_acidente
       OR NEW.parte_corpo_atingida IS DISTINCT FROM OLD.parte_corpo_atingida
       OR NEW.agente_causador   IS DISTINCT FROM OLD.agente_causador
       OR NEW.houve_afastamento IS DISTINCT FROM OLD.houve_afastamento
       OR NEW.houve_obito       IS DISTINCT FROM OLD.houve_obito
       OR NEW.protocolo_esocial IS DISTINCT FROM OLD.protocolo_esocial
       OR NEW.hash_integridade  IS DISTINCT FROM OLD.hash_integridade THEN
      RAISE EXCEPTION 'CAT transmitida ao eSocial (S-2210) é imutável. Emita CAT de reabertura/retificação via evento oficial.'
        USING ERRCODE = 'check_violation';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_impedir_alteracao_cat_transmitida ON public.sst_cat;
CREATE TRIGGER tr_impedir_alteracao_cat_transmitida
  BEFORE UPDATE ON public.sst_cat
  FOR EACH ROW EXECUTE FUNCTION public.impedir_alteracao_cat_transmitida();

-- Proibir DELETE de CATs transmitidas
CREATE OR REPLACE FUNCTION public.proibir_delete_cat_transmitida()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF (OLD.protocolo_esocial IS NOT NULL AND OLD.protocolo_esocial <> '')
     OR OLD.status_esocial IN ('enviado','processado','aceito','transmitido') THEN
    RAISE EXCEPTION 'CATs transmitidas não podem ser deletadas (prova previdenciária INSS - retenção mínima 20 anos).'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS tr_proibir_delete_cat_transmitida ON public.sst_cat;
CREATE TRIGGER tr_proibir_delete_cat_transmitida
  BEFORE DELETE ON public.sst_cat
  FOR EACH ROW EXECUTE FUNCTION public.proibir_delete_cat_transmitida();
