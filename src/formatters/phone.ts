// V15-317
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '() -');
  if (cleaned.length === 10) return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '() -');
  return phone;
}
export function parsePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}
