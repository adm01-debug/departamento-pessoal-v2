-- Melhorias na tabela de beneficios
ALTER TABLE public.beneficios ADD COLUMN IF NOT EXISTS categoria TEXT DEFAULT 'outros';
ALTER TABLE public.beneficios ADD COLUMN IF NOT EXISTS codigo_esocial TEXT;
ALTER TABLE public.beneficios ADD COLUMN IF NOT EXISTS obrigatorio_por_lei BOOLEAN DEFAULT false;

-- Melhorias na tabela de dependentes
ALTER TABLE public.dependentes ADD COLUMN IF NOT EXISTS grau_parentesco TEXT;
ALTER TABLE public.dependentes ADD COLUMN IF NOT EXISTS incapacidade_fisica_mental BOOLEAN DEFAULT false;
ALTER TABLE public.dependentes ADD COLUMN IF NOT EXISTS data_inicio_vigencia DATE DEFAULT now();

-- Melhorias no vínculo de benefícios
ALTER TABLE public.beneficios_colaborador ADD COLUMN IF NOT EXISTS data_inicio DATE DEFAULT now();
ALTER TABLE public.beneficios_colaborador ADD COLUMN IF NOT EXISTS data_fim DATE;
ALTER TABLE public.beneficios_colaborador ADD COLUMN IF NOT EXISTS status_vinculo TEXT DEFAULT 'ativo'; -- ativo, suspenso, cancelado
ALTER TABLE public.beneficios_colaborador ADD COLUMN IF NOT EXISTS motivo_suspensao TEXT;

-- Melhorias em Planos de Saúde
ALTER TABLE public.planos_saude ADD COLUMN IF NOT EXISTS ans_registro TEXT;
ALTER TABLE public.planos_saude ADD COLUMN IF NOT EXISTS coparticipacao_teto DECIMAL(10,2);
ALTER TABLE public.planos_saude ADD COLUMN IF NOT EXISTS abrangencia TEXT DEFAULT 'nacional'; -- nacional, estadual, municipal

-- Melhorias em Seguros de Vida
ALTER TABLE public.seguros_vida ADD COLUMN IF NOT EXISTS apolice_numero TEXT;
ALTER TABLE public.seguros_vida ADD COLUMN IF NOT EXISTS data_vencimento_apolice DATE;
ALTER TABLE public.seguros_vida ADD COLUMN IF NOT EXISTS possui_assistencia_funeral BOOLEAN DEFAULT false;

-- Melhorias em Recargas de Vales
ALTER TABLE public.recargas_vale ADD COLUMN IF NOT EXISTS mes_referencia TEXT;
ALTER TABLE public.recargas_vale ADD COLUMN IF NOT EXISTS origem_recurso TEXT DEFAULT 'empresa'; -- empresa, convenio
