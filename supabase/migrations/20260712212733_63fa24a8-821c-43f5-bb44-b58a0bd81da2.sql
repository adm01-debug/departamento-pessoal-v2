
-- ============================================================================
-- WORM: ASOs (Atestado de Saúde Ocupacional - NR-7 / PCMSO)
-- Cenários simulados:
--  1. ASO admissional emitido -> imutável (base para admissão eSocial S-2220)
--  2. ASO periódico -> imutável (auditoria fiscal do trabalho)
--  3. ASO demissional -> imutável (retenção 20 anos após desligamento - NR-7)
--  4. ASO de mudança de função / retorno ao trabalho -> imutável
--  5. Tentativa de alterar resultado (apto/inapto) pós-emissão: BLOQUEADO
--  6. Tentativa de trocar médico ou CRM: BLOQUEADO (fraude documental)
--  7. Correção de digitação em rascunho (arquivo_url NULL): permitida
-- ============================================================================

ALTER TABLE public.asos
  ADD COLUMN IF NOT EXISTS hash_integridade TEXT;

CREATE OR REPLACE FUNCTION public.enforce_aso_hash()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_canonical TEXT;
BEGIN
  -- ASO é considerado emitido quando possui médico + CRM + arquivo
  IF NEW.medico_nome IS NOT NULL
     AND NEW.medico_crm IS NOT NULL
     AND NEW.arquivo_url IS NOT NULL
     AND NEW.arquivo_url <> '' THEN

    v_canonical := COALESCE(NEW.colaborador_id::text,'')  || '|' ||
                   COALESCE(NEW.empresa_id::text,'')      || '|' ||
                   COALESCE(NEW.tipo,'')                  || '|' ||
                   COALESCE(NEW.data_exame::text,'')      || '|' ||
                   COALESCE(NEW.data_validade::text,'')   || '|' ||
                   COALESCE(NEW.resultado,'')             || '|' ||
                   COALESCE(NEW.medico_nome,'')           || '|' ||
                   COALESCE(NEW.medico_crm,'')            || '|' ||
                   COALESCE(NEW.clinica,'')               || '|' ||
                   COALESCE(NEW.arquivo_url,'');

    IF NEW.hash_integridade IS NULL OR NEW.hash_integridade = '' THEN
      NEW.hash_integridade := encode(digest(v_canonical,'sha256'),'hex');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_aso_hash() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enforce_aso_hash() TO service_role;

DROP TRIGGER IF EXISTS tr_enforce_aso_hash ON public.asos;
CREATE TRIGGER tr_enforce_aso_hash
  BEFORE INSERT OR UPDATE ON public.asos
  FOR EACH ROW EXECUTE FUNCTION public.enforce_aso_hash();

-- Imutabilidade após emissão
CREATE OR REPLACE FUNCTION public.impedir_alteracao_aso_emitido()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.arquivo_url IS NOT NULL AND OLD.arquivo_url <> ''
     AND OLD.medico_crm IS NOT NULL THEN
    IF NEW.colaborador_id  IS DISTINCT FROM OLD.colaborador_id
       OR NEW.empresa_id   IS DISTINCT FROM OLD.empresa_id
       OR NEW.tipo         IS DISTINCT FROM OLD.tipo
       OR NEW.data_exame   IS DISTINCT FROM OLD.data_exame
       OR NEW.resultado    IS DISTINCT FROM OLD.resultado
       OR NEW.medico_nome  IS DISTINCT FROM OLD.medico_nome
       OR NEW.medico_crm   IS DISTINCT FROM OLD.medico_crm
       OR NEW.clinica      IS DISTINCT FROM OLD.clinica
       OR NEW.arquivo_url  IS DISTINCT FROM OLD.arquivo_url
       OR NEW.hash_integridade IS DISTINCT FROM OLD.hash_integridade THEN
      RAISE EXCEPTION 'ASO emitido é imutável (NR-7/PCMSO). Emita um novo ASO retificador.'
        USING ERRCODE = 'check_violation';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_impedir_alteracao_aso_emitido ON public.asos;
CREATE TRIGGER tr_impedir_alteracao_aso_emitido
  BEFORE UPDATE ON public.asos
  FOR EACH ROW EXECUTE FUNCTION public.impedir_alteracao_aso_emitido();

-- Proibir DELETE de ASOs emitidos
CREATE OR REPLACE FUNCTION public.proibir_delete_aso_emitido()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.arquivo_url IS NOT NULL AND OLD.arquivo_url <> ''
     AND OLD.medico_crm IS NOT NULL THEN
    RAISE EXCEPTION 'ASOs emitidos não podem ser deletados (NR-7: retenção mínima 20 anos após desligamento).'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS tr_proibir_delete_aso_emitido ON public.asos;
CREATE TRIGGER tr_proibir_delete_aso_emitido
  BEFORE DELETE ON public.asos
  FOR EACH ROW EXECUTE FUNCTION public.proibir_delete_aso_emitido();
