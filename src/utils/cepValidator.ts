export const validateCEP = (cep: string): boolean => { const cleaned = cep.replace(/\D/g, ''); return cleaned.length === 8; };
