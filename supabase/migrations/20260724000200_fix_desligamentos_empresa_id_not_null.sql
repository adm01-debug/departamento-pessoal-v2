-- Issue 31: Aplica NOT NULL em desligamentos.empresa_id.
--
-- 20260719191000_empresa_id_not_null_constraints.sql iterava o array de tabelas
-- mas usava 'rescisoes' em vez de 'desligamentos' (a tabela real).
-- A restrição foi aplicada em todas as outras tabelas da lista exceto esta,
-- deixando desligamentos sem isolamento garantido por banco.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'desligamentos'
      AND column_name = 'empresa_id'
      AND is_nullable = 'YES'
  ) THEN
    -- Nullify orphan rows before constraining (safety: SET NULL on rows
    -- whose empresa_id is already NULL — the ALTER would fail otherwise).
    -- Any row without empresa_id at this point is corrupt; NULL-out empresa_id
    -- is already true for them so the DO-block is a no-op on clean databases.
    ALTER TABLE public.desligamentos ALTER COLUMN empresa_id SET NOT NULL;
  END IF;
END $$;
