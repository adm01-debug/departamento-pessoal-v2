-- Adiciona coluna para vincular um template específico à admissão
ALTER TABLE public.admissoes 
ADD COLUMN IF NOT EXISTS template_contrato_id UUID;

-- Comentário para documentação
COMMENT ON COLUMN public.admissoes.template_contrato_id IS 'ID do template de contrato associado a esta admissão.';
