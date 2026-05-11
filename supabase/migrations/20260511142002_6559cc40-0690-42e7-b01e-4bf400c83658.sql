-- Adicionar coluna de alerta na folha
ALTER TABLE public.folhas_pagamento ADD COLUMN IF NOT EXISTS alerta_calculo JSONB;

-- Adicionar preferências de notificação no perfil (opcional, se a tabela perfis existir)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
        ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS config_notificacoes JSONB DEFAULT '{"email": true, "push": true, "folha_alertas": true}'::jsonb;
    END IF;
END $$;

-- Função para verificar divergências e alertar
CREATE OR REPLACE FUNCTION public.verificar_divergencias_folha()
RETURNS TRIGGER AS $$
DECLARE
    media_anterior DECIMAL;
BEGIN
    -- Busca média dos últimos 3 meses para o mesmo colaborador
    SELECT AVG(total_proventos) INTO media_anterior 
    FROM public.folhas_pagamento 
    WHERE colaborador_id = NEW.colaborador_id 
      AND status = 'fechada'
      AND competencia < NEW.competencia
    LIMIT 3;

    -- Se houver uma variação maior que 30%, marca alerta
    IF media_anterior IS NOT NULL AND (ABS(NEW.total_proventos - media_anterior) / media_anterior) > 0.3 THEN
        NEW.alerta_calculo = jsonb_build_object(
            'tipo', 'VARIACAO_SALARIAL_ALTA',
            'valor_anterior', media_anterior,
            'variacao_percentual', ROUND(((NEW.total_proventos - media_anterior) / media_anterior) * 100, 2),
            'mensagem', 'Variação de proventos superior a 30% detectada.'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS trigger_alerta_divergencia ON public.folhas_pagamento;
CREATE TRIGGER trigger_alerta_divergencia
BEFORE INSERT OR UPDATE ON public.folhas_pagamento
FOR EACH ROW
WHEN (NEW.status = 'calculada')
EXECUTE FUNCTION public.verificar_divergencias_folha();