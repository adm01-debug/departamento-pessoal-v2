
CREATE OR REPLACE FUNCTION public.enforce_esocial_evento_hash()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_canonical TEXT;
BEGIN
  IF NEW.status IN ('enviado','processado','aceito') OR NEW.recibo IS NOT NULL OR NEW.id_recibo IS NOT NULL THEN
    v_canonical := COALESCE(NEW.empresa_id::text,'')  || '|' ||
                   COALESCE(NEW.tipo_evento,'')       || '|' ||
                   COALESCE(NEW.competencia,'')       || '|' ||
                   COALESCE(NEW.xml_envio, NEW.xml, '') || '|' ||
                   COALESCE(NEW.protocolo,'')         || '|' ||
                   COALESCE(NEW.recibo,'')            || '|' ||
                   COALESCE(NEW.id_recibo,'');

    IF NEW.hash_arquivo IS NULL OR NEW.hash_arquivo = '' THEN
      NEW.hash_arquivo := encode(digest(v_canonical,'sha256'),'hex');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_esocial_evento_hash() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enforce_esocial_evento_hash() TO service_role;

DROP TRIGGER IF EXISTS trg_enforce_esocial_evento_hash ON public.esocial_eventos;
CREATE TRIGGER trg_enforce_esocial_evento_hash
BEFORE INSERT OR UPDATE ON public.esocial_eventos
FOR EACH ROW EXECUTE FUNCTION public.enforce_esocial_evento_hash();

-- Imutabilidade: uma vez transmitido com recibo, campos-chave são imutáveis
CREATE OR REPLACE FUNCTION public.impedir_alteracao_esocial_transmitido()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.recibo IS NOT NULL OR OLD.id_recibo IS NOT NULL THEN
    IF NEW.xml_envio    IS DISTINCT FROM OLD.xml_envio
       OR NEW.xml       IS DISTINCT FROM OLD.xml
       OR NEW.dados     IS DISTINCT FROM OLD.dados
       OR NEW.tipo_evento IS DISTINCT FROM OLD.tipo_evento
       OR NEW.competencia IS DISTINCT FROM OLD.competencia
       OR NEW.empresa_id  IS DISTINCT FROM OLD.empresa_id
       OR NEW.protocolo   IS DISTINCT FROM OLD.protocolo
       OR NEW.recibo      IS DISTINCT FROM OLD.recibo
       OR NEW.id_recibo   IS DISTINCT FROM OLD.id_recibo
       OR NEW.hash_arquivo IS DISTINCT FROM OLD.hash_arquivo THEN
      RAISE EXCEPTION 'Evento eSocial transmitido (com recibo/protocolo) é imutável. Envie um evento de retificação/exclusão via layout oficial.'
        USING ERRCODE = 'check_violation';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_impedir_alteracao_esocial_transmitido ON public.esocial_eventos;
CREATE TRIGGER trg_impedir_alteracao_esocial_transmitido
BEFORE UPDATE ON public.esocial_eventos
FOR EACH ROW EXECUTE FUNCTION public.impedir_alteracao_esocial_transmitido();

-- Proibir DELETE de evento transmitido
CREATE OR REPLACE FUNCTION public.proibir_delete_esocial_transmitido()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.recibo IS NOT NULL OR OLD.id_recibo IS NOT NULL OR OLD.status IN ('enviado','processado','aceito') THEN
    RAISE EXCEPTION 'Eventos eSocial transmitidos ao governo não podem ser deletados (exigência legal - use evento S-3000 de exclusão).'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_proibir_delete_esocial_transmitido ON public.esocial_eventos;
CREATE TRIGGER trg_proibir_delete_esocial_transmitido
BEFORE DELETE ON public.esocial_eventos
FOR EACH ROW EXECUTE FUNCTION public.proibir_delete_esocial_transmitido();
