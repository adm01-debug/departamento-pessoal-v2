-- 1. Ajustar audit_logs
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_logs' AND column_name='empresa_id') THEN
        ALTER TABLE public.audit_logs ADD COLUMN empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 2. Ajustar auditoria_logs
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='auditoria_logs' AND column_name='empresa_id') THEN
        ALTER TABLE public.auditoria_logs ADD COLUMN empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 3. Habilitar RLS e Criar Políticas
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditoria_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Multi-tenant access for audit_logs" ON public.audit_logs;
CREATE POLICY "Multi-tenant access for audit_logs" ON public.audit_logs FOR ALL USING (empresa_id = auth.uid() OR (SELECT c.empresa_id FROM public.colaboradores c WHERE c.id = auth.uid()) = empresa_id);

DROP POLICY IF EXISTS "Multi-tenant access for auditoria_logs" ON public.auditoria_logs;
CREATE POLICY "Multi-tenant access for auditoria_logs" ON public.auditoria_logs FOR ALL USING (empresa_id = auth.uid() OR (SELECT c.empresa_id FROM public.colaboradores c WHERE c.id = auth.uid()) = empresa_id);
