// V18: Validador de CTPS - Carteira de Trabalho

const UFS_VALIDAS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export interface CTPS {
  numero: string;
  serie: string;
  uf: string;
}

export function validateCTPS(numero: string, serie: string, uf?: string): boolean {
  const numClean = numero.replace(/\D/g, '');
  const serieClean = serie.replace(/\D/g, '');
  
  if (numClean.length < 5 || numClean.length > 7) return false;
  if (serieClean.length < 4 || serieClean.length > 5) return false;
  if (uf && !UFS_VALIDAS.includes(uf.toUpperCase())) return false;
  
  return true;
}

export function formatCTPS(numero: string, serie: string, uf: string): string {
  return `${numero.padStart(7, '0')}/${serie.padStart(4, '0')}-${uf.toUpperCase()}`;
}

export function parseCTPS(formatted: string): CTPS | null {
  const match = formatted.match(/^(\d+)\/(\d+)-([A-Z]{2})$/);
  if (!match) return null;
  return { numero: match[1], serie: match[2], uf: match[3] };
}

export function validateUF(uf: string): boolean {
  return UFS_VALIDAS.includes(uf.toUpperCase());
}

export function getUFsValidas(): string[] {
  return [...UFS_VALIDAS];
}

export default { validateCTPS, formatCTPS, parseCTPS, validateUF, getUFsValidas };
