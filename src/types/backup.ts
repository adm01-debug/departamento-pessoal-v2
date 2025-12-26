/**
 * @fileoverview Tipos para backup e restore
 * @module types/backup
 */

export type StatusBackup = 'pendente' | 'em_progresso' | 'concluido' | 'erro';
export type TipoBackup = 'completo' | 'incremental' | 'diferencial';

export interface Backup {
  id: string;
  tipo: TipoBackup;
  status: StatusBackup;
  tamanho: number;
  urlDownload?: string;
  dataInicio: string;
  dataFim?: string;
  erro?: string;
  createdBy: string;
}

export interface RestorePoint {
  id: string;
  backupId: string;
  descricao: string;
  dataRestore: string;
  status: StatusBackup;
  restoredBy: string;
}

export interface BackupConfig {
  automatico: boolean;
  frequencia: 'diario' | 'semanal' | 'mensal';
  horario: string;
  retencaoDias: number;
  incluirAnexos: boolean;
}
