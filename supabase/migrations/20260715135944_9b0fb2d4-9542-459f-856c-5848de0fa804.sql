-- REPLICA IDENTITY FULL: payload de UPDATE/DELETE traz a linha completa
ALTER TABLE public.security_alerts REPLICA IDENTITY FULL;

-- Adiciona à publicação do Realtime (idempotente)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename  = 'security_alerts'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.security_alerts';
  END IF;
END $$;