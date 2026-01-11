// V15-312
export function validarCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length !== 14 || /^(\d)+$/.test(cleaned)) return false;
  const calc = (x: number) => {
    const slice = cleaned.slice(0, x);
    let factor = x - 7, sum = 0;
    for (let i = x; i >= 1; i--) { sum += parseInt(slice[x - i]) * factor--; if (factor < 2) factor = 9; }
    const result = 11 - (sum % 11);
    return result > 9 ? 0 : result;
  };
  return calc(12) === parseInt(cleaned[12]) && calc(13) === parseInt(cleaned[13]);
}
export function formatarCNPJ(cnpj: string): string {
  return cnpj.replace(/\D/g, '').replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '../-');
}
