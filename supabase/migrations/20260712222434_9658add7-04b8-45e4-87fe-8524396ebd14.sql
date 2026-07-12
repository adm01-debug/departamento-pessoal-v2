
-- Melhoria 35: índices para as 3 queries mais quentes identificadas via pg_stat_statements

-- 1. empresas: ordenação por razão social (listagem principal)
CREATE INDEX IF NOT EXISTS idx_empresas_razao_social
  ON public.empresas (razao_social);

-- 2. metricas_processamento: ordenação por timestamp DESC (monitor de fila)
CREATE INDEX IF NOT EXISTS idx_metricas_processamento_timestamp_desc
  ON public.metricas_processamento (timestamp DESC);

-- 3. notificacoes: filtro multi-tenant + ordenação recente-primeiro (bell/inbox)
CREATE INDEX IF NOT EXISTS idx_notificacoes_empresa_created_desc
  ON public.notificacoes (empresa_id, created_at DESC);
