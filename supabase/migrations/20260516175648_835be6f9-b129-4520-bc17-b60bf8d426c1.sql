-- =============================================================================
-- MÓDULO DE RECRUTAMENTO, SELEÇÃO E ONBOARDING (PADRONIZAÇÃO MULTI-TENANT)
-- =============================================================================

-- 1. ADIÇÃO DE COLUNAS FALTANTES EM TABELAS EXISTENTES
-- -----------------------------------------------------------------------------

DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'candidaturas') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'candidaturas' AND column_name = 'empresa_id') THEN
            ALTER TABLE public.candidaturas ADD COLUMN empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE;
        END IF;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'onboarding_colaborador') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_colaborador' AND column_name = 'empresa_id') THEN
            ALTER TABLE public.onboarding_colaborador ADD COLUMN empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE;
        END IF;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'onboarding_tarefas') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_tarefas' AND column_name = 'empresa_id') THEN
            ALTER TABLE public.onboarding_tarefas ADD COLUMN empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- 2. CRIAÇÃO DE NOVAS TABELAS
-- -----------------------------------------------------------------------------

-- Vagas (Garantir estrutura se não existir)
CREATE TABLE IF NOT EXISTS public.vagas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descricao TEXT,
    requisitos TEXT,
    status TEXT DEFAULT 'aberta',
    data_abertura DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Candidatos
CREATE TABLE IF NOT EXISTS public.candidatos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Candidaturas
CREATE TABLE IF NOT EXISTS public.candidaturas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    vaga_id UUID NOT NULL REFERENCES public.vagas(id) ON DELETE CASCADE,
    candidato_id UUID NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'triagem',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Etapas da Vaga
CREATE TABLE IF NOT EXISTS public.vaga_etapas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    vaga_id UUID NOT NULL REFERENCES public.vagas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    ordem INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Entrevistas
CREATE TABLE IF NOT EXISTS public.vaga_entrevistas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    candidatura_id UUID NOT NULL REFERENCES public.candidaturas(id) ON DELETE CASCADE,
    etapa_id UUID NOT NULL REFERENCES public.vaga_etapas(id) ON DELETE CASCADE,
    data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Onboarding de Colaborador
CREATE TABLE IF NOT EXISTS public.onboarding_colaborador (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    colaborador_id UUID NOT NULL REFERENCES public.colaboradores(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'em_andamento',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Kits de Onboarding
CREATE TABLE IF NOT EXISTS public.onboarding_kits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    itens JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tarefas de Onboarding
CREATE TABLE IF NOT EXISTS public.onboarding_tarefas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    onboarding_id UUID NOT NULL REFERENCES public.onboarding_colaborador(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    status TEXT DEFAULT 'pendente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Documentos Obrigatórios
CREATE TABLE IF NOT EXISTS public.onboarding_documentos_obrigatorios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    onboarding_id UUID NOT NULL REFERENCES public.onboarding_colaborador(id) ON DELETE CASCADE,
    nome_documento TEXT NOT NULL,
    entregue BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Triagem de Notas
CREATE TABLE IF NOT EXISTS public.triagem_notas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    candidatura_id UUID NOT NULL REFERENCES public.candidaturas(id) ON DELETE CASCADE,
    nota INTEGER,
    comentario TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Arquivos de Currículos
CREATE TABLE IF NOT EXISTS public.curriculos_arquivos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    candidato_id UUID NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. SEGURANÇA (RLS)
-- -----------------------------------------------------------------------------

DO $$
DECLARE
    t_name TEXT;
BEGIN
    FOR t_name IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN (
            'vagas', 'candidatos', 'candidaturas', 'vaga_etapas', 'vaga_entrevistas',
            'onboarding_colaborador', 'onboarding_kits', 'onboarding_tarefas', 
            'onboarding_documentos_obrigatorios', 'triagem_notas', 'curriculos_arquivos'
        )
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t_name);
        EXECUTE format('DROP POLICY IF EXISTS "Multi-tenant access" ON public.%I', t_name);
        EXECUTE format('CREATE POLICY "Multi-tenant access" ON public.%I FOR ALL USING (empresa_id = auth.uid() OR (SELECT c.empresa_id FROM public.colaboradores c WHERE c.id = auth.uid()) = empresa_id)', t_name);
    END LOOP;
END $$;

-- 4. ÍNDICES
-- -----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_vagas_empresa ON public.vagas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_candidaturas_vaga ON public.candidaturas(vaga_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_colab ON public.onboarding_colaborador(colaborador_id);

-- 5. TRIGGERS UPDATED_AT
-- -----------------------------------------------------------------------------

DO $$
DECLARE
    t_name TEXT;
BEGIN
    FOR t_name IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN (
            'vagas', 'candidatos', 'candidaturas', 'vaga_etapas', 'vaga_entrevistas',
            'onboarding_colaborador', 'onboarding_tarefas', 'onboarding_documentos_obrigatorios'
        )
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS tr_updated_at_%I ON public.%I', t_name, t_name);
        EXECUTE format('CREATE TRIGGER tr_updated_at_%I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()', t_name, t_name);
    END LOOP;
END $$;
