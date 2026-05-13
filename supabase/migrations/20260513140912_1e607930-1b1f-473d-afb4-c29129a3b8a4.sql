-- Function to calculate bank of hours balance in SQL
CREATE OR REPLACE FUNCTION public.get_colaborador_banco_horas(p_colaborador_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_saldo_total INTEGER := 0;
BEGIN
    -- Sum all positive and negative adjustments (assuming format is decimal or interval)
    -- This version assumes we have a table 'registros_ponto' with 'horas_extras' and 'horas_falta'
    -- Converting to minutes for canonical calculation
    
    SELECT 
        COALESCE(SUM(
            EXTRACT(EPOCH FROM (COALESCE(horas_extras, '00:00:00'::interval) - COALESCE(horas_falta, '00:00:00'::interval))) / 60
        )::INTEGER, 0)
    INTO v_saldo_total
    FROM public.registros_ponto
    WHERE colaborador_id = p_colaborador_id
    AND aprovado = true;

    RETURN v_saldo_total;
END;
$$;