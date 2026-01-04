/**
 * Formatador de Telefones Brasileiros
 * Suporte a fixo, celular, 0800 e internacional
 */

/**
 * Remove caracteres não numéricos
 */
export function limparTelefone(telefone: string): string {
  return telefone.replace(/\D/g, '');
}

/**
 * Formata telefone automaticamente baseado no tamanho
 */
export function formatarTelefone(telefone: string): string {
  const numeros = limparTelefone(telefone);
  
  // Celular com DDD: (XX) 9XXXX-XXXX
  if (numeros.length === 11 && numeros[2] === '9') {
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  // Fixo com DDD: (XX) XXXX-XXXX
  if (numeros.length === 10) {
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  // Celular sem DDD: 9XXXX-XXXX
  if (numeros.length === 9 && numeros[0] === '9') {
    return numeros.replace(/(\d{5})(\d{4})/, '$1-$2');
  }
  
  // Fixo sem DDD: XXXX-XXXX
  if (numeros.length === 8) {
    return numeros.replace(/(\d{4})(\d{4})/, '$1-$2');
  }
  
  // 0800: 0800 XXX XXXX
  if (numeros.length === 11 && numeros.startsWith('0800')) {
    return numeros.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  
  // Internacional com código país
  if (numeros.length >= 12) {
    return '+' + numeros.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '$1 ($2) $3-$4');
  }
  
  return telefone;
}

/**
 * Máscara para input de telefone
 */
export function mascararTelefone(valor: string): string {
  const numeros = limparTelefone(valor);
  
  if (numeros.length <= 2) return numeros.length ? `(${numeros}` : '';
  if (numeros.length <= 6) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  if (numeros.length <= 10) return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
}

/**
 * Valida telefone brasileiro
 */
export function validarTelefone(telefone: string): boolean {
  const numeros = limparTelefone(telefone);
  
  // Verifica tamanho válido
  if (numeros.length < 8 || numeros.length > 13) return false;
  
  // Telefone com DDD
  if (numeros.length >= 10) {
    const ddd = parseInt(numeros.substring(0, 2));
    // DDDs válidos no Brasil: 11-99
    if (ddd < 11 || ddd > 99) return false;
  }
  
  // Celular deve começar com 9
  if (numeros.length === 11 && numeros[2] !== '9') return false;
  
  return true;
}

/**
 * Identifica tipo do telefone
 */
export function identificarTipo(telefone: string): 'celular' | 'fixo' | '0800' | 'internacional' | 'desconhecido' {
  const numeros = limparTelefone(telefone);
  
  if (numeros.startsWith('0800')) return '0800';
  if (numeros.length >= 12) return 'internacional';
  if (numeros.length === 11 && numeros[2] === '9') return 'celular';
  if (numeros.length === 10 || numeros.length === 8) return 'fixo';
  if (numeros.length === 9 && numeros[0] === '9') return 'celular';
  
  return 'desconhecido';
}

/**
 * Extrai DDD do telefone
 */
export function extrairDDD(telefone: string): string | null {
  const numeros = limparTelefone(telefone);
  if (numeros.length >= 10) {
    return numeros.substring(0, 2);
  }
  return null;
}

/**
 * Formata para WhatsApp (com código do país)
 */
export function formatarWhatsApp(telefone: string, codigoPais: string = '55'): string {
  const numeros = limparTelefone(telefone);
  
  // Remove código do país se já existir
  const semCodigoPais = numeros.startsWith(codigoPais) ? numeros.slice(codigoPais.length) : numeros;
  
  return `+${codigoPais}${semCodigoPais}`;
}

/**
 * Gera link para WhatsApp
 */
export function gerarLinkWhatsApp(telefone: string, mensagem?: string): string {
  const numero = formatarWhatsApp(telefone).replace(/\D/g, '');
  const url = `https://wa.me/${numero}`;
  return mensagem ? `${url}?text=${encodeURIComponent(mensagem)}` : url;
}

/**
 * Oculta parte do telefone
 */
export function ocultarTelefone(telefone: string): string {
  const formatado = formatarTelefone(telefone);
  const numeros = formatado.replace(/\D/g, '');
  
  if (numeros.length >= 10) {
    return formatado.slice(0, 5) + '****' + formatado.slice(-4);
  }
  
  return '****' + formatado.slice(-4);
}

/**
 * Compara dois telefones
 */
export function compararTelefone(tel1: string, tel2: string): boolean {
  const n1 = limparTelefone(tel1);
  const n2 = limparTelefone(tel2);
  
  // Remove código do país para comparação
  const normalizar = (n: string) => n.startsWith('55') && n.length > 11 ? n.slice(2) : n;
  
  return normalizar(n1) === normalizar(n2);
}

export default {
  limparTelefone,
  formatarTelefone,
  mascararTelefone,
  validarTelefone,
  identificarTipo,
  extrairDDD,
  formatarWhatsApp,
  gerarLinkWhatsApp,
  ocultarTelefone,
  compararTelefone
};
