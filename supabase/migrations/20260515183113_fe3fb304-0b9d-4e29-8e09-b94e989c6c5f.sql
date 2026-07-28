-- Reconfiguração de Views para usar SECURITY INVOKER (padrão seguro)
-- Nota: PostgreSQL views por padrão usam as permissões do usuário que consulta, 
-- a menos que explicitamente criadas como SECURITY DEFINER. 
-- Vamos recriar as principais garantindo que respeitem o RLS.

DROP VIEW IF EXISTS public.vw_colaboradores_completo;
CREATE VIEW public.vw_colaboradores_completo WITH (security_invoker = true) AS
SELECT * FROM public.colaboradores;

DROP VIEW IF EXISTS public.vw_dashboard_time;
CREATE VIEW public.vw_dashboard_time WITH (security_invoker = true) AS
SELECT 
    empresa_id,
    count(*) as total_colaboradores,
    count(*) FILTER (WHERE status = 'ativo') as ativos,
    count(*) FILTER (WHERE status = 'afastado') as afastados
FROM public.colaboradores
GROUP BY empresa_id;

DROP VIEW IF EXISTS public.vw_alertas_rh;
CREATE VIEW public.vw_alertas_rh WITH (security_invoker = true) AS
SELECT * FROM public.notificacoes WHERE lida = false;
