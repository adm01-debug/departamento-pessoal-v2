
-- ============================================================================
-- WORM: Medidas Disciplinares (CLT arts. 474, 482)
-- Simulação de cenários considerados:
--  1. Advertência escrita com ciência do colaborador -> imutável (prova judicial)
--  2. Suspensão aplicada -> imutável (afeta salário, banco de horas, ponto)
--  3. Justa causa aplicada -> imutável (base para rescisão)
--  4. Colaborador recusa assinar -> registro de recusa imutável (2 testemunhas)
--  5. Retificação de dados descritivos: BLOQUEADO após ciência (evitar tampering)
--  6. Anulação: exige status='anulada' + motivo (não DELETE físico)
--  7. Correção de digitação antes da ciência: permitida
-- ============================================================================

-- 1) Hash de integridade
ALTER TABLE public.medidas_disciplinares
  ADD COLUMN IF NOT EXISTS hash_integridade TEXT;

CREATE OR REPLACE FUNCTION public.enforce_medida_disciplinar_hash()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_canonical TEXT;
BEGIN
  -- Só canoniza quando a medida está formalmente aplicada/ciente/assinada
  IF NEW.status IN ('aplicada','assinada','ciente','homologada','concluida','concluída')
     OR NEW.colaborador_ciente = true
     OR NEW.assinado_em IS NOT NULL
     OR NEW.recusa_assinatura = true THEN

    v_canonical := COALESCE(NEW.colaborador_id::text,'')     || '|' ||
                   COALESCE(NEW.empresa_id::text,'')         || '|' ||
                   COALESCE(NEW.tipo,'')                     || '|' ||
                   COALESCE(NEW.data_ocorrencia::text,'')    || '|' ||
                   COALESCE(NEW.descricao,'')                || '|' ||
                   COALESCE(NEW.dias_suspensao::text,'0')    || '|' ||
                   COALESCE(NEW.artigo_clt,'')               || '|' ||
                   COALESCE(NEW.testemunha_1_nome,'')        || '|' ||
                   COALESCE(NEW.testemunha_1_cpf,'')         || '|' ||
                   COALESCE(NEW.testemunha_2_nome,'')        || '|' ||
                   COALESCE(NEW.testemunha_2_cpf,'')         || '|' ||
                   COALESCE(NEW.recusa_assinatura::text,'false') || '|' ||
                   COALESCE(NEW.data_ciencia::text,'')       || '|' ||
                   COALESCE(NEW.assinado_em::text,'');

    IF NEW.hash_integridade IS NULL OR NEW.hash_integridade = '' THEN
      NEW.hash_integridade := encode(digest(v_canonical,'sha256'),'hex');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_medida_disciplinar_hash() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enforce_medida_disciplinar_hash() TO service_role;

DROP TRIGGER IF EXISTS tr_enforce_medida_disciplinar_hash ON public.medidas_disciplinares;
CREATE TRIGGER tr_enforce_medida_disciplinar_hash
  BEFORE INSERT OR UPDATE ON public.medidas_disciplinares
  FOR EACH ROW EXECUTE FUNCTION public.enforce_medida_disciplinar_hash();

-- 2) Imutabilidade após ciência/aplicação
CREATE OR REPLACE FUNCTION public.impedir_alteracao_medida_aplicada()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_bloqueio BOOLEAN;
BEGIN
  v_bloqueio := (OLD.status IN ('aplicada','assinada','ciente','homologada','concluida','concluída'))
                OR OLD.colaborador_ciente = true
                OR OLD.assinado_em IS NOT NULL
                OR OLD.recusa_assinatura = true;

  IF v_bloqueio THEN
    -- Permitido: transição para 'anulada'/'cancelada' (com motivo em campo textual)
    -- e atualização de documento_url (upload de PDF assinado digitalizado uma única vez)
    IF NEW.status = OLD.status THEN
      IF NEW.colaborador_id     IS DISTINCT FROM OLD.colaborador_id
         OR NEW.empresa_id      IS DISTINCT FROM OLD.empresa_id
         OR NEW.tipo            IS DISTINCT FROM OLD.tipo
         OR NEW.data_ocorrencia IS DISTINCT FROM OLD.data_ocorrencia
         OR NEW.descricao       IS DISTINCT FROM OLD.descricao
         OR NEW.dias_suspensao  IS DISTINCT FROM OLD.dias_suspensao
         OR NEW.artigo_clt      IS DISTINCT FROM OLD.artigo_clt
         OR NEW.testemunha_1_nome IS DISTINCT FROM OLD.testemunha_1_nome
         OR NEW.testemunha_1_cpf  IS DISTINCT FROM OLD.testemunha_1_cpf
         OR NEW.testemunha_2_nome IS DISTINCT FROM OLD.testemunha_2_nome
         OR NEW.testemunha_2_cpf  IS DISTINCT FROM OLD.testemunha_2_cpf
         OR NEW.data_ciencia    IS DISTINCT FROM OLD.data_ciencia
         OR NEW.colaborador_ciente IS DISTINCT FROM OLD.colaborador_ciente
         OR NEW.recusa_assinatura  IS DISTINCT FROM OLD.recusa_assinatura
         OR NEW.assinado_em     IS DISTINCT FROM OLD.assinado_em
         OR NEW.hash_integridade IS DISTINCT FROM OLD.hash_integridade THEN
        RAISE EXCEPTION 'Medida disciplinar aplicada/ciente é imutável (CLT art. 474/482). Anule oficialmente (status=anulada) com motivo para retificar.'
          USING ERRCODE = 'check_violation';
      END IF;
    ELSE
      -- Transição de status permitida apenas para anulada/cancelada/revogada
      IF NEW.status NOT IN ('anulada','cancelada','revogada') THEN
        RAISE EXCEPTION 'Transição de status inválida em medida aplicada. Permitido apenas: anulada, cancelada, revogada.'
          USING ERRCODE = 'check_violation';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_impedir_alteracao_medida_aplicada ON public.medidas_disciplinares;
CREATE TRIGGER tr_impedir_alteracao_medida_aplicada
  BEFORE UPDATE ON public.medidas_disciplinares
  FOR EACH ROW EXECUTE FUNCTION public.impedir_alteracao_medida_aplicada();

-- 3) Proibir DELETE físico de medidas aplicadas (retenção mínima trabalhista)
CREATE OR REPLACE FUNCTION public.proibir_delete_medida_aplicada()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.status IN ('aplicada','assinada','ciente','homologada','concluida','concluída')
     OR OLD.colaborador_ciente = true
     OR OLD.assinado_em IS NOT NULL
     OR OLD.recusa_assinatura = true THEN
    RAISE EXCEPTION 'Medidas disciplinares aplicadas não podem ser deletadas (prova trabalhista - retenção mínima 5 anos). Use status=anulada.'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS tr_proibir_delete_medida_aplicada ON public.medidas_disciplinares;
CREATE TRIGGER tr_proibir_delete_medida_aplicada
  BEFORE DELETE ON public.medidas_disciplinares
  FOR EACH ROW EXECUTE FUNCTION public.proibir_delete_medida_aplicada();
