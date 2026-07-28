-- Inserir empresa padrão se não existir
INSERT INTO public.empresas (id, cnpj, razao_social, nome_fantasia, ativa)
VALUES ('d290f1ee-6c54-4b01-90e6-d701748f0851', '00000000000191', 'Empresa Demonstração 10/10', 'DP Inteligente Demo', true)
ON CONFLICT (id) DO NOTHING;

-- Atualizar admissões órfãs (caso existam) para esta empresa
UPDATE public.admissoes SET empresa_id = 'd290f1ee-6c54-4b01-90e6-d701748f0851' WHERE empresa_id IS NULL;
UPDATE public.folhas_pagamento SET empresa_id = 'd290f1ee-6c54-4b01-90e6-d701748f0851' WHERE empresa_id IS NULL;
