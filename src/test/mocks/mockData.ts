/** Mock data para testes */

export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin',
};

export const mockColaborador = {
  id: '1',
  nome: 'João Silva',
  cpf: '123.456.789-00',
  email: 'joao@example.com',
  cargo: 'Desenvolvedor',
  departamento: 'TI',
  data_admissao: '2024-01-01',
  status: 'active',
};

export const mockEmpresa = {
  id: '1',
  razao_social: 'Empresa Teste LTDA',
  cnpj: '12.345.678/0001-90',
  ie: '123456789',
  endereco: 'Rua Teste, 123',
  cidade: 'São Paulo',
  estado: 'SP',
  cep: '01234-567',
};

export const mockAdmissao = {
  id: '1',
  colaborador_id: '1',
  data_admissao: '2024-01-01',
  tipo_contrato: 'CLT',
  cargo: 'Desenvolvedor',
  salario: 5000,
  status: 'pending',
};

export const mockDesligamento = {
  id: '1',
  colaborador_id: '1',
  data_desligamento: '2024-12-31',
  tipo: 'sem_justa_causa',
  motivo: 'Reestruturação',
  status: 'pending',
};

export const mockList = <T extends Record<string, any>>(item: T, count = 10): T[] =>
  Array.from({ length: count }, (_, i) => ({ ...item, id: String(i + 1) }));
