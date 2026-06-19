
-- Triggers: usar colunas reais de auditoria_logs (entidade, entidade_id, user_id)
CREATE OR REPLACE FUNCTION public.process_audit_log()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO public.auditoria_logs(entidade, entidade_id, acao, dados_anteriores, user_id)
        VALUES (TG_TABLE_NAME, OLD.id::text, TG_OP, to_jsonb(OLD), auth.uid());
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.auditoria_logs(entidade, entidade_id, acao, dados_anteriores, dados_novos, user_id)
        VALUES (TG_TABLE_NAME, NEW.id::text, TG_OP, to_jsonb(OLD), to_jsonb(NEW), auth.uid());
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO public.auditoria_logs(entidade, entidade_id, acao, dados_novos, user_id)
        VALUES (TG_TABLE_NAME, NEW.id::text, TG_OP, to_jsonb(NEW), auth.uid());
        RETURN NEW;
    END IF;
    RETURN NULL;
END; $$;

CREATE OR REPLACE FUNCTION public.log_esocial_transmission()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
    IF (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'enviado') THEN
        INSERT INTO public.auditoria_logs(entidade, entidade_id, acao, dados_anteriores, dados_novos, user_id)
        VALUES ('esocial_eventos', NEW.id::text, 'TRANSMISSAO_ESOCIAL', to_jsonb(OLD), to_jsonb(NEW), auth.uid());
    END IF;
    RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.fn_audit_biometric_failure()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
    IF (NEW.biometria_status = 'invalido') THEN
        INSERT INTO public.auditoria_logs(entidade, entidade_id, acao, dados_novos, user_id)
        VALUES ('batidas_ponto', NEW.id::text, 'ALERTA_FALHA_BIOMETRICA',
            jsonb_build_object('colaborador_id', NEW.colaborador_id, 'status', NEW.biometria_status,
                'score', NEW.biometria_score, 'data_batida', NEW.data || ' ' || NEW.hora),
            NEW.colaborador_id);
    END IF;
    RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.registrar_auditoria_sst()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
    INSERT INTO public.auditoria_logs(entidade, entidade_id, acao, dados_novos, user_id)
    VALUES (TG_TABLE_NAME, NEW.id::text, TG_OP, row_to_json(NEW)::jsonb, auth.uid());
    RETURN NEW;
END; $$;

-- GRANTs para policies funcionarem
GRANT EXECUTE ON FUNCTION public.get_user_empresas(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_auth_empresa_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_belongs_to_empresa(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_default_empresa(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_roles(uuid) TO authenticated;
