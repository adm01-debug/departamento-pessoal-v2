
DO $$ BEGIN
  CREATE TYPE public.regime_tributario AS ENUM (
    'simples_nacional', 'lucro_presumido', 'lucro_real', 'mei'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.empresas
  ADD COLUMN IF NOT EXISTS regime_tributario public.regime_tributario NOT NULL DEFAULT 'lucro_real',
  ADD COLUMN IF NOT EXISTS aliquota_simples NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS fap NUMERIC(5,4) DEFAULT 1.0000,
  ADD COLUMN IF NOT EXISTS rat NUMERIC(5,4) DEFAULT 0.0200,
  ADD COLUMN IF NOT EXISTS terceiros NUMERIC(5,4) DEFAULT 0.0580,
  ADD COLUMN IF NOT EXISTS cor_identificacao TEXT DEFAULT '#3b82f6',
  ADD COLUMN IF NOT EXISTS ordem_exibicao INTEGER DEFAULT 0;

UPDATE public.empresas
SET cor_identificacao = CASE (abs(hashtext(id::text)) % 8)
  WHEN 0 THEN '#3b82f6' WHEN 1 THEN '#10b981' WHEN 2 THEN '#f59e0b'
  WHEN 3 THEN '#8b5cf6' WHEN 4 THEN '#ec4899' WHEN 5 THEN '#14b8a6'
  WHEN 6 THEN '#f97316' ELSE '#6366f1'
END
WHERE cor_identificacao IS NULL OR cor_identificacao = '#3b82f6';

CREATE OR REPLACE FUNCTION public.get_user_scope_empresas(_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT id FROM public.empresas WHERE ativa = true
    AND public.has_role(_user_id, 'admin'::app_role)
  UNION
  SELECT empresa_id FROM public.user_empresas WHERE user_id = _user_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_scope_empresas(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.auto_vincular_admins_empresa()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_empresas (user_id, empresa_id, is_default)
  SELECT ur.user_id, NEW.id, false FROM public.user_roles ur WHERE ur.role = 'admin'
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_vincular_admins ON public.empresas;
CREATE TRIGGER trg_auto_vincular_admins
  AFTER INSERT ON public.empresas
  FOR EACH ROW EXECUTE FUNCTION public.auto_vincular_admins_empresa();

INSERT INTO public.user_empresas (user_id, empresa_id, is_default)
SELECT ur.user_id, e.id, false
FROM public.user_roles ur CROSS JOIN public.empresas e
WHERE ur.role = 'admin'
ON CONFLICT DO NOTHING;
