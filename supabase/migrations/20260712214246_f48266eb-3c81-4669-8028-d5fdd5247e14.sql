
-- Extensão para digest sha256 (já habilitada globalmente, mas garantimos)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Colunas de hash/last4
ALTER TABLE public.colaboradores
  ADD COLUMN IF NOT EXISTS cpf_hash  TEXT,
  ADD COLUMN IF NOT EXISTS cpf_last4 TEXT;

-- Função de normalização e hash
CREATE OR REPLACE FUNCTION public.fn_colab_cpf_hash()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_norm TEXT;
BEGIN
  IF NEW.cpf IS NULL OR length(btrim(NEW.cpf)) = 0 THEN
    NEW.cpf_hash  := NULL;
    NEW.cpf_last4 := NULL;
    RETURN NEW;
  END IF;
  v_norm := regexp_replace(NEW.cpf, '\D', '', 'g');
  IF length(v_norm) = 11 THEN
    NEW.cpf_hash  := encode(digest(v_norm, 'sha256'), 'hex');
    NEW.cpf_last4 := right(v_norm, 4);
  ELSE
    NEW.cpf_hash  := encode(digest(v_norm, 'sha256'), 'hex');
    NEW.cpf_last4 := right(v_norm, LEAST(length(v_norm), 4));
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.fn_colab_cpf_hash() FROM PUBLIC;

DROP TRIGGER IF EXISTS trg_colab_cpf_hash ON public.colaboradores;
CREATE TRIGGER trg_colab_cpf_hash
  BEFORE INSERT OR UPDATE OF cpf ON public.colaboradores
  FOR EACH ROW EXECUTE FUNCTION public.fn_colab_cpf_hash();

-- Backfill dos registros existentes
UPDATE public.colaboradores
   SET cpf_hash  = encode(digest(regexp_replace(cpf, '\D', '', 'g'), 'sha256'), 'hex'),
       cpf_last4 = right(regexp_replace(cpf, '\D', '', 'g'), 4)
 WHERE cpf IS NOT NULL
   AND (cpf_hash IS NULL OR cpf_last4 IS NULL);

-- Índice único parcial (permite múltiplos NULL, garante unicidade)
CREATE UNIQUE INDEX IF NOT EXISTS ux_colaboradores_cpf_hash
  ON public.colaboradores (cpf_hash)
  WHERE cpf_hash IS NOT NULL;

-- Índice de suporte para busca por últimos 4 (UI de suporte)
CREATE INDEX IF NOT EXISTS idx_colaboradores_cpf_last4
  ON public.colaboradores (cpf_last4)
  WHERE cpf_last4 IS NOT NULL;

ANALYZE public.colaboradores;
