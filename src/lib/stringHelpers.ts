/**
 * Capitaliza primeira letra
 */
export function capitalizar(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitaliza todas as palavras
 */
export function capitalizarPalavras(str: string): string {
  return str.split(' ').map(capitalizar).join(' ');
}

/**
 * Remove acentos
 */
export function removerAcentos(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Slug amigável
 */
export function slugify(str: string): string {
  return removerAcentos(str)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Trunca texto
 */
export function truncar(str: string, tamanho: number, sufixo = '...'): string {
  if (str.length <= tamanho) return str;
  return str.slice(0, tamanho - sufixo.length) + sufixo;
}

/**
 * Extrai iniciais
 */
export function extrairIniciais(nome: string, quantidade = 2): string {
  return nome.split(' ')
    .filter(p => p.length > 0)
    .slice(0, quantidade)
    .map(p => p[0].toUpperCase())
    .join('');
}

/**
 * Pluraliza palavra
 */
export function pluralizar(singular: string, plural: string, quantidade: number): string {
  return quantidade === 1 ? singular : plural;
}

/**
 * Formata bytes
 */
export function formatarBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(1)} ${units[i]}`;
}
