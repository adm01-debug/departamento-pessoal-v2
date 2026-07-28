
-- 1) Backfill e NOT NULL
UPDATE public.folhas_pagamento SET version = 1 WHERE version IS NULL OR version < 1;
ALTER TABLE public.folhas_pagamento ALTER COLUMN version SET DEFAULT 1;
ALTER TABLE public.folhas_pagamento ALTER COLUMN version SET NOT NULL;

-- 2) Índice de suporte
CREATE INDEX IF NOT EXISTS idx_folhas_pagamento_id_version ON public.folhas_pagamento (id, version);

-- 3) Tabela de métricas de conflitos (append-only)
CREATE TABLE IF NOT EXISTS public.folha_lock_conflicts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folha_id uuid NOT NULL,
  empresa_id uuid,
  competencia text,
  version_esperada integer NOT NULL,
  version_atual integer NOT NULL,
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.folha_lock_conflicts TO authenticated;
GRANT ALL ON public.folha_lock_conflicts TO service_role;
ALTER TABLE public.folha_lock_conflicts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admins veem conflitos" ON public.folha_lock_conflicts;
CREATE POLICY "admins veem conflitos" ON public.folha_lock_conflicts
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "sistema registra conflitos" ON public.folha_lock_conflicts;
CREATE POLICY "sistema registra conflitos" ON public.folha_lock_conflicts
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_folha_lock_conflicts_folha ON public.folha_lock_conflicts (folha_id, created_at DESC);

-- Append-only: bloqueia UPDATE/DELETE (reusa função já existente audit_log_append_only)
DROP TRIGGER IF EXISTS trg_folha_lock_conflicts_ao ON public.folha_lock_conflicts;
CREATE TRIGGER trg_folha_lock_conflicts_ao
  BEFORE UPDATE OR DELETE ON public.folha_lock_conflicts
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_append_only();

-- 4) Trigger de optimistic locking
CREATE OR REPLACE FUNCTION public.fn_folha_optimistic_lock()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Se o cliente enviou uma versão explícita diferente da atual → CONFLITO
  IF NEW.version IS NOT NULL
     AND NEW.version <> OLD.version
     AND NEW.version <> OLD.version + 1 THEN

    -- Registra o conflito para observabilidade (best-effort)
    BEGIN
      INSERT INTO public.folha_lock_conflicts
        (folha_id, empresa_id, competencia, version_esperada, version_atual, user_id)
      VALUES
        (OLD.id, OLD.empresa_id, OLD.competencia::text, NEW.version, OLD.version, auth.uid());
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;

    RAISE EXCEPTION 'Conflito de concorrência em folha_pagamento (id=%): versão esperada %, versão atual %. Recarregue e tente novamente.',
      OLD.id, NEW.version, OLD.version
      USING ERRCODE = '40001'; -- serialization_failure → retry-friendly
  END IF;

  -- Auto-incremento da versão em qualquer UPDATE
  NEW.version := OLD.version + 1;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_folha_optimistic_lock ON public.folhas_pagamento;
CREATE TRIGGER trg_folha_optimistic_lock
  BEFORE UPDATE ON public.folhas_pagamento
  FOR EACH ROW EXECUTE FUNCTION public.fn_folha_optimistic_lock();

-- 5) Função de estatísticas (para dashboard)
CREATE OR REPLACE FUNCTION public.folha_conflict_stats(_days integer DEFAULT 7)
RETURNS TABLE(competencia text, conflitos bigint, ultimo_em timestamptz)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.competencia, count(*)::bigint AS conflitos, max(c.created_at) AS ultimo_em
  FROM public.folha_lock_conflicts c
  WHERE c.created_at > now() - make_interval(days => _days)
    AND public.has_role(auth.uid(), 'admin'::app_role)
  GROUP BY c.competencia
  ORDER BY conflitos DESC;
$$;
