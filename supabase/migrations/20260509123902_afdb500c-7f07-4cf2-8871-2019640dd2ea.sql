CREATE OR REPLACE FUNCTION public.processar_ajuste_aprovado(p_solicitacao_id UUID)
RETURNS VOID AS $$
DECLARE
    v_solicitacao RECORD;
BEGIN
    -- 1. Get request data
    SELECT * INTO v_solicitacao FROM public.solicitacoes_ajuste_ponto WHERE id = p_solicitacao_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Solicitação não encontrada';
    END IF;

    IF v_solicitacao.status != 'aprovado' THEN
        RAISE EXCEPTION 'Apenas solicitações aprovadas podem ser processadas';
    END IF;

    -- 2. Insert corrected clock-in/out record
    INSERT INTO public.batidas_ponto (
        colaborador_id,
        empresa_id,
        data,
        hora,
        tipo,
        origem,
        ajustada,
        motivo_ajuste,
        hash_integridade
    ) VALUES (
        v_solicitacao.colaborador_id,
        v_solicitacao.empresa_id,
        v_solicitacao.data_ponto,
        v_solicitacao.hora_sugerida,
        v_solicitacao.tipo_ponto,
        'ajuste_manual',
        true,
        v_solicitacao.motivo,
        encode(digest(v_solicitacao.id::text || now()::text, 'sha256'), 'hex')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
