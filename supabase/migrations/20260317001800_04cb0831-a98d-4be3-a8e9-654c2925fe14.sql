
-- FASE 1: Adicionar campos faltantes à tabela colaboradores (do doc externo)

-- Campos pessoais
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS tipo_sanguineo text;
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS email_pessoal text;
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS telefone_residencial text;
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS whatsapp text;
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS instagram text;
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS facebook text;
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS linkedin text;
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS tiktok text;

-- Cônjuge
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS conjuge_nome text;
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS conjuge_cpf text;
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS conjuge_data_nascimento date;
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS conjuge_telefone text;

-- Uniformes
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS uniforme_camiseta text;
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS uniforme_calca text;
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS uniforme_calcado text;

-- Campos trabalhistas adicionais
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS tipo_salario_descricao text;
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS jornada_horas_mensais text;
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS experiencia_tipo text;
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS experiencia_fim_1 date;
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS experiencia_fim_2 date;

-- Documentos adicionais
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS cnh_data_emissao date;
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS titulo_eleitor_uf text;
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS reservista text;
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS reservista_ra text;
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS reservista_serie text;

-- Integração
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS codigo_firebird integer;
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS unidade varchar;
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS timeman_ultimo_status text;
ALTER TABLE public.colaboradores ADD COLUMN IF NOT EXISTS timeman_ultima_sync timestamptz;
