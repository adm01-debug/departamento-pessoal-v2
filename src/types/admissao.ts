/**
 * @fileoverview Tipos para processo de admissão
 * @module types/admissao
 */

export type StatusAdmissao = 'pendente' | 'em_andamento' | 'documentos_pendentes' | 'aprovado' | 'reprovado' | 'cancelado';

export interface DocumentoAdmissao {
  id: string;
  tipo: string;
  nome: string;
  url?: string;
  status: 'pendente' | 'enviado' | 'aprovado' | 'rejeitado';
  dataEnvio?: string;
  observacoes?: string;
}

export interface Admissao {
  id: string;
  colaboradorId?: string;
  nome: string;
  email: string;
  cpf: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  salario: number;
  status: StatusAdmissao;
  documentos: DocumentoAdmissao[];
  etapaAtual: number;
  totalEtapas: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdmissaoFormData {
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  salario: number;
  tipoContrato: 'clt' | 'pj' | 'estagio' | 'temporario';
}

export interface AdmissaoChecklist {
  id: string;
  admissaoId: string;
  item: string;
  obrigatorio: boolean;
  concluido: boolean;
  responsavel?: string;
  dataConclusao?: string;
}
