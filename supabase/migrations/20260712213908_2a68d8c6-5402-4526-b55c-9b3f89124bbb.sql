
-- Hardening #16: Least-privilege EXECUTE grants em funções SECURITY DEFINER sensíveis.
-- Estratégia:
--   1) REVOKE ALL FROM PUBLIC em funções privilegiadas (mantém owner/service_role).
--   2) GRANT EXECUTE TO authenticated apenas nas funções realmente chamadas pelo app.
--   3) Funções de manutenção/cron/admin ficam restritas ao service_role/postgres.

-- === Admin / manutenção / cron (somente service_role) ===
REVOKE ALL ON FUNCTION public.purge_expired_idempotency_keys()            FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cleanup_security_logs()                     FROM PUBLIC;
REVOKE ALL ON FUNCTION public.fn_cleanup_old_logs()                       FROM PUBLIC;
REVOKE ALL ON FUNCTION public.check_idempotency_anomalies()               FROM PUBLIC;
REVOKE ALL ON FUNCTION public.gerar_alertas_preditivos_ia()               FROM PUBLIC;
REVOKE ALL ON FUNCTION public.auto_vincular_admins_empresa()              FROM PUBLIC;
REVOKE ALL ON FUNCTION public.record_failed_login()                       FROM PUBLIC;
REVOKE ALL ON FUNCTION public.record_failed_login(text, text)             FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reset_login_attempts(text, text)            FROM PUBLIC;
REVOKE ALL ON FUNCTION public.check_brute_force(text, text)               FROM PUBLIC;
REVOKE ALL ON FUNCTION public.check_login_lock(text, text)                FROM PUBLIC;
REVOKE ALL ON FUNCTION public.check_rate_limit(text, text, uuid)          FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_idempotency_health()                    FROM PUBLIC;

-- Triggers/audit — nunca devem ser executadas diretamente por clientes
REVOKE ALL ON FUNCTION public.process_audit_log()                         FROM PUBLIC;
REVOKE ALL ON FUNCTION public.process_ferias_audit()                      FROM PUBLIC;
REVOKE ALL ON FUNCTION public.processar_auditoria_premiacao()             FROM PUBLIC;
REVOKE ALL ON FUNCTION public.audit_log_append_only()                     FROM PUBLIC;
REVOKE ALL ON FUNCTION public.check_processamento_timeout()               FROM PUBLIC;
REVOKE ALL ON FUNCTION public.fn_trigger_whatsapp_on_event()              FROM PUBLIC;
REVOKE ALL ON FUNCTION public.fn_alert_severe_disciplinary_measure()      FROM PUBLIC;
REVOKE ALL ON FUNCTION public.fn_update_admissao_checklist()              FROM PUBLIC;
REVOKE ALL ON FUNCTION public.fn_update_candidatura_history()             FROM PUBLIC;
REVOKE ALL ON FUNCTION public.gerar_relatorio_conformidade_ponto()        FROM PUBLIC;
REVOKE ALL ON FUNCTION public.gerar_hash_ponto()                          FROM PUBLIC;
REVOKE ALL ON FUNCTION public.validate_ponto_compliance()                 FROM PUBLIC;
REVOKE ALL ON FUNCTION public.enforce_batida_ponto_hash()                 FROM PUBLIC;
REVOKE ALL ON FUNCTION public.enforce_holerite_signed_hash()              FROM PUBLIC;
REVOKE ALL ON FUNCTION public.enforce_folha_pagamento_hash()              FROM PUBLIC;
REVOKE ALL ON FUNCTION public.enforce_desligamento_hash()                 FROM PUBLIC;
REVOKE ALL ON FUNCTION public.enforce_esocial_evento_hash()               FROM PUBLIC;
REVOKE ALL ON FUNCTION public.enforce_cnab_remessa_hash()                 FROM PUBLIC;
REVOKE ALL ON FUNCTION public.enforce_medida_disciplinar_hash()           FROM PUBLIC;
REVOKE ALL ON FUNCTION public.enforce_ferias_hash()                       FROM PUBLIC;
REVOKE ALL ON FUNCTION public.impedir_alteracao_holerite_assinado()       FROM PUBLIC;
REVOKE ALL ON FUNCTION public.impedir_alteracao_folha_fechada()           FROM PUBLIC;
REVOKE ALL ON FUNCTION public.impedir_alteracao_cnab_transmitida()        FROM PUBLIC;
REVOKE ALL ON FUNCTION public.impedir_alteracao_desligamento_homologado() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.impedir_alteracao_esocial_transmitido()     FROM PUBLIC;
REVOKE ALL ON FUNCTION public.impedir_alteracao_medida_aplicada()         FROM PUBLIC;
REVOKE ALL ON FUNCTION public.impedir_alteracao_periodo_ponto_fechado()   FROM PUBLIC;
REVOKE ALL ON FUNCTION public.proibir_delete_folha_fechada()              FROM PUBLIC;
REVOKE ALL ON FUNCTION public.proibir_delete_holerite_assinado()          FROM PUBLIC;
REVOKE ALL ON FUNCTION public.proibir_delete_esocial_transmitido()        FROM PUBLIC;
REVOKE ALL ON FUNCTION public.proibir_delete_cnab_transmitida()           FROM PUBLIC;
REVOKE ALL ON FUNCTION public.proibir_delete_desligamento_homologado()    FROM PUBLIC;
REVOKE ALL ON FUNCTION public.proibir_delete_ferias_concluidas()          FROM PUBLIC;
REVOKE ALL ON FUNCTION public.proibir_delete_periodo_ponto_fechado()      FROM PUBLIC;
REVOKE ALL ON FUNCTION public.proibir_delete_medida_aplicada()            FROM PUBLIC;
REVOKE ALL ON FUNCTION public.proibir_delete_aso_emitido()                FROM PUBLIC;
REVOKE ALL ON FUNCTION public.proibir_delete_cat_transmitida()            FROM PUBLIC;
REVOKE ALL ON FUNCTION public.proibir_delete_epi_entrega_assinada()       FROM PUBLIC;
REVOKE ALL ON FUNCTION public.processar_ajuste_aprovado(uuid)             FROM PUBLIC;

-- === Funções seguras/consultivas chamadas pelo app (permitidas a authenticated) ===
REVOKE ALL ON FUNCTION public.get_personnel_cost_projection(uuid, integer) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_personnel_cost_projection(uuid, integer) TO authenticated;

REVOKE ALL ON FUNCTION public.get_colaborador_banco_horas(uuid)           FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_colaborador_banco_horas(uuid)       TO authenticated;

REVOKE ALL ON FUNCTION public.fn_calculate_periodo_aquisitivo(uuid)       FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.fn_calculate_periodo_aquisitivo(uuid)   TO authenticated;

REVOKE ALL ON FUNCTION public.get_user_scope_empresas(uuid)               FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_user_scope_empresas(uuid)           TO authenticated;

REVOKE ALL ON FUNCTION public.get_auth_empresa_id()                       FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_auth_empresa_id()                   TO authenticated;

-- Health/observabilidade — só admin (função já valida has_role internamente)
GRANT EXECUTE ON FUNCTION public.get_idempotency_health()                 TO authenticated;
