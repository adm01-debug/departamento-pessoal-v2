-- Adicionar controle de auditoria de tempo nas batidas
ALTER TABLE public.batidas_ponto 
ADD COLUMN IF NOT EXISTS timestamp_dispositivo TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS offset_timezone INTEGER; -- Diferença em minutos para o servidor

-- Tabela para gerenciar dispositivos bloqueados por tentativa de fraude
CREATE TABLE IF NOT EXISTS public.ponto_seguranca_blacklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispositivo_id TEXT UNIQUE NOT NULL,
    colaborador_id UUID REFERENCES public.colaboradores(id),
    motivo TEXT,
    bloqueado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
    bloqueado_ate TIMESTAMP WITH TIME ZONE
);

-- Função para detectar anomalias de GPS (Simulação de GPS Spoofing)
CREATE OR REPLACE FUNCTION public.detectar_fraude_ponto(
    batida_id UUID, 
    colaborador_id UUID, 
    lat_nova NUMERIC, 
    lng_nova NUMERIC, 
    time_nova TIMESTAMP WITH TIME ZONE
)
RETURNS VOID AS $$
DECLARE
    ultima_lat NUMERIC;
    ultima_lng NUMERIC;
    ultima_time TIMESTAMP WITH TIME ZONE;
    distancia_metros NUMERIC;
    segundos_diff NUMERIC;
    velocidade_kmh NUMERIC;
BEGIN
    -- Pegar última batida do colaborador nas últimas 12 horas
    SELECT latitude, longitude, created_at INTO ultima_lat, ultima_lng, ultima_time
    FROM public.batidas_ponto
    WHERE colaborador_id = colaborador_id
    AND created_at > (time_nova - INTERVAL '12 hours')
    ORDER BY created_at DESC LIMIT 1;

    IF FOUND AND ultima_lat IS NOT NULL AND lat_nova IS NOT NULL THEN
        -- Calcular distância simplificada (Haversine seria melhor, aqui usamos uma aproximação)
        distancia_metros := sqrt(pow(lat_nova - ultima_lat, 2) + pow(lng_nova - ultima_lng, 2)) * 111320;
        segundos_diff := extract(epoch from (time_nova - ultima_time));
        
        IF segundos_diff > 0 THEN
            velocidade_kmh := (distancia_metros / segundos_diff) * 3.6;
            
            -- Se a velocidade for superior a 1000km/h (avião comercial rápido), marcar como suspeita
            IF velocidade_kmh > 1000 THEN
                INSERT INTO public.security_alerts (tipo, severidade, detalhes, colaborador_id)
                VALUES ('PONTO_VELOCIDADE_IMPOSSIVEL', 'alta', 
                        jsonb_build_object('velocidade_kmh', velocidade_kmh, 'distancia_m', distancia_metros), 
                        colaborador_id);
                
                UPDATE public.batidas_ponto SET anomalia_detectada = true WHERE id = batida_id;
            END IF;
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
