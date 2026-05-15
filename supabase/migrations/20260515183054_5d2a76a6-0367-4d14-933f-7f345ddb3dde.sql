-- Ajuste de segurança para funções críticas (set search_path)
CREATE OR REPLACE FUNCTION public.fn_processar_workflow_admissao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.fn_start_workflow_on_colaborador_create()
RETURNS TRIGGER AS $$
BEGIN
    -- Lógica de inicialização de workflow para novos colaboradores
    INSERT INTO public.workflows_execucoes (colaborador_id, status, created_at)
    VALUES (NEW.id, 'pendente', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.record_failed_login()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.login_rate_limits (ip_address, created_at)
    VALUES (NEW.ip_address, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.cleanup_security_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM public.login_rate_limits WHERE created_at < now() - interval '24 hours';
END;
$$ LANGUAGE plpgsql SET search_path = public;
