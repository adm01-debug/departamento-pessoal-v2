-- Ajustar unicidade para multi-tenant (empresa_id + codigo)
ALTER TABLE public.rubricas_folha DROP CONSTRAINT IF EXISTS rubricas_folha_codigo_key;
ALTER TABLE public.rubricas_folha ADD CONSTRAINT rubricas_folha_empresa_codigo_unique UNIQUE (empresa_id, codigo);

-- Inserir rubricas padrão para o eSocial
INSERT INTO public.rubricas_folha (codigo, descricao, tipo, incide_inss, incide_irrf, incide_fgts, automatico, codigo_esocial)
VALUES 
('1000', 'Salário Base', 'provento', true, true, true, true, '1000'),
('5000', 'INSS', 'desconto', false, false, false, true, '9201'),
('5001', 'IRRF', 'desconto', false, false, false, true, '9202')
ON CONFLICT (empresa_id, codigo) DO UPDATE 
SET codigo_esocial = EXCLUDED.codigo_esocial,
    descricao = EXCLUDED.descricao;