// Dados mockados para prototipagem do Sistema DP

export interface Colaborador {
  id: string;
  nome: string;
  matricula: string;
  cargo: string;
  departamento: string;
  status: 'ativo' | 'ferias' | 'afastado' | 'desligado' | 'admissao';
  dataAdmissao: string;
  salario: number;
  foto?: string;
  gestor?: string;
}

export interface KPIData {
  colaboradoresAtivos: number;
  admissoesEmCurso: number;
  feriasEsteMes: number;
  afastadosHoje: number;
  pontosPendentes: number;
  folhaProjetada: number;
  desligamentosEmCurso: number;
  alertasUrgentes: number;
}

export interface Alerta {
  id: string;
  tipo: 'ferias' | 'admissao' | 'ponto' | 'atestado' | 'documento';
  titulo: string;
  descricao: string;
  urgencia: 'alta' | 'media' | 'baixa';
  data: string;
}

export interface FeriasItem {
  id: string;
  colaboradorId: string;
  colaboradorNome: string;
  departamento: string;
  dataInicio: string;
  dataFim: string;
  dias: number;
  status: 'aprovada' | 'pendente' | 'em_gozo';
}

export interface AdmissaoItem {
  id: string;
  candidatoNome: string;
  cargo: string;
  departamento: string;
  etapa: string;
  progresso: number;
  dataPrevisao: string;
}

export interface PontoResumo {
  colaboradorId: string;
  colaboradorNome: string;
  horasTrabalhadas: number;
  horasExtras: number;
  faltas: number;
  atrasos: number;
  status: 'ok' | 'pendente' | 'inconsistencia';
}

// === DADOS MOCKADOS ===

export const mockKPIs: KPIData = {
  colaboradoresAtivos: 48,
  admissoesEmCurso: 3,
  feriasEsteMes: 5,
  afastadosHoje: 2,
  pontosPendentes: 12,
  folhaProjetada: 185000,
  desligamentosEmCurso: 1,
  alertasUrgentes: 7,
};

export const mockColaboradores: Colaborador[] = [
  { id: '1', nome: 'João Silva Santos', matricula: '001-2024', cargo: 'Operador de Produção', departamento: 'Gravação', status: 'ativo', dataAdmissao: '2024-01-15', salario: 3500, gestor: 'Carlos Mendes' },
  { id: '2', nome: 'Maria Oliveira Costa', matricula: '002-2024', cargo: 'Designer Gráfico', departamento: 'Artes', status: 'ferias', dataAdmissao: '2024-02-01', salario: 4200, gestor: 'Paula Coordenadora' },
  { id: '3', nome: 'Pedro Lima Souza', matricula: '003-2024', cargo: 'Vendedor', departamento: 'Comercial', status: 'ativo', dataAdmissao: '2024-03-10', salario: 3800, gestor: 'Roberto Vendas' },
  { id: '4', nome: 'Ana Souza Ferreira', matricula: '004-2024', cargo: 'Analista DP', departamento: 'Administrativo', status: 'afastado', dataAdmissao: '2023-06-15', salario: 4500, gestor: 'Diretor RH' },
  { id: '5', nome: 'Carlos Lima Pereira', matricula: '005-2024', cargo: 'Motorista', departamento: 'Logística', status: 'ativo', dataAdmissao: '2023-09-01', salario: 3200, gestor: 'Coordenador Log' },
  { id: '6', nome: 'Fernanda Alves', matricula: '006-2023', cargo: 'Assistente Comercial', departamento: 'Comercial', status: 'ativo', dataAdmissao: '2023-04-20', salario: 2800, gestor: 'Roberto Vendas' },
  { id: '7', nome: 'Ricardo Santos', matricula: '007-2023', cargo: 'Operador CNC', departamento: 'Gravação', status: 'ativo', dataAdmissao: '2023-07-10', salario: 3600, gestor: 'Carlos Mendes' },
  { id: '8', nome: 'Juliana Costa', matricula: '008-2024', cargo: 'Assistente Financeiro', departamento: 'Financeiro', status: 'ativo', dataAdmissao: '2024-01-02', salario: 3000, gestor: 'Gerente Financeiro' },
];

export const mockAlertas: Alerta[] = [
  { id: '1', tipo: 'ferias', titulo: '3 férias vencendo em 30 dias', descricao: 'Ana Souza, Carlos Lima, Pedro Santos precisam programar férias', urgencia: 'alta', data: '2025-12-16' },
  { id: '2', tipo: 'admissao', titulo: '2 admissões pendentes de documentação', descricao: 'Maria Designer e João Aux estão com docs incompletos', urgencia: 'media', data: '2025-12-15' },
  { id: '3', tipo: 'ponto', titulo: '1 período de ponto não fechado', descricao: 'Novembro/2025 ainda em aberto para Gravação', urgencia: 'media', data: '2025-12-14' },
  { id: '4', tipo: 'atestado', titulo: '1 atestado > 15 dias', descricao: 'Carlos Lima precisa encaminhamento INSS', urgencia: 'alta', data: '2025-12-10' },
  { id: '5', tipo: 'documento', titulo: 'CNH vencendo', descricao: '2 motoristas com CNH vencendo em 30 dias', urgencia: 'baixa', data: '2025-12-16' },
];

export const mockFerias: FeriasItem[] = [
  { id: '1', colaboradorId: '2', colaboradorNome: 'Maria Oliveira Costa', departamento: 'Artes', dataInicio: '2025-12-10', dataFim: '2025-12-29', dias: 20, status: 'em_gozo' },
  { id: '2', colaboradorId: '1', colaboradorNome: 'João Silva Santos', departamento: 'Gravação', dataInicio: '2026-01-06', dataFim: '2026-01-25', dias: 20, status: 'aprovada' },
  { id: '3', colaboradorId: '3', colaboradorNome: 'Pedro Lima Souza', departamento: 'Comercial', dataInicio: '2026-01-19', dataFim: '2026-02-02', dias: 15, status: 'pendente' },
];

export const mockAdmissoes: AdmissaoItem[] = [
  { id: '1', candidatoNome: 'Maria Designer', cargo: 'Designer Gráfico', departamento: 'Artes', etapa: 'Coleta de Documentos', progresso: 85, dataPrevisao: '2025-12-20' },
  { id: '2', candidatoNome: 'Carlos Auxiliar', cargo: 'Aux. Administrativo', departamento: 'Administrativo', etapa: 'Solicitação Recebida', progresso: 20, dataPrevisao: '2025-12-22' },
  { id: '3', candidatoNome: 'Ana Vendedora', cargo: 'Vendedora', departamento: 'Comercial', etapa: 'Exame Admissional', progresso: 60, dataPrevisao: '2025-12-18' },
];

export const mockDepartamentos = [
  { id: '1', nome: 'Produção', colaboradores: 18 },
  { id: '2', nome: 'Comercial', colaboradores: 12 },
  { id: '3', nome: 'Artes', colaboradores: 8 },
  { id: '4', nome: 'Logística', colaboradores: 6 },
  { id: '5', nome: 'Administrativo', colaboradores: 4 },
];

export const mockCalendarioEventos = [
  { data: '2025-12-18', tipo: 'admissao', titulo: 'Admissão Ana Vendedora' },
  { data: '2025-12-20', tipo: 'admissao', titulo: 'Admissão Maria Designer' },
  { data: '2025-12-25', tipo: 'feriado', titulo: 'Natal' },
  { data: '2026-01-01', tipo: 'feriado', titulo: 'Ano Novo' },
  { data: '2026-01-05', tipo: 'pagamento', titulo: 'Pagamento Folha Dez/25' },
  { data: '2026-01-06', tipo: 'ferias', titulo: 'Início Férias João Silva' },
];

export const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  ativo: { bg: 'bg-success/10', text: 'text-success', dot: 'status-dot-success' },
  ferias: { bg: 'bg-warning/10', text: 'text-warning', dot: 'status-dot-warning' },
  afastado: { bg: 'bg-loggi/10', text: 'text-loggi', dot: 'bg-loggi' },
  desligado: { bg: 'bg-muted', text: 'text-muted-foreground', dot: 'bg-muted-foreground' },
  admissao: { bg: 'bg-info/10', text: 'text-info', dot: 'status-dot-info' },
};
