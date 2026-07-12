
-- ============================================================================
-- APPEND-ONLY em tabelas de auditoria/logs restantes
-- Reutiliza função pública public.audit_log_append_only() já existente
-- Cenários: nenhum registro de auditoria/log crítico pode ser alterado ou
-- deletado por ninguém, garantindo trilha forense íntegra.
-- ============================================================================

DO $$
DECLARE
  v_table TEXT;
  v_tables TEXT[] := ARRAY[
    'auditoria_contratual',
    'folha_eventos_auditoria',
    'ponto_auditoria_fraude',
    'provisao_auditoria',
    'premiacoes_auditoria',
    'esocial_transmissao_logs',
    'fgts_digital_logs',
    'webhook_logs',
    'webhooks_logs',
    'integracao_logs',
    'logs_integracoes',
    'logs_sincronizacao',
    'logs_sistema',
    'bitrix24_sync_logs',
    'automacao_logs',
    'ferias_aprovacoes_log',
    'provisao_logs',
    'log_envio_relatorios',
    'whatsapp_mensagens_logs',
    'trilha_auditoria_ponto',
    'ponto_espelhos_assinados',
    'conformidade_ponto_logs',
    'folha_assinaturas'
  ];
BEGIN
  FOREACH v_table IN ARRAY v_tables LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = v_table
    ) THEN
      EXECUTE format(
        'DROP TRIGGER IF EXISTS trg_%1$s_no_update ON public.%1$I;
         DROP TRIGGER IF EXISTS trg_%1$s_no_delete ON public.%1$I;
         CREATE TRIGGER trg_%1$s_no_update
           BEFORE UPDATE ON public.%1$I
           FOR EACH ROW EXECUTE FUNCTION public.audit_log_append_only();
         CREATE TRIGGER trg_%1$s_no_delete
           BEFORE DELETE ON public.%1$I
           FOR EACH ROW EXECUTE FUNCTION public.audit_log_append_only();',
        v_table
      );
    END IF;
  END LOOP;
END $$;
