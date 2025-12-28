-- Migration: integracao_logs
-- Description: Logs de integração
-- Created at: 2025-12-28T19:25:55+00:00

-- Up Migration
CREATE TABLE IF NOT EXISTS integracao_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS Policies
ALTER TABLE integracao_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "integracao_logs_select" ON integracao_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "integracao_logs_insert" ON integracao_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "integracao_logs_update" ON integracao_logs
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_integracao_logs_created_at ON integracao_logs(created_at);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_integracao_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_integracao_logs_updated_at
  BEFORE UPDATE ON integracao_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_integracao_logs_updated_at();

-- Down Migration (rollback)
-- DROP TABLE IF EXISTS integracao_logs CASCADE;
