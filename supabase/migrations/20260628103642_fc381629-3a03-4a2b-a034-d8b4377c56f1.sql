CREATE INDEX IF NOT EXISTS idx_empresas_razao_social ON public.empresas (razao_social);
CREATE INDEX IF NOT EXISTS idx_empresas_ativa ON public.empresas (ativa) WHERE ativa = true;
CREATE INDEX IF NOT EXISTS idx_empresas_ordem_exibicao ON public.empresas (ordem_exibicao);
ANALYZE public.empresas;