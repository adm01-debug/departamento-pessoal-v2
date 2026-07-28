
-- Policies do bucket sst-programas
DROP POLICY IF EXISTS "sst_programas_read" ON storage.objects;
CREATE POLICY "sst_programas_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'sst-programas' AND
    auth.uid() IN (
      SELECT user_id FROM public.user_roles
      WHERE role IN ('admin','rh','gestor')
    )
  );

DROP POLICY IF EXISTS "sst_programas_write" ON storage.objects;
CREATE POLICY "sst_programas_write" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'sst-programas' AND
    auth.uid() IN (
      SELECT user_id FROM public.user_roles
      WHERE role IN ('admin','rh')
    )
  );

-- Campos adicionais em sst_programas
ALTER TABLE public.sst_programas
  ADD COLUMN IF NOT EXISTS hash_sha256 TEXT,
  ADD COLUMN IF NOT EXISTS versao INT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS gerado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE UNIQUE INDEX IF NOT EXISTS uq_sst_programa_ativo
  ON public.sst_programas(empresa_id, tipo)
  WHERE status = 'ativo';
