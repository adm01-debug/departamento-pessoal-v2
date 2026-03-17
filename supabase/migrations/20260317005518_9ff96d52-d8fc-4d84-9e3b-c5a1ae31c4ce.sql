
-- =============================================
-- MIGRATION 2: FÉRIAS - Workflow aprovação 3 níveis
-- =============================================
ALTER TABLE public.ferias
  ADD COLUMN IF NOT EXISTS aprovado_gestor boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS aprovado_gestor_em timestamptz,
  ADD COLUMN IF NOT EXISTS aprovado_gestor_por uuid,
  ADD COLUMN IF NOT EXISTS aprovado_rh boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS aprovado_rh_em timestamptz,
  ADD COLUMN IF NOT EXISTS aprovado_rh_por uuid,
  ADD COLUMN IF NOT EXISTS enviado_contabilidade boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS enviado_contabilidade_em timestamptz,
  ADD COLUMN IF NOT EXISTS enviado_contabilidade_por uuid,
  ADD COLUMN IF NOT EXISTS abono_pecuniario boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS valor_abono_pecuniario numeric(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS adiantamento_13 boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS valor_adiantamento_13 numeric(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cancelado boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS cancelado_em timestamptz,
  ADD COLUMN IF NOT EXISTS cancelado_por uuid,
  ADD COLUMN IF NOT EXISTS motivo_cancelamento text,
  ADD COLUMN IF NOT EXISTS justificativa text,
  ADD COLUMN IF NOT EXISTS documento_url text;
