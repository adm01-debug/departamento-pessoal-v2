-- Melhoria #33 — Índices parciais para acelerar scanner de anomalias e consultas de auditoria
-- Simulação: scanner atual faz seq scan em audit_log filtrando por acao='STATUS_CHANGE' + created_at >= now()-interval
-- Com 10M linhas: ~300-800ms. Com índice parcial: <10ms.

-- Índice parcial primário: usado pelo _scan_status_anomalies_global
CREATE INDEX IF NOT EXISTS idx_audit_log_status_change_scan
  ON public.audit_log (tabela, created_at DESC)
  WHERE acao = 'STATUS_CHANGE';

-- Índice de histórico por registro (drill-down na UI de auditoria)
CREATE INDEX IF NOT EXISTS idx_audit_log_registro_created
  ON public.audit_log (registro_id, created_at DESC);

-- Índice para filtros por usuário + período (dashboard de compliance LGPD)
CREATE INDEX IF NOT EXISTS idx_audit_log_user_created
  ON public.audit_log (user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

-- Atualiza estatísticas p/ o planner enxergar os novos índices
ANALYZE public.audit_log;