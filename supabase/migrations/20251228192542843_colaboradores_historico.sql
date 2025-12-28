-- Migration: colaboradores_historico
-- Description: Histórico de alterações de colaboradores
-- Created at: 2025-12-28T19:25:42+00:00

-- Up Migration
CREATE TABLE IF NOT EXISTS colaboradores_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS Policies
ALTER TABLE colaboradores_historico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "colaboradores_historico_select" ON colaboradores_historico
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "colaboradores_historico_insert" ON colaboradores_historico
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "colaboradores_historico_update" ON colaboradores_historico
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_colaboradores_historico_created_at ON colaboradores_historico(created_at);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_colaboradores_historico_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_colaboradores_historico_updated_at
  BEFORE UPDATE ON colaboradores_historico
  FOR EACH ROW
  EXECUTE FUNCTION update_colaboradores_historico_updated_at();

-- Down Migration (rollback)
-- DROP TABLE IF EXISTS colaboradores_historico CASCADE;
