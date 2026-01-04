/**
 * Formatador e Consulta de CEP
 * Integração com ViaCEP e BrasilAPI
 */

export interface Endereco {
  cep: string;
  logradouro: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  ibge?: string;
  ddd?: string;
}

/**
 * Remove caracteres não numéricos
 */
export function limparCEP(cep: string): string {
  return cep.replace(/\D/g, '');
}

/**
 * Formata CEP no padrão XXXXX-XXX
 */
export function formatarCEP(cep: string): string {
  const numeros = limparCEP(cep);
  if (numeros.length !== 8) return cep;
  return numeros.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Máscara CEP para inputs
 */
export function mascararCEP(valor: string): string {
  const numeros = limparCEP(valor);
  if (numeros.length <= 5) return numeros;
  return `${numeros.slice(0, 5)}-${numeros.slice(5, 8)}`;
}

/**
 * Valida formato do CEP
 */
export function validarCEP(cep: string): boolean {
  const numeros = limparCEP(cep);
  return numeros.length === 8 && /^\d{8}$/.test(numeros);
}

/**
 * Consulta CEP via ViaCEP
 */
export async function consultarCEPViaCEP(cep: string): Promise<Endereco | null> {
  const numeros = limparCEP(cep);
  if (!validarCEP(numeros)) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${numeros}/json/`);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.erro) return null;
    
    return {
      cep: formatarCEP(data.cep),
      logradouro: data.logradouro || '',
      complemento: data.complemento || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      uf: data.uf || '',
      ibge: data.ibge || '',
      ddd: data.ddd || ''
    };
  } catch {
    return null;
  }
}

/**
 * Consulta CEP via BrasilAPI (fallback)
 */
export async function consultarCEPBrasilAPI(cep: string): Promise<Endereco | null> {
  const numeros = limparCEP(cep);
  if (!validarCEP(numeros)) return null;

  try {
    const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${numeros}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    
    return {
      cep: formatarCEP(data.cep),
      logradouro: data.street || '',
      bairro: data.neighborhood || '',
      cidade: data.city || '',
      uf: data.state || ''
    };
  } catch {
    return null;
  }
}

/**
 * Consulta CEP com fallback automático
 */
export async function consultarCEP(cep: string): Promise<Endereco | null> {
  let resultado = await consultarCEPViaCEP(cep);
  if (!resultado) {
    resultado = await consultarCEPBrasilAPI(cep);
  }
  return resultado;
}

/**
 * Identifica região pelo CEP
 */
export function identificarRegiao(cep: string): string {
  const numeros = limparCEP(cep);
  if (numeros.length < 1) return 'Desconhecido';
  
  const primeiro = numeros[0];
  const regioes: Record<string, string> = {
    '0': 'Grande São Paulo',
    '1': 'Interior de São Paulo',
    '2': 'Rio de Janeiro e Espírito Santo',
    '3': 'Minas Gerais',
    '4': 'Bahia e Sergipe',
    '5': 'Nordeste (PE, AL, PB, RN)',
    '6': 'Norte (CE, PI, MA, PA, AP, AM, RR, AC)',
    '7': 'Centro-Oeste (DF, GO, TO, MT, MS, RO)',
    '8': 'Paraná e Santa Catarina',
    '9': 'Rio Grande do Sul'
  };
  
  return regioes[primeiro] || 'Desconhecido';
}

/**
 * Formata endereço completo
 */
export function formatarEnderecoCompleto(endereco: Endereco, numero?: string): string {
  let resultado = endereco.logradouro;
  if (numero) resultado += `, ${numero}`;
  if (endereco.complemento) resultado += ` - ${endereco.complemento}`;
  resultado += ` - ${endereco.bairro}`;
  resultado += ` - ${endereco.cidade}/${endereco.uf}`;
  resultado += ` - CEP: ${endereco.cep}`;
  return resultado;
}

/**
 * Compara dois CEPs
 */
export function compararCEP(cep1: string, cep2: string): boolean {
  return limparCEP(cep1) === limparCEP(cep2);
}

export default {
  limparCEP,
  formatarCEP,
  mascararCEP,
  validarCEP,
  consultarCEP,
  consultarCEPViaCEP,
  consultarCEPBrasilAPI,
  identificarRegiao,
  formatarEnderecoCompleto,
  compararCEP
};
