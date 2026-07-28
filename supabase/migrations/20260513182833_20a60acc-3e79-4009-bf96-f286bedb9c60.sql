-- 1. Melhorias de Auditoria Global
CREATE TABLE IF NOT EXISTS public.auditoria_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tabela TEXT NOT NULL,
    registro_id UUID NOT NULL,
    acao TEXT NOT NULL,
    dados_antigos JSONB,
    dados_novos JSONB,
    usuario_id UUID REFERENCES auth.users(id),
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.auditoria_logs ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.process_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO public.auditoria_logs(tabela, registro_id, acao, dados_antigos, usuario_id)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, to_jsonb(OLD), auth.uid());
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.auditoria_logs(tabela, registro_id, acao, dados_antigos, dados_novos, usuario_id)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(OLD), to_jsonb(NEW), auth.uid());
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO public.auditoria_logs(tabela, registro_id, acao, dados_novos, usuario_id)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(NEW), auth.uid());
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_audit_colaboradores') THEN
        CREATE TRIGGER trg_audit_colaboradores AFTER INSERT OR UPDATE OR DELETE ON public.colaboradores FOR EACH ROW EXECUTE FUNCTION public.process_audit_log();
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'folhas_pagamento') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_audit_folha') THEN
            CREATE TRIGGER trg_audit_folha AFTER INSERT OR UPDATE OR DELETE ON public.folhas_pagamento FOR EACH ROW EXECUTE FUNCTION public.process_audit_log();
        END IF;
    END IF;
END $$;

-- 2. Engine de Workflows Automáticos
CREATE OR REPLACE FUNCTION public.fn_workflow_admissao_auto()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.workflows_execucoes (workflow_id, empresa_id, entidade_id, entidade_tipo, status, etapa_atual, metadata)
    SELECT id, NEW.empresa_id, NEW.id, 'admissao', 'em_andamento', 1, jsonb_build_object('auto_start', true)
    FROM public.workflows_definicoes
    WHERE tipo = 'admissao' AND empresa_id = NEW.empresa_id
    LIMIT 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_admissao_auto_workflow') THEN
        CREATE TRIGGER trg_admissao_auto_workflow AFTER INSERT ON public.admissoes FOR EACH ROW EXECUTE FUNCTION public.fn_workflow_admissao_auto();
    END IF;
END $$;

-- 3. eSocial
ALTER TABLE public.esocial_eventos 
ADD COLUMN IF NOT EXISTS hash_seguranca TEXT,
ADD COLUMN IF NOT EXISTS assinatura_xml TEXT,
ADD COLUMN IF NOT EXISTS xml_envio TEXT,
ADD COLUMN IF NOT EXISTS xml_retorno TEXT,
ADD COLUMN IF NOT EXISTS data_processamento TIMESTAMP WITH TIME ZONE;

-- 4. CNAB
CREATE TABLE IF NOT EXISTS public.cnab_remessas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id),
    banco_codigo TEXT NOT NULL,
    status TEXT DEFAULT 'pendente',
    valor_total DECIMAL(15,2),
    total_pagamentos INTEGER,
    arquivo_remessa TEXT,
    arquivo_retorno TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cnab_itens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    remessa_id UUID REFERENCES public.cnab_remessas(id),
    colaborador_id UUID REFERENCES public.colaboradores(id),
    folha_item_id UUID REFERENCES public.folha_itens(id),
    nome_favorecido TEXT,
    cpf_cnpj_favorecido TEXT,
    valor_pagamento DECIMAL(15,2),
    seu_numero TEXT UNIQUE,
    status TEXT DEFAULT 'pendente',
    codigo_ocorrencia TEXT,
    mensagem_ocorrencia TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Ponto
ALTER TABLE public.batidas_ponto 
ADD COLUMN IF NOT EXISTS foto_biometria_url TEXT,
ADD COLUMN IF NOT EXISTS hash_integridade TEXT;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('ponto-biometria', 'ponto-biometria', true)
ON CONFLICT (id) DO NOTHING;
