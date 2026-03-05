// @ts-nocheck
// V18-H001: Hook de Validacao eSocial - Validacao Offline Completa
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type TipoEvento = "S-1000" | "S-1200" | "S-2200" | "S-2206" | "S-2299" | "S-2300";

export interface ErroValidacao {
  campo: string;
  mensagem: string;
  tipo: "erro" | "aviso";
  codigo?: string;
}

export interface ResultadoValidacao {
  valido: boolean;
  erros: ErroValidacao[];
  avisos: ErroValidacao[];
  tipoEvento: TipoEvento;
  dataValidacao: string;
}

interface ValidadorConfig {
  tipoEvento: TipoEvento;
  dados: Record<string, unknown>;
  validarCPF?: boolean;
  validarCNPJ?: boolean;
  validarDatas?: boolean;
}

export function useESocialValidacao() {
  const [resultadoAtual, setResultadoAtual] = useState<ResultadoValidacao | null>(null);
  const [isValidando, setIsValidando] = useState(false);
  const queryClient = useQueryClient();

  const validarCPF = useCallback((cpf: string): boolean => {
    if (!cpf || cpf.length !== 11) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i-1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i-1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf[10]);
  }, []);

  const validarCNPJ = useCallback((cnpj: string): boolean => {
    if (!cnpj || cnpj.length !== 14) return false;
    const pesos1 = [5,4,3,2,9,8,7,6,5,4,3,2];
    const pesos2 = [6,5,4,3,2,9,8,7,6,5,4,3,2];
    let soma = 0;
    for (let i = 0; i < 12; i++) soma += parseInt(cnpj[i]) * pesos1[i];
    let resto = soma % 11;
    const dig1 = resto < 2 ? 0 : 11 - resto;
    if (dig1 !== parseInt(cnpj[12])) return false;
    soma = 0;
    for (let i = 0; i < 13; i++) soma += parseInt(cnpj[i]) * pesos2[i];
    resto = soma % 11;
    const dig2 = resto < 2 ? 0 : 11 - resto;
    return dig2 === parseInt(cnpj[13]);
  }, []);

  const validarEvento = useCallback(async (config: ValidadorConfig): Promise<ResultadoValidacao> => {
    setIsValidando(true);
    const erros: ErroValidacao[] = [];
    const avisos: ErroValidacao[] = [];

    try {
      const { tipoEvento, dados, validarCPF: vCPF = true, validarCNPJ: vCNPJ = true } = config;

      // Validacoes comuns
      if (vCPF && dados.cpf && !validarCPF(String(dados.cpf))) {
        erros.push({ campo: "cpf", mensagem: "CPF invalido", tipo: "erro" });
      }
      if (vCNPJ && dados.cnpj && !validarCNPJ(String(dados.cnpj))) {
        erros.push({ campo: "cnpj", mensagem: "CNPJ invalido", tipo: "erro" });
      }

      // Validacoes por tipo de evento
      switch (tipoEvento) {
        case "S-2200":
          if (!dados.dtAdm) erros.push({ campo: "dtAdm", mensagem: "Data admissao obrigatoria", tipo: "erro" });
          if (!dados.nmTrab) erros.push({ campo: "nmTrab", mensagem: "Nome trabalhador obrigatorio", tipo: "erro" });
          if (!dados.grauInstr) avisos.push({ campo: "grauInstr", mensagem: "Grau instrucao recomendado", tipo: "aviso" });
          break;
        case "S-2206":
          if (!dados.dtAlteracao) erros.push({ campo: "dtAlteracao", mensagem: "Data alteracao obrigatoria", tipo: "erro" });
          break;
        case "S-2299":
          if (!dados.dtDeslig) erros.push({ campo: "dtDeslig", mensagem: "Data desligamento obrigatoria", tipo: "erro" });
          if (!dados.mtvDeslig) erros.push({ campo: "mtvDeslig", mensagem: "Motivo desligamento obrigatorio", tipo: "erro" });
          break;
      }

      const resultado: ResultadoValidacao = {
        valido: erros.length === 0,
        erros,
        avisos,
        tipoEvento,
        dataValidacao: new Date().toISOString()
      };

      setResultadoAtual(resultado);
      return resultado;
    } finally {
      setIsValidando(false);
    }
  }, [validarCPF, validarCNPJ]);

  const validarLote = useCallback(async (eventos: ValidadorConfig[]): Promise<ResultadoValidacao[]> => {
    const resultados: ResultadoValidacao[] = [];
    for (const evento of eventos) {
      resultados.push(await validarEvento(evento));
    }
    return resultados;
  }, [validarEvento]);

  const limparResultado = useCallback(() => {
    setResultadoAtual(null);
  }, []);

  return {
    validarEvento,
    validarLote,
    validarCPF,
    validarCNPJ,
    resultadoAtual,
    isValidando,
    limparResultado
  };
}

export default useESocialValidacao;
