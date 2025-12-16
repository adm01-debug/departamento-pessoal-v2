-- Create enum types for colaboradores
CREATE TYPE public.estado_civil AS ENUM ('solteiro', 'casado', 'divorciado', 'viuvo', 'separado', 'uniao_estavel');
CREATE TYPE public.sexo AS ENUM ('masculino', 'feminino');
CREATE TYPE public.tipo_contrato AS ENUM ('clt', 'pj', 'estagiario', 'temporario', 'intermitente', 'aprendiz');
CREATE TYPE public.status_colaborador AS ENUM ('ativo', 'ferias', 'afastado', 'desligado', 'pendente');
CREATE TYPE public.escolaridade AS ENUM ('fundamental_incompleto', 'fundamental_completo', 'medio_incompleto', 'medio_completo', 'superior_incompleto', 'superior_completo', 'pos_graduacao', 'mestrado', 'doutorado');
CREATE TYPE public.tipo_conta AS ENUM ('corrente', 'poupanca', 'salario');

-- Create colaboradores table with all eSocial required fields
CREATE TABLE public.colaboradores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  
  -- Dados Pessoais
  nome_completo TEXT NOT NULL,
  nome_social TEXT,
  cpf TEXT NOT NULL UNIQUE,
  rg TEXT,
  rg_orgao_emissor TEXT,
  rg_uf TEXT,
  rg_data_emissao DATE,
  data_nascimento DATE NOT NULL,
  sexo sexo NOT NULL,
  estado_civil estado_civil NOT NULL DEFAULT 'solteiro',
  nacionalidade TEXT DEFAULT 'Brasileira',
  naturalidade_cidade TEXT,
  naturalidade_uf TEXT,
  nome_mae TEXT NOT NULL,
  nome_pai TEXT,
  
  -- Documentos Trabalhistas
  pis_pasep TEXT,
  ctps_numero TEXT,
  ctps_serie TEXT,
  ctps_uf TEXT,
  ctps_data_emissao DATE,
  titulo_eleitor TEXT,
  titulo_zona TEXT,
  titulo_secao TEXT,
  certificado_reservista TEXT,
  cnh_numero TEXT,
  cnh_categoria TEXT,
  cnh_validade DATE,
  
  -- Contato
  email TEXT,
  telefone TEXT,
  celular TEXT,
  
  -- Endereço
  cep TEXT,
  logradouro TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  uf TEXT,
  
  -- Dados Bancários
  banco_codigo TEXT,
  banco_nome TEXT,
  agencia TEXT,
  conta TEXT,
  tipo_conta tipo_conta DEFAULT 'corrente',
  pix_tipo TEXT,
  pix_chave TEXT,
  
  -- Dados Contratuais
  matricula TEXT UNIQUE,
  data_admissao DATE NOT NULL,
  data_desligamento DATE,
  tipo_contrato tipo_contrato NOT NULL DEFAULT 'clt',
  cargo TEXT NOT NULL,
  departamento TEXT NOT NULL,
  centro_custo TEXT,
  local_trabalho TEXT,
  cbo TEXT, -- Código Brasileiro de Ocupações
  
  -- Remuneração
  salario_base DECIMAL(12,2) NOT NULL,
  tipo_salario TEXT DEFAULT 'mensal', -- mensal, horista, comissionado
  
  -- Jornada
  jornada_semanal INTEGER DEFAULT 44,
  horario_entrada TIME,
  horario_saida TIME,
  intervalo_minutos INTEGER DEFAULT 60,
  
  -- Escolaridade e Qualificação
  escolaridade escolaridade,
  formacao TEXT,
  cursos_certificacoes TEXT,
  
  -- Status
  status status_colaborador NOT NULL DEFAULT 'ativo',
  
  -- Observações
  observacoes TEXT,
  
  -- Foto
  foto_url TEXT
);

-- Enable RLS
ALTER TABLE public.colaboradores ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can view colaboradores"
ON public.colaboradores
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert colaboradores"
ON public.colaboradores
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update colaboradores"
ON public.colaboradores
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete colaboradores"
ON public.colaboradores
FOR DELETE
TO authenticated
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_colaboradores_updated_at
BEFORE UPDATE ON public.colaboradores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create dependentes table
CREATE TABLE public.dependentes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  colaborador_id UUID NOT NULL REFERENCES public.colaboradores(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cpf TEXT,
  data_nascimento DATE NOT NULL,
  parentesco TEXT NOT NULL, -- filho, conjuge, pai, mae, etc
  para_irrf BOOLEAN DEFAULT false,
  para_salario_familia BOOLEAN DEFAULT false,
  para_plano_saude BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.dependentes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage dependentes"
ON public.dependentes
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create historico_cargo table for tracking position/salary changes
CREATE TABLE public.historico_cargo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  colaborador_id UUID NOT NULL REFERENCES public.colaboradores(id) ON DELETE CASCADE,
  cargo_anterior TEXT,
  cargo_novo TEXT NOT NULL,
  salario_anterior DECIMAL(12,2),
  salario_novo DECIMAL(12,2) NOT NULL,
  motivo TEXT, -- promocao, merito, transferencia, etc
  data_alteracao DATE NOT NULL,
  observacao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.historico_cargo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage historico_cargo"
ON public.historico_cargo
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create documentos table for file attachments
CREATE TABLE public.documentos_colaborador (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  colaborador_id UUID NOT NULL REFERENCES public.colaboradores(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL, -- rg, cpf, ctps, comprovante_residencia, foto, contrato, etc
  nome_arquivo TEXT NOT NULL,
  url TEXT NOT NULL,
  tamanho_bytes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.documentos_colaborador ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage documentos"
ON public.documentos_colaborador
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);