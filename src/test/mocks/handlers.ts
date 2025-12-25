/** Mock handlers para testes */
export const mockColaborador = {
  id: '1',
  nome: 'Test User',
  cpf: '12345678901',
  email: 'test@example.com',
  data_admissao: '2024-01-01',
  status: 'ativo',
};

export const mockFerias = {
  id: '1',
  colaborador_id: '1',
  data_inicio: '2024-07-01',
  data_fim: '2024-07-30',
  status: 'aprovado',
};

export const mockFolha = {
  id: '1',
  colaborador_id: '1',
  mes_referencia: '2024-01',
  salario_bruto: 5000,
  salario_liquido: 4200,
};

export const mockBeneficio = {
  id: '1',
  nome: 'Vale Refeição',
  tipo: 'alimentacao',
  valor: 500,
};
