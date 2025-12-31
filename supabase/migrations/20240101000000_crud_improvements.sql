-- ============================================
-- MIGRATION: CRUD Improvements
-- Sistema: DP System
-- Data: 2024
-- ============================================

-- ============================================
-- 1. TABELA: saved_filters (Filtros Salvos)
-- ============================================

CREATE TABLE IF NOT EXISTS saved_filters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL, -- ex: 'colaboradores', 'folha', 'ferias'
  name TEXT NOT NULL,
  filters JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraint: nome único por usuário e tipo de entidade
  CONSTRAINT unique_filter_name_per_user UNIQUE (user_id, entity_type, name)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_saved_filters_user ON saved_filters(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_filters_entity ON saved_filters(entity_type);
CREATE INDEX IF NOT EXISTS idx_saved_filters_default ON saved_filters(user_id, entity_type) WHERE is_default = true;

-- RLS (Row Level Security)
ALTER TABLE saved_filters ENABLE ROW LEVEL SECURITY;

-- Policy: Usuário pode gerenciar apenas seus próprios filtros
DROP POLICY IF EXISTS "Users can manage own filters" ON saved_filters;
CREATE POLICY "Users can manage own filters"
ON saved_filters FOR ALL
USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_saved_filters_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS saved_filters_updated_at ON saved_filters;
CREATE TRIGGER saved_filters_updated_at
  BEFORE UPDATE ON saved_filters
  FOR EACH ROW
  EXECUTE FUNCTION update_saved_filters_timestamp();


-- ============================================
-- 2. TABELA: entity_versions (Versionamento)
-- ============================================

CREATE TABLE IF NOT EXISTS entity_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL, -- nome da tabela/entidade
  entity_id UUID NOT NULL, -- ID do registro original
  version_number INT NOT NULL,
  data JSONB NOT NULL, -- snapshot dos dados
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  change_summary TEXT, -- descrição da mudança
  
  -- Constraint: versão única por entidade
  CONSTRAINT unique_version UNIQUE (entity_type, entity_id, version_number)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_versions_entity ON entity_versions(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_versions_date ON entity_versions(changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_versions_user ON entity_versions(changed_by);

-- RLS
ALTER TABLE entity_versions ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários autenticados podem ver versões
DROP POLICY IF EXISTS "Authenticated users can view versions" ON entity_versions;
CREATE POLICY "Authenticated users can view versions"
ON entity_versions FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Policy: Usuários podem criar versões
DROP POLICY IF EXISTS "Authenticated users can create versions" ON entity_versions;
CREATE POLICY "Authenticated users can create versions"
ON entity_versions FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);


-- ============================================
-- 3. FUNÇÃO: create_entity_version()
-- Cria versão automaticamente antes de UPDATE
-- ============================================

CREATE OR REPLACE FUNCTION create_entity_version()
RETURNS TRIGGER AS $$
DECLARE
  next_version INT;
BEGIN
  -- Calcular próxima versão
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO next_version
  FROM entity_versions
  WHERE entity_type = TG_TABLE_NAME AND entity_id = OLD.id;
  
  -- Inserir versão
  INSERT INTO entity_versions (
    entity_type,
    entity_id,
    version_number,
    data,
    changed_by,
    change_summary
  ) VALUES (
    TG_TABLE_NAME,
    OLD.id,
    next_version,
    row_to_json(OLD),
    auth.uid(),
    'Auto-save antes de update'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================
-- 4. VIEW: v_filter_stats
-- Estatísticas de uso de filtros
-- ============================================

CREATE OR REPLACE VIEW v_filter_stats AS
SELECT 
  entity_type,
  COUNT(*) as total_filters,
  COUNT(DISTINCT user_id) as users_with_filters,
  SUM(CASE WHEN is_default THEN 1 ELSE 0 END) as default_filters,
  MAX(created_at) as last_created
FROM saved_filters
GROUP BY entity_type;


-- ============================================
-- 5. FUNÇÃO: get_or_create_default_filter()
-- Retorna filtro padrão ou cria um vazio
-- ============================================

CREATE OR REPLACE FUNCTION get_default_filter(
  p_entity_type TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_filters JSONB;
BEGIN
  SELECT filters INTO v_filters
  FROM saved_filters
  WHERE user_id = auth.uid()
    AND entity_type = p_entity_type
    AND is_default = true
  LIMIT 1;
  
  RETURN COALESCE(v_filters, '{}'::JSONB);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================
-- 6. Comentários nas tabelas
-- ============================================

COMMENT ON TABLE saved_filters IS 'Filtros salvos pelos usuários para diferentes entidades do sistema';
COMMENT ON COLUMN saved_filters.entity_type IS 'Tipo da entidade (ex: colaboradores, folha, ferias)';
COMMENT ON COLUMN saved_filters.filters IS 'Objeto JSON com os filtros configurados';
COMMENT ON COLUMN saved_filters.is_default IS 'Se true, este filtro é aplicado automaticamente ao abrir a página';

COMMENT ON TABLE entity_versions IS 'Histórico de versões de registros para auditoria e recuperação';
COMMENT ON COLUMN entity_versions.entity_type IS 'Nome da tabela/entidade versionada';
COMMENT ON COLUMN entity_versions.data IS 'Snapshot completo dos dados no momento da versão';


-- ============================================
-- DONE!
-- ============================================
