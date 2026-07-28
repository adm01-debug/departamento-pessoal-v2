
ALTER TABLE public.cnab_remessas ADD COLUMN IF NOT EXISTS hash_integridade TEXT;

CREATE OR REPLACE FUNCTION public.enforce_cnab_remessa_hash()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_canonical TEXT;
BEGIN
  IF NEW.status IN ('transmitida','enviada','processada','confirmada') THEN
    v_canonical := COALESCE(NEW.empresa_id::text,'')       || '|' ||
                   COALESCE(NEW.banco_codigo,'')           || '|' ||
                   COALESCE(NEW.sequencial_arquivo::text,'')|| '|' ||
                   COALESCE(NEW.data_geracao::text,'')     || '|' ||
                   COALESCE(NEW.total_pagamentos::text,'0')|| '|' ||
                   COALESCE(NEW.valor_total::text,'0')     || '|' ||
                   COALESCE(NEW.arquivo_url,'');

    IF NEW.hash_integridade IS NULL OR NEW.hash_integridade = '' THEN
      NEW.hash_integridade := encode(digest(v_canonical,'sha256'),'hex');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_cnab_remessa_hash() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enforce_cnab_remessa_hash() TO service_role;

DROP TRIGGER IF EXISTS trg_enforce_cnab_remessa_hash ON public.cnab_remessas;
CREATE TRIGGER trg_enforce_cnab_remessa_hash
BEFORE INSERT OR UPDATE ON public.cnab_remessas
FOR EACH ROW EXECUTE FUNCTION public.enforce_cnab_remessa_hash();

-- Imutabilidade
CREATE OR REPLACE FUNCTION public.impedir_alteracao_cnab_transmitida()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.status IN ('transmitida','enviada','processada','confirmada') THEN
    IF NEW.banco_codigo        IS DISTINCT FROM OLD.banco_codigo
       OR NEW.sequencial_arquivo IS DISTINCT FROM OLD.sequencial_arquivo
       OR NEW.data_geracao     IS DISTINCT FROM OLD.data_geracao
       OR NEW.total_pagamentos IS DISTINCT FROM OLD.total_pagamentos
       OR NEW.valor_total      IS DISTINCT FROM OLD.valor_total
       OR NEW.arquivo_url      IS DISTINCT FROM OLD.arquivo_url
       OR NEW.empresa_id       IS DISTINCT FROM OLD.empresa_id
       OR NEW.hash_integridade IS DISTINCT FROM OLD.hash_integridade THEN
      RAISE EXCEPTION 'Remessa CNAB transmitida é imutável. Gere uma nova remessa de estorno/complementar.'
        USING ERRCODE = 'check_violation';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_impedir_alteracao_cnab_transmitida ON public.cnab_remessas;
CREATE TRIGGER trg_impedir_alteracao_cnab_transmitida
BEFORE UPDATE ON public.cnab_remessas
FOR EACH ROW EXECUTE FUNCTION public.impedir_alteracao_cnab_transmitida();

-- Proibir DELETE
CREATE OR REPLACE FUNCTION public.proibir_delete_cnab_transmitida()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.status IN ('transmitida','enviada','processada','confirmada') THEN
    RAISE EXCEPTION 'Remessas CNAB transmitidas não podem ser deletadas (rastreabilidade financeira - retenção mínima 5 anos).'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_proibir_delete_cnab_transmitida ON public.cnab_remessas;
CREATE TRIGGER trg_proibir_delete_cnab_transmitida
BEFORE DELETE ON public.cnab_remessas
FOR EACH ROW EXECUTE FUNCTION public.proibir_delete_cnab_transmitida();
