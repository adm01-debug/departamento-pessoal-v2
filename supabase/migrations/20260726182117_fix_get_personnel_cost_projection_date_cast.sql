-- Fix get_personnel_cost_projection: competencia em provisoes_mensais é DATE,
-- mas o WHERE usava to_char(m, 'YYYY-MM') (text), gerando erro 42883 (date = text).
-- Comparar por mês/ano direto na coluna DATE.
CREATE OR REPLACE FUNCTION public.get_personnel_cost_projection(p_empresa_id UUID, p_months INTEGER)
RETURNS TABLE (
    mes_ref DATE,
    total_estimado DECIMAL(15,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE months AS (
        SELECT date_trunc('month', now())::date as m
        UNION ALL
        SELECT (m + interval '1 month')::date
        FROM months
        WHERE m < (date_trunc('month', now()) + (p_months - 1 || ' months')::interval)::date
    )
    SELECT
        m as mes_ref,
        (
            COALESCE((SELECT AVG(total_liquido) FROM public.folhas_pagamento WHERE empresa_id = p_empresa_id), 5000) +
            COALESCE((SELECT SUM(total) FROM public.provisoes_mensais WHERE empresa_id = p_empresa_id AND competencia = date_trunc('month', m)::date), 0)
        )::DECIMAL(15,2) as total_estimado
    FROM months;
END;
$$ LANGUAGE plpgsql STABLE;
