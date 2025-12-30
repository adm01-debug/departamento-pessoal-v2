/**
 * @fileoverview Hook para cálculo de rescisão
 * @module hooks/useRescisao
 */
import { useMemo } from 'react';

export interface DadosRescisao {
  salario: number;
  dataAdmissao: Date;
  dataDesligamento: Date;
  motivoDesligamento: 'pedido_demissao' | 'sem_justa_causa' | 'com_justa_causa' | 'acordo';
  feriasVencidas: number;
  feriasProporcional: number;
  avisoTrabalhado: boolean;
}

export interface ResultadoRescisao {
  saldoSalario: number;
  decimoTerceiro: number;
  feriasVencidas: number;
  feriasProporcional: number;
  tercoFerias: number;
  avisoPrevio: number;
  multaFGTS: number;
  totalBruto: number;
  descontos: number;
  totalLiquido: number;
}

export function useRescisao(dados?: DadosRescisao) {
  const resultado = useMemo<ResultadoRescisao | null>(() => {
    if (!dados) return null;
    
    const { salario, dataAdmissao, dataDesligamento, motivoDesligamento, avisoTrabalhado } = dados;
    
    // Cálculo simplificado
    const diasTrabalhados = Math.max(1, Math.ceil((dataDesligamento.getTime() - dataAdmissao.getTime()) / (1000 * 60 * 60 * 24)));
    const mesesTrabalhados = Math.floor(diasTrabalhados / 30);
    
    const saldoSalario = (salario / 30) * (dataDesligamento.getDate());
    const decimoTerceiro = (salario / 12) * (mesesTrabalhados % 12);
    const feriasVencidas = dados.feriasVencidas * salario;
    const feriasProporcional = (salario / 12) * dados.feriasProporcional;
    const tercoFerias = (feriasVencidas + feriasProporcional) / 3;
    const avisoPrevio = !avisoTrabalhado && motivoDesligamento === 'sem_justa_causa' ? salario : 0;
    const multaFGTS = motivoDesligamento === 'sem_justa_causa' ? salario * 0.4 * (mesesTrabalhados / 12) : 0;
    
    const totalBruto = saldoSalario + decimoTerceiro + feriasVencidas + feriasProporcional + tercoFerias + avisoPrevio + multaFGTS;
    const descontos = totalBruto * 0.11; // INSS simplificado
    const totalLiquido = totalBruto - descontos;
    
    return {
      saldoSalario, decimoTerceiro, feriasVencidas, feriasProporcional, tercoFerias,
      avisoPrevio, multaFGTS, totalBruto, descontos, totalLiquido,
    };
  }, [dados]);

  return resultado;
}

export default useRescisao;
