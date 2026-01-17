// V18: Validador de CEP - Formatado e Documentado

/**
 * Valida CEP brasileiro
 * @param cep - CEP com ou sem máscara
 * @returns true se válido (8 dígitos numéricos)
 */
export function validateCEP(cep: string): boolean {
  if (!cep) return false;
  const cleaned = cep.replace(/\D/g, '');
  return cleaned.length === 8 && /^[0-9]{8}$/.test(cleaned);
}

/**
 * Formata CEP com máscara
 * @param cep - CEP sem máscara
 * @returns CEP formatado: XXXXX-XXX
 */
export function formatCEP(cep: string): string {
  const cleaned = cep.replace(/\D/g, '');
  if (cleaned.length !== 8) return cep;
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
}

/**
 * Remove máscara do CEP
 * @param cep - CEP com máscara
 * @returns Apenas dígitos
 */
export function cleanCEP(cep: string): string {
  return cep.replace(/\D/g, '');
}

/**
 * Interface de retorno da API ViaCEP
 */
export interface ViaCEPResponse {
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

/**
 * Busca endereço pelo CEP na API ViaCEP
 * @param cep - CEP a ser consultado
 * @returns Dados do endereço
 */
export async function fetchCEP(cep: string): Promise<ViaCEPResponse> {
  const cleaned = cleanCEP(cep);
  
  if (!validateCEP(cleaned)) {
    throw new Error('CEP inválido');
  }
  
  const response = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
  
  if (!response.ok) {
    throw new Error('Erro ao consultar CEP');
  }
  
  const data = await response.json();
  
  if (data.erro) {
    throw new Error('CEP não encontrado');
  }
  
  return data;
}

/**
 * Identifica região pelo CEP
 * @param cep - CEP a ser analisado
 * @returns Nome da região
 */
export function getRegiaoByCEP(cep: string): string {
  const cleaned = cleanCEP(cep);
  if (cleaned.length !== 8) return 'Desconhecida';
  
  const prefixo = parseInt(cleaned.charAt(0));
  
  const regioes: Record<number, string> = {
    0: 'Grande São Paulo',
    1: 'Interior de São Paulo',
    2: 'Rio de Janeiro e Espírito Santo',
    3: 'Minas Gerais',
    4: 'Bahia e Sergipe',
    5: 'Nordeste (PE, AL, PB, RN)',
    6: 'Norte (CE, PI, MA, PA, AM, AC, AP, RR)',
    7: 'Centro-Oeste (DF, GO, TO, MT, MS, RO)',
    8: 'Paraná e Santa Catarina',
    9: 'Rio Grande do Sul'
  };
  
  return regioes[prefixo] || 'Desconhecida';
}

export default {
  validateCEP,
  formatCEP,
  cleanCEP,
  fetchCEP,
  getRegiaoByCEP
};
