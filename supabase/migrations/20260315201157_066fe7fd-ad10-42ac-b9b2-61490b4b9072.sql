-- Fix documentos_pessoais_arquivos: add missing columns used by UI
ALTER TABLE public.documentos_pessoais_arquivos
  ADD COLUMN IF NOT EXISTS numero text,
  ADD COLUMN IF NOT EXISTS orgao_emissor text,
  ADD COLUMN IF NOT EXISTS data_emissao text,
  ADD COLUMN IF NOT EXISTS data_validade text;

-- Fix dados_estagiario: add missing columns used by UI
ALTER TABLE public.dados_estagiario
  ADD COLUMN IF NOT EXISTS curso text,
  ADD COLUMN IF NOT EXISTS nivel text,
  ADD COLUMN IF NOT EXISTS supervisor_nome text,
  ADD COLUMN IF NOT EXISTS supervisor_cargo text,
  ADD COLUMN IF NOT EXISTS carga_horaria_semanal integer,
  ADD COLUMN IF NOT EXISTS valor_bolsa numeric,
  ADD COLUMN IF NOT EXISTS numero_apolice text;