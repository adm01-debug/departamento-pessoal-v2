
DO $$
DECLARE
  t text;
  audit_tables text[] := ARRAY[
    'audit_log','audit_logs','auditoria','auditoria_logs','auditoria_contratual',
    'ferias_audit_log','ferias_aprovacoes_log','folha_auditoria','folha_eventos_auditoria',
    'ponto_auditoria','ponto_auditoria_fraude','premiacoes_auditoria','provisao_auditoria',
    'trilha_auditoria_ponto','conformidade_ponto_logs'
  ];
BEGIN
  FOREACH t IN ARRAY audit_tables LOOP
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename=t) THEN
      EXECUTE format('DROP TRIGGER IF EXISTS trg_%I_append_only ON public.%I', t, t);
      EXECUTE format(
        'CREATE TRIGGER trg_%I_append_only BEFORE UPDATE OR DELETE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.audit_log_append_only()',
        t, t
      );
    END IF;
  END LOOP;
END $$;
