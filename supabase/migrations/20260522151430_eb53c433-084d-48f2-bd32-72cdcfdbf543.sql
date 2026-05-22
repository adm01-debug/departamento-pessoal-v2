-- Função para monitorar timeouts e gerar alertas
CREATE OR REPLACE FUNCTION public.check_processamento_timeout()
RETURNS TRIGGER AS $$
BEGIN
    -- Se o status for alterado para 'failed' e o erro contiver 'timeout'
    IF NEW.status = 'failed' AND NEW.erro_log ILIKE '%timeout%' THEN
        INSERT INTO public.security_alerts (
            title,
            description,
            severity,
            metadata
        ) VALUES (
            'Timeout Detectado na Fila',
            'A tarefa do tipo ' || NEW.tipo_tarefa || ' (ID: ' || NEW.id || ') falhou por timeout.',
            'medium',
            jsonb_build_object('task_id', NEW.id, 'task_type', NEW.tipo_tarefa)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger na tabela de fila
DROP TRIGGER IF EXISTS tr_monitor_timeout ON public.fila_processamento;
CREATE TRIGGER tr_monitor_timeout
AFTER UPDATE OF status ON public.fila_processamento
FOR EACH ROW
WHEN (NEW.status = 'failed')
EXECUTE FUNCTION public.check_processamento_timeout();

-- View para métricas de performance
CREATE OR REPLACE VIEW public.vw_metricas_fila AS
SELECT 
    tipo_tarefa,
    COUNT(*) FILTER (WHERE status = 'completed') as sucessos,
    COUNT(*) FILTER (WHERE status = 'failed') as falhas,
    AVG(EXTRACT(EPOCH FROM (updated_at - created_at))) as tempo_medio_segundos
FROM public.fila_processamento
GROUP BY tipo_tarefa;