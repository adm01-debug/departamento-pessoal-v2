-- Ensure empresa_id is never null on tenant-scoped business tables.
-- This prevents accidental data leaks across tenants if application code
-- fails to set empresa_id before insert.

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'colaboradores',
      'folhas_pagamento',
      'despesas',
      'dependentes',
      'contas_bancarias',
      'ferias',
      'rescisoes',
      'beneficios',
      'asos',
      'batidas_ponto',
      'holerites'
    ])
  LOOP
    -- Only add constraint if column exists and doesn't already have NOT NULL
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = tbl
        AND column_name = 'empresa_id'
        AND is_nullable = 'YES'
    ) THEN
      EXECUTE format(
        'ALTER TABLE public.%I ALTER COLUMN empresa_id SET NOT NULL',
        tbl
      );
    END IF;
  END LOOP;
END $$;

-- Add CHECK constraint to prevent empty-string empresa_id
DO $$
DECLARE
  tbl TEXT;
  cname TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'colaboradores',
      'folhas_pagamento',
      'despesas',
      'dependentes',
      'contas_bancarias',
      'ferias',
      'rescisoes',
      'beneficios',
      'asos',
      'batidas_ponto',
      'holerites'
    ])
  LOOP
    cname := 'chk_' || tbl || '_empresa_id_not_empty';
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = tbl
        AND column_name = 'empresa_id'
    ) AND NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = cname
    ) THEN
      EXECUTE format(
        'ALTER TABLE public.%I ADD CONSTRAINT %I CHECK (empresa_id <> '''')',
        tbl, cname
      );
    END IF;
  END LOOP;
END $$;
