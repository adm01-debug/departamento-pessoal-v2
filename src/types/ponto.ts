// V15-435
export type TipoRegistro = 'entrada' | 'saida_almoco' | 'retorno_almoco' | 'saida';
export interface RegistroPonto { id: string; colaborador_id: string; data: string; hora: string; tipo: TipoRegistro; latitude?: number; longitude?: number; endereco?: string; foto_url?: string; ip?: string; dispositivo?: string; created_at: string; }
export interface EspelhoPonto { colaborador_id: string; competencia: string; dias: DiaPonto[]; total_horas_trabalhadas: number; total_horas_extras: number; total_atrasos: number; total_faltas: number; banco_horas: number; }
export interface DiaPonto { data: string; entrada?: string; saida_almoco?: string; retorno_almoco?: string; saida?: string; horas_trabalhadas: number; horas_extras: number; atraso: number; falta: boolean; observacao?: string; }
