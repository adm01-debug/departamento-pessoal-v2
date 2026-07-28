
ALTER TABLE public.webhook_logs
  ADD COLUMN IF NOT EXISTS event_id TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT,
  ADD COLUMN IF NOT EXISTS version TEXT,
  ADD COLUMN IF NOT EXISTS headers JSONB;

CREATE UNIQUE INDEX IF NOT EXISTS webhook_logs_event_id_unique
  ON public.webhook_logs(event_id)
  WHERE event_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS webhook_logs_status_created_idx
  ON public.webhook_logs(status, created_at DESC)
  WHERE status IS NOT NULL;
