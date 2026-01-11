// V15-313
export function validarPIS(pis: string): boolean {
  const cleaned = pis.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;
  const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cleaned[i]) * weights[i];
  const remainder = sum % 11;
  const digit = remainder < 2 ? 0 : 11 - remainder;
  return digit === parseInt(cleaned[10]);
}
export function formatarPIS(pis: string): string {
  return pis.replace(/\D/g, '').replace(/(\d{3})(\d{5})(\d{2})(\d{1})/, '..-');
}
