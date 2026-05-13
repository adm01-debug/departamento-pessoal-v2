-- 1. Garantir que a tabela de execuções suporte metadados
ALTER TABLE public.workflows_execucoes 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 2. Criar função para iniciar workflow automaticamente
CREATE OR REPLACE FUNCTION public.fn_start_workflow_on_colaborador_create()
RETURNS TRIGGER AS $$
DECLARE
    def_record RECORD;
    exec_id UUID;
BEGIN
    -- Busca definições de workflow do tipo 'admissao' ativas para a empresa
    FOR def_record IN 
        SELECT id, nome 
        FROM public.workflows_definicoes 
        WHERE tipo = 'admissao' 
          AND ativo = true 
          AND empresa_id = NEW.empresa_id
    LOOP
        -- Inicia a execução do workflow
        INSERT INTO public.workflows_execucoes (
            definicao_id,
            empresa_id,
            status,
            colaborador_id,
            metadata,
            data_inicio
        ) VALUES (
            def_record.id,
            NEW.empresa_id,
            'em_andamento',
            NEW.id,
            jsonb_build_object(
                'trigger', 'create_colaborador',
                'colaborador_nome', NEW.nome_completo,
                'data_evento', now()
            ),
            now()
        ) RETURNING id INTO exec_id;

        -- Registrar histórico inicial
        INSERT INTO public.workflows_historico (
            execucao_id,
            status_anterior,
            status_novo,
            observacao
        ) VALUES (
            exec_id,
            'inicial',
            'em_andamento',
            'Workflow de admissão iniciado automaticamente pelo sistema.'
        );
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Criar a trigger na tabela colaboradores
DROP TRIGGER IF EXISTS tr_auto_start_workflow_on_hiring ON public.colaboradores;
CREATE TRIGGER tr_auto_start_workflow_on_hiring
AFTER INSERT ON public.colaboradores
FOR EACH ROW
EXECUTE FUNCTION public.fn_start_workflow_on_colaborador_create();
