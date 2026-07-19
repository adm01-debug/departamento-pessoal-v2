-- V16-006: Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE departamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cargos ENABLE ROW LEVEL SECURITY;
ALTER TABLE sindicatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE colaboradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE dependentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rubricas ENABLE ROW LEVEL SECURITY;
ALTER TABLE folha_pagamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE folha_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE ferias ENABLE ROW LEVEL SECURITY;
ALTER TABLE ponto_registros ENABLE ROW LEVEL SECURITY;
ALTER TABLE banco_horas ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficios ENABLE ROW LEVEL SECURITY;
ALTER TABLE colaborador_beneficios ENABLE ROW LEVEL SECURITY;
ALTER TABLE afastamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE feriados ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos_rh ENABLE ROW LEVEL SECURITY;
ALTER TABLE esocial_eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE esocial_lotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's empresa_id (public schema for branching compatibility)
CREATE OR REPLACE FUNCTION public.user_empresa_id()
RETURNS UUID AS $$
  SELECT (auth.jwt() -> 'user_metadata' ->> 'empresa_id')::UUID;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Empresas policies
CREATE POLICY empresa_select ON empresas FOR SELECT USING (id = public.user_empresa_id() OR auth.jwt() ->> 'role' = 'super_admin');
CREATE POLICY empresa_insert ON empresas FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'super_admin');
CREATE POLICY empresa_update ON empresas FOR UPDATE USING (id = public.user_empresa_id() AND auth.jwt() ->> 'role' IN ('admin', 'super_admin'));
CREATE POLICY empresa_delete ON empresas FOR DELETE USING (auth.jwt() ->> 'role' = 'super_admin');

-- Colaboradores policies
CREATE POLICY colab_select ON colaboradores FOR SELECT USING (empresa_id = public.user_empresa_id());
CREATE POLICY colab_insert ON colaboradores FOR INSERT WITH CHECK (empresa_id = public.user_empresa_id() AND auth.jwt() ->> 'role' IN ('admin', 'rh'));
CREATE POLICY colab_update ON colaboradores FOR UPDATE USING (empresa_id = public.user_empresa_id() AND auth.jwt() ->> 'role' IN ('admin', 'rh'));
CREATE POLICY colab_delete ON colaboradores FOR DELETE USING (empresa_id = public.user_empresa_id() AND auth.jwt() ->> 'role' = 'admin');

-- Departamentos policies
CREATE POLICY depto_select ON departamentos FOR SELECT USING (empresa_id = public.user_empresa_id());
CREATE POLICY depto_all ON departamentos FOR ALL USING (empresa_id = public.user_empresa_id() AND auth.jwt() ->> 'role' IN ('admin', 'rh'));

-- Cargos policies
CREATE POLICY cargos_select ON cargos FOR SELECT USING (empresa_id = public.user_empresa_id());
CREATE POLICY cargos_all ON cargos FOR ALL USING (empresa_id = public.user_empresa_id() AND auth.jwt() ->> 'role' IN ('admin', 'rh'));

-- Folha policies
CREATE POLICY folha_select ON folha_pagamento FOR SELECT USING (empresa_id = public.user_empresa_id());
CREATE POLICY folha_all ON folha_pagamento FOR ALL USING (empresa_id = public.user_empresa_id() AND auth.jwt() ->> 'role' IN ('admin', 'rh', 'financeiro'));

-- Ferias policies (colaborador pode ver as próprias)
CREATE POLICY ferias_select ON ferias FOR SELECT USING (
  colaborador_id IN (SELECT id FROM colaboradores WHERE empresa_id = public.user_empresa_id())
);
CREATE POLICY ferias_all ON ferias FOR ALL USING (
  colaborador_id IN (SELECT id FROM colaboradores WHERE empresa_id = public.user_empresa_id()) 
  AND auth.jwt() ->> 'role' IN ('admin', 'rh')
);

-- Ponto policies
CREATE POLICY ponto_select ON ponto_registros FOR SELECT USING (
  colaborador_id IN (SELECT id FROM colaboradores WHERE empresa_id = public.user_empresa_id())
);
CREATE POLICY ponto_all ON ponto_registros FOR ALL USING (
  colaborador_id IN (SELECT id FROM colaboradores WHERE empresa_id = public.user_empresa_id())
  AND auth.jwt() ->> 'role' IN ('admin', 'rh')
);

-- Auditoria policies (somente leitura para admin)
CREATE POLICY audit_select ON auditoria FOR SELECT USING (
  empresa_id = public.user_empresa_id() AND auth.jwt() ->> 'role' = 'admin'
);
CREATE POLICY audit_insert ON auditoria FOR INSERT WITH CHECK (true);

-- Notificacoes policies
CREATE POLICY notif_select ON notificacoes FOR SELECT USING (usuario_id = auth.uid() OR empresa_id = public.user_empresa_id());
CREATE POLICY notif_update ON notificacoes FOR UPDATE USING (usuario_id = auth.uid());
