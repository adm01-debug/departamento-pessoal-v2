export const validateRG = (rg: string): boolean => { const cleaned = rg.replace(/\D/g, ''); return cleaned.length >= 5 && cleaned.length <= 14; };
