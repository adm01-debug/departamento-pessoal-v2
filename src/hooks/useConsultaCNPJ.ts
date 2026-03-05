// @ts-nocheck
/**
 * @fileoverview Hook para consulta de CNPJ
 * @module hooks/useConsultaCNPJ
 */
import { useState } from 'react';
import { toast } from 'sonner';

export interface DadosCNPJ {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  situacao: string;
  data_situacao: string;
  tipo: string;
  porte: string;
  natureza_juridica: string;
  atividade_principal: {
    code: string;
    text: string;
  };
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  cidade: string;
  uf: string;
  cep: string;
  telefone: string;
  email: string;
  capital_social: number;
  data_abertura: string;
}


export interface UseConsultaCNPJReturn {
  consultar: (cnpj: string) => Promise<DadosCNPJ | null>;
  loading: boolean;
  dados: DadosCNPJ | null;
  error: string | null;
  limpar: () => void;
}

export function useConsultaCNPJ(): UseConsultaCNPJReturn {
  const [loading, setLoading] = useState(false);
  const [dados, setDados] = useState<DadosCNPJ | null>(null);
  const [error, setError] = useState<string | null>(null);

  const consultar = async (cnpj: string): Promise<DadosCNPJ | null> => {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    
    if (cnpjLimpo.length !== 14) {
      toast.error('CNPJ inválido');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Usando a API pública ReceitaWS
      const response = await fetch(`https://receitaws.com.br/v1/cnpj/${cnpjLimpo}`);
      
      if (!response.ok) {
        throw new Error('Erro ao consultar CNPJ');
      }

      const data = await response.json();

      if (data.status === 'ERROR') {
        throw new Error(data.message || 'CNPJ não encontrado');
      }

      const dadosFormatados: DadosCNPJ = {
        cnpj: data.cnpj || cnpjLimpo,
        razao_social: data.nome ?? '',
        nome_fantasia: data.fantasia ?? '',
        situacao: data.situacao ?? '',
        data_situacao: data.data_situacao ?? '',
        tipo: data.tipo ?? '',
        porte: data.porte ?? '',
        natureza_juridica: data.natureza_juridica ?? '',
        atividade_principal: data.atividade_principal?.[0] || { code: '', text: '' },
        logradouro: data.logradouro ?? '',
        numero: data.numero ?? '',
        complemento: data.complemento ?? '',
        bairro: data.bairro ?? '',
        municipio: data.municipio ?? '',
        cidade: data.municipio ?? '',
        uf: data.uf ?? '',
        cep: data.cep ?? '',
        telefone: data.telefone ?? '',
        email: data.email ?? '',
        capital_social: parseFloat(data.capital_social) ?? 0,
        data_abertura: data.abertura ?? '',
      };

      setDados(dadosFormatados);
      toast.success('CNPJ consultado com sucesso!');
      return dadosFormatados;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao consultar CNPJ';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const limpar = () => {
    setDados(null);
    setError(null);
  };

  return {
    consultar,
    loading,
    dados,
    error,
    limpar,
  };
}







