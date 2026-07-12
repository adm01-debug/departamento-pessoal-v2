
CREATE OR REPLACE FUNCTION public.audit_log_append_only()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RAISE EXCEPTION 'Trilha de auditoria é append-only. UPDATE/DELETE não são permitidos em %.', TG_TABLE_NAME
    USING ERRCODE = 'insufficient_privilege';
END;
$$;

-- audit_log
DROP TRIGGER IF EXISTS trg_audit_log_no_update ON public.audit_log;
CREATE TRIGGER trg_audit_log_no_update
BEFORE UPDATE ON public.audit_log
FOR EACH ROW EXECUTE FUNCTION public.audit_log_append_only();

DROP TRIGGER IF EXISTS trg_audit_log_no_delete ON public.audit_log;
CREATE TRIGGER trg_audit_log_no_delete
BEFORE DELETE ON public.audit_log
FOR EACH ROW EXECUTE FUNCTION public.audit_log_append_only();

-- auditoria_logs
DROP TRIGGER IF EXISTS trg_auditoria_logs_no_update ON public.auditoria_logs;
CREATE TRIGGER trg_auditoria_logs_no_update
BEFORE UPDATE ON public.auditoria_logs
FOR EACH ROW EXECUTE FUNCTION public.audit_log_append_only();

DROP TRIGGER IF EXISTS trg_auditoria_logs_no_delete ON public.auditoria_logs;
CREATE TRIGGER trg_auditoria_logs_no_delete
BEFORE DELETE ON public.auditoria_logs
FOR EACH ROW EXECUTE FUNCTION public.audit_log_append_only();

-- audit_logs
DROP TRIGGER IF EXISTS trg_audit_logs_no_update ON public.audit_logs;
CREATE TRIGGER trg_audit_logs_no_update
BEFORE UPDATE ON public.audit_logs
FOR EACH ROW EXECUTE FUNCTION public.audit_log_append_only();

DROP TRIGGER IF EXISTS trg_audit_logs_no_delete ON public.audit_logs;
CREATE TRIGGER trg_audit_logs_no_delete
BEFORE DELETE ON public.audit_logs
FOR EACH ROW EXECUTE FUNCTION public.audit_log_append_only();

-- auditoria
DROP TRIGGER IF EXISTS trg_auditoria_no_update ON public.auditoria;
CREATE TRIGGER trg_auditoria_no_update
BEFORE UPDATE ON public.auditoria
FOR EACH ROW EXECUTE FUNCTION public.audit_log_append_only();

DROP TRIGGER IF EXISTS trg_auditoria_no_delete ON public.auditoria;
CREATE TRIGGER trg_auditoria_no_delete
BEFORE DELETE ON public.auditoria
FOR EACH ROW EXECUTE FUNCTION public.audit_log_append_only();

-- ponto_auditoria
DROP TRIGGER IF EXISTS trg_ponto_auditoria_no_update ON public.ponto_auditoria;
CREATE TRIGGER trg_ponto_auditoria_no_update
BEFORE UPDATE ON public.ponto_auditoria
FOR EACH ROW EXECUTE FUNCTION public.audit_log_append_only();

DROP TRIGGER IF EXISTS trg_ponto_auditoria_no_delete ON public.ponto_auditoria;
CREATE TRIGGER trg_ponto_auditoria_no_delete
BEFORE DELETE ON public.ponto_auditoria
FOR EACH ROW EXECUTE FUNCTION public.audit_log_append_only();

-- ferias_audit_log
DROP TRIGGER IF EXISTS trg_ferias_audit_no_update ON public.ferias_audit_log;
CREATE TRIGGER trg_ferias_audit_no_update
BEFORE UPDATE ON public.ferias_audit_log
FOR EACH ROW EXECUTE FUNCTION public.audit_log_append_only();

DROP TRIGGER IF EXISTS trg_ferias_audit_no_delete ON public.ferias_audit_log;
CREATE TRIGGER trg_ferias_audit_no_delete
BEFORE DELETE ON public.ferias_audit_log
FOR EACH ROW EXECUTE FUNCTION public.audit_log_append_only();

-- folha_auditoria
DROP TRIGGER IF EXISTS trg_folha_auditoria_no_update ON public.folha_auditoria;
CREATE TRIGGER trg_folha_auditoria_no_update
BEFORE UPDATE ON public.folha_auditoria
FOR EACH ROW EXECUTE FUNCTION public.audit_log_append_only();

DROP TRIGGER IF EXISTS trg_folha_auditoria_no_delete ON public.folha_auditoria;
CREATE TRIGGER trg_folha_auditoria_no_delete
BEFORE DELETE ON public.folha_auditoria
FOR EACH ROW EXECUTE FUNCTION public.audit_log_append_only();
