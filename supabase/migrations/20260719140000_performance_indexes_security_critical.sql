-- Performance indexes for security-critical tenant isolation queries
-- These indexes accelerate RLS policy checks and frontend tenant-scoped queries.
-- All are CREATE INDEX IF NOT EXISTS to be idempotent.

-- =============================================================================
-- audit_log: queried by empresa_id + created_at (auditoriaService.listar)
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_audit_log_empresa_id
  ON public.audit_log (empresa_id);

CREATE INDEX IF NOT EXISTS idx_audit_log_empresa_created
  ON public.audit_log (empresa_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_log_registro_id
  ON public.audit_log (registro_id);

-- =============================================================================
-- colaboradores: core tenant table, RLS uses empresa_id extensively
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_colaboradores_empresa_id
  ON public.colaboradores (empresa_id);

CREATE INDEX IF NOT EXISTS idx_colaboradores_empresa_status
  ON public.colaboradores (empresa_id, status);

-- =============================================================================
-- folhas_pagamento: financial data, queried by empresa_id + competencia
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_folhas_pagamento_empresa_id
  ON public.folhas_pagamento (empresa_id);

CREATE INDEX IF NOT EXISTS idx_folhas_pagamento_empresa_competencia
  ON public.folhas_pagamento (empresa_id, competencia DESC);

-- =============================================================================
-- ferias: RLS joins through colaboradores.empresa_id
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_ferias_colaborador_id
  ON public.ferias (colaborador_id);

CREATE INDEX IF NOT EXISTS idx_ferias_status
  ON public.ferias (status);

-- =============================================================================
-- pontos: RLS joins through colaboradores.empresa_id, high volume table
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_pontos_colaborador_id
  ON public.pontos (colaborador_id);

CREATE INDEX IF NOT EXISTS idx_pontos_colaborador_data
  ON public.pontos (colaborador_id, data DESC);

-- =============================================================================
-- webhooks_config: queried by empresa_id (integracaoService)
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_webhooks_config_empresa_id
  ON public.webhooks_config (empresa_id);

-- =============================================================================
-- webhook_logs: queried by empresa_id (integracaoService.getLogs)
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_webhook_logs_empresa_id
  ON public.webhook_logs (empresa_id);

CREATE INDEX IF NOT EXISTS idx_webhook_logs_empresa_created
  ON public.webhook_logs (empresa_id, created_at DESC);

-- =============================================================================
-- cnab_configuracoes: queried by empresa_id (cnabService.getConfig)
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_cnab_configuracoes_empresa_id
  ON public.cnab_configuracoes (empresa_id);

-- =============================================================================
-- cnab_remessas: queried by empresa_id + created_at
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_cnab_remessas_empresa_id
  ON public.cnab_remessas (empresa_id);

CREATE INDEX IF NOT EXISTS idx_cnab_remessas_empresa_created
  ON public.cnab_remessas (empresa_id, created_at DESC);

-- =============================================================================
-- premiacoes_campanhas: queried by empresa_id
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_premiacoes_campanhas_empresa_id
  ON public.premiacoes_campanhas (empresa_id);

-- =============================================================================
-- premiacoes_pagamentos: financial, queried by campanha_id and status
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_premiacoes_pagamentos_campanha_id
  ON public.premiacoes_pagamentos (campanha_id);

CREATE INDEX IF NOT EXISTS idx_premiacoes_pagamentos_status
  ON public.premiacoes_pagamentos (status);

CREATE INDEX IF NOT EXISTS idx_premiacoes_pagamentos_colaborador
  ON public.premiacoes_pagamentos (colaborador_id);

-- =============================================================================
-- premiacoes_roi_cenarios: queried by empresa_id
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_premiacoes_roi_cenarios_empresa_id
  ON public.premiacoes_roi_cenarios (empresa_id);

-- =============================================================================
-- notificacoes: queried by user_id + lida status
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_notificacoes_user_id
  ON public.notificacoes (user_id);

CREATE INDEX IF NOT EXISTS idx_notificacoes_user_lida
  ON public.notificacoes (user_id, lida, created_at DESC);

-- =============================================================================
-- periodos_experiencia: joined through colaboradores for RLS
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_periodos_experiencia_colaborador_id
  ON public.periodos_experiencia (colaborador_id);

-- =============================================================================
-- user_roles: critical for authorization checks
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_user_roles_empresa_id
  ON public.user_roles (empresa_id);

-- =============================================================================
-- dependentes, historico_salarial, asos: joined via colaborador_id
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_dependentes_colaborador_id
  ON public.dependentes (colaborador_id);

CREATE INDEX IF NOT EXISTS idx_historico_salarial_colaborador_id
  ON public.historico_salarial (colaborador_id);

CREATE INDEX IF NOT EXISTS idx_asos_colaborador_id
  ON public.asos (colaborador_id);

CREATE INDEX IF NOT EXISTS idx_formacoes_academicas_colaborador_id
  ON public.formacoes_academicas (colaborador_id);

-- =============================================================================
-- folha_itens: high-volume, queried by colaborador_id and folha_id
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_folha_itens_colaborador_id
  ON public.folha_itens (colaborador_id);

CREATE INDEX IF NOT EXISTS idx_folha_itens_folha_id
  ON public.folha_itens (folha_id);

-- =============================================================================
-- documentos: queried by colaborador_id (document storage)
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_documentos_colaborador_id
  ON public.documentos (colaborador_id);

CREATE INDEX IF NOT EXISTS idx_documentos_empresa_id
  ON public.documentos (empresa_id);
