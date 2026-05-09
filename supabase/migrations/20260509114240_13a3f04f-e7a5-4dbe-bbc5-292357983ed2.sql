ALTER TABLE public.locais_trabalho 
ADD COLUMN IF NOT EXISTS latitude NUMERIC,
ADD COLUMN IF NOT EXISTS longitude NUMERIC;

-- Insert default point settings for existing companies if they don't have it
INSERT INTO public.configuracoes_ponto (empresa_id)
SELECT id FROM public.empresas
ON CONFLICT (empresa_id) DO NOTHING;
