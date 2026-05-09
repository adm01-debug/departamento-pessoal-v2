-- Enable pgcrypto if not already
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add compliance fields to RAW events (batidas_ponto)
ALTER TABLE public.batidas_ponto 
ADD COLUMN IF NOT EXISTS hash_digital TEXT,
ADD COLUMN IF NOT EXISTS dispositivo_id TEXT,
ADD COLUMN IF NOT EXISTS versao_app TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/Sao_Paulo',
ADD COLUMN IF NOT EXISTS latitude NUMERIC,
ADD COLUMN IF NOT EXISTS longitude NUMERIC,
ADD COLUMN IF NOT EXISTS precisao_metros INTEGER,
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS dentro_raio BOOLEAN,
ADD COLUMN IF NOT EXISTS ajustado BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ajustado_por TEXT,
ADD COLUMN IF NOT EXISTS motivo_ajuste TEXT;

-- Update hashing function for batidas_ponto
CREATE OR REPLACE FUNCTION public.gerar_hash_batida_ponto()
RETURNS TRIGGER AS $$
BEGIN
  NEW.hash_digital := encode(digest(
    COALESCE(NEW.colaborador_id::text, '') || 
    COALESCE(NEW.data::text, '') || 
    COALESCE(NEW.hora::text, '') || 
    COALESCE(NEW.tipo, '') ||
    COALESCE(NEW.dispositivo_id, '') ||
    COALESCE(NEW.ip_address, ''), 
    'sha256'
  ), 'hex');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS tr_gerar_hash_batida_ponto ON public.batidas_ponto;
CREATE TRIGGER tr_gerar_hash_batida_ponto
BEFORE INSERT ON public.batidas_ponto
FOR EACH ROW
EXECUTE FUNCTION public.gerar_hash_batida_ponto();
