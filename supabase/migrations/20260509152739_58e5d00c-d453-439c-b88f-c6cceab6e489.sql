-- Adicionar coluna metadata se não existir
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admissoes' AND column_name='metadata') THEN
        ALTER TABLE public.admissoes ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

-- Garantir que a tabela de auditoria suporte os campos necessários (ou usar a estrutura existente)
-- A tabela existente é 'audit_log'
-- Colunas: id, user_id, user_email, acao, tabela, registro_id, campos_alterados, dados_anteriores, dados_novos, ip_address, user_agent, created_at
