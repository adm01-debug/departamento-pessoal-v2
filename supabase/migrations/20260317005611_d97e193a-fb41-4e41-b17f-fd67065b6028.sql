
-- =============================================
-- MIGRATION 4: MEDIDAS_DISCIPLINARES - Campos jurídicos
-- =============================================
ALTER TABLE public.medidas_disciplinares
  ADD COLUMN IF NOT EXISTS numero_sequencial serial,
  ADD COLUMN IF NOT EXISTS artigo_clt text,
  ADD COLUMN IF NOT EXISTS testemunha_1_nome text,
  ADD COLUMN IF NOT EXISTS testemunha_1_cpf text,
  ADD COLUMN IF NOT EXISTS testemunha_2_nome text,
  ADD COLUMN IF NOT EXISTS testemunha_2_cpf text,
  ADD COLUMN IF NOT EXISTS data_ciencia timestamptz,
  ADD COLUMN IF NOT EXISTS colaborador_ciente boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS documento_url text,
  ADD COLUMN IF NOT EXISTS recusa_assinatura boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS motivo_recusa text;
