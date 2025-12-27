export const formatCEP = (cep: string): string => { const cleaned = cep.replace(/\D/g, '').slice(0, 8); return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2'); };
