-- Melhoria #45: hardening — revoke EXECUTE de authenticated em funções internas
-- (triggers, maintenance, purge, workflow-hooks). Mantém funções chamadas pelo app.

-- Trigger-only functions (hash enforcement, audit forwarding, workflow hooks)
REVOKE EXECUTE ON FUNCTION public.enforce_afastamento_hash() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.enforce_aso_hash() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.enforce_batida_ponto_hash() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.enforce_cat_hash() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.enforce_cnab_remessa_hash() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.enforce_desligamento_hash() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.enforce_documento_assinatura_hash() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.enforce_epi_entrega_hash() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.enforce_esocial_evento_hash() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.enforce_ferias_hash() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.enforce_folha_pagamento_hash() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.enforce_holerite_signed_hash() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.enforce_log_retention() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.enforce_medida_disciplinar_hash() FROM authenticated, anon, PUBLIC;

REVOKE EXECUTE ON FUNCTION public.trg_audit_status_change() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.trg_detect_status_anomaly() FROM authenticated, anon, PUBLIC;

REVOKE EXECUTE ON FUNCTION public.log_audit_change() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.process_audit_log() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.process_ferias_audit() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.fwd_to_audit_unified() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.auto_vincular_admins_empresa() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public._is_admin_bypass() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public._purge_audit_log_internal(integer) FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.registrar_auditoria_contratual() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.registrar_auditoria_ponto() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.validate_ponto_compliance() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.log_esocial_transmission() FROM authenticated, anon, PUBLIC;

-- Maintenance / cron / workflow-only
REVOKE EXECUTE ON FUNCTION public.check_idempotency_anomalies() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.check_processamento_timeout() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.gerar_alertas_preditivos_ia() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.limpar_govbr_states_expirados() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.maintenance_archive_old_audit(integer, integer) FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.maintenance_weekly_analyze() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.process_lgpd_cleanup_queue() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.processar_auditoria_premiacao() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.purge_audit_log_old(integer) FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.purge_expired_idempotency_keys() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.purge_expired_security_data() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.purge_old_lock_conflicts() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.refresh_dashboard_mvs() FROM authenticated, anon, PUBLIC;

-- Workflow / trigger hooks
REVOKE EXECUTE ON FUNCTION public.fn_consolidar_batidas() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.fn_auto_generate_training_certificate() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.fn_workflow_admissao_auto() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.fn_update_admissao_checklist() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.fn_update_candidatura_history() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.fn_enqueue_notification() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.fn_trigger_whatsapp_on_event() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.fn_create_default_onboarding_tasks() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.fn_alert_severe_disciplinary_measure() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.fn_audit_biometric_failure() FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.detectar_fraude_ponto(uuid, uuid, numeric, numeric, timestamptz) FROM authenticated, anon, PUBLIC;

-- Materialized views: remover do schema exposto na Data API (mover para schema privado)
CREATE SCHEMA IF NOT EXISTS private_analytics;
REVOKE ALL ON SCHEMA private_analytics FROM authenticated, anon, PUBLIC;
GRANT USAGE ON SCHEMA private_analytics TO service_role;

ALTER MATERIALIZED VIEW IF EXISTS public.mv_status_change_daily SET SCHEMA private_analytics;
ALTER MATERIALIZED VIEW IF EXISTS public.mv_anomalies_hourly SET SCHEMA private_analytics;