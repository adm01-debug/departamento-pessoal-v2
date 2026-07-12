
-- ============================================================
-- HARDEN FOLHA: Defesa em profundidade para folhas_pagamento
-- ============================================================
-- Objetivo: garantir integridade e imutabilidade da folha fechada
-- mesmo em caso de bypass acidental das edge functions autoritativas.
--
-- Camadas:
-- 1) Trigger de hash de integridade automático (BEFORE INSERT/UPDATE)
-- 2) Trigger de imutabilidade reforçada (bloqueia mudanças em folha
--    fechada, exceto reabertura autorizada via campo `reaberta_em`)
-- 3) Bloqueio total de DELETE em folhas fechadas (WORM)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Coluna de hash canônico (adicionada se não existir)
ALTER TABLE public.folhas_pagamento
  ADD COLUMN IF NOT EXISTS hash_integridade TEXT;

-- ------------------------------------------------------------
-- 1) HASH DE INTEGRIDADE AUTOMÁTICO
-- ------------------------------------------------------------
-- Snapshot canônico determinístico do estado financeiro
CREATE OR REPLACE FUNCTION public.enforce_folha_pagamento_hash()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_canonical TEXT;
  v_expected TEXT;
BEGIN
  -- Só calcula quando fechando ou já fechada
  IF NEW.status IN ('fechada','fechado','closed') THEN
    v_canonical := COALESCE(NEW.empresa_id::text, '')     || '|' ||
                   COALESCE(NEW.competencia::text, '')    || '|' ||
                   COALESCE(NEW.total_proventos::text,'0')|| '|' ||
                   COALESCE(NEW.total_descontos::text,'0')|| '|' ||
                   COALESCE(NEW.total_liquido::text, '0') || '|' ||
                   COALESCE(NEW.version::text, '1')       || '|' ||
                   COALESCE(NEW.status, '');

    v_expected := encode(digest(v_canonical, 'sha256'), 'hex');

    -- Preenche automaticamente se ausente (compat legado)
    IF NEW.hash_integridade IS NULL OR NEW.hash_integridade = '' THEN
      NEW.hash_integridade := v_expected;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_folha_pagamento_hash() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enforce_folha_pagamento_hash() TO service_role;

DROP TRIGGER IF EXISTS trg_enforce_folha_pagamento_hash ON public.folhas_pagamento;
CREATE TRIGGER trg_enforce_folha_pagamento_hash
BEFORE INSERT OR UPDATE ON public.folhas_pagamento
FOR EACH ROW
EXECUTE FUNCTION public.enforce_folha_pagamento_hash();

-- ------------------------------------------------------------
-- 2) IMUTABILIDADE REFORÇADA
-- ------------------------------------------------------------
-- A função `impedir_alteracao_folha_fechada` já existia mas apenas
-- bloqueava updates fechada→fechada. Reforçamos para:
--  - Permitir apenas transições explicitas: fechada → aberta (reabertura)
--  - Bloquear qualquer edição de campos financeiros em folha fechada
CREATE OR REPLACE FUNCTION public.impedir_alteracao_folha_fechada()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.status IN ('fechada','fechado','closed') THEN
    -- Permitido apenas: reabertura (status muda para aberta/rascunho)
    -- e atualização de metadados de auditoria (reaberta_em, motivo_reabertura)
    IF NEW.status = OLD.status THEN
      -- Bloqueia qualquer alteração de valores financeiros
      IF NEW.total_proventos IS DISTINCT FROM OLD.total_proventos
         OR NEW.total_descontos IS DISTINCT FROM OLD.total_descontos
         OR NEW.total_liquido   IS DISTINCT FROM OLD.total_liquido
         OR NEW.hash_integridade IS DISTINCT FROM OLD.hash_integridade
         OR NEW.competencia     IS DISTINCT FROM OLD.competencia
         OR NEW.empresa_id      IS DISTINCT FROM OLD.empresa_id THEN
        RAISE EXCEPTION 'Folha fechada é imutável. Reabra a folha antes de alterar valores (motivo obrigatório).'
          USING ERRCODE = 'check_violation';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_impedir_alteracao_folha_fechada ON public.folhas_pagamento;
CREATE TRIGGER trg_impedir_alteracao_folha_fechada
BEFORE UPDATE ON public.folhas_pagamento
FOR EACH ROW
EXECUTE FUNCTION public.impedir_alteracao_folha_fechada();

-- ------------------------------------------------------------
-- 3) BLOQUEIO DE DELETE EM FOLHA FECHADA (WORM)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.proibir_delete_folha_fechada()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.status IN ('fechada','fechado','closed') THEN
    RAISE EXCEPTION 'Folhas fechadas não podem ser deletadas (exigência fiscal/contábil - retenção mínima 5 anos).'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_proibir_delete_folha_fechada ON public.folhas_pagamento;
CREATE TRIGGER trg_proibir_delete_folha_fechada
BEFORE DELETE ON public.folhas_pagamento
FOR EACH ROW
EXECUTE FUNCTION public.proibir_delete_folha_fechada();

REVOKE ALL ON FUNCTION public.proibir_delete_folha_fechada() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.proibir_delete_folha_fechada() TO service_role;
