
-- Etapa 3: ASO Digital + Workflow Clínica -> RH
-- Enriquece a tabela asos com campos necessários para workflow digital
ALTER TABLE public.asos
  ADD COLUMN IF NOT EXISTS agendamento_id UUID REFERENCES public.exames_agendamentos(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS clinica_partner_id UUID REFERENCES public.clinicas_partners(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'rascunho'
    CHECK (status IN ('rascunho','emitido_clinica','recebido_rh','validado','arquivado','cancelado')),
  ADD COLUMN IF NOT EXISTS restricoes JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS restricoes_descricao TEXT,
  ADD COLUMN IF NOT EXISTS restricao_data_fim DATE,
  ADD COLUMN IF NOT EXISTS assinatura_medico_hash TEXT,
  ADD COLUMN IF NOT EXISTS assinado_em TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS recebido_rh_em TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS recebido_rh_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS validado_em TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS validado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS motivo_cancelamento TEXT,
  ADD COLUMN IF NOT EXISTS emitido_por_partner_user UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Regra: se APTO_COM_RESTRICOES exige descrição
CREATE OR REPLACE FUNCTION public.asos_validar_restricoes()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.resultado = 'apto_com_restricoes' AND (NEW.restricoes_descricao IS NULL OR length(trim(NEW.restricoes_descricao)) < 5) THEN
    RAISE EXCEPTION 'ASO com restrições exige descrição detalhada (mínimo 5 caracteres)';
  END IF;
  IF NEW.resultado = 'apto_com_restricoes' AND NEW.restricao_data_fim IS NULL THEN
    RAISE EXCEPTION 'ASO com restrições exige data_fim da restrição';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_asos_validar_restricoes ON public.asos;
CREATE TRIGGER tr_asos_validar_restricoes
  BEFORE INSERT OR UPDATE ON public.asos
  FOR EACH ROW EXECUTE FUNCTION public.asos_validar_restricoes();

-- Workflow: state-machine de status
CREATE OR REPLACE FUNCTION public.asos_validar_transicao_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_allowed BOOLEAN := FALSE;
BEGIN
  IF TG_OP = 'INSERT' THEN
    RETURN NEW;
  END IF;
  IF NEW.status = OLD.status THEN
    RETURN NEW;
  END IF;
  -- Transições permitidas
  v_allowed := (OLD.status,NEW.status) IN (
    ('rascunho','emitido_clinica'),
    ('rascunho','cancelado'),
    ('emitido_clinica','recebido_rh'),
    ('emitido_clinica','cancelado'),
    ('recebido_rh','validado'),
    ('recebido_rh','cancelado'),
    ('validado','arquivado')
  );
  IF NOT v_allowed THEN
    RAISE EXCEPTION 'Transição de status inválida: % -> %', OLD.status, NEW.status;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_asos_validar_transicao ON public.asos;
CREATE TRIGGER tr_asos_validar_transicao
  BEFORE UPDATE ON public.asos
  FOR EACH ROW EXECUTE FUNCTION public.asos_validar_transicao_status();

-- Índices para performance de dashboard SST
CREATE INDEX IF NOT EXISTS idx_asos_status ON public.asos(empresa_id, status);
CREATE INDEX IF NOT EXISTS idx_asos_agendamento ON public.asos(agendamento_id) WHERE agendamento_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_asos_clinica_partner ON public.asos(clinica_partner_id) WHERE clinica_partner_id IS NOT NULL;

-- Auto-vincular ASO validado ao agendamento (marca como realizado)
CREATE OR REPLACE FUNCTION public.asos_auto_marcar_agendamento_realizado()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'validado' AND OLD.status <> 'validado' AND NEW.agendamento_id IS NOT NULL THEN
    UPDATE public.exames_agendamentos
       SET status = 'realizado', updated_at = now()
     WHERE id = NEW.agendamento_id AND status <> 'realizado';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_asos_auto_marcar_agendamento ON public.asos;
CREATE TRIGGER tr_asos_auto_marcar_agendamento
  AFTER UPDATE OF status ON public.asos
  FOR EACH ROW EXECUTE FUNCTION public.asos_auto_marcar_agendamento_realizado();
