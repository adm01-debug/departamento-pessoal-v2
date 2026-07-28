
-- GAP 6: Workflow de Aprovação em Afastamentos
ALTER TABLE public.afastamentos
  ADD COLUMN IF NOT EXISTS aprovado_por uuid,
  ADD COLUMN IF NOT EXISTS aprovado_em timestamptz,
  ADD COLUMN IF NOT EXISTS rejeitado_por uuid,
  ADD COLUMN IF NOT EXISTS rejeitado_em timestamptz,
  ADD COLUMN IF NOT EXISTS motivo_rejeicao text;

-- GAP 9: Pontos Abertos (Open Shifts) - View
CREATE OR REPLACE VIEW public.pontos_abertos AS
SELECT
  rp.id,
  rp.colaborador_id,
  c.nome_completo,
  rp.data,
  rp.entrada_1,
  rp.saida_1,
  rp.entrada_2,
  rp.saida_2,
  rp.empresa_id
FROM public.registros_ponto rp
JOIN public.colaboradores c ON c.id = rp.colaborador_id
WHERE rp.saida_1 IS NULL
  AND rp.data <= CURRENT_DATE
ORDER BY rp.data DESC;
