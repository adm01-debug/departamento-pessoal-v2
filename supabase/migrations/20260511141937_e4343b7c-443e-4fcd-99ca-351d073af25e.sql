-- Garantir integridade multi-tenant na unicidade
ALTER TABLE public.folhas_pagamento DROP CONSTRAINT IF EXISTS folhas_pagamento_competencia_tipo_key;
ALTER TABLE public.folhas_pagamento ADD CONSTRAINT folhas_pagamento_empresa_comp_tipo_unique UNIQUE (empresa_id, competencia, tipo);

-- Refinar RLS para Folhas de Pagamento
ALTER TABLE public.folhas_pagamento ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem ver folhas da empresa" ON public.folhas_pagamento;
DROP POLICY IF EXISTS "Leitura por empresa" ON public.folhas_pagamento;
CREATE POLICY "Leitura por empresa" 
ON public.folhas_pagamento FOR SELECT 
TO authenticated
USING (empresa_id::uuid = (auth.jwt()->>'empresa_id')::uuid);

DROP POLICY IF EXISTS "RH e Admin podem gerenciar folhas" ON public.folhas_pagamento;
DROP POLICY IF EXISTS "Gestão de folha por cargo" ON public.folhas_pagamento;
CREATE POLICY "Gestão de folha por cargo" 
ON public.folhas_pagamento FOR ALL 
TO authenticated
USING (
  (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gestor') OR public.has_role(auth.uid(), 'rh')) AND 
  (empresa_id::uuid = (auth.jwt()->>'empresa_id')::uuid)
)
WITH CHECK (
  (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gestor') OR public.has_role(auth.uid(), 'rh')) AND 
  (empresa_id::uuid = (auth.jwt()->>'empresa_id')::uuid)
);

-- Impedir deleção de folha FECHADA (Proteção contra erro humano/fraude)
CREATE OR REPLACE FUNCTION public.impedir_alteracao_folha_fechada()
RETURNS TRIGGER AS $$
BEGIN
    -- Se a folha já estava fechada, não permite NENHUMA alteração ou delete
    IF (OLD.status = 'fechada') THEN
        RAISE EXCEPTION 'Não é permitido alterar ou excluir uma folha que já foi fechada.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS trigger_protecao_folha_fechada ON public.folhas_pagamento;
CREATE TRIGGER trigger_protecao_folha_fechada
BEFORE DELETE OR UPDATE ON public.folhas_pagamento
FOR EACH ROW
EXECUTE FUNCTION public.impedir_alteracao_folha_fechada();