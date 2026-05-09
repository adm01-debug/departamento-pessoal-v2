-- Adicionar colunas de potencial e performance para Matriz Nine-Box
ALTER TABLE public.feedbacks_360 
ADD COLUMN IF NOT EXISTS potencial INTEGER CHECK (potencial >= 1 AND potencial <= 5),
ADD COLUMN IF NOT EXISTS performance INTEGER CHECK (performance >= 1 AND performance <= 5);

-- Criar uma view para facilitar a visualização da Matriz Nine-Box
CREATE OR REPLACE VIEW public.vw_matriz_nine_box AS
SELECT 
    f.avaliado_id,
    c.nome_completo,
    f.empresa_id,
    AVG(f.performance)::NUMERIC(3,2) as media_performance,
    AVG(f.potencial)::NUMERIC(3,2) as media_potencial,
    COUNT(f.id) as total_avaliacoes
FROM 
    public.feedbacks_360 f
JOIN 
    public.colaboradores c ON f.avaliado_id = c.id
WHERE 
    f.status = 'concluido'
GROUP BY 
    f.avaliado_id, c.nome_completo, f.empresa_id;
