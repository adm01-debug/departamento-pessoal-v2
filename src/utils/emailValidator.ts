// V18: Validador de Email - Formatado e Documentado

/**
 * Regex para validação de email
 * Padrão: texto@dominio.extensao
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Lista de domínios de email descartáveis/temporários
 */
const DISPOSABLE_DOMAINS = [
  'tempmail.com',
  'guerrillamail.com',
  'mailinator.com',
  '10minutemail.com',
  'throwaway.email',
  'fakeinbox.com',
  'temp-mail.org',
  'dispostable.com',
  'yopmail.com',
  'trashmail.com'
];

/**
 * Valida formato de email
 * @param email - Email a ser validado
 * @returns true se válido, false se inválido
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const trimmed = email.trim();
  
  // Verifica tamanho mínimo e máximo
  if (trimmed.length < 5 || trimmed.length > 254) {
    return false;
  }
  
  return EMAIL_REGEX.test(trimmed);
}

/**
 * Normaliza email (lowercase e trim)
 * @param email - Email a ser normalizado
 * @returns Email normalizado
 */
export function normalizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return '';
  }
  return email.trim().toLowerCase();
}

/**
 * Extrai domínio do email
 * @param email - Email completo
 * @returns Domínio (após @)
 */
export function extractDomain(email: string): string {
  if (!email || typeof email !== 'string') {
    return '';
  }
  const parts = email.split('@');
  return parts[1]?.toLowerCase() || '';
}

/**
 * Verifica se é email descartável/temporário
 * @param email - Email a verificar
 * @returns true se for descartável
 */
export function isDisposableEmail(email: string): boolean {
  const domain = extractDomain(email);
  return DISPOSABLE_DOMAINS.some(d => domain.includes(d.split('.')[0]));
}

/**
 * Verifica se é email corporativo (não gmail, hotmail, etc)
 * @param email - Email a verificar
 * @returns true se for corporativo
 */
export function isCorporateEmail(email: string): boolean {
  const freeProviders = [
    'gmail.com',
    'hotmail.com',
    'outlook.com',
    'yahoo.com',
    'live.com',
    'msn.com',
    'icloud.com',
    'aol.com',
    'protonmail.com',
    'mail.com'
  ];
  
  const domain = extractDomain(email);
  return !freeProviders.includes(domain);
}

/**
 * Formata email para exibição (parcialmente oculto)
 * @param email - Email completo
 * @returns Email parcialmente oculto (ex: j***@gmail.com)
 */
export function maskEmail(email: string): string {
  if (!validateEmail(email)) {
    return email;
  }
  
  const [local, domain] = email.split('@');
  const masked = local.charAt(0) + '***';
  return `${masked}@${domain}`;
}

export default {
  validateEmail,
  normalizeEmail,
  extractDomain,
  isDisposableEmail,
  isCorporateEmail,
  maskEmail
};
