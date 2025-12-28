-- Migration: ferias_programacao
-- Description: Programação de férias
-- Created at: 2025-12-28T19:25:46+00:00

-- Up Migration
CREATE TABLE IF NOT EXISTS ferias_programacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS Policies
ALTER TABLE ferias_programacao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ferias_programacao_select" ON ferias_programacao
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "ferias_programacao_insert" ON ferias_programacao
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "ferias_programacao_update" ON ferias_programacao
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ferias_programacao_created_at ON ferias_programacao(created_at);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_ferias_programacao_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ferias_programacao_updated_at
  BEFORE UPDATE ON ferias_programacao
  FOR EACH ROW
  EXECUTE FUNCTION update_ferias_programacao_updated_at();

-- Down Migration (rollback)
-- DROP TABLE IF EXISTS ferias_programacao CASCADE;
