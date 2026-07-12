
-- ============================================================================
-- WORM: Documentos com Assinatura Digital (MP 2.200-2/2001)
-- Cenários simulados:
--  1. Contrato de trabalho assinado -> imutável (base CLT)
--  2. Termo de confidencialidade -> imutável (defesa em ações)
--  3. Aditivo contratual assinado -> imutável (novo documento, não altera anterior)
--  4. Recibo de férias/EPI/holerite via portal -> imutável
--  5. Tentativa de alterar conteúdo pós-assinatura: BLOQUEADO
--  6. Tentativa de reassinar (limpar assinatura): BLOQUEADO
--  7. Cancelamento oficial (status=cancelado): permitido com motivo
--  8. Rascunho pendente -> livre para edição
-- ============================================================================

CREATE OR REPLACE FUNCTION public.enforce_documento_assinatura_hash()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_canonical TEXT;
BEGIN
  IF NEW.status = 'assinado'
     OR NEW.assinatura_base64 IS NOT NULL
     OR NEW.assinado_em IS NOT NULL THEN

    v_canonical := COALESCE(NEW.colaborador_id::text,'')     || '|' ||
                   COALESCE(NEW.empresa_id::text,'')         || '|' ||
                   COALESCE(NEW.tipo_documento,'')           || '|' ||
                   COALESCE(NEW.titulo,'')                   || '|' ||
                   COALESCE(NEW.conteudo_url,'')             || '|' ||
                   COALESCE(NEW.assinatura_base64,'')        || '|' ||
                   COALESCE(NEW.assinado_em::text,'')        || '|' ||
                   COALESCE(NEW.assinado_por::text,'')       || '|' ||
                   COALESCE(NEW.ip_assinatura,'')            || '|' ||
                   COALESCE(NEW.validade_assinatura::text,'');

    IF NEW.hash_documento IS NULL OR NEW.hash_documento = '' THEN
      NEW.hash_documento := encode(digest(v_canonical,'sha256'),'hex');
    END IF;

    IF NEW.assinado_em IS NULL AND NEW.status = 'assinado' THEN
      NEW.assinado_em := now();
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_documento_assinatura_hash() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enforce_documento_assinatura_hash() TO service_role;

DROP TRIGGER IF EXISTS tr_enforce_documento_assinatura_hash ON public.documentos_assinatura;
CREATE TRIGGER tr_enforce_documento_assinatura_hash
  BEFORE INSERT OR UPDATE ON public.documentos_assinatura
  FOR EACH ROW EXECUTE FUNCTION public.enforce_documento_assinatura_hash();

-- Imutabilidade após assinatura
CREATE OR REPLACE FUNCTION public.impedir_alteracao_documento_assinado()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.status = 'assinado' OR OLD.assinatura_base64 IS NOT NULL OR OLD.assinado_em IS NOT NULL THEN
    -- Permitido apenas: status -> 'cancelado' (com motivo em outro campo se aplicável)
    IF NEW.status = OLD.status THEN
      IF NEW.colaborador_id     IS DISTINCT FROM OLD.colaborador_id
         OR NEW.empresa_id      IS DISTINCT FROM OLD.empresa_id
         OR NEW.tipo_documento  IS DISTINCT FROM OLD.tipo_documento
         OR NEW.titulo          IS DISTINCT FROM OLD.titulo
         OR NEW.conteudo_url    IS DISTINCT FROM OLD.conteudo_url
         OR NEW.assinatura_base64 IS DISTINCT FROM OLD.assinatura_base64
         OR NEW.assinado_em     IS DISTINCT FROM OLD.assinado_em
         OR NEW.assinado_por    IS DISTINCT FROM OLD.assinado_por
         OR NEW.ip_assinatura   IS DISTINCT FROM OLD.ip_assinatura
         OR NEW.hash_documento  IS DISTINCT FROM OLD.hash_documento
         OR NEW.validade_assinatura IS DISTINCT FROM OLD.validade_assinatura THEN
        RAISE EXCEPTION 'Documento assinado digitalmente é imutável (MP 2.200-2/2001 - ICP-Brasil). Cancele oficialmente e emita novo documento.'
          USING ERRCODE = 'check_violation';
      END IF;
    ELSE
      IF NEW.status <> 'cancelado' THEN
        RAISE EXCEPTION 'Transição inválida em documento assinado. Permitido apenas: cancelado.'
          USING ERRCODE = 'check_violation';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_impedir_alteracao_documento_assinado ON public.documentos_assinatura;
CREATE TRIGGER tr_impedir_alteracao_documento_assinado
  BEFORE UPDATE ON public.documentos_assinatura
  FOR EACH ROW EXECUTE FUNCTION public.impedir_alteracao_documento_assinado();

-- Proibir DELETE físico
CREATE OR REPLACE FUNCTION public.proibir_delete_documento_assinado()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.status = 'assinado' OR OLD.assinatura_base64 IS NOT NULL OR OLD.assinado_em IS NOT NULL THEN
    RAISE EXCEPTION 'Documentos assinados digitalmente não podem ser deletados (validade jurídica MP 2.200-2/2001 - retenção mínima 5 anos após término do vínculo). Use status=cancelado.'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS tr_proibir_delete_documento_assinado ON public.documentos_assinatura;
CREATE TRIGGER tr_proibir_delete_documento_assinado
  BEFORE DELETE ON public.documentos_assinatura
  FOR EACH ROW EXECUTE FUNCTION public.proibir_delete_documento_assinado();
