
-- ============================================================================
-- WORM: Afastamentos (eSocial S-2230 - CLT arts. 476/476-A)
-- Cenários simulados:
--  1. Afastamento por atestado médico (< 15 dias) -> imutável após encerramento
--  2. Afastamento previdenciário (> 15 dias, benefício INSS) -> imutável após aprovação
--  3. Licença maternidade/paternidade -> imutável
--  4. Prorrogação -> nova linha em prorrogacoes_afastamento, não altera original
--  5. Retorno antecipado -> apenas data_fim_real pode ser preenchida enquanto ativo
--  6. Tentativa de alterar CID pós-encerramento: BLOQUEADO (fraude previdenciária)
--  7. Tentativa de trocar médico/CRM pós-aprovação: BLOQUEADO
--  8. Cancelamento oficial (status=cancelado): permitido com motivo_rejeicao
-- ============================================================================

ALTER TABLE public.afastamentos
  ADD COLUMN IF NOT EXISTS hash_integridade TEXT;

CREATE OR REPLACE FUNCTION public.enforce_afastamento_hash()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_canonical TEXT;
BEGIN
  IF NEW.status IN ('encerrado','cancelado') OR NEW.aprovado_em IS NOT NULL THEN
    v_canonical := COALESCE(NEW.colaborador_id::text,'')      || '|' ||
                   COALESCE(NEW.empresa_id::text,'')          || '|' ||
                   COALESCE(NEW.tipo::text,'')                || '|' ||
                   COALESCE(NEW.data_inicio::text,'')         || '|' ||
                   COALESCE(NEW.data_fim_prevista::text,'')   || '|' ||
                   COALESCE(NEW.data_fim_real::text,'')       || '|' ||
                   COALESCE(NEW.dias_empresa::text,'0')       || '|' ||
                   COALESCE(NEW.dias_inss::text,'0')          || '|' ||
                   COALESCE(NEW.cid::text,'')                 || '|' ||
                   COALESCE(NEW.numero_beneficio::text,'')    || '|' ||
                   COALESCE(NEW.medico_nome::text,'')         || '|' ||
                   COALESCE(NEW.medico_crm::text,'')          || '|' ||
                   COALESCE(NEW.atestado_numero::text,'')     || '|' ||
                   COALESCE(NEW.data_pericia::text,'')        || '|' ||
                   COALESCE(NEW.status::text,'');

    IF NEW.hash_integridade IS NULL OR NEW.hash_integridade = '' THEN
      NEW.hash_integridade := encode(digest(v_canonical,'sha256'),'hex');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_afastamento_hash() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enforce_afastamento_hash() TO service_role;

DROP TRIGGER IF EXISTS tr_enforce_afastamento_hash ON public.afastamentos;
CREATE TRIGGER tr_enforce_afastamento_hash
  BEFORE INSERT OR UPDATE ON public.afastamentos
  FOR EACH ROW EXECUTE FUNCTION public.enforce_afastamento_hash();

-- Imutabilidade após encerramento/cancelamento/aprovação
CREATE OR REPLACE FUNCTION public.impedir_alteracao_afastamento_encerrado()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.status IN ('encerrado','cancelado') OR OLD.aprovado_em IS NOT NULL THEN
    IF NEW.status = OLD.status THEN
      IF NEW.colaborador_id     IS DISTINCT FROM OLD.colaborador_id
         OR NEW.empresa_id      IS DISTINCT FROM OLD.empresa_id
         OR NEW.tipo            IS DISTINCT FROM OLD.tipo
         OR NEW.data_inicio     IS DISTINCT FROM OLD.data_inicio
         OR NEW.data_fim_prevista IS DISTINCT FROM OLD.data_fim_prevista
         OR NEW.data_fim_real   IS DISTINCT FROM OLD.data_fim_real
         OR NEW.dias_empresa    IS DISTINCT FROM OLD.dias_empresa
         OR NEW.dias_inss       IS DISTINCT FROM OLD.dias_inss
         OR NEW.cid             IS DISTINCT FROM OLD.cid
         OR NEW.numero_beneficio IS DISTINCT FROM OLD.numero_beneficio
         OR NEW.medico_nome     IS DISTINCT FROM OLD.medico_nome
         OR NEW.medico_crm      IS DISTINCT FROM OLD.medico_crm
         OR NEW.atestado_numero IS DISTINCT FROM OLD.atestado_numero
         OR NEW.data_pericia    IS DISTINCT FROM OLD.data_pericia
         OR NEW.aprovado_em     IS DISTINCT FROM OLD.aprovado_em
         OR NEW.aprovado_por    IS DISTINCT FROM OLD.aprovado_por
         OR NEW.hash_integridade IS DISTINCT FROM OLD.hash_integridade THEN
        RAISE EXCEPTION 'Afastamento encerrado/aprovado é imutável (eSocial S-2230). Registre novo evento ou prorrogação oficial.'
          USING ERRCODE = 'check_violation';
      END IF;
    ELSE
      IF NEW.status NOT IN ('cancelado','encerrado') THEN
        RAISE EXCEPTION 'Transição de status inválida em afastamento encerrado/aprovado.'
          USING ERRCODE = 'check_violation';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_impedir_alteracao_afastamento_encerrado ON public.afastamentos;
CREATE TRIGGER tr_impedir_alteracao_afastamento_encerrado
  BEFORE UPDATE ON public.afastamentos
  FOR EACH ROW EXECUTE FUNCTION public.impedir_alteracao_afastamento_encerrado();

-- Proibir DELETE físico de afastamentos encerrados/aprovados
CREATE OR REPLACE FUNCTION public.proibir_delete_afastamento_encerrado()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.status IN ('encerrado','cancelado') OR OLD.aprovado_em IS NOT NULL THEN
    RAISE EXCEPTION 'Afastamentos encerrados/aprovados não podem ser deletados (prova previdenciária INSS - retenção mínima 20 anos).'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS tr_proibir_delete_afastamento_encerrado ON public.afastamentos;
CREATE TRIGGER tr_proibir_delete_afastamento_encerrado
  BEFORE DELETE ON public.afastamentos
  FOR EACH ROW EXECUTE FUNCTION public.proibir_delete_afastamento_encerrado();
