export function validateRG(rg: string): boolean {
  const cleaned = rg.replace(/[^\dXx]/g, "");
  return cleaned.length >= 7 && cleaned.length <= 14;
}
export function formatRG(rg: string): string {
  const cleaned = rg.replace(/[^\dXx]/g, "");
  if (cleaned.length < 9) return cleaned;
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})([\dXx])/, "$1.$2.$3-$4");
}
export function cleanRG(rg: string): string {
  return rg.replace(/[^\dXx]/g, "");
}
export default { validateRG, formatRG, cleanRG };
