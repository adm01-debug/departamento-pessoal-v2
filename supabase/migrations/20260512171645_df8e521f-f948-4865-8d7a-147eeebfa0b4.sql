-- Tabela de configurações do eSocial
CREATE TABLE IF NOT EXISTS public.configuracoes_esocial (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE UNIQUE,
    ambiente TEXT DEFAULT '2' CHECK (ambiente IN ('1', '2')), -- 1: Produção, 2: Produção Restrita
    certificado_id UUID REFERENCES public.certificados_digitais(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.configuracoes_esocial ENABLE ROW LEVEL SECURITY;

-- Remover política antiga se existir (caso falhou mas criou tabela)
DROP POLICY IF EXISTS "Empresas podem gerenciar suas configurações de eSocial" ON public.configuracoes_esocial;

CREATE POLICY "Empresas podem gerenciar suas configurações de eSocial" 
ON public.configuracoes_esocial FOR ALL
USING (auth.uid() IN (
    SELECT user_id FROM public.user_empresas WHERE empresa_id = configuracoes_esocial.empresa_id
));

-- Trigger para updated_at (assumindo que a função já existe globalmente)
DO $$ BEGIN
    CREATE TRIGGER update_configuracoes_esocial_updated_at
    BEFORE UPDATE ON public.configuracoes_esocial
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN OTHERS THEN NULL; END $$;
