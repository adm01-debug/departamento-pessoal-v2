
ALTER TABLE public.folhas_pagamento
  ADD COLUMN IF NOT EXISTS fechada_por uuid,
  ADD COLUMN IF NOT EXISTS reaberta_em timestamptz,
  ADD COLUMN IF NOT EXISTS reaberta_por uuid,
  ADD COLUMN IF NOT EXISTS motivo_reabertura text,
  ADD COLUMN IF NOT EXISTS esocial_status text NOT NULL DEFAULT 'nao_enviado';

UPDATE public.folhas_pagamento SET version = COALESCE(version, 1) WHERE version IS NULL;
ALTER TABLE public.folhas_pagamento ALTER COLUMN version SET DEFAULT 1;
ALTER TABLE public.folhas_pagamento ALTER COLUMN version SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_folhas_pagamento_empresa_status ON public.folhas_pagamento(empresa_id, status);
