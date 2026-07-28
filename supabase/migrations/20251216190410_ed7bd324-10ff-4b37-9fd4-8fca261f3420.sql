-- Adicionar campos extras para admissão
ALTER TABLE public.admissoes
ADD COLUMN cpf TEXT,
ADD COLUMN data_nascimento DATE,
ADD COLUMN sexo TEXT,
ADD COLUMN email TEXT,
ADD COLUMN telefone TEXT,
ADD COLUMN estado_civil TEXT DEFAULT 'solteiro',
ADD COLUMN nome_mae TEXT;