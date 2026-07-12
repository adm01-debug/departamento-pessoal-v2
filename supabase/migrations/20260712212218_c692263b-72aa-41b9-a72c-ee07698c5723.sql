
CREATE OR REPLACE FUNCTION public.enforce_desligamento_hash()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_canonical TEXT;
BEGIN
  IF NEW.status IN ('homologado','finalizado','concluido','concluído') THEN
    v_canonical := COALESCE(NEW.colaborador_id::text,'')      || '|' ||
                   COALESCE(NEW.empresa_id::text,'')          || '|' ||
                   COALESCE(NEW.data_desligamento::text,'')   || '|' ||
                   COALESCE(NEW.tipo::text,'')                || '|' ||
                   COALESCE(NEW.saldo_salario::text,'0')      || '|' ||
                   COALESCE(NEW.aviso_previo::text,'0')       || '|' ||
                   COALESCE(NEW.ferias_vencidas::text,'0')    || '|' ||
                   COALESCE(NEW.ferias_proporcionais::text,'0')|| '|' ||
                   COALESCE(NEW.terco_constitucional::text,'0')|| '|' ||
                   COALESCE(NEW.decimo_terceiro::text,'0')    || '|' ||
                   COALESCE(NEW.multa_fgts::text,'0')         || '|' ||
                   COALESCE(NEW.total_proventos::text,'0')    || '|' ||
                   COALESCE(NEW.total_descontos::text,'0')    || '|' ||
                   COALESCE(NEW.valor_liquido::text,'0');

    IF NEW.hash_integridade IS NULL OR NEW.hash_integridade = '' THEN
      NEW.hash_integridade := encode(digest(v_canonical,'sha256'),'hex');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_desligamento_hash() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enforce_desligamento_hash() TO service_role;

DROP TRIGGER IF EXISTS trg_enforce_desligamento_hash ON public.desligamentos;
CREATE TRIGGER trg_enforce_desligamento_hash
BEFORE INSERT OR UPDATE ON public.desligamentos
FOR EACH ROW EXECUTE FUNCTION public.enforce_desligamento_hash();

-- Imutabilidade
CREATE OR REPLACE FUNCTION public.impedir_alteracao_desligamento_homologado()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.status IN ('homologado','finalizado','concluido','concluído') THEN
    IF NEW.status = OLD.status THEN
      IF NEW.data_desligamento     IS DISTINCT FROM OLD.data_desligamento
         OR NEW.tipo               IS DISTINCT FROM OLD.tipo
         OR NEW.saldo_salario      IS DISTINCT FROM OLD.saldo_salario
         OR NEW.aviso_previo       IS DISTINCT FROM OLD.aviso_previo
         OR NEW.ferias_vencidas    IS DISTINCT FROM OLD.ferias_vencidas
         OR NEW.ferias_proporcionais IS DISTINCT FROM OLD.ferias_proporcionais
         OR NEW.terco_constitucional IS DISTINCT FROM OLD.terco_constitucional
         OR NEW.decimo_terceiro    IS DISTINCT FROM OLD.decimo_terceiro
         OR NEW.multa_fgts         IS DISTINCT FROM OLD.multa_fgts
         OR NEW.total_proventos    IS DISTINCT FROM OLD.total_proventos
         OR NEW.total_descontos    IS DISTINCT FROM OLD.total_descontos
         OR NEW.valor_liquido      IS DISTINCT FROM OLD.valor_liquido
         OR NEW.hash_integridade   IS DISTINCT FROM OLD.hash_integridade
         OR NEW.hash_assinatura_empresa IS DISTINCT FROM OLD.hash_assinatura_empresa
         OR NEW.hash_assinatura_colaborador IS DISTINCT FROM OLD.hash_assinatura_colaborador
         OR NEW.colaborador_id     IS DISTINCT FROM OLD.colaborador_id
         OR NEW.empresa_id         IS DISTINCT FROM OLD.empresa_id THEN
        RAISE EXCEPTION 'Desligamento homologado é imutável. Reabra oficialmente antes de alterar valores.'
          USING ERRCODE = 'check_violation';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_impedir_alteracao_desligamento_homologado ON public.desligamentos;
CREATE TRIGGER trg_impedir_alteracao_desligamento_homologado
BEFORE UPDATE ON public.desligamentos
FOR EACH ROW EXECUTE FUNCTION public.impedir_alteracao_desligamento_homologado();

-- Proibir DELETE
CREATE OR REPLACE FUNCTION public.proibir_delete_desligamento_homologado()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.status IN ('homologado','finalizado','concluido','concluído') THEN
    RAISE EXCEPTION 'Desligamentos homologados não podem ser deletados (retenção fiscal/trabalhista mínima 5 anos).'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_proibir_delete_desligamento_homologado ON public.desligamentos;
CREATE TRIGGER trg_proibir_delete_desligamento_homologado
BEFORE DELETE ON public.desligamentos
FOR EACH ROW EXECUTE FUNCTION public.proibir_delete_desligamento_homologado();
