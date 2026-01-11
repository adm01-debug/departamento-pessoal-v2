-- V16-005: eSocial e Auditoria Schema

-- ESOCIAL EVENTOS
CREATE TABLE IF NOT EXISTS esocial_eventos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  colaborador_id UUID REFERENCES colaboradores(id),
  tipo_evento VARCHAR(10) NOT NULL, -- S-1000, S-1005, S-1010, S-2200, S-2206, S-2299, S-2230, S-1200, S-1210
  id_evento VARCHAR(50),
  numero_recibo VARCHAR(50),
  xml_envio TEXT,
  xml_retorno TEXT,
  data_envio TIMESTAMPTZ,
  data_retorno TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'pendente', -- pendente, enviado, processado, erro, rejeitado
  codigo_retorno VARCHAR(10),
  mensagem_retorno TEXT,
  ambiente VARCHAR(20) DEFAULT 'producao_restrita',
  lote_id VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ESOCIAL LOTES
CREATE TABLE IF NOT EXISTS esocial_lotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  protocolo VARCHAR(50),
  tipo VARCHAR(20), -- tabelas, nao_periodicos, periodicos
  quantidade_eventos INTEGER,
  data_envio TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'pendente',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AUDITORIA (Log de todas as ações)
CREATE TABLE IF NOT EXISTS auditoria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id),
  usuario_id UUID NOT NULL,
  usuario_nome VARCHAR(255),
  acao VARCHAR(50) NOT NULL, -- create, update, delete, view, export, login, logout
  tabela VARCHAR(100),
  registro_id UUID,
  dados_anteriores JSONB,
  dados_novos JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BACKUP LOGS
CREATE TABLE IF NOT EXISTS backup_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id),
  tipo VARCHAR(20) NOT NULL, -- full, incremental, restore
  status VARCHAR(20) DEFAULT 'iniciado', -- iniciado, em_progresso, concluido, erro
  arquivo VARCHAR(255),
  tamanho_bytes BIGINT,
  tabelas_incluidas TEXT[],
  data_inicio TIMESTAMPTZ DEFAULT NOW(),
  data_fim TIMESTAMPTZ,
  erro TEXT,
  created_by UUID
);

-- NOTIFICACOES
CREATE TABLE IF NOT EXISTS notificacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id),
  usuario_id UUID,
  titulo VARCHAR(255) NOT NULL,
  mensagem TEXT NOT NULL,
  tipo VARCHAR(20) DEFAULT 'info', -- info, warning, error, success
  link VARCHAR(255),
  lida BOOLEAN DEFAULT false,
  data_leitura TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONFIGURACOES
CREATE TABLE IF NOT EXISTS configuracoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  chave VARCHAR(100) NOT NULL,
  valor TEXT,
  tipo VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json
  descricao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(empresa_id, chave)
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_esocial_empresa ON esocial_eventos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_esocial_status ON esocial_eventos(status);
CREATE INDEX IF NOT EXISTS idx_esocial_tipo ON esocial_eventos(tipo_evento);
CREATE INDEX IF NOT EXISTS idx_auditoria_empresa ON auditoria(empresa_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_data ON auditoria(created_at);
CREATE INDEX IF NOT EXISTS idx_auditoria_usuario ON auditoria(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_usuario ON notificacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_config_empresa ON configuracoes(empresa_id);
