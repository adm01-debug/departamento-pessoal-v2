
-- ============================================================================
-- WORM: Entregas de EPI (NR-6)
-- Cenários simulados:
--  1. Entrega assinada pelo colaborador -> imutável (prova de fornecimento)
--  2. Devolução posterior -> data_devolucao pode ser preenchida (fluxo normal)
--  3. Tentativa de alterar quantidade/epi/data pós-assinatura: BLOQUEADO
--  4. Tentativa de DELETE de entrega assinada: BLOQUEADO
--  5. Rascunho sem assinatura -> livre para correção
--  6. Troca de EPI danificado -> nova entrega, não altera anterior
-- ============================================================================

ALTER TABLE public.epis_entregas
  ADD COLUMN IF NOT EXISTS hash_integridade TEXT;

CREATE OR REPLACE FUNCTION public.enforce_epi_entrega_hash()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_canonical TEXT;
BEGIN
  IF NEW.assinatura_url IS NOT NULL AND NEW.assinatura_url <> '' THEN
    v_canonical := COALESCE(NEW.epi_id::text,'')          || '|' ||
                   COALESCE(NEW.colaborador_id::text,'')  || '|' ||
                   COALESCE(NEW.empresa_id::text,'')      || '|' ||
                   COALESCE(NEW.data_entrega::text,'')    || '|' ||
                   COALESCE(NEW.quantidade::text,'1')     || '|' ||
                   COALESCE(NEW.motivo,'')                || '|' ||
                   COALESCE(NEW.assinatura_url,'')        || '|' ||
                   COALESCE(NEW.entregue_por::text,'');

    IF NEW.hash_integridade IS NULL OR NEW.hash_integridade = '' THEN
      NEW.hash_integridade := encode(digest(v_canonical,'sha256'),'hex');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_epi_entrega_hash() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enforce_epi_entrega_hash() TO service_role;

DROP TRIGGER IF EXISTS tr_enforce_epi_entrega_hash ON public.epis_entregas;
CREATE TRIGGER tr_enforce_epi_entrega_hash
  BEFORE INSERT OR UPDATE ON public.epis_entregas
  FOR EACH ROW EXECUTE FUNCTION public.enforce_epi_entrega_hash();

-- Imutabilidade após assinatura (permite apenas preenchimento de data_devolucao e observacoes)
CREATE OR REPLACE FUNCTION public.impedir_alteracao_epi_entrega_assinada()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.assinatura_url IS NOT NULL AND OLD.assinatura_url <> '' THEN
    IF NEW.epi_id           IS DISTINCT FROM OLD.epi_id
       OR NEW.colaborador_id IS DISTINCT FROM OLD.colaborador_id
       OR NEW.empresa_id     IS DISTINCT FROM OLD.empresa_id
       OR NEW.data_entrega   IS DISTINCT FROM OLD.data_entrega
       OR NEW.quantidade     IS DISTINCT FROM OLD.quantidade
       OR NEW.motivo         IS DISTINCT FROM OLD.motivo
       OR NEW.assinatura_url IS DISTINCT FROM OLD.assinatura_url
       OR NEW.entregue_por   IS DISTINCT FROM OLD.entregue_por
       OR NEW.hash_integridade IS DISTINCT FROM OLD.hash_integridade THEN
      RAISE EXCEPTION 'Entrega de EPI assinada é imutável (NR-6). Registre nova entrega/devolução em vez de alterar.'
        USING ERRCODE = 'check_violation';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_impedir_alteracao_epi_entrega_assinada ON public.epis_entregas;
CREATE TRIGGER tr_impedir_alteracao_epi_entrega_assinada
  BEFORE UPDATE ON public.epis_entregas
  FOR EACH ROW EXECUTE FUNCTION public.impedir_alteracao_epi_entrega_assinada();

-- Proibir DELETE de entregas assinadas
CREATE OR REPLACE FUNCTION public.proibir_delete_epi_entrega_assinada()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.assinatura_url IS NOT NULL AND OLD.assinatura_url <> '' THEN
    RAISE EXCEPTION 'Entregas de EPI assinadas não podem ser deletadas (NR-6: prova de fornecimento em ações trabalhistas - retenção mínima 5 anos após desligamento).'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS tr_proibir_delete_epi_entrega_assinada ON public.epis_entregas;
CREATE TRIGGER tr_proibir_delete_epi_entrega_assinada
  BEFORE DELETE ON public.epis_entregas
  FOR EACH ROW EXECUTE FUNCTION public.proibir_delete_epi_entrega_assinada();
