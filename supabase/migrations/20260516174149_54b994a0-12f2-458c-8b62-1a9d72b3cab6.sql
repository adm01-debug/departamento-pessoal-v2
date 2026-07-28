-- Drop para evitar erros de alteração de estrutura
DROP VIEW IF EXISTS public.vw_colaboradores_completo;
DROP VIEW IF EXISTS public.vw_espelho_ponto_mensal;

-- Índices de Performance
CREATE INDEX IF NOT EXISTS idx_batidas_ponto_colaborador_data ON public.batidas_ponto (colaborador_id, data);
CREATE INDEX IF NOT EXISTS idx_banco_horas_colaborador_data ON public.banco_horas (colaborador_id, data);
CREATE INDEX IF NOT EXISTS idx_folhas_pagamento_empresa_status ON public.folhas_pagamento (empresa_id, status);

-- View: Colaboradores Completo
CREATE VIEW public.vw_colaboradores_completo AS
SELECT 
    c.id,
    c.nome_completo,
    c.cpf,
    c.email_corporativo,
    c.data_admissao,
    c.status,
    e.nome_fantasia as empresa_nome,
    c.departamento as departamento_nome,
    c.cargo as cargo_nome,
    c.empresa_id
FROM 
    public.colaboradores c
LEFT JOIN public.empresas e ON c.empresa_id = e.id
WHERE c.status::text = 'ativo';

-- View: Espelho de Ponto Mensal
CREATE VIEW public.vw_espelho_ponto_mensal AS
SELECT 
    bp.colaborador_id,
    bp.data,
    MIN(bp.hora) FILTER (WHERE bp.tipo::text = 'entrada') as entrada_1,
    MAX(bp.hora) FILTER (WHERE bp.tipo::text = 'saida') as saida_1,
    COUNT(bp.id) as total_batidas,
    c.empresa_id
FROM 
    public.batidas_ponto bp
JOIN public.colaboradores c ON bp.colaborador_id = c.id
GROUP BY bp.colaborador_id, bp.data, c.empresa_id;
