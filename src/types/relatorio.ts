// V15-438
export interface RelatorioConfig { tipo: 'folha' | 'colaboradores' | 'ferias' | 'ponto' | 'beneficios' | 'encargos'; formato: 'pdf' | 'xlsx' | 'csv'; competencia?: string; dataInicio?: string; dataFim?: string; filtros?: Record<string, any>; }
export interface Relatorio { id: string; empresa_id: string; tipo: RelatorioConfig['tipo']; nome: string; arquivo_url: string; gerado_por: string; created_at: string; }
export interface DadosRelatorioFolha { competencia: string; total_colaboradores: number; total_proventos: number; total_descontos: number; total_liquido: number; total_inss: number; total_fgts: number; total_irrf: number; }
