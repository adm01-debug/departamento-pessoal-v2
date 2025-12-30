/**
 * @fileoverview Hook para verificar disponibilidade de férias
 * @module hooks/useFeriasAvailable
 */
import { useMemo } from 'react';
import { differenceInDays, differenceInMonths, parseISO } from 'date-fns';

export interface FeriasDisponivel {
  diasDisponiveis: number;
  diasUsados: number;
  diasRestantes: number;
  periodoAquisitivo: { inicio: Date; fim: Date };
  podeSolicitar: boolean;
  mensagem?: string;
}

export function useFeriasAvailable(dataAdmissao: string, feriasAnteriores: { dias: number; data_inicio: string }[] = []) {
  const disponibilidade = useMemo<FeriasDisponivel>(() => {
    const admissao = parseISO(dataAdmissao);
    const hoje = new Date();
    const mesesTrabalhados = differenceInMonths(hoje, admissao);
    
    // Após 12 meses, tem direito a 30 dias
    const diasDisponiveis = mesesTrabalhados >= 12 ? 30 : 0;
    
    // Calcular dias já usados no período
    const diasUsados = feriasAnteriores.reduce((acc, f) => acc + f.dias, 0);
    const diasRestantes = diasDisponiveis - diasUsados;
    
    // Período aquisitivo atual
    const anosTrabalhados = Math.floor(mesesTrabalhados / 12);
    const inicioPA = new Date(admissao);
    inicioPA.setFullYear(admissao.getFullYear() + anosTrabalhados);
    const fimPA = new Date(inicioPA);
    fimPA.setFullYear(fimPA.getFullYear() + 1);
    fimPA.setDate(fimPA.getDate() - 1);
    
    const podeSolicitar = diasRestantes > 0 && mesesTrabalhados >= 12;
    
    return {
      diasDisponiveis,
      diasUsados,
      diasRestantes,
      periodoAquisitivo: { inicio: inicioPA, fim: fimPA },
      podeSolicitar,
      mensagem: !podeSolicitar ? 
        (mesesTrabalhados < 12 ? 'Período aquisitivo incompleto' : 'Sem dias disponíveis') : 
        undefined,
    };
  }, [dataAdmissao, feriasAnteriores]);

  return disponibilidade;
}

export default useFeriasAvailable;
