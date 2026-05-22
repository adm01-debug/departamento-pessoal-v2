-- Criar tabela de fila de processamento
CREATE TABLE IF NOT EXISTS public.fila_processamento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_tarefa TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente', -- pendente, processando, concluido, erro
    payload JSONB DEFAULT '{}'::jsonb,
    resultado JSONB,
    progresso INTEGER DEFAULT 0,
    erro_log TEXT,
    usuario_id UUID REFERENCES auth.users(id),
    empresa_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.fila_processamento ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Usuários podem ver suas próprias tarefas"
ON public.fila_processamento FOR SELECT
USING (auth.uid() = usuario_id);

-- Índices para performance
CREATE INDEX idx_fila_processamento_status ON public.fila_processamento(status) WHERE status = 'pendente';
CREATE INDEX idx_fila_processamento_usuario ON public.fila_processamento(usuario_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_fila_processamento_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_fila_processamento_updated_at
BEFORE UPDATE ON public.fila_processamento
FOR EACH ROW
EXECUTE FUNCTION update_fila_processamento_updated_at();
