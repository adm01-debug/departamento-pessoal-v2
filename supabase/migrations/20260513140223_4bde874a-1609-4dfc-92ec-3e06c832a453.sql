-- Add version column to critical tables
ALTER TABLE public.folhas_pagamento ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE public.registros_ponto ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- Create function to increment version
CREATE OR REPLACE FUNCTION public.increment_version()
RETURNS TRIGGER AS $$
BEGIN
  NEW.version = OLD.version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
DROP TRIGGER IF EXISTS tr_increment_version_folhas ON public.folhas_pagamento;
CREATE TRIGGER tr_increment_version_folhas
BEFORE UPDATE ON public.folhas_pagamento
FOR EACH ROW
EXECUTE FUNCTION public.increment_version();

DROP TRIGGER IF EXISTS tr_increment_version_ponto ON public.registros_ponto;
CREATE TRIGGER tr_increment_version_ponto
BEFORE UPDATE ON public.registros_ponto
FOR EACH ROW
EXECUTE FUNCTION public.increment_version();

DROP TRIGGER IF EXISTS tr_increment_version_colab ON public.colaboradores;
CREATE TRIGGER tr_increment_version_colab
BEFORE UPDATE ON public.colaboradores
FOR EACH ROW
EXECUTE FUNCTION public.increment_version();