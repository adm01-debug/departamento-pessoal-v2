export function validateCEP(cep: string): boolean {
  const cleaned = cep.replace(/\D/g, "");
  return cleaned.length === 8 && /^[0-9]{8}$/.test(cleaned);
}
export function formatCEP(cep: string): string {
  const cleaned = cep.replace(/\D/g, "");
  if (cleaned.length !== 8) return cep;
  return cleaned.replace(/(\d{5})(\d{3})/, "$1-$2");
}
export function cleanCEP(cep: string): string {
  return cep.replace(/\D/g, "");
}
export async function fetchCEP(cep: string): Promise<any> {
  const cleaned = cleanCEP(cep);
  if (!validateCEP(cleaned)) throw new Error("CEP inválido");
  const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
  return res.json();
}
export default { validateCEP, formatCEP, cleanCEP, fetchCEP };
