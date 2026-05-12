-- Adicionar colunas necessárias para conciliação bancária
ALTER TABLE public.cnab_itens 
ADD COLUMN IF NOT EXISTS folha_item_id UUID REFERENCES public.folha_itens(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS seu_numero TEXT,
ADD COLUMN IF NOT EXISTS codigo_ocorrencia TEXT,
ADD COLUMN IF NOT EXISTS mensagem_ocorrencia TEXT;

-- Criar índice para busca rápida durante o retorno
CREATE INDEX IF NOT EXISTS idx_cnab_itens_seu_numero ON public.cnab_itens(seu_numero);
CREATE INDEX IF NOT EXISTS idx_cnab_itens_folha_item_id ON public.cnab_itens(folha_item_id);
