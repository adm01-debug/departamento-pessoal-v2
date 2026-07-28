
-- Melhoria #25: Detector de anomalias em mudanças de status

-- 1) Trigger AFTER INSERT em audit_log: pico individual por usuário
CREATE OR REPLACE FUNCTION public.trg_detect_status_anomaly() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _count integer;
  _threshold constant integer := 50;
  _window constant interval := interval '5 minutes';
BEGIN
  IF NEW.acao <> 'STATUS_CHANGE' OR NEW.user_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT count(*) INTO _count
  FROM public.audit_log
  WHERE user_id = NEW.user_id
    AND tabela  = NEW.tabela
    AND acao    = 'STATUS_CHANGE'
    AND created_at >= now() - _window;

  IF _count >= _threshold THEN
    -- Dedup: só um alerta aberto por (user,tabela) na janela
    IF NOT EXISTS (
      SELECT 1 FROM public.security_alerts
      WHERE type = 'status_change_burst'
        AND user_id = NEW.user_id
        AND details->>'tabela' = NEW.tabela
        AND COALESCE(resolved,false) = false
        AND created_at >= now() - _window
    ) THEN
      INSERT INTO public.security_alerts (type, severity, user_id, details)
      VALUES (
        'status_change_burst', 'high', NEW.user_id,
        jsonb_build_object('tabela', NEW.tabela, 'count', _count,
                           'window_minutes', 5, 'threshold', _threshold,
                           'detected_at', now())
      );
    END IF;
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS detect_status_anomaly ON public.audit_log;
CREATE TRIGGER detect_status_anomaly AFTER INSERT ON public.audit_log
  FOR EACH ROW EXECUTE FUNCTION public.trg_detect_status_anomaly();

-- 2) Scan global periódico: picos anômalos por tabela
CREATE OR REPLACE FUNCTION public._scan_status_anomalies_global() RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _alerts integer := 0;
  r record;
BEGIN
  FOR r IN
    SELECT tabela, count(*) AS c
    FROM public.audit_log
    WHERE acao = 'STATUS_CHANGE'
      AND created_at >= now() - interval '10 minutes'
    GROUP BY tabela
    HAVING count(*) >= 500
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM public.security_alerts
      WHERE type = 'status_change_burst_global'
        AND details->>'tabela' = r.tabela
        AND COALESCE(resolved,false) = false
        AND created_at >= now() - interval '10 minutes'
    ) THEN
      INSERT INTO public.security_alerts (type, severity, details)
      VALUES ('status_change_burst_global', 'critical',
              jsonb_build_object('tabela', r.tabela, 'count', r.c,
                                 'window_minutes', 10, 'threshold', 500,
                                 'detected_at', now()));
      _alerts := _alerts + 1;
    END IF;
  END LOOP;
  RETURN _alerts;
END; $$;

REVOKE ALL ON FUNCTION public._scan_status_anomalies_global() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public._scan_status_anomalies_global() TO service_role;

-- 3) Cron a cada 10 min
DO $$ BEGIN
  PERFORM cron.unschedule('status_anomalies_scan')
  WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'status_anomalies_scan');
EXCEPTION WHEN OTHERS THEN NULL; END $$;

SELECT cron.schedule(
  'status_anomalies_scan',
  '*/10 * * * *',
  $$ SELECT public._scan_status_anomalies_global(); $$
);
