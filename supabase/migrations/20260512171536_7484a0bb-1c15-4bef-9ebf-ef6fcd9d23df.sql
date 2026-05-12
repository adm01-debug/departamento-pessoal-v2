-- Atualizar tabela de certificados digitais
ALTER TABLE public.certificados_digitais 
ADD COLUMN IF NOT EXISTS arquivo_base64 TEXT,
ADD COLUMN IF NOT EXISTS senha_encriptada TEXT,
ADD COLUMN IF NOT EXISTS cnpj_cpf TEXT;

-- Garantir RLS (já deve estar ativo, mas por segurança)
ALTER TABLE public.certificados_digitais ENABLE ROW LEVEL SECURITY;
