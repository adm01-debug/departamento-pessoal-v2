import { useState, useCallback } from 'react';

interface EnderecoViaCEP {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

interface UseViaCEPReturn {
  buscarCEP: (cep: string) => Promise<EnderecoViaCEP | null>;
  loading: boolean;
  error: string | null;
}

export function useViaCEP(): UseViaCEPReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarCEP = useCallback(async (cep: string): Promise<EnderecoViaCEP | null> => {
    // Limpar CEP
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
      setError('CEP deve ter 8 dígitos');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      
      if (!response.ok) {
        throw new Error('Erro ao consultar CEP');
      }

      const data: EnderecoViaCEP = await response.json();

      if (data.erro) {
        setError('CEP não encontrado');
        return null;
      }

      return data;
    } catch (err) {
      setError('Erro ao buscar CEP. Tente novamente.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { buscarCEP, loading, error };
}
